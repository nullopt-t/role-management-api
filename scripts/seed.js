#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI =
	process.env.MONGO_URI;

// Define schemas standalone (not dependent on app configs)
const permissionSchema = new mongoose.Schema(
	{
		action: {
			type: String,
			required: true,
			lowercase: true,
			minlength: 2,
			maxlength: 50,
		},
		resource: {
			type: String,
			required: true,
			lowercase: true,
			minlength: 2,
			maxlength: 50,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const roleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			minlength: 2,
			maxlength: 50,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		permissions: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Permission',
			default: [],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		roles: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Role',
			default: [],
		},
		lastLogin: {
			type: Date,
			default: null,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

// Create models
const Permission = mongoose.model('Permission', permissionSchema);
const Role = mongoose.model('Role', roleSchema);
const User = mongoose.model('User', userSchema);

async function seed() {
	try {
		// Connect to MongoDB
		console.log('🔗 Connecting to MongoDB...');
		await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
		});
		console.log('✓ Connected to MongoDB');

		// Clear existing data
		console.log('\n📝 Clearing existing data...');
		await Permission.deleteMany({});
		await Role.deleteMany({});
		await User.deleteMany({});
		console.log('✓ Cleared collections');

		// Create permissions
		console.log('\n📝 Creating permissions...');
		const permissionsData = [
			// User permissions
			{ action: 'create', resource: 'users', description: 'Create new users' },
			{ action: 'read', resource: 'users', description: 'Read user details' },
			{
				action: 'update',
				resource: 'users',
				description: 'Update user information',
			},
			{ action: 'delete', resource: 'users', description: 'Delete users' },

			// Role permissions
			{ action: 'create', resource: 'roles', description: 'Create new roles' },
			{ action: 'read', resource: 'roles', description: 'Read role details' },
			{
				action: 'update',
				resource: 'roles',
				description: 'Update role information',
			},
			{ action: 'delete', resource: 'roles', description: 'Delete roles' },

			// Permission permissions
			{
				action: 'create',
				resource: 'permissions',
				description: 'Create new permissions',
			},
			{
				action: 'read',
				resource: 'permissions',
				description: 'Read permission details',
			},
			{
				action: 'update',
				resource: 'permissions',
				description: 'Update permission information',
			},
			{
				action: 'delete',
				resource: 'permissions',
				description: 'Delete permissions',
			},

			// Post permissions
			{ action: 'create', resource: 'posts', description: 'Create new posts' },
			{ action: 'read', resource: 'posts', description: 'Read posts' },
			{ action: 'update', resource: 'posts', description: 'Update posts' },
			{ action: 'delete', resource: 'posts', description: 'Delete posts' },
			{ action: 'moderate', resource: 'posts', description: 'Moderate posts' },

			// Comment permissions
			{
				action: 'create',
				resource: 'comments',
				description: 'Create new comments',
			},
			{ action: 'read', resource: 'comments', description: 'Read comments' },
			{
				action: 'delete',
				resource: 'comments',
				description: 'Delete comments',
			},
		];

		const permissions = await Permission.insertMany(permissionsData);
		console.log(`✓ Created ${permissions.length} permissions`);

		// Create roles
		console.log('\n📝 Creating roles...');
		const adminPermissions = permissions.map((p) => p._id);
		const userPermissions = permissions
			.filter(
				(p) =>
					['read', 'create'].includes(p.action) &&
					['posts', 'comments'].includes(p.resource)
			)
			.map((p) => p._id);
		const moderatorPermissions = permissions
			.filter(
				(p) =>
					p.resource === 'posts' ||
					(p.action === 'read' && p.resource === 'users')
			)
			.map((p) => p._id);

		const rolesData = [
			{
				name: 'admin',
				description: 'Administrator with full system access',
				permissions: adminPermissions,
				isActive: true,
			},
			{
				name: 'moderator',
				description: 'Moderator for content management',
				permissions: moderatorPermissions,
				isActive: true,
			},
			{
				name: 'user',
				description: 'Regular user with limited permissions',
				permissions: userPermissions,
				isActive: true,
			},
			{
				name: 'guest',
				description: 'Guest with minimal read permissions',
				permissions: permissions
					.filter((p) => p.action === 'read')
					.map((p) => p._id),
				isActive: true,
			},
		];

		const roles = await Role.insertMany(rolesData);
		console.log(`✓ Created ${roles.length} roles`);

		// Create users
		console.log('\n📝 Creating users...');
		const hashedPassword = await bcrypt.hash('Password123!', 10);

		const usersData = [
			{
				username: 'admin_user',
				email: 'admin@example.com',
				password: hashedPassword,
				emailVerified: true,
				isActive: true,
				roles: [roles[0]._id], // admin
				lastLogin: new Date(),
			},
			{
				username: 'moderator_user',
				email: 'moderator@example.com',
				password: hashedPassword,
				emailVerified: true,
				isActive: true,
				roles: [roles[1]._id], // moderator
				lastLogin: new Date(),
			},
			{
				username: 'john_doe',
				email: 'john@example.com',
				password: hashedPassword,
				emailVerified: true,
				isActive: true,
				roles: [roles[2]._id], // user
				lastLogin: new Date(),
			},
			{
				username: 'jane_smith',
				email: 'jane@example.com',
				password: hashedPassword,
				emailVerified: false,
				isActive: true,
				roles: [roles[2]._id], // user
				lastLogin: null,
			},
			{
				username: 'guest_user',
				email: 'guest@example.com',
				password: hashedPassword,
				emailVerified: false,
				isActive: true,
				roles: [roles[3]._id], // guest
				lastLogin: null,
			},
		];

		const users = await User.insertMany(usersData);
		console.log(`✓ Created ${users.length} users`);

		// Print summary
		console.log('\n✅ Seed completed successfully!\n');
		console.log('📊 Data Summary:');
		console.log(`   Permissions: ${permissions.length}`);
		console.log(`   Roles: ${roles.length}`);
		console.log(`   Users: ${users.length}`);

		console.log('\n👥 Test Users (Password: Password123!)');
		console.log(`   Admin:      admin_user (admin@example.com)`);
		console.log(`   Moderator:  moderator_user (moderator@example.com)`);
		console.log(`   User:       john_doe (john@example.com)`);
		console.log(`   User:       jane_smith (jane@example.com)`);
		console.log(`   Guest:      guest_user (guest@example.com)`);

		await mongoose.connection.close();
		console.log('\n✓ Database connection closed');
	} catch (error) {
		console.error('❌ Seed error:', error.message);
		await mongoose.connection.close();
	}
}

seed();

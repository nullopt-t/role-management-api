var RoleRepository = require('../../repositories/roles');

module.exports = {
	async getRoles() {
		const roles = await RoleRepository.findAll();
		return roles.map((role)=> { 
			return {
				id: role._id,
				name: role.name,
				description: role.description,
				permissions: role.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
			}
		});
	},
	async getRoleByID(id) {
		const role = await RoleRepository.findById(id);
		return role ? {
			id: role._id,
			name: role.name,
			description: role.descripton,
			permissions: role.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async getRoleByName(name) {
		const role = await RoleRepository.findByName(name);
		return role ? {
			id: role._id,
			name: role.name,
			description: role.descripton,
			permissions: role.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async createRole(role) {
		const createdRole = await RoleRepository.create(role);
		return createdRole ? {
			id: createdRole._id,
			name: createdRole.name,
			description: createdRole.descripton,
			permissions: createdRole.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async updateRole(id, role) {
		const updatedRole = await RoleRepository.update(id, role);
		return updatedRole ? {
			id: updatedRole._id,
			name: updatedRole.name,
			description: updatedRole.descripton,
			permissions: updatedRole.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async deleteRole(id) {
		const deletedRole = await RoleRepository.delete(id);
		return deletedRole ? {
			id: deletedRole._id,
			name: deletedRole.name,
			description: deletedRole.descripton,
			permissions: deletedRole.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async existsByID(id) {
		const role = await RoleRepository.existsByID(id);
		return role ? {
			id: role._id,
			name: role.name,
			description: role.descripton,
			permissions: role.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
	async existsByName(name) {
		const role = await RoleRepository.existsByName(name);
		return role ? {
			id: role._id,
			name: role.name,
			description: role.descripton,
			permissions: role.permissions.map((perm)=>{
					return {
						action: perm.action,
						resource: perm.resource,
						description: perm.description,
					};
				})
		} : null;
	},
};

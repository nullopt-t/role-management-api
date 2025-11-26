var { model } = require('mongoose');
var UserSchema = require('./user');
var PermissionSchema = require('./permission');
var RoleSchema = require('./role');

const UserModel = model('User', UserSchema);
const PermissionModel = model('Permission', PermissionSchema);
const RoleModel = model('Role', RoleSchema);

module.exports = {
	UserModel,
	PermissionModel,
	RoleModel,
};

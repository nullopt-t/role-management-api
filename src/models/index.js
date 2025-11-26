var { model } = require('mongoose');
var UserSchema = require('./user/user.model');

var UserModel = model('User', UserSchema);

module.exports = {
	UserModel,
};

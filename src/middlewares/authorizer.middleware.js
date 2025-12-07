var { sendError } = require('../utilities/controller.utility');

function authorize(permission, resource) {
	return (req, res, next) => {
		const user = req.user;
		if (!user) {
			return sendError(res, 'Unauthorized', 401);
		}

		const allowed = user.permissions?.some(
			(p) => p.action === permission && p.resource === resource
		);

		if (!allowed) {
			return sendError(res, 'Forbidden', 403);
		}

		next();
	};
}

module.exports = { authorize };

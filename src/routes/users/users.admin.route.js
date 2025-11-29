var router = require('express').Router();
var {
	getUsers,
	getUserByID,
	createUser,
	updateUser,
} = require('../../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserByID);

router.post('/', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', (req, res) => {
	res.send('adminDeleteUser');
});

router.patch('/:id/role', (req, res) => {
	res.send('adminUpdateUserRole');
});

router.patch('/:id/suspend', (req, res) => {
	res.send('adminSuspendUser');
});

module.exports = router;

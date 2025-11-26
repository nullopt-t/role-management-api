const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('adminGetAllUsers');
});

router.get('/:id', (req, res) => {
	res.send('adminGetUserByID');
});

router.post('/', (req, res) => {
	res.send('adminCreateUser');
});

router.put('/:id', (req, res) => {
	res.send('adminReplaceUser');
});

router.patch('/:id', (req, res) => {
	res.send('adminUpdateUser');
});

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

var router = require('express').Router();
var { getAll, getByID } = require('../../controllers/users');

router.get('/', getAll);

router.get('/:id', getByID);

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

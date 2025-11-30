var router = require('express').Router();
var { getRoles, getRoleByID, createRole } = require('../../controllers/roles');

router.get('/', getRoles);

router.get('/:id', getRoleByID);

router.post('/', createRole);

router.delete('/:id', (req, res) => {
	res.send('deleteRole');
});

router.patch('/:id', (req, res) => {
	res.send('patchRole');
});

module.exports = router;

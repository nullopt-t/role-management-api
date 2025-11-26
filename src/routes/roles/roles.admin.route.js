var router = require('express').Router();

router.get('/', (req, res) => {
	res.send('getRoles');
});

router.get('/:id', (req, res) => {
	res.send('getRoleByID');
});

router.post('/', (req, res) => {
	res.send('postRole');
});

router.delete('/:id', (req, res) => {
	res.send('deleteRole');
});

router.patch('/:id', (req, res) => {
	res.send('patchRole');
});

module.exports = router;

const { Router } = require('express');
const {
  getAll,
  getById,
  tabla,
  login,
 
  usuarios,
} = require('../controllers/example.controller');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

router.post('/usuarios',usuarios)
router.post('/tabla',tabla);
router.post ('/login',login)
module.exports = router;

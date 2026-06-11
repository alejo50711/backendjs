const { Router } = require('express');
const {
  getAll,
  getById,
  tabla,
  login,
  personal,
  getpersonal,
 
  usuarios,
  guests,
} = require('../controllers/example.controller');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

router.post('/usuarios',usuarios)
router.post('/tabla',tabla);
router.post('/personal',personal);
router.post('/getpersonal',getpersonal);
router.post('/invitadors',guests);


router.post ('/login',login)
module.exports = router;

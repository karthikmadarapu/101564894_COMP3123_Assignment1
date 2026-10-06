const router = require('express').Router();
const {signup, login} = require('../controllers/userController');

const { signupRules, loginRules } = require('../validators/userValidators');
const validate = require('../middleware/validate');

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);

module.exports = router;
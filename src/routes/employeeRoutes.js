const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/employeeController');
const { createRules, updateRules, eidParam } = require('../validators/employeeValidators');

router.use(auth); // every employee route requires a valid token

router.get('/employees', ctrl.getAll);
router.post('/employees', createRules, validate, ctrl.create);
router.get('/employees/:eid', eidParam, validate, ctrl.getOne);
router.put('/employees/:eid', updateRules, validate, ctrl.update);
router.delete('/employees/:eid', eidParam, validate, ctrl.remove);

module.exports = router;
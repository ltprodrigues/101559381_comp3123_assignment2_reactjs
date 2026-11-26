const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
    employeeValidators,
    employeeIdValidator,
    deleteEmployeeIdValidator,
    searchEmployeeValidators
} = require('../validators/employeeValidators');
const {
    createEmployee,
    getEmployees, 
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    searchEmployees
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authenticate);

router.get(
    '/employees/search',
    searchEmployeeValidators,
    validateRequest,
    searchEmployees
);

router.get('/employees', getEmployees);

router.post(
    '/employees',
    employeeValidators,
    validateRequest,
    createEmployee
);

router.get(
    '/employees/:eid',
    employeeIdValidator,
    validateRequest,
    getEmployeeById
);

router.put(
    '/employees/:eid',
    employeeIdValidator,
    employeeValidators,
    validateRequest,
    updateEmployee
);
router.delete(
    '/employees',
    deleteEmployeeIdValidator,
    validateRequest,
    deleteEmployee
);

module.exports = router;
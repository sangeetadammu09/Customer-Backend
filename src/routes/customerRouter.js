// import controllers customer, address
const customerController = require('../controllers/customerController')
const fileUpload = require('../helpers/fileUpload')

// router
const router = require('express').Router()

// use routers
router.post('/insertCustomer', fileUpload("./Images") , customerController.insertCustomer);
router.post('/verifyCustomer', customerController.verifyCustomer);
router.get('/selectCustomers', customerController.selectCustomers);
router.get('/getCustomer/:id', customerController.selectCustomerById);
router.get('/getCustomerByName', customerController.selectCustomerByFirstName);
router.put('/:id', fileUpload("./Images"), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.post('/login', customerController.login);
router.post("/forgotPassword", customerController.forgotPassword);
router.patch("/resetPassword/:token", customerController.resetPassword);




module.exports = router;
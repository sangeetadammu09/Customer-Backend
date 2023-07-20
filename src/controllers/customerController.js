const db = require('../models')
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sendEmail = require("../helpers/sendEmail");
const crypto = require("crypto");
const clientURL = process.env.CLIENT_URL;
const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;


require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


// create main Model
const Customer = db.customer;
const Address = db.address;
const Token = db.token;

// main work


//  verify customer
const verifyCustomer = async (req, res) => {
    try{
        let foundcustomer = await Customer.findOne({ where: { userName: req.body.userName }});
        if(!foundcustomer){           
            res.status(200).json({"status": 200, "message": "Customer doesnot exist"});     
               
        }else{
            res.status(409).json({"status": 409, "message": "Customer already exists"});
        }
    }catch(err){
            res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }
    
              
}
// create customer
const insertCustomer = async (req, res) => {
    
    let customerInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        dob: req.body.dob,
        phone: (req.body.phone).toString(),
        email: req.body.email,
        gender: req.body.gender,
        password: bcrypt.hashSync(req.body.password, 8),
        confirmPassword: req.body.confirmPassword,
        isActive: req.body.isActive ? req.body.isActive : false,
        image: req.file.filename
    }
   
    try{
        let foundcustomer = await Customer.findOne({ where: { userName: req.body.userName }});

        if(!foundcustomer){
            const customer = await Customer.create(customerInfo)
            let addressdata = {
                    customerId: customer.customerId,
                    address: req.body.address,
                    landmark: req.body.landmark,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    zipCode: req.body.zipCode
                }   
                await Address.create(addressdata);
            
                res.status(200).json({"status": 200, "message": "Customer created sucessfully"});     
               
        }else{
            res.status(409).json({"status": 409, "message": "Customer already exists"});
        }
    }catch(err){
        res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }
    
              
}

const login = async(req, res) => {
    const customer = await Customer.findOne({  include: [{
        model: Address,
        as: 'address', 
       }],where : {userName : req.body.userName }});
       
    if(customer){
       const password_valid = await bcrypt.compare(req.body.password,customer.password);
       if(password_valid){
           const jwtSecret = process.env.JWT_SECRET
           token = jwt.sign({ "customerId" : customer.customerId },jwtSecret);
           res.status(200).json({ token : token, 'message' : "Logged in successfully"});
       }else{
         res.status(400).json({ error : "Password Incorrect" });
       }
     }else{
       res.status(404).json({ error : "Customer does not exist" });
     }
    
}


// get all customers
const selectCustomers = async (req, res) => {
    
    try{
        let customers = await Customer.findAll({
            include: [{model: Address,as: 'address'}]
             })
            if(customers.length > 0) {
            for(const customer of customers) {
            if(customer.image !== ''){
                let imageUrl = process.env.IMAGE_BASE_PATH+customer.image;
                customer.image = imageUrl;
                }
            }
        }
        res.status(200).json({"status": 200, "message": "Customers fetched successfully", data: customers});
    }catch(err){
         res.status(500).json({"status": 500, "message": "something went wrong", error: err});
    }

}

// get single customer by id
const selectCustomerById = async (req, res) => {
    let id = req.params.id;
    try{
        let customer = await Customer.findOne({
            include: [{model: Address,as: 'address'}], where: { customerId: id }})
        res.status(200).json({"status": 200, "message": "Customer found successfully", data: customer});
    }catch(err){
         res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }
}

// get single customer by firstname
const selectCustomerByFirstName = async (req, res) => {
    let name = req.query.name;
   
    try{
        let customers = await Customer.findAll({
            where: {
                firstName: { [Op.like]: `%${name}%` },
              }
             })
            if(customers.length > 0) {
            for(const customer of customers) {
            if(customer.image !== ''){
                let imageUrl = process.env.IMAGE_BASE_PATH+customer.image;
                customer.image = imageUrl;
                }
            }
        }
        res.status(200).json({"status": 200, "message": "Customers fetched successfully", data: customers});
    }catch(err){
         res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }
   
}

// update Customer
const updateCustomer = async (req, res) => {
    try{
        let cid = req.params.id;
        let foundCustomer = await Customer.findOne({include: [{model: Address,as: 'address'}], where: { customerId: cid }});
        let customerInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            dob: req.body.dob,
            phone: (req.body.phone).toString(),
            email: req.body.email,
            gender: req.body.gender,
            password: foundCustomer.password,
            confirmPassword: foundCustomer.confirmPassword,
            isActive: req.body.isActive ? req.body.isActive : false,
            image: req.file == undefined ? foundCustomer.image : req.file.filename,
        }
        const customer =  await Customer.update(customerInfo,{ where:{ customerId: cid }});

        if(foundCustomer){
            const id = foundCustomer.address.addressId;
            let addressdata = {
                    customerId: foundCustomer.customerId,
                    address: req.body.address,
                    landmark: req.body.landmark,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    zipCode: req.body.zipCode
            }   
           await Address.update(addressdata,{ where:{ addressId: id }});
        }    
        res.status(200).json({"status": 200, "message": "Customer updated sucessfully"});            
    }catch(err){
        res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }
    
}

// delete customer by id
const deleteCustomer = async (req, res) => {
    let id = req.params.id  
    try{
        await Customer.destroy({ where: { customerId: id }} )
        res.status(200).json({"status": 200, "message": "Customer deleted successfully"});
    }catch(err){
         res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }

}

const forgotPassword = async (req, res) => {
    const customer = await Customer.findOne({ where: { email: req.body.email }});
    if (!customer){
        res.status(404).json({"status": 404, "message": "Email does not exist"});
    }
    try{
    let resetToken = crypto.randomBytes(32).toString("hex");
    
    let customerinfo = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        userName: customer.userName,
        dob: customer.dob,
        phone: (customer.phone).toString(),
        email: customer.email,
        gender: customer.gender,
        isActive: customer.isActive ? req.body.isActive : false,
        image: customer.image,
        passwordResetToken: crypto.createHash('sha256').update(resetToken).digest("hex"),
        passwordResetTokenExpires:  Date.now() * 10 * 60 * 1000
    }
    await Customer.update(customerinfo,{ where:{ customerId: customer.customerId }});
    const resetUrl = `${req.protocol}://${req.get('host')}/api/resetPassword/${customerinfo.passwordResetToken}`;
    const message = `We have received a reset password request. \n\n Please use this link to reset your password ${resetUrl}. \n\n This link is valid for only 10 minutes.` ;
    try{

        await sendEmail({
            email : customerinfo.email,
            subject : "Password reset request",
            message : message
        });
        res.status(200).json({"status": 200, "message": "Password reset link was sent to the customer email."});

    }catch(err){
        res.status(500).json({"status": 500, "message": "Error occurred while sending password reset link"});
    }
   
    
    
   }catch(err){
       res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }


}


const resetPassword = async (req,res) => {
     const token = req.params.token;

    try{
        const customer = await Customer.findOne({ where: { passwordResetToken: token}});
        if(!customer){           
            res.status(200).json({"status": 200, "message": "Customer doesnot exist"});                  
        }else{
            let customerInfo = {
                firstName: customer.firstName,
                lastName: customer.lastName,
                userName: customer.userName,
                dob: customer.dob,
                phone: (customer.phone).toString(),
                email: customer.email,
                gender: customer.gender,
                password : bcrypt.hashSync(req.body.password, 8),
                confirmPassword : req.body.confirmPassword,
                isActive: customer.isActive ? req.body.isActive : false,
                image: customer.image,
            }
            await Customer.update(customerInfo,{ where:{ customerId: customer.customerId }});
            res.status(200).json({"status": 200, "message": "Customer passowrd update successfully"});

            
      }
    }catch(err){
            res.status(400).json({"status": 400, "message": "something went wrong", error: err});
    }  
    




};




module.exports = {verifyCustomer,insertCustomer,selectCustomerByFirstName,
                  login,selectCustomers,selectCustomerById, updateCustomer,deleteCustomer,forgotPassword,resetPassword}
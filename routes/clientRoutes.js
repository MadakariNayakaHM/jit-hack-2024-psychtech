const express=require('express');
const authController=require('./../controllers/authController');
const serverController=require('./../controllers/serverController');
const clientController=require('./../controllers/clientController');
const Router = express.Router();

Router.route('/clientCreation').post(clientController.createClient);

module.exports=Router;
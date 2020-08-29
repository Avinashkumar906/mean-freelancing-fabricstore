const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Mongodb schema for Order collection 
const orderSchema = new Schema({
    name:String,
    email:String,
    address:String,
    status:{type:String,default:'placed'},
    items:{type : Array, default: []}
})

module.exports = mongoose.model('order', orderSchema)
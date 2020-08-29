const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Mongodb schema for product collection 
const productSchema = new Schema({
    name:String,
    cost:Number,
    quantity:Number,
    image:String,
    type:String,
    colors:[{type:String}],
    description:String,
})

module.exports = mongoose.model('product', productSchema)
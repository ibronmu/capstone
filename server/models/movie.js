const mongoose = require('mongoose')

const Movie = new mongoose.Schema({
    title:{type:String, required:true},
    genre:{type:String},
    description:{type:String},
    releaseYear:{type:Number},
    posterUrl:{type:String},
        likes:{type: Number,default:0},
         ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }]

    
}, {timestamps:true})
module.exports = mongoose.model('Movie', Movie);
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title:{type :string, required:true},
    genre:{type:string},
    description:{type:string},
    releaseYear:{type:number},
    posterUrl:{type:string},
        likes:{type: number,default:0},
         ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }]

    
}, {timestamps:true})

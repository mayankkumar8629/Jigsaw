import { response } from 'express';
import mongoose from 'mongoose';
const { Schema,model}= mongoose;

const sessionSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        default:'Untitled Project'
    },
    description:{
        type:String,
        default:'No description provided'
    },
    currentState:{
        type:String,
        default:''
    },
    history:[
        {
            prompt:{
                type:String,
                required:true
            },
            response:{
                type:String,
                default:''
            },
            timestamp:{
                type:Date,
                default:Date.now
            },
            code:{
                type:String,
                default:''
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Session = model('Session', sessionSchema);
export default Session;
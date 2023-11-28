import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let request = new Schema({
    sender: {
        type: String,
        required: true
    },
    type: {
        type: Number, // 1: sms, 2: twitter, 3: telegram
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: Number, // 1: pending, 2: success, 3: fail
        required: true,
        default: 1
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Request = mongoose.model('Request', request);
mongoose.models = {};
export default Request;
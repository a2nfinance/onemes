import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let request = new Schema({
    sender: {
        type: String,
        required: true
    },
    type: {
        type: Number, // 1: sms, 2: telegram, 3: twitter,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: false
    },
    status: {
        type: Number, // 0: pending, 1: success, 2: fail, 3: processing
        required: true,
        default: 0
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
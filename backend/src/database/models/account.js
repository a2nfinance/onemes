import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let account = new Schema({
    wallet_address: {
        type: String,
        required: true
    },
    onemes_name: {
        type: String,
        required: true
    },
    onemes_account_address: {
        type: String,
        required: true
    },
    chain: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    twitter: {
        type: String,
        required: false
    },
    telegram: {
        type: String,
        required: false
    },
    use_wallet_address_to_receive: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: Number, // 0: inactive, 1: active, 2: paused
        required: true,
        default: 1
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Account = mongoose.model('Account', account);
mongoose.models = {};
export default Account;
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();

const connect = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return handler(req, res);
    }

    // Use new db connection
    await mongoose.connect(process.env.DATABASE_URL, {
        //@ts-ignore
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    return handler(req, res);
};

export default connect;
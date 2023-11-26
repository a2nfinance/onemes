import mongoose from 'mongoose';

const connect = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return handler(req, res);
    }

    // Use new db connection
    await mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL, {
        //@ts-ignore
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    return handler(req, res);
};

export default connect;
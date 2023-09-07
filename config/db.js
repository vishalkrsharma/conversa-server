import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`DB connected: ${connect.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(`Error: ${err}`.red.bold);
    process.exit();
  }
};

export default connectDB;

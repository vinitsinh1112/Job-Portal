import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        // connect DB
        await connectDB();

        // start the server
        app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server failed to start: ", error.message);
        process.exit(1);
    }
};

startServer();
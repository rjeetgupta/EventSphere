import dotenv from "dotenv"
import connectDB from "./config/db.js";
import app from "./app.js";
import initializeDepartment from "./constants/department.js";


dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 4000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        
        // Initialize default department
        // await initializeDepartment();

        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port : ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();


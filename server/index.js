import express from 'express';
import dotenv from 'dotenv'; 
import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
dotenv.config();

const app = express();
const port = 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173",credentials:true,methods:["GET","POST","PUT","DELETE","OPTION"]}))
   

// Test route to check if the server is working
app.get('/', (req, res) => {
    res.send('Hello World');
});

// API routes
app.use("/api", apiRouter);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
    console.log(`Route not found: ${req.method} ${req.originalUrl}`);  
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

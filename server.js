import express from "express";
import cors from "cors"; 
import mongoose from "mongoose"; 
import dotenv from "dotenv";
import newTrip from "./routes/newTrip.js" //TRIP ROUTE 
import CreateTrip from "./routes/createTrip.js"  //CREATE ROUTE
import ScheduleTrip from "./routes/scheduleTrip.js" //SCHEDULE ROUTE
import SavedTrip from "./routes/savedTrip.js" //SAVED TRIP ROUTE
import CoverImages from "./routes/coverImages.js" //COVER IMGS ROUTE
import Auth from "./routes/auth.js"
import Logout from "./routes/logout.js"
import cookieParser from "cookie-parser";
import Explore from "./routes/savedTrip.js";
import chatRoute from "./routes/chat.js";


dotenv.config(); 

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",              
  "https://travel-genie-itinerary.vercel.app/"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
})); 

app.use("/Create", newTrip); //rename !!!!
app.use("/new", CreateTrip); //rename !!!!
app.use("/Schedule", ScheduleTrip);
app.use("/saved", SavedTrip);
app.use("/uploadCover", CoverImages);
app.use("/auth", Auth);
app.use("/logout", Logout);
app.use("/explore", Explore);
app.use("/api", chatRoute);

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    connectDB();
}
);

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MDB_URL);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}

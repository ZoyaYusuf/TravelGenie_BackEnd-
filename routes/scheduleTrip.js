import express from "express";        //Exp
import Schedule from "../models/Schedule.js"; //DB
import Trip from "../models/Trip.js"; 
const router = express.Router(); 
import { protect } from "../middleware/auth.js";

router.post("/CreateTrip/:tripId", protect ,async(req,res) => {
    try{ 
        const { tripId, days} = req.body;
        if (!tripId || !days) {
            return res.status(400).json({ success: false, message: "tripId and days are required" });
        }       
         
        const newSchedule = new Schedule({tripId, days});
        const savedSchedule = await newSchedule.save();
        await Trip.findOneAndUpdate(  // Link the schedule _id to the Trip
        { tripId },
        { $push: { schedules: savedSchedule._id } },
        { new: true } 
        );
        res.status(201).json(savedSchedule);
        console.log("saved backend : ", savedSchedule);
        // console.log("saved backend : ", savedSchedule.days.slots[0]); //undefined! 
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Can't save schedule"});
    }
})


export default router; 
import express from "express";        //Exp
import Trip from "../models/Trip.js"; //DB
import multer from "multer";
import { protect } from "../middleware/auth.js";
const router = express.Router(); 

router.post("/newTrip/:userId", protect,async(req,res) =>{
    try{ 
        const { userId } = req.params;
        const { tripName, city, days, startDate, cover} = req.body;
        const newTrip = new Trip({tripName, city, days, startDate, cover, userId});
        console.log(userId)
        const response = await newTrip.save();
        console.log(response);
        res.status(201).json({ success: true, tripId: newTrip.tripId });
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Can't fetch"}); 
    }
});

export default router;

// router.post("/test", async(req,res) =>{
//     try{
//         const trip = new Trip({
//             tripName:"first trip",
//             city:"delhi",
//             days:3,
//         });
//         const response = await trip.save();
//         console.log(response);
//     }catch{
//         console.log(err);
//         res.status(500).json({error: "Failed to save in DB"});
//     }
// });
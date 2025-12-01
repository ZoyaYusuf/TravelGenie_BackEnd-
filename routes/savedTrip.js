import express from "express";        //Exp
import Trip from "../models/Trip.js"; //DB
const router = express.Router(); 
import { protect } from "../middleware/auth.js";

router.get("/Explore/:id", protect, async(req,res)=>{
  console.log("in console")
})

router.get("/savedTrip/:userId", protect,async(req,res) =>{
    try{  
        const { userId } = req.params;
        const trips = await Trip.find({userId}); // get all trips
        res.status(200).json(trips);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Can't fetch trips"}); 
    }
}); 


router.get("/savedTrip/:userId/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ tripId }).populate("schedules");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Can't fetch this trip" });
  }
});

router.delete("/savedTrip/:userId/:tripId", protect, async (req, res) => {
  try {
    const { userId, tripId } = req.params;

    const deleted = await Trip.findOneAndDelete({ userId, tripId });

    if (!deleted) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});


export default router;


// better security code: 
// router.get("/savedTrip/:userId", protect, async (req, res) => {
//   try {
//     const loggedInUserId = req.user.id; // coming from token
//     const { userId } = req.params;

//     // Block access if URL id does not match token id
//     if (loggedInUserId !== userId) {
//       return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const trips = await Trip.find({ userId: loggedInUserId });

//     res.status(200).json(trips);
//   } 
//   catch (err) {
//     res.status(500).json({ error: "Can't fetch trips" });
//   }
// });
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const TripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String, 
      required : true,
      unique: true,
      default: uuidv4
    },
    tripName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,  
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    city: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    cover: {
      type: String,
      default: "https://www.finedge.in/public/uploads/blog/how-to-plan-a-vacation.jpg",
    },
    schedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
import mongoose from "mongoose"; 
import Trip from "../models/Trip.js"; //DB

const slotSchema = new mongoose.Schema(
    {
        Morning: { type: [String], default: [] },
        Afternoon: { type: [String], default: [] },
        Evening: { type: [String], default: [] },
        Night: { type: [String], default: [] }
    }
); 

const daySchema = new mongoose.Schema(
    {
        dayNumber: { 
            type: Number, 
            required: true 
        },
        date:{
            type: Date,
            required: true
        },
        slots: { 
            type: slotSchema, 
            default: () => ({}) },
    }
);

const ScheduleSchema = new mongoose.Schema(
    {
        tripId : {
            type: String, 
            required : true,
            unique: true, 
            ref: "Trip",
        },
        days: [daySchema],
    }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);
export default Schedule;
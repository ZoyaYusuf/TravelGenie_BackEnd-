// import express from "express";        //Exp 
// const router = express.Router(); 
// import { protect } from "../middleware/auth.js";

// router.post("/CreateTrip/:id", protect ,async(req,res)=>{
//     try{
//         const { city } = req.body;
//         console.log(city)
//         if (!city) {
//         return res.status(400).json({ error: "City name is required" });
//         }
//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
//             },
//             body: JSON.stringify({
//                 model: "openai/gpt-oss-20b:free",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are a helpful travel assistant. Always respond in JSON format."
//                     },
//                     {
//                         role: "user",
//                         content: `Give me a list of 10 tourist attractions in ${city}. Return only valid JSON in this format: 
//                         [
//                         { "title": "Attraction Name"}
//                         ]`
//                     }
//                 ]
//             })
//         };

//         try {
//             const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
//             const data = await response.json();

//             const attractions = JSON.parse(data.choices[0].message.content);

//             console.log("AI attractions:", attractions);

//             res.json(attractions); // send parsed JSON directly
//         } catch(err) {
//             console.error(err);
//             res.status(500).json({ error: "Something went wrong in apis" });
//         }

//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: "Can't fetch"});
//     }
// })

// // router.post("CreateTrip", async(req,res) => {
// //     try{

// //     }catch(err){
// //         console.log(err);
// //     }
// // })

// export default router; 





import express from "express";        //Exp 
const router = express.Router(); 
import { protect } from "../middleware/auth.js";
import { extractValidJSON } from "../middleware/validateJson.js";

router.post("/CreateTrip/:id", protect ,async(req,res)=>{
    try{
        const { city } = req.body;
        if (!city) {
        return res.status(400).json({ error: "City name is required" });
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful travel assistant. Always respond in JSON format."
                    },
                    {
                        role: "user",
                        content: `Give me a list of 10 tourist attractions in ${city}. Return only valid JSON in this format: 
                        [
                        { "title": "Attraction Name" }
                        ]`
                    } 
                ]
            })
        };

        try {  
            const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
            const aiData = await aiRes.json();
            const content = aiData?.choices?.[0]?.message?.content;

            let attractions = extractValidJSON(content);

            if (!attractions) {
            console.log("AI JSON Invalid On First Try:", content);

            // ⚠️ SAFE RETRY (retry only once)
            const retryRes = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
            const retryData = await retryRes.json();
            const retryContent = retryData?.choices?.[0]?.message?.content;

            attractions = extractValidJSON(retryContent);

            if (!attractions) {
                console.log("AI JSON Invalid On Second Try:", retryContent);
                return res.status(500).json({ error: "AI returned invalid JSON twice." });
            }
            }
            res.json(attractions); // send parsed JSON directly
        } catch(err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong in apis" });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

// router.post("CreateTrip", async(req,res) => {
//     try{

//     }catch(err){
//         console.log(err);
//     }
// })

export default router; 
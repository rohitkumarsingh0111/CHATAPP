import express from "express";

const router = express.Router();

router.get("/contacts", (req, res) => {
    
});

router.get("/send", (req, res)=> {
    res.send("Send message endpoint");
});


export default router;
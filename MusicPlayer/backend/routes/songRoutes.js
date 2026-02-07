import express from "express";
import { getPlayListByTag, getSongs, toggleFavourite } from "../controllers/musicController.js";
import { protect } from "../middleware/authMiddleware.js";

const songRouter = express.Router();

songRouter.get('/',getSongs);
songRouter.get('/playListByTag/:tag',getPlayListByTag);
songRouter.post('/favourite',protect, toggleFavourite);
songRouter.get('/favourites',protect,(req,res) => {
    res.json(req.user.favourites);
})

export default songRouter;

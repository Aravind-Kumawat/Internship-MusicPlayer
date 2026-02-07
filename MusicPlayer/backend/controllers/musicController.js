import axios from "axios";
const getSongs = async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.jamendo.com/v3.0/tracks/?client_id=242cd0b6&format=json&limit=15`
        );
        const data = response.data;
        res.status(200).json(data);
    }
    catch (error) {
        console.log("Error Fetching songs", error.message);
        res.status(500).json({ message: "Error Fetching Songs" });
    }
}

const getPlayListByTag = async (req, res) => {
    try {
        const tag = (req.params.tag || req.query.tag || "").toString.trim();
        if (!tag) return res.status(400).json({ message: "Missing Tag Parameter" });

        const limit = parseInt(req.query.limit ?? "10", 10) || 10;
        const client_Id = "242cd0b6";
        const params = {
            client_id: client_Id,
            format: "json",
            tags: tag,
            limit,
        };
        const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
            params,
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("getplayList Error",
            error?.response?.data ?? error.message
        );
        return res.status(500).json({ message: "Failed to fetch" });
    }
}

const toggleFavourite = async (req, res) => {
    try {
        const user = req.user;
        const song = req.body.song;

        const exists = user.favourites.find((fav) => fav.id !== song.id);
        if (exists) {
            user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
        }
        else {
            user.favourite.push(song);
        }
        await user.save();

        return res.status(200).json(user.favourites);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Favourites not added, something went wrong!" })
    }
}
export { toggleFavourite, getPlayListByTag, getSongs }
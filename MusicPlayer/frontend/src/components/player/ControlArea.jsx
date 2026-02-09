import React from "react";
import { GiPauseButton } from "react-icons/gi";
import {  FaHeart, FaRegHeart, FaCirclePlay } from "react-icons/fa6";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // ✅ Added import
import { updateFavourites } from "../../redux/slices/authSlice";
import { formatTime } from "../../../utils/helper";
// import InSpinner2 from "your-spinner-component"; // ✅ Import if you have it

const ControlArea = ({ playerState, playerControls }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { isPlaying, currentTime, duration, currentSong, isLoading } = playerState;

  const { handleTogglePlay, handleNext, handlePrev, handleSeek } = playerControls;

  const currentSongId = currentSong?.id;
  const isLiked = Boolean(
    currentSongId && user?.favourites?.some((fav) => fav.id === currentSong.id)
  );

  const handleLike = async () => {
    if (!isAuthenticated || !currentSong) return;

    try {
      const songData = {
        id: currentSong.id,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      };

      const res = await axios.post(
        "http://localhost:8001/api/songs/favourite",
        { song: songData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateFavourites(res.data));
    } catch (err) {
      console.log("Like Failed", err);
    }
  };

  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={handlePrev}
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>

        <button
          type="button"
          aria-label={isPlaying ? "pause" : "play"}
          className="control-play-btn"
          onClick={handleTogglePlay}
        >
          {isLoading ? (
            <InSpinner2 className="animate-spin" color="#a855f7" size={36} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>

        {isAuthenticated && (
          <button
            type="button"
            aria-label="like"
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #a855f7 ${
              duration ? (currentTime / duration) * 100 : 0
            }%, #333 ${
              duration ? (currentTime / duration) * 100 : 0
            }%)`,
          }}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;

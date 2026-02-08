import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";

const ControlArea = () => {
  const isPlaying = false;
  const currentTime = 0;
  const duration = 180;
  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>
        <button type="button" aria-label="play" className="control-play-btn">
          {isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button type="button" aria-label="next" className="control-icon-btn">
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>
        <button type="button" aria-label="like" className="control-icon-btn">
          <FaRegHeart color="#a855f7" size={22} />
        </button>
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
        />
        <div className="control-times">
          <span>0.00</span>
          <span>3.00</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;

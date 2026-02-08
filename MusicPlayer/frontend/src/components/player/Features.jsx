import React from "react";
import { IoVolumeHighOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

import "../../css/footer/Feature.css";

const Features = () => {
  // static UI state
  const isMuted = false;
  const shuffleEnabled = false;
  const loopEnabled = false;
  const playbackSpeed = 1;
  const volume = 50;

  return (
    <div className="features-root">
      <div className="features-row">
        {/* Mute */}
        <button className="features-btn" aria-label="mute">
          <IoVolumeHighOutline color="#a855f7" size={26} />
        </button>

        {/* Shuffle */}
        <button className="features-btn" aria-label="shuffle">
          <TbArrowsShuffle color="#9ca3af" size={26} />
        </button>

        {/* Loop */}
        <button className="features-btn" aria-label="loop">
          <RiLoopRightLine color="#9ca3af" size={26} />
        </button>

        {/* Playback Speed */}
        <label className="features-speed-label">
          <select
            className="features-speed-select"
            value={playbackSpeed}
            readOnly
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          className="features-volume-range"
          readOnly
        />
      </div>
    </div>
  );
};

export default Features;

import React from "react";
import "../../css/songs/SongGrid.css";
import SongCard from "./SongCard.jsx";

const SongGrid = ({ songs, onSelectFavourite }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="song-grid-empty">
        <p className="empty-text">No favourite songs yet</p>
        <p className="empty-subtext">
          Start adding songs to your favourites by clicking the heart icon on any song in the home or search view
        </p>
      </div>
    );
  }

  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading">Your Favourites</h2>
      <div className="song-grid">
        {songs.map((song, index) => (
          <SongCard
            key={index}
            song={song}
            onSelectFavourite={() => onSelectFavourite(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;

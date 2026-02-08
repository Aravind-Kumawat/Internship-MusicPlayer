import React from "react";

const SongGrid = ({ songs }) => {
  return (
    <div>
      {songs.map((song) => (
        <div key={song.id}>{song.name || song.title}</div>
      ))}
    </div>
  );
};

export default SongGrid;

import React from 'react'
import "../../css/songs/SongCard.css";
const SongCard = ({ song, onSelectFavourite }) => {
  return (
    <div className='song-card' onClick = {onSelectFavourite}>
        <div className='song-card-image'>
            <img src={song.image} alt={song.title} loading='lazy'></img>
        </div>
        <div className='song-card-info'>
            <h4 className='song-title'>{song.name}</h4>
            <p className='song-artist'>{song.artist_name}</p>
            </div>
    </div>
  )
}

export default SongCard
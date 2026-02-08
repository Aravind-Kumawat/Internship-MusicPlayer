import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import useAudioPlayer from "../hooks/useAudioState.js";
import axios from "axios";
import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const auth = useSelector((state) => state.auth);
  const songsToDisplay = view === "search" ? searchSongs : songs;
  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    isLoading,
    duration,
    isMuted,
    volume,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    handlePrev,
    handleNext,
    handleTogglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
    playSongAtIndex,


  } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong, isPlaying, currentTime, duration, isMuted,
    loopEnabled, shuffleEnabled, playbackSpeed, volume,
  }
  const playerControls = {
    playSongAtIndex,
    handlePrev, handleNext, handleTogglePlay, handleEnded,
  }

  const playerFeatures = {
    onToggeleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onSeek: handleSeek,
    onChangeVolume: handleChangeVolume,
  }
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try{
        const res = await axios.get("http://localhost:8001/api/songs");
        setSongs(res.data.results || []);
      }
      catch(err){
        console.log("Failed to fetch songs",err);
        setSongs([]);
      }
    };
    fetchInitialSongs();
  },[]);

  const loadPlayList = async (tag) => {
    if(!tag){
      console.log("Tag is required to load playlist");
      return;
    }
    try{
      const res= await axios.get(`http://localhost:8001/api/songs/playlistByTag/${tag}`);
      setSongs(res.data.results || []);
    }catch(err){
      console.log("Failed to load playlist",err);
      setSongs([]);
    }
  }

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  }
  const handlePlayFavorite = (song) => {
    const favourites = auth.user?.favourites || [];
    if(!favourites.length)  return;
    const index = auth.user.favourites.findIndex((fav) => fav._id === song._id);
    setSongs(auth.user.favourites);
    setView("home");
    setTimeout(() => {
      if(index !== -1){
        playSongAtIndex(index);
      }
    },0);

  };
  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}

      >{currentSong && <source src={currentSong.audio} type="audio/mpeg"/>}</audio>
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea view={view}
           currentIndex = {currentIndex}
           inSelectSong={handleSelectSong}
           onSelectFavourite={handlePlayFavorite}
           onSelectTag={loadPlayList}
           songsToDisplay={songsToDisplay}
           setSearchSongs = {setSearchSongs }
           />
        </div>
      </div>
      {/* Footer Player */}
      <Footer />
    </div>
  );
};

export default Homepage;

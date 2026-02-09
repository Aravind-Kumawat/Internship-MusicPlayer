import { useSelector } from "react-redux";
import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";
import SongGrid from "../songs/SongGrid";

import "../../css/mainArea/MainArea.css";

const MainArea = ({
  view,
  currentIndex,
  onSelectSong,        // renamed for clarity
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSongs,
}) => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist onSelectTag={onSelectTag} />}
        {view === "search" && <SearchBar setSearchSongs={setSearchSongs} />}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList
            songs={songsToDisplay}
            currentIndex={currentIndex}
            onSelectSong={onSelectSong}
          />
        )}

        {view === "favourite" && (
          <SongGrid
            songs={auth.user?.favourites || []}
            onSelectFavourite={onSelectFavourite}
          />
        )}
      </div>
    </div>
  );
};

export default MainArea;

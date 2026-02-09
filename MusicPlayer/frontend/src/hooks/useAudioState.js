import { useReducer, useState, useRef } from "react";

const initialAudioState = {
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    volume: 1,
    loopEnabled: false,
    shuffleEnabled: false,
    playbackSpeed: 1,
    currentIndex: null,
    currentSong: null,
    currentTime: 0,
};

function audioReducer(state, action) {
    switch (action.type) {
        case "LOADING":
            return { ...state, isLoading: true };
        case "PLAY":
            return { ...state, isPlaying: true, isLoading: false };
        case "PAUSE":
            return { ...state, isPlaying: false };
        case "MUTE":
            return { ...state, isMuted: true, volume: 0 };
        case "UNMUTE":
            return { ...state, isMuted: false, volume: action.payload || 1 }; // Restore volume
        case "SET_VOLUME":
            return { ...state, volume: action.payload, isMuted: action.payload === 0 };
        case "TOGGLE_LOOP":
            return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
        case "TOGGLE_SHUFFLE":
            return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
        case "SET_PLAYBACK_SPEED":
            return { ...state, playbackSpeed: action.payload };
        case "SET_CURRENT_TRACK":
            return {
                ...state,
                currentIndex: action.payload.index,
                currentSong: action.payload.song,
                isLoading: true,
                currentTime: 0, // Reset time on new song
            };
        case "SET_CURRENT_TIME":
            return { ...state, currentTime: action.payload };
        default:
            return state;
    }
}

export const useAudioPlayer = (songs) => {
    const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
    const [duration, setDuration] = useState(0);

    // Initialize Audio object in a ref so it persists without re-rendering
    const audioRef = useRef(new Audio());
    const previousVolumeRef = useRef(1);

    // 1. Handle Song Playing / Changing
    const playSongAtIndex = async (index) => {
        if (!songs || songs.length === 0) {
            console.warn("No songs available.");
            return;
        }
        // Loop around if out of bounds (optional safety)
        if (index < 0 || index >= songs.length) return;

        const song = songs[index];

        // Update State
        dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });

        // Handle Audio Element
        const audio = audioRef.current;
        if (!audio) return;

        // Assuming your song object has a 'url' or 'src' property
        audio.src = song.url || song.src;
        audio.playbackRate = audioState.playbackSpeed;
        audio.volume = audioState.volume;

        try {
            dispatch({ type: "LOADING" });
            await audio.load();
            await audio.play();
            dispatch({ type: "PLAY" });
        } catch (error) {
            console.error("Error playing audio:", error);
            dispatch({ type: "PAUSE" });
        }
    };

    // 2. Handle Play/Pause Toggle
    const handleTogglePlay = async () => {
        const audio = audioRef.current;
        if (!audio || !audio.src) return;

        if (audioState.isPlaying) {
            audio.paused;
            dispatch({ type: "PAUSE" });
        } else {
            try {
                await audio.play();
                dispatch({ type: "PLAY" });
            } catch (error) {
                console.error("Error resuming:", error);
            }
        }
    };

    // 3. Handle Next Song
    const handleNext = () => {
        if (!songs.length) return;
        if (audioState.currentIndex === null) {
            playSongAtIndex(0);
            return;
        }

        if (audioState.shuffleEnabled && songs.length > 1) {
            let randomIndex = audioState.currentIndex;
            while (randomIndex === audioState.currentIndex) {
                randomIndex = Math.floor(Math.random() * songs.length);
            }
            playSongAtIndex(randomIndex);
            return;
        }
        const nextIndex = (audioState.currentIndex + 1) % songs.length;
        playSongAtIndex(nextIndex);
    };

    // 4. Handle Previous Song
    const handlePrev = () => {
        if (!songs.length) return;

        if (audioState.currentIndex === null) {
            playSongAtIndex(0);
            return;
        }

        let prevIndex = (audioState.currentIndex - 1 + songs.length) % songs.length;
        playSongAtIndex(prevIndex);
    };

    //Audio event handler
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }
        dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime || 0 });

    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) { return; }
        setDuration(audio.duration || 0);
        audio.playbackRate = audioState.playbackSpeed;
        audio.volume = audioState.volume;
        audio.muted = audioState.muted;
        dispatch({ type: "PLAY" });
    };
    const handleEnded = () => {
        const audio = audioRef.current;
        if (!audio) { return; }
        if (audioState.loopEnabled) {
            audio.currentTime = 0;
            audio.play().then(() => {
                dispatch({ type: "PLAY" });
                dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
            }).catch((error) => {
                console.error("Error replaying:", error);
                dispatch({ type: "PAUSE" });
            });
        }
    }
    const handleToggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audioState.isMuted) {
            const restoredVolume = previousVolumeRef.current || 1;

            audio.muted = false;
            audio.volume = restoredVolume;
            dispatch({ type: "UNMUTE" });
            dispatch({ type: "SET_VOLUME", payload: restoredVolume });
        } else {
            previousVolumeRef.current = audioState.volume || 1;
            audio.muted = true;
            audio.volume = 0;
            dispatch({ type: "MUTE" });
            dispatch({ type: "SET_VOLUME", payload: 0 });
        }
    };

    const handleToggleLoop = () => {
        dispatch({ type: "TOGGLE_LOOP" });
    };
    const handleToggleShuffle = () => {
        dispatch({ type: "TOGGLE_SHUFFLE" });
    }
    const handleChangeSpeed = (speed) => {
        const audio = audioRef.current;
        if (!audio) return;
        dispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
        if (audio) {
            audio.playbackRate = speed;

        }
    };

    const handleSeek = (time) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        dispatch({ type: "SET_CURRENT_TIME", payload: time });
    };
    const handleChangeVolume = (volume) => {
        const audio = audioRef.current;
        if (volume > 0) {
            previousVolumeRef.current = volume;
        }
        dispatch({ type: "SET_VOLUME", payload: volume });
        if (!audio) return;
        audio.volume = volume;
        if (volume === 0) {
            audio.muted = true;
            dispatch({ type: "MUTE" });
        } else if (audioState.isMuted) {
            audio.muted = false;
            dispatch({ type: "UNMUTE" });
        }
    };
    return {
        audioRef,
        currentIndex: audioState.currentIndex,
        currentSong: audioState.currentSong,
        isPlaying: audioState.isPlaying,
        currentTime: audioState.currentTime,
        isLoading: audioState.isLoading,
        duration,
        isMuted: audioState.isMuted,
        loopEnabled: audioState.loopEnabled,
        shuffleEnabled: audioState.shuffleEnabled,
        playbackSpeed: audioState.playbackSpeed,
        volume: audioState.volume,
        playSongAtIndex,
        handleTogglePlay,
        handleNext, 
        handlePrev,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,
        handleToggleMute,
        handleToggleLoop,
        handleToggleShuffle,
        handleChangeSpeed,
        handleSeek,
        handleChangeVolume,
    };
};

export default useAudioPlayer;
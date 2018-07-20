angular
    .module('dpPlayerService', [])
    .factory('dpPlayerService', dpPlayerService);

dpPlayerService.$inject = ["$rootScope", "dpSongsListLogic"];

function dpPlayerService($rootScope, dpSongsListLogic) {
    
    var service = {
        isPlaying: isPlaying,
        isPlayerEnabled: isPlayerEnabled,
        isPlayerMuted : isPlayerMuted,
        initPlayerService: initPlayerService,
        setPlay: setPlay,
        setPause: setPause,
        loadSongById: loadSongById,
        onPlaySongClick: onPlaySongClick,
        onPauseSongClick: onPauseSongClick,
        onNextSongClick: onNextSongClick,
        onBackSongClick : onBackSongClick,
        onRepeatSongClick : onRepeatSongClick,
        seekToBeginningOfSong : seekToBeginningOfSong,
        getPlayerCurrentDuration : getPlayerCurrentDuration,
        getPlayerCurrentDurationFormatted : getPlayerCurrentDurationFormatted,
        getVolumeLevel : getVolumeLevel,
        setVolumeLevel : setVolumeLevel,
        mutePlayer: mutePlayer,
        unMutePlayer : unMutePlayer,
        playerSeekTo : playerSeekTo
    };
    return service;


    //////////

    function initPlayerService() {
        $rootScope.isPlaying = false;
    }

    function isPlaying() {
        return $rootScope.isPlaying;
    }

    function setPlay() {
        $rootScope.isPlaying = true;
    }

    function setPause() {
        $rootScope.isPlaying = false;
    }

    function onPlaySongClick() {
        getPlayerRef().playVideo();
    }

    function onPauseSongClick() {
        getPlayerRef().pauseVideo();
    }

    function onNextSongClick() {
        getPlayerRef().stopVideo();
        dpSongsListLogic.popSongIndexFromListAndUpdate(true);
        var songId = dpSongsListLogic.getNextSongId();
        loadSongById(songId);
    }

    function onBackSongClick() {
        // we seek to the begining of the song when: 1. there is no played song (begining of playing)
        //                                           2. the song was played less than 3 seconds
        if (dpSongsListLogic.isAnySongWasPlayed() && isCurrnetSongWasPlayedMoreThanGivenSeconds(3)) {
            getPlayerRef().stopVideo();
            dpSongsListLogic.playLastPlayedSong();
            var songId = dpSongsListLogic.getNextSongId();
            loadSongById(songId);
        } else {
            seekToBeginningOfSong();
        }
    }

    function isCurrnetSongWasPlayedMoreThanGivenSeconds(minimumSeconds) {
        return getPlayerCurrentDuration() < minimumSeconds;
    }

    function onRepeatSongClick() {
        dpSongsListLogic.switchRepeatSongToggle();
    }

    function loadSongById(songId) {
        // note: we don't need to check if 'YT' was loaded - it was done before
        var playerRef = getPlayerRef();
        playerRef.loadVideoById(songId);
        playerRef.playVideo();
    }

    function isPlayerEnabled() {
        // we need to check if 'YT' was loaded
        if (typeof YT !== 'undefined' && typeof YT.get === "function") {
            var playerRef = getPlayerRef();
            // even if 'YT' was loaded, we need to check if 'loadVideoById' is available    
            if (typeof playerRef !== 'undefined' && typeof playerRef.loadVideoById === "function") {
                return true;
            }
        }
        return false;
    }
    

    //getting the current time of the playing song
    // for example: 
    function getPlayerCurrentDuration() {
        if (isPlayerEnabled()) {
            // return typeof getPlayerRef().getCurrentTime() !== 'undefined' ? Math.floor(getPlayerRef().getCurrentTime()) : 0;
            return typeof getPlayerRef().getCurrentTime() !== 'undefined' ? getPlayerRef().getCurrentTime() : 0;
            
        }
        return 0;
    }

    function getPlayerCurrentDurationFormatted() {
        // var rawDuration = Math.floor(getPlayerCurrentDuration());
        var rawDuration = getPlayerCurrentDuration();
        // console.log("getPlayerCurrentDuration(): " + getPlayerCurrentDuration())
        var formattedDuration = "";
        var seconds = parseInt(rawDuration % 60);
        var minutes = parseInt(rawDuration / 60);
        if (seconds < 10) {
            formattedDuration = minutes + ":0" + seconds;
        } else {
            formattedDuration = minutes + ":" + seconds;
        }
        return formattedDuration;
    }


    function getVolumeLevel() {
        return isPlayerEnabled() ? getPlayerRef().getVolume() : "100";
    }

    function setVolumeLevel(volLevel) {
        if (isPlayerEnabled()) {
            getPlayerRef().setVolume(volLevel);
        }
    }

    function playerSeekTo(seconds) {
        if (isPlayerEnabled()) {
            getPlayerRef().seekTo(seconds, true);
        }
    }

    function seekToBeginningOfSong() {
        playerSeekTo(0);
    }

    function isPlayerMuted() {
        if (isPlayerEnabled()) {
            return getPlayerRef().isMuted();
        }
        return false;
    }

    function mutePlayer() {
        if (isPlayerEnabled()) {
            getPlayerRef().mute();
        }
    }

    function unMutePlayer() {
        if (isPlayerEnabled()) {
            getPlayerRef().unMute();
        }
    }


    // service Utils

    function checkObjAndHisFunc(obj, func) {
        return typeof obj !== 'undefined' && typeof func === "function";
    }

    function getPlayerRef() {
        return YT.get("player");
    }

}


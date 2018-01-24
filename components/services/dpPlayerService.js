angular
    .module('dpPlayerService', [])
    .factory('dpPlayerService', dpPlayerService);

dpPlayerService.$inject = ["$rootScope", "$mdMedia", "dpSongsListLogic"];

function dpPlayerService($rootScope, $mdMedia, dpSongsListLogic) {

    var service = {
        initPlayerService: initPlayerService,
        isPlaying: isPlaying,
        setPlay: setPlay,
        setPause: setPause,
        loadSongById: loadSongById,
        isPlayerEnabled: isPlayerEnabled,
        onPlaySongClick: onPlaySongClick,
        onPauseSongClick: onPauseSongClick,
        onNextSongClick: onNextSongClick,
        getPlayerCurrentDuration : getPlayerCurrentDuration,
        getVolumeLevel : getVolumeLevel
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
            if (typeof playerRef !== 'undefined' && typeof  playerRef.loadVideoById === "function") {
                return true;
            }
        }
        return false;
    }
    

    function getPlayerCurrentDuration() {
        if (isPlayerEnabled()) {
            return getPlayerRef().getCurrentTime();
        }
        return false;
        // player.getCurrentTime()

    }

    function getVolumeLevel() {
        return isPlayerEnabled() ? getPlayerRef().getVolume() : "100";

    }


    // service Utils

    function checkObjAndHisFunc(obj, func) {
        return typeof obj !== 'undefined' && typeof func === "function";
    }

    function getPlayerRef() {
        return YT.get("player");
    }

}


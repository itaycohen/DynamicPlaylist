angular
    .module('dpDynamicPlaylist', [])
    .directive("dpDynamicPlaylist", dpDynamicPlaylist);

dpDynamicPlaylist.$inject = ["dpSongsListLogic"];
function dpDynamicPlaylist() {
    var directive = {
        restrict: "E",
        template: "<ng-include src='getTemplateUrl()'/>",
        controller: dpDynamicPlaylistController
    };
    return directive;
}

dpDynamicPlaylistController.$inject = ['$rootScope', 'dpSongsListLogic', 'dpAppUtils', '$window', '$timeout'];
function dpDynamicPlaylistController($rootScope, dpSongsListLogic, dpAppUtils, $window, $timeout) {

    $rootScope.logicService = dpSongsListLogic;

    // workaround - can't hook on ng reapeat 
    $rootScope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $rootScope.getTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistFixWideScreen.html";
        }
        return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistLongVerticalScreen.html";
    };

    $rootScope.getPlaylistWarpperClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "playlist-wrapper-horizontal";
        }
        return "playlist-wrapper-vertical";
    };

    $rootScope.playSelectedSong = function (songIndex) {
        //TODO - smooth scrolling
        $timeout(function() {
            $window.scrollTo(0, 0);
            dpSongsListLogic.popSongIndexFromListAndUpdate(true, songIndex);
            loadNextSong();
            }, 200);
    };

    // for sound bars
    $rootScope.isPlayerPlaying = function () {
        if (typeof YT !== 'undefined' && typeof YT.get === "function") {
            var playerRef = YT.get("player");
            if (typeof playerRef !== 'undefined' && typeof playerRef.getPlayerState === "function") {
                var playerState = playerRef.getPlayerState();
                return playerState === 1;
            }
        }
        return false;
    };

    function loadNextSong() {
        // we need to check if 'YT' was loaded
        if (typeof YT !== 'undefined' && typeof YT.get === "function") {
            var playerRef = YT.get("player");
            playerRef.videoId = dpSongsListLogic.getNextSongId();
            // even if 'YT' was loaded, we need to check if 'loadVideoById' is available    
            if (typeof playerRef.loadVideoById === "function") {
                playerRef.loadVideoById(playerRef.videoId);
                playerRef.playVideo();
            }
        }
    }

    $rootScope.isPlaySongEnabled = function () {
        // we need to check if 'YT' was loaded
        if (typeof YT !== 'undefined' && typeof YT.get === "function") {
            var playerRef = YT.get("player");
            // even if 'YT' was loaded, we need to check if 'loadVideoById' is available    
            if (typeof playerRef !== 'undefined' && typeof playerRef.loadVideoById === "function") {
                return true;
            }
        }
        return false;
    };


}
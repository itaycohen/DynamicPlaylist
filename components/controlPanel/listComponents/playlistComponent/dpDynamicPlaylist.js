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

dpDynamicPlaylistController.$inject = ['$rootScope', 'dpSongsListLogic', 'dpAppUtils'];
function dpDynamicPlaylistController($rootScope, dpSongsListLogic, dpAppUtils) {

    $rootScope.logicService = dpSongsListLogic;

    // workaround - can't hook on ng reapeat 
    $rootScope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $rootScope.alreadyPlayedSongsIndexesListFull = dpSongsListLogic.getAlreadyPlayedSongsIndexesListFull();

    $rootScope.getTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistFixWideScreen.html";
        }
        return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistLongVerticalScreen.html";
    };

    $rootScope.playSelectedSong = function (songIndex) {
        dpSongsListLogic.popSongIndexFromListAndUpdate(true, songIndex);
        loadNextSong();
    };

    function loadNextSong() {
        var playerRef = YT.get("player");
        playerRef.videoId = dpSongsListLogic.getNextSongId();
        playerRef.loadVideoById(playerRef.videoId);
        playerRef.playVideo();
    }

}
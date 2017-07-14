angular
    .module('dpDynamicPlaylist', [])
    .directive("dpDynamicPlaylist", dpDynamicPlaylist);

dpDynamicPlaylist.$inject = ["dpSongsListLogic"];
function dpDynamicPlaylist() {
    var directive = {
        restrict: "E",
        templateUrl: "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylist.html",
        controller: dpDynamicPlaylistController
    };
    return directive;
}

dpDynamicPlaylistController.$inject = ["$rootScope", "$mdMedia", "dpSongsListLogic"];
function dpDynamicPlaylistController($rootScope, $mdMedia, dpSongsListLogic) {


    $rootScope.logicService = dpSongsListLogic;

    // workaround - can't hook on ng reapeat 
    $rootScope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $rootScope.alreadyPlayedSongsIndexesListFull = dpSongsListLogic.getAlreadyPlayedSongsIndexesListFull();

    $rootScope.getPlaylistContainerClass = function () {
        if ($mdMedia('min-width: 960px')) { 
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "container-with-overflow-y";
        }
    };

    $rootScope.getDesktopClass = function() {
        if ($mdMedia('min-width: 960px')) { 
            return "song-by-desktop";
        }
    };

    $rootScope.playSelectedSong = function(songIndex) {
        alert(songIndex);
        // dpSongsListLogic.
        
    };

}
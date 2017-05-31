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

dpDynamicPlaylistController.$inject = ["$scope", "$mdMedia", "dpSongsListLogic"];
function dpDynamicPlaylistController($scope, $mdMedia, dpSongsListLogic) {

    $scope.logicService = dpSongsListLogic;

    // workaround - can't hook on ng reapeat 
    $scope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $scope.alreadyPlayedSongsIndexesListFull = dpSongsListLogic.getAlreadyPlayedSongsIndexesListFull();

    $scope.getPlaylistContainerClass = function () {
        if ($mdMedia('min-width: 960px')) { 
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "container-with-overflow-y";
        }
    };

}
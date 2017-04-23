angular
    .module('dpDynamicPlaylist', [])
    .directive("dpDynamicPlaylist", dpDynamicPlaylist);

dpDynamicPlaylist.$inject = ["dpSongsListLogic"];
function dpDynamicPlaylist() {
    var directive = {
        restrict: "E",
        templateUrl: "components/controlPanel/listComponents/dpDynamicPlaylist.html",
        controller: dpDynamicPlaylistController
    };
    return directive;
}

dpDynamicPlaylistController.$inject = ["$scope", "dpSongsListLogic"];
function dpDynamicPlaylistController($scope, dpSongsListLogic) {

    $scope.logicService = dpSongsListLogic;

    // workaround - can't hook on ng reapeat 
    $scope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $scope.alreadyPlayedSongsIndexesListFull = dpSongsListLogic.getAlreadyPlayedSongsIndexesListFull();

}
angular
    .module('dpGenreWidgetManagerComponent', [])
    .directive("dpGenreWidgetManager", dpGenreWidgetManager);

dpGenreWidgetManager.$inject = ['dpSongsListLogic'];

function dpGenreWidgetManager(dpSongsListLogic) {
    var directive = {
        restrict: "E",
        templateUrl: "components/controlPanel/smartBarsComponent/genreWidgetManager/dpGenreWidgetManager.html",
        controller: dpGenreWidgetManagerController
    };
    return directive;
}

dpGenreWidgetManagerController.$inject = ["$scope", "dpSongsListLogic"];
function dpGenreWidgetManagerController($scope, dpSongsListLogic) {

    // TODO - Ticket 001 
    // $scope.updateSongIndexesList = function (widgetObject) {
    //     $scope.updateGenreWeightsDistancesList(widgetObject.genre, widgetObject.widgetValue);
    // };

    $scope.updateSongIndexesList = function (genre, widgetValue) {
        dpSongsListLogic.updateGenreWeightsDistancesList(genre, widgetValue);
    };

}
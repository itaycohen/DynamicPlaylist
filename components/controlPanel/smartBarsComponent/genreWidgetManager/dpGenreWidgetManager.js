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

dpGenreWidgetManagerController.$inject = ["$scope", "$element", 'dpAppUtils', 'dpSongsListLogic'];
function dpGenreWidgetManagerController($scope, $element, dpAppUtils, dpSongsListLogic) {

    $scope.selectedGenres = dpSongsListLogic.getSelectedGenres();
    $scope.allGenres = dpSongsListLogic.geAllGenres();

    $scope.shouldShowGenre = function (genre) {
        return $scope.selectedGenres.indexOf(genre) > -1;
    };

    $scope.isGenreDisabled = function (genre) {
        //checking if the genre is already selected, 
        // if yes, we want to enabled this genre in order to remove it
        if ($scope.selectedGenres.indexOf(genre) > -1) {
            return $scope.selectedGenres.length <= 1;
        }
        // else we want to check if there are more than 4 genres selected
        // if yes, we want to disabled this genre adding
        return $scope.selectedGenres.length >= 4;
    };

    // $scope.onOptionClick = function (genre) {
    //     if ($scope.isGenreDisabled(genre)) {
    //         alert("disabled");
    //     }
    // };

    $scope.searchTerm = '';
    $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
    };

    // when changing the 
    $scope.onChange = function () {
        dpSongsListLogic.setSelectedGenres($scope.selectedGenres);
        dpSongsListLogic.updateGenreWeightsDistancesListByCurrentWidget();
    };

    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
    });

    // TODO - Ticket 001 
    // $scope.updateSongIndexesList = function (widgetObject) {
    //     $scope.updateGenreWeightsDistancesList(widgetObject.genre, widgetObject.widgetValue);
    // };

    $scope.updateSongIndexesList = function (genre, widgetValue) {
        dpSongsListLogic.updateGenreWeightsDistancesList(genre, widgetValue);
    };

    $scope.getGenreManagerWarpperClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "genre-manager-wrapper-horizontal";
        }
        return "genre-manager-wrapper-vertical";
    };

}
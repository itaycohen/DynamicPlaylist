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

    var MAXIMUM_GENRES = 5;
    var MINIMUM_GENRES = 1;

    // getting the genres NAMES from the logic
    $scope.selectedGenresNames = dpSongsListLogic.getUserGenresNames();
    // $scope.allGenresNames = dpSongsListLogic.geAllGenresNames();
    // TEMP
    $scope.allGenresNames = ["Alternative", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Pop", "R&B", "Rap", "Reggaeton", "Rock", "Soul"];

    $scope.shouldShowGenre = function (genre) {
        return $scope.selectedGenresNames.indexOf(genre) > -1;
    };

    $scope.isGenreDisabled = function (genre) {
        //checking if the genre is already selected, 
        // if yes, we want to enabled this genre in order to remove it
        if ($scope.selectedGenresNames.indexOf(genre) > -1) {
            return $scope.selectedGenresNames.length <= MINIMUM_GENRES;
        }
        // else we want to check if there are more than 2 genres selected
        // if yes, we want to disabled this genre adding
        return $scope.selectedGenresNames.length >= MAXIMUM_GENRES;
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

    // when changing the genres selector OR (IMPORTNAT) in page loading
    $scope.onGenreSelectorChange = function () {
        dpSongsListLogic.setSelectedGenresByNames($scope.selectedGenresNames);
        // update the number WeightDistanceFactor
        dpSongsListLogic.updateWeightDistanceFactor();
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
        // we save the user genres data after each change
        dpSongsListLogic.storeUserGenresData();
    };

    $scope.getGenreManagerWarpperClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "genre-manager-wrapper-horizontal";
        }
        return "genre-manager-wrapper-vertical";
    };

}
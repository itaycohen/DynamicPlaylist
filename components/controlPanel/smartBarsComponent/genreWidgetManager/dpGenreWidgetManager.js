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

dpGenreWidgetManagerController.$inject = ["$scope", "$element", "dpSongsListLogic"];
function dpGenreWidgetManagerController($scope, $element, dpSongsListLogic) {

    $scope.selectedGenres = dpSongsListLogic.getSelectedGenres();
    $scope.allGenres = dpSongsListLogic.geAllGenres();

    $scope.initAllGenresShowToFalse = function () {
        $scope.showHouse = false;
        $scope.showPop = false;
        $scope.showRb = false;
        $scope.showIr = false;
        $scope.showSoul = false;

    };

    function setGenreAttVisibilty(genre, shouldShow) {
        switch (genre) {
            case 'House':
                $scope.showHouse = shouldShow;
                break;
            case 'Pop':
                $scope.showPop = shouldShow;
                break;
            case 'R&B':
                $scope.showRb = shouldShow;
                break;
            case 'Indie-Rock':
                $scope.showIr = shouldShow;
                break;
            case 'Soul':
                $scope.showSoul = shouldShow;
                break;
            default:
                break;
        }
    }


    $scope.updateShownAndHiddenGenres = function () {
        //set selected genres to be shown
        for (var i = 0; i < $scope.selectedGenres.length; i++) {
            var genreToShow = $scope.selectedGenres[i];
            setGenreAttVisibilty(genreToShow, true);
        }

         var hiddenGenres = dpSongsListLogic.getHiddenGenres();

        //set hidden genres to be hide
        for (var j = 0; j < hiddenGenres.length; j++) {
            var genreToHide = hiddenGenres[j];
            setGenreAttVisibilty(genreToHide, false);
        }

    };

    $scope.initAllGenresShowToFalse();
    $scope.updateShownAndHiddenGenres();

    // TODO - Ticket 001 
    // $scope.updateSongIndexesList = function (widgetObject) {
    //     $scope.updateGenreWeightsDistancesList(widgetObject.genre, widgetObject.widgetValue);
    // };


    $scope.searchTerm = '';
    $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
    };

    // when changing the 
    $scope.onChange = function () {
        dpSongsListLogic.setSelectedGenres($scope.selectedGenres);
        $scope.updateShownAndHiddenGenres();
        dpSongsListLogic.updateGenreWeightsDistancesListByCurrentWidget();
    };

    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
    });

    $scope.updateSongIndexesList = function (genre, widgetValue) {
        dpSongsListLogic.updateGenreWeightsDistancesList(genre, widgetValue);
    };



}
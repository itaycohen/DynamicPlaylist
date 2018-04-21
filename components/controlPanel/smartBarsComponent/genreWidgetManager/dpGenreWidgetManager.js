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

    $scope.showOnlySelectedGenreHint = false;
    $scope.showMaxGenresHint = false;
    

    // getting the genres NAMES from the logic
    $scope.selectedGenresNames = dpSongsListLogic.getUserGenresNames();
    // $scope.allGenresNames = dpSongsListLogic.geAllGenresNames();
    // TEMP
    $scope.allGenresNames = ["Alternative", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Pop", "R&B", "Rap", "Reggaeton", "Rock", "Soul"];

    $scope.shouldShowGenre = function (genre) {
        return $scope.selectedGenresNames.indexOf(genre) > -1;
    };

    $scope.isGenreDisabled = function(genre) {
        //checking if the genre is already selected, 
        // if yes, we want to enabled this genre in order to remove it
        if ($scope.selectedGenresNames.indexOf(genre) > -1) {
            return $scope.selectedGenresNames.length <= MINIMUM_GENRES;
        }
        // else we want to check if there are more than 2 genres selected
        // if yes, we want to disabled this genre adding
        return $scope.selectedGenresNames.length >= MAXIMUM_GENRES;
    };

    $scope.isOnlySelectedGenre = function(genre) {
        //checking if the genre is the only selected, 
        return ($scope.selectedGenresNames[0] === genre);
    };

    $scope.onOptionClick = function(genre) {
        if ($scope.selectedGenresNames.length == 1 && $scope.selectedGenresNames[0] === genre) {
            $scope.showOnlySelectedGenreHint = true;
        } else {
            $scope.showOnlySelectedGenreHint = false;
        }

        if ($scope.selectedGenresNames.length > 4) {
            $scope.showMaxGenresHint = true;
        } else {
            $scope.showMaxGenresHint = false;
        }
    };

    

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
        // we save the user genres data after each genre adding/removing
        dpSongsListLogic.storeUserGenresAndTagsData();
    };

    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
    });

    $scope.updateSongIndexesListWithGenre = function (genre, widgetValue) {
        dpSongsListLogic.updateGenreWeightsDistancesList(genre, widgetValue);
        // we save the user genres data after each change
        dpSongsListLogic.storeUserGenresAndTagsData();
    };

    $scope.updateSongIndexesListWithTagName = function (tagName, tagState) {
        dpSongsListLogic.updateSongIndexesListByTagIfNeeded(tagName, tagState);
        // we save the user genres data after each change
        dpSongsListLogic.storeUserGenresAndTagsData();
    };
    

    $scope.getGenreManagerWarpperClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "genre-manager-wrapper-horizontal scroll-style";
        }
        return "genre-manager-wrapper-vertical";
    };

    $scope.getGenreManagerButtonsWrapperTemp = function () {
		if (dpAppUtils.isDesktop()) {
            return "components/controlPanel/smartBarsComponent/genreManagerButtonsWrapper/genreManagerButtonsWrapperBig.html";
		}
        return "components/controlPanel/smartBarsComponent/genreManagerButtonsWrapper/genreManagerButtonsWrapperSmall.html";
    };
    
    $scope.removeGenreParent = function(genre) {
        if ($scope.selectedGenresNames.length > 1) {
            var index = $scope.selectedGenresNames.indexOf(genre);
            if (index > -1) {
                $scope.selectedGenresNames.splice(index, 1);
                $scope.onGenreSelectorChange();
            }
        }

    };

    

}
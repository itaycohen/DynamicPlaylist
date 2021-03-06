angular
    .module('dpGenreWidgetComponent', []) // TOHELP - [] can not be deleted
    .directive("dpGenreWidget", dpGenreWidget);

dpGenreWidget.$inject = ["$rootScope", "dpSongsListLogic"];

// dpGenreWidgetManager.$inject = ['dpSongsListLogic'];

function dpGenreWidget($rootScope, dpSongsListLogic) {
    var directive = {
        restrict: "E",
        scope: {
            genre: "@",
        },
        template: "<ng-include src='getTemplateUrl()'/>",
        controller: dpGenreWidgetController
    };
    return directive;
}

dpGenreWidgetController.$inject = ["$scope", "dpSongsListLogic", "dpAppUtils"];
function dpGenreWidgetController($scope, dpSongsListLogic, dpAppUtils) {


    // Normalization - multiple by 2 because we add more steps for the genre sliders 
    var GENRE_NORMALIZARION_FACOR = 20

    // init the weight
    // TODO - save and load from chache for each user
    $scope.widgetValue = dpSongsListLogic.getWeightOfGenre($scope.genre) * GENRE_NORMALIZARION_FACOR;

    $scope.onWidgetChange = function () {
        // first we update the genre map
        // TODO
        removeActiveClass("genre-slider");
        // updating dpGenreWidgetManager 
        $scope.$parent.updateSongIndexesListWithGenre($scope.genre, $scope.widgetValue / GENRE_NORMALIZARION_FACOR);
    };

    $scope.getGenreContainerClass = function () {
        if (!dpAppUtils.isDesktop()) {
            return "genre-name-container-small";
        }
        return "genre-name-container-big";
    };

    $scope.getTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidgetFixWideScreen.html";
        }
        return "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidgetLongVerticalScreen.html";
    };

    $scope.getRemoveGenreContainerClass = function() {
        if ($scope.widgetValue == 0 && $scope.$parent.selectedGenresNames.length > 1) {
            return "show-remove-genre-icon";
        }
        return "";
    };

    $scope.removeGenre = function(genre) {
        $scope.$parent.removeGenreParent(genre);
    };

    $scope.getGenreNameWrapperClass = function() {
        if ($scope.$parent.selectedGenresNames.length == 1) {
            return "hide-remove-genre-icon";
        }
        return "";
    };

    function removeActiveClass(className) {
        var allSliders = document.getElementsByClassName(className);
        for (var i = 0; i < allSliders.length; i++) {
            allSliders[i].classList.remove("md-active");
        }
    }

}
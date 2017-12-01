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
        // template: "<ng-include src='getTemplateUrl()'/>",
        templateUrl: "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidget.html",
        controller: dpGenreWidgetController
    };
    return directive;
}

dpGenreWidgetController.$inject = ["$scope", "dpSongsListLogic", "dpAppUtils"];
function dpGenreWidgetController($scope, dpSongsListLogic, dpAppUtils) {

    // init the weight
    // TODO - save and load from chache for each user
    $scope.widgetValue = dpSongsListLogic.getWeightOfGenre($scope.genre) * 10;

    $scope.onWidgetChange = function () {
        // first we update the genre map
        // TODO
        // updating dpGenreWidgetManager 
        $scope.$parent.updateSongIndexesListWithGenre($scope.genre, $scope.widgetValue / 10);
    };

    $scope.getGenreContainerClass = function () {
        if (!dpAppUtils.isDesktop()) {
            return "genre-name-container-small";
        }
        return "genre-name-container-big";
    };

    // $scope.getTemplateUrl = function () {
    //     if (dpAppUtils.isDesktop()) {
    //         //big view - row layout (not small as in mobile - row)
    //         // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
    //         return "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidgeFixWideScreen.html";
    //     }
    //     return "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidgetLongVerticalScreen.html";
    // };

}
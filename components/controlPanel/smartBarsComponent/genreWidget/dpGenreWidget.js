angular
    .module('dpGenreWidgetComponent', []) // TOHELP - [] can not be deleted
    .directive("dpGenreWidget", dpGenreWidget);

dpGenreWidget.$inject = ["$rootScope", "dpSongsListLogic"];

dpGenreWidgetManager.$inject = ['dpSongsListLogic'];

function dpGenreWidget($rootScope, dpSongsListLogic) {
    var directive = {
        restrict: "E",
        scope: {
            genre: "@",
            // TODO - Ticket 001 
            //callback
            changeHandler: "&"
            // function & onValueChange 
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
    $scope.widgetValue = dpSongsListLogic.getWeightOfGenre($scope.genre);

    $scope.onWidgetChange = function () {
        // TODO - Ticket 001 
        // $scope.changeHandler({genre: $scope.genre, widgetValue: $scope.widgetValue});
        // $scope.changeHandler($scope.widgetValue);
        // updating dpGenreWidgetManager 
        $scope.$parent.updateSongIndexesList($scope.genre, $scope.widgetValue);
        // we save the user genres data after each change
        dpSongsListLogic.storeUserGenresData();

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

    // TODO - Ticket 001 
    // $scope.onWidgetChange = function() {
    //     // updating dpGenreWidgetManager 
    //     $rootScope.updateSongIndexesList($scope.genre, $scope.widgetValue);
    // };
    /* Reference
$scope.onClick = function(values, $index, $event) {
        $scope.data.onRowClick({values: values, $index: $index, $event: $event});
};
*/
}
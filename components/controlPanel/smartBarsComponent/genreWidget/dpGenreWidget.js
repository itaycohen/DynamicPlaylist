angular
    .module('dpGenreWidgetComponent', []) // TOHELP - [] can not be deleted
    .directive("dpGenreWidget", dpGenreWidget);

dpGenreWidget.$inject = ["$rootScope"];
function dpGenreWidget($rootScope) {
    var directive = {
        restrict: "E",
        scope: {
            genre: "@",

            // TODO - Ticket 001 
            //callback
            changeHandler: "&"
            // function & onValueChange 
        },
        templateUrl: "components/controlPanel/smartBarsComponent/genreWidget/dpGenreWidget.html",
        controller: dpGenreWidgetController
    };
    return directive;
}

dpGenreWidgetController.$inject = ["$scope"];
function dpGenreWidgetController($scope) {

    // init the weight
    // TODO - save and load from chache for each user
    $scope.widgetValue = 3;

    $scope.onWidgetChange = function () {
        // TODO - Ticket 001 
        // $scope.changeHandler({genre: $scope.genre, widgetValue: $scope.widgetValue});
        // $scope.changeHandler($scope.widgetValue);
        // updating dpGenreWidgetManager 
        $scope.$parent.updateSongIndexesList($scope.genre, $scope.widgetValue);
    };

    $scope.getGenreLabel = function () {
        switch ($scope.genre) {
            case "house":
                return "House";
            case "pop":
                return "Pop";
            case "rb":
                return "R&B";
            case "ir":
                return "Indie-Rock";
            case "soul":
                return "Soul";
            default:
                return "Genre";

        }
    };

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
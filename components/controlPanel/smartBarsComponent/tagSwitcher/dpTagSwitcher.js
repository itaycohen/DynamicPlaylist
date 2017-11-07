angular
    .module('dpTagSwitcherComponent', []) // TOHELP - [] can not be deleted
    .directive("dpTagSwitcher", dpTagSwitcher);

dpTagSwitcher.$inject = ["$rootScope", "dpSongsListLogic"];

function dpTagSwitcher($rootScope, dpSongsListLogic) {
    var directive = {
        restrict: "E",
        scope: {
            tagName: "@",
            // TODO - Ticket 001 
            //callback
            changeHandler: "&"
            // function & onValueChange 
        },
        templateUrl: "components/controlPanel/smartBarsComponent/tagSwitcher/dpTagSwitcher.html",
        controller: dpTagSwitcherController
    };
    return directive;
}

dpTagSwitcherController.$inject = ["$scope", "dpSongsListLogic", "dpAppUtils"];
function dpTagSwitcherController($scope, dpSongsListLogic, dpAppUtils) {

    // init the weight
    // TODO - save and load from chache for each user
    $scope.tagState = dpSongsListLogic.getTagStateByName($scope.tagName);

    $scope.getTagSwitcherStateClass = function() {
        return $scope.tagState ? "active" : "";
    };

    $scope.getTagName = function () {
        return $scope.tagName;
    };

    $scope.onSwitch = function (tagName) {
        $scope.tagState = switchTagState($scope.tagState);
        //first update the user tags map
        dpSongsListLogic.updateUserTagsMap($scope.tagName, $scope.tagState);
        // updating dpGenreWidgetManager 
        $scope.$parent.updateSongIndexesListWithTagName($scope.tagName, $scope.tagState);
    };

    function switchTagState(tagState) {
        return !tagState;
    }

}
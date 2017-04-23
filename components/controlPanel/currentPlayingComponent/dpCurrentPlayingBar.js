angular
    .module('dpCurrentPlayingBar', [])
    .directive("dpCurrentPlayingBar", dpCurrentPlayingBar);

dpCurrentPlayingBar.$inject = ["dpSongsListLogic"];
function dpCurrentPlayingBar() {
    var directive = {
        restrict: "E",
        templateUrl: "components/controlPanel/currentPlayingComponent/dpCurrentPlayingBar.html",
        controller: dpCurrentPlayingBarController
    };
    return directive;
}

dpCurrentPlayingBarController.$inject = ["$scope", "dpSongsListLogic"];
function dpCurrentPlayingBarController($scope, dpSongsListLogic) {
    $scope.logicService = dpSongsListLogic;
}
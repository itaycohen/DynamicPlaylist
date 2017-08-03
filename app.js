var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpPlayerPanelService',
    'dpYoutubeEmbedComponent',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpDynamicPlaylist'
]);

app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic) {
    $rootScope.rawSongsList = dpSongsListLoaderService.getSongsList();
    dpSongsListLogic.initCalcSongsList();
}]);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan')
        .accentPalette('cyan');
});

app.controller('appController', appController);
appController.$inject = ["$scope", "$mdMedia", "$mdDialog"];
function appController($scope, $mdMedia, $mdDialog) {

    $scope.getMainViewClass = function () {
        if (!$mdMedia('max-width: 959px')) {
            return "main-view-big";
        }
    };

    $scope.openFeedbackForm = function () {
        plugin_H1IyjxbPW.open();
    };

}


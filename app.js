var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpAppUtils',
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
appController.$inject = ['$scope', 'dpAppUtils'];
function appController($scope, dpAppUtils) {
    $scope.getMainViewClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "main-view-big";
        }
    };

    $scope.getAppClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "app-horizontal";
        }
        return "app-vertical";
    };
}


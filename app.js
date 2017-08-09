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
appController.$inject = ["$scope", "$mdMedia", "$mdDialog", 'dpAppUtils'];
function appController($scope, $mdMedia, $mdDialog, dpAppUtils) {

    $scope.getMainViewClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "main-view-big";
        }
    };

    $scope.openFeedbackForm = function () {
        plugin_H1IyjxbPW.open();
    };

    $scope.getAppClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "app-horizontal";
        }
        return "app-vertical";
    };
}


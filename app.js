var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpAppUtils',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpYoutubeEmbedComponent',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpDynamicPlaylist'
]);

app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic) {
    dpSongsListLogic.initUserData();

    //section 01
    $rootScope.rawSongsList = dpSongsListLoaderService.getTempSongsList();
    dpSongsListLogic.initCalcSongsList();

    //section 02
    // dpSongsListLoaderService.loadSongsList().then(
    //     function (data) {
    //         console.log("finish loading data");
    //         $rootScope.rawSongsList = data;
    //         dpSongsListLogic.initCalcSongsList();
    //     }
    // );

}]);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-purple');
});


app.controller('appController', appController);
appController.$inject = ["$scope", "$mdMedia", "$mdDialog", 'dpAppUtils'];
function appController($scope, $mdMedia, $mdDialog, dpAppUtils) {

    $scope.getMainViewClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "main-view-big";
        }
    };

    $scope.getToolbarTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            return "components/app/toolbar/dpToolbarBig.html";
        }
        return "components/app/toolbar/dpToolbarSmall.html";
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


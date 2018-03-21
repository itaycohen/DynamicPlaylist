var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpAppUtils',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpPlayerService',
    'dpYoutubeEmbedComponent',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpTagSwitcherComponent',
    'dpDynamicPlaylist',
    'dpPlayingBar' 
]);

app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', 'dpPlayerService', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic, dpPlayerService) {


    
    // init the player state - pause
    dpPlayerService.initPlayerService();

    $rootScope.rawSongsList = dpSongsListLoaderService.getTempSongsList();

    dpSongsListLogic.initUrlParams();

    dpSongsListLogic.initUserData();

    //section 01
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

app.config(function ($mdThemingProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-purple');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
});


app.controller('appController', appController);
appController.$inject = ["$scope", "$mdMedia", "$mdDialog", 'dpAppUtils'];
function appController($scope, $mdMedia, $mdDialog, dpAppUtils) {

    $scope.getMainViewClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "main-view-big layout-row";
        } else {
            return "main-view-small layout-sm-column";
        }
    };

    $scope.getPlayerAndWidgetViewClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "left-view";
        } else {
            return "top-view";
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


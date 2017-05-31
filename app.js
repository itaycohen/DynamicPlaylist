

// var app = angular.module('dynamicPlaylistApp', ['dpPlayerBoxComponent', 'dpGenreWidgetManagerComponent', 'dpGenreWidgetComponent']);

var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpPlayerPanelService',
    // 'dpYoutubeEmbedService',
    'dpYoutubeEmbedComponent',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpCurrentPlayingBar',
    'dpDynamicPlaylist'
]); // TOHELP - these names should be equal to
//     the names in  angular.module('dpGenreWidgetComponent', [])


app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic) {

    $rootScope.rawSongsList = dpSongsListLoaderService.getSongsList();

    dpSongsListLogic.initCalcSongsList();


    console.log("runner");
}]);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('orange');
});


app.controller('appController', function ($mdMedia, $scope) {

    $scope.getMainViewClass = function () {
        if ($mdMedia('max-width: 959px')) { //small view
            if ($mdMedia('portrait')) { // portrait
                return "main-view-small-portrait";
            } else { //landscape
                return "main-view-small-landscape";
            }
        }
        return "main-view-big";
    };
});

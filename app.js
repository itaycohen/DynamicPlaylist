

// var app = angular.module('dynamicPlaylistApp', ['dpPlayerBoxComponent', 'dpGenreWidgetManagerComponent', 'dpGenreWidgetComponent']);

var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpPlayerPanelService',
    'dpYoutubeEmbedService',
    'dpYoutubeEmbedDirective',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpCurrentPlayingBar',
    'dpDynamicPlaylist'
]); // TOHELP - these names should be equal to
//     the names in  angular.module('dpGenreWidgetComponent', [])




app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic) {
    $rootScope.bodyClass = 'loading';
    $rootScope.test = "hello";

    $rootScope.rawSongsList = dpSongsListLoaderService.getSongsList();

    dpSongsListLogic.initCalcSongsList();

    // $rootScope.initSongId = dpSongsListUtils.findInitSongId($rootScope.rawSongsList);

    console.log("runner");
}]);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('orange');
});

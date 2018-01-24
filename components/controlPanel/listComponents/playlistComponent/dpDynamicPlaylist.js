angular
    .module('dpDynamicPlaylist', [])
    .directive("dpDynamicPlaylist", dpDynamicPlaylist);

dpDynamicPlaylist.$inject = ["dpSongsListLogic"];
function dpDynamicPlaylist() {
    var directive = {
        restrict: "E",
        template: "<ng-include src='getPlaylistTemplateUrl()'/>",
        controller: dpDynamicPlaylistController
    };
    return directive;
}

dpDynamicPlaylistController.$inject = ['$rootScope', 'dpSongsListLogic', 'dpAppUtils', 'dpPlayerService', '$window', '$timeout'];
function dpDynamicPlaylistController($rootScope, dpSongsListLogic, dpAppUtils, dpPlayerService, $window, $timeout) {

    var NUMBER_SONGS_TO_SHOW_LESS = 10;
    var NUMBER_SONGS_TO_SHOW_MORE = 25;

    $rootScope.logicService = dpSongsListLogic;

    $rootScope.playerService = dpPlayerService;

    $rootScope.isShowingLessSongs = true; //default - we show less

    // workaround - can't hook on ng reapeat 
    $rootScope.songsIndexesList = dpSongsListLogic.getSongsIndexesList();

    $rootScope.getPlaylistTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistFixWideScreen.html";
        }
        return "components/controlPanel/listComponents/playlistComponent/dpDynamicPlaylistLongVerticalScreen.html";
    };

    $rootScope.getPlaylistWarpperClass = function () {
        if (dpAppUtils.isDesktop()) {
            return "playlist-wrapper-horizontal";
        }
        return "playlist-wrapper-vertical";
    };

    $rootScope.playSelectedSong = function (songIndex) {
        //TODO - smooth scrolling
        $timeout(function() {
            $window.scrollTo(0, 0);
            dpSongsListLogic.popSongIndexFromListAndUpdate(true, songIndex);
            dpPlayerService.loadSongById(dpSongsListLogic.getNextSongId());
            }, 200);
    };


    $rootScope.getNumberOfSongsToShow = function() {
        return $rootScope.isShowingLessSongs ? NUMBER_SONGS_TO_SHOW_LESS : NUMBER_SONGS_TO_SHOW_MORE;
    };

    $rootScope.showMoreLessToggle = function() {
        $rootScope.isShowingLessSongs = !$rootScope.isShowingLessSongs;
    };


    $rootScope.getTextShowMoreLessButton = function() {
        return $rootScope.isShowingLessSongs ? "SHOW MORE" : "SHOW LESS";
    };

    $rootScope.getSongImgSrc = function(songIndex) {
        return dpSongsListLogic.getSongImgSrcByIndex(songIndex);
    };   
    
    $rootScope.getDuration = function(songIndex) {
        return dpSongsListLogic.getSongDurationByIndex(songIndex);
    };
    
    

}
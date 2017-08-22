var app = angular.module('appUtils', [
    'ngMaterial',
    'dpAppUtils'
    
]);

app.run(['$rootScope', '$http', function ($rootScope, $http) {

    $http.get("data/songs/songsShrink.json")
        .then(function (response) {
            $rootScope.songsShrink = response.data;
        });

    $http.get("data/songs/songsRaw.json")
        .then(function (response) {
            $rootScope.songsRaw = response.data;
        });



}]);

// app.config(function ($mdThemingProvider) {
//     $mdThemingProvider.theme('default')
//         .primaryPalette('deep-purple')
//         .accentPalette('deep-purple');
// });


app.controller('appUtilsController', appUtilsController);
appUtilsController.$inject = ["$rootScope", 'dpAppUtils'];
function appUtilsController($rootScope, dpAppUtils) {


     $rootScope.currentNavItem = 'page1';

    // Adding Songs

    $rootScope.song = {
        id : '',
        artist: '',
        songName : ''

    };

    $rootScope.addSong = function () {
        alert("song: " + $rootScope.song.songName);

    };




    // Convertors

    $rootScope.convertFromShrinkToRaw = function () {
        convertShrinkSongsListToRawSongsList();
    };

    $rootScope.convertFromRawToShrink = function () {
        convertRawSongListToShrinkSongList();
    };

    function convertRawSongListToShrinkSongList() {
        var mapOfGenres = ['House', 'Indie-Rock', 'Pop', 'R&B', 'Soul'];
        var rawSongList = $rootScope.songsRaw;
        var shrinkSongList = [];
        for (var i = 0; i < rawSongList.length; i++) {
            var currentSong = rawSongList[i];
            var newSong = {};
            newSong.i = currentSong.index;
            newSong.id = currentSong.id;
            newSong.a = currentSong.details.artist;
            newSong.s = currentSong.details.songName;
            var genres = currentSong.genreWeights;
            var genresweightsOfSong = [];
            for (var j = 0; j < mapOfGenres.length; j++) {
                var currentGenre = mapOfGenres[j];
                genresweightsOfSong[j] = genres[currentGenre];
            }
            newSong.g = genresweightsOfSong;
            shrinkSongList[i] = newSong;
        }
        console.log(JSON.stringify(shrinkSongList));
    }


    function convertShrinkSongsListToRawSongsList() {
        var mapOfGenres = ['House', 'Indie-Rock', 'Pop', 'R&B', 'Soul'];
        var shrinkList = $rootScope.songsShrink;
        var rawSongsList = [];
        for (var i = 0; i < shrinkList.length; i++) {
            var currentSong = shrinkList[i];
            var newSong = {};
            newSong.index = currentSong.i;
            newSong.id = currentSong.id;
            newSong.details = {};
            newSong.details.artist = currentSong.a;
            newSong.details.songName = currentSong.s;
            newSong.genreWeights = {};
            for (var j = 0; j < currentSong.g.length; j++) {
                var key = mapOfGenres[j];
                newSong.genreWeights[key] = currentSong.g[j];
            }
            rawSongsList[i] = newSong;
        }

        console.log(JSON.stringify(rawSongsList));

    }


}


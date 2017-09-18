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

    var mapOfGenres = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop']

    // Adding Songs

    $rootScope.song = {
        "id": '',
        "artist": '',
        "songName": '',
        "songGenres": [0, 0, 0, 0, 0, 0, 0]
    };

    $rootScope.songToAdd = '';

    $rootScope.loadSongDetails = function () {
        var songId = $rootScope.song.id;
        if (angular.isDefined(songId) && songId !== '') {

            var gdata = document.createElement("script");
            gdata.src = "http://gdata.youtube.com/feeds/api/videos/" + songId + "?v=2&alt=jsonc&callback=storeInfo";
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(gdata);
            alert(info.data.title);
        }
        alert('song id error');
    };


    $rootScope.addSong = function () {
        validateSong();
        var currentSong = $rootScope.song;
        var newSong = {};
        newSong.index = 'xxx';
        newSong.id = currentSong.id;
        newSong.details = {};
        // newSong.details.artist = currentSong.artist.trim();
        // newSong.details.songName = currentSong.songName.trim();
        newSong.details.artist = currentSong.artist;
        newSong.details.songName = currentSong.songName;
        newSong.genreWeights = {};
        for (var i = 0; i < mapOfGenres.length; i++) {
            var key = mapOfGenres[i];
            newSong.genreWeights[key] = currentSong.songGenres[i];
        }
        var newSongStr = JSON.stringify(newSong);
        console.log(newSongStr);

        $rootScope.songToAdd += newSongStr;
        $rootScope.songToAdd += ",";


    };

    function validateSong() {
        var currentSong = $rootScope.song;
        if (angular.isUndefined(currentSong) || currentSong.id === '' || currentSong.artist === '' || currentSong.songName === '') {
            alert("Error in song details");
            return;
        }
    }

    $rootScope.cleanSong = function () {
        $rootScope.song = {
            "id": '',
            "artist": '',
            "songName": '',
            "songGenres": [0, 0, 0, 0, 0, 0, 0]
        };
    };

    $rootScope.cleanAllSongs = function () {
        $rootScope.songToAdd = '';
    };

    $rootScope.isNewSong = function (songId) {
        var shrinkSongList =  $rootScope.songsShrink;
        for (var i in shrinkSongList) {
            if (shrinkSongList[i].id === songId) {
                return false;
            }
        }
        //TODO - check if the song is in the new songs to add
        return true;

    };

    $rootScope.getSongArtist = function() {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            var artist = fullSongTitle.substring(0, dashIndex - 1).trim();
            var songName = fullSongTitle.substring(dashIndex + 1).trim();
            $rootScope.song.artist = artist;
            return artist;
            // console.log(artist);
            // console.log(songName);
        }
        return "";
    };


    $rootScope.getSongName = function() {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            var songName = fullSongTitle.substring(dashIndex + 1).trim();
            $rootScope.song.songName = songName;
            return songName;
        }
        return "";
    };



    // Convertors
    ////////////////////////////////////

    $rootScope.convertFromShrinkToRaw = function () {
        convertShrinkSongsListToRawSongsList();
    };

    $rootScope.convertFromRawToShrink = function () {
        convertRawSongListToShrinkSongList();
    };

    function convertRawSongListToShrinkSongList() {
        // var mapOfGenres = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];
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
        // var mapOfGenres = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];
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


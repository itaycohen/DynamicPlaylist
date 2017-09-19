var app = angular.module('appUtils', [
    'ngMaterial',
    'dpAppUtils',
    'ngclipboard'
]);

app.run(['$rootScope', '$http', function ($rootScope, $http) {

    // debugger;

    $http.get("data/songs/songsShrink.json")
        .then(function (response) {
            $rootScope.songsShrink = response.data;
        });

    $http.get("data/songs/songsRaw.json")
        .then(function (response) {
            $rootScope.songsRaw = response.data;
        });



}]);


app.controller('appUtilsController', appUtilsController);
appUtilsController.$inject = ["$rootScope", 'dpAppUtils', '$http'];
function appUtilsController($rootScope, dpAppUtils, $http) {


    $rootScope.currentNavItem = 'page1';
    $rootScope.data = {};
    $rootScope.data.takeSongName = true;
    $rootScope.genreInputStyle = { "width": "100px" };
    // $rootScope.APIResult = "text'<br/>'text";



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
        newSong.details.songName = $rootScope.data.takeSongName ? currentSong.songName : $rootScope.song.songNameAPI;
        newSong.genreWeights = {};
        for (var i = 0; i < mapOfGenres.length; i++) {
            var key = mapOfGenres[i];
            newSong.genreWeights[key] = currentSong.songGenres[i];
        }
        var newSongStr = JSON.stringify(newSong);
        console.log(newSongStr);

        $rootScope.songToAdd += newSongStr;
        $rootScope.songToAdd += ",";

        $rootScope.cleanSong();
        $rootScope.data.takeSongName = true;


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
        $rootScope.APIResult = "";
    };

    $rootScope.cleanAllSongs = function () {
        $rootScope.songToAdd = '';
    };

    $rootScope.isNewSong = function (songId) {
        var shrinkSongList = $rootScope.songsShrink;
        for (var i in shrinkSongList) {
            if (shrinkSongList[i].id === songId) {
                return false;
            }
        }
        //TODO - check if the song is in the new songs to add
        return true;

    };

    $rootScope.parseFullTitle = function () {
        $rootScope.getSongArtist();
        $rootScope.getSongName();
        // TEMP
        // $rootScope.APIResult = "Genre: dance | Count: 100"+ '\n' +"Genre: House | Count: 100" + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100"  + '\n' +"Genre: House | Count: 100";
    };



    $rootScope.getSongArtist = function () {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            var artist = fullSongTitle.substring(0, dashIndex).trim();
            $rootScope.song.artist = artist;
        }
    };


    $rootScope.getSongName = function () {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            var songName = fullSongTitle.substring(dashIndex + 1).trim();
            $rootScope.song.songName = songName;
        }
    };

    $rootScope.parseSongName = function () {
        var songName = $rootScope.song.songName;
        if (angular.isDefined(songName)) {
            var bracket = songName.indexOf("(");
            var songNameAPI = bracket != -1 ? songName.substring(0, bracket - 1).trim() : songName;
            $rootScope.song.songNameAPI = songNameAPI;
        }
    };




    $rootScope.getSongGneres = function () {
        var url = "http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=6c43957997d9e000c1678ee52dbacd54&format=json";
        url += "&artist=";
        url += $rootScope.song.artist;
        url += "&track=";
        url += $rootScope.song.songNameAPI;
        $http.get(url).
            then(function (response) {
                $rootScope.APIResultRaw = response.data;
                parseAPIResult();
            });
    };

    $rootScope.cleanResult = function () {
        $rootScope.APIResultRaw = "";
    };

    


    function parseAPIResult() {
        var textResult = "";
        dataToParse = $rootScope.APIResultRaw;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            // alert("No API Result");
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.toptags) || dataToParse.toptags === '') {
            // alert("Error in Result - no toptags");
            textResult = "Error in Result - no toptags";
        } else {
            // var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
            var genresScores = dataToParse.toptags.tag;
            for (var i = 0; i < genresScores.length; i++) {
                currentScore = genresScores[i];
                // textResult += "Genre: ";
                textResult += currentScore.name;
                textResult += " | ";
                
                // textResult += " | Count: ";
                textResult += currentScore.count;
                textResult += "\n";
            }
        }
        $rootScope.APIResult = textResult;
    }


    $rootScope.getSelectedSongNameStyle = function (takeMeToJson) {
        if (takeMeToJson) {
            return {"color": "blue" };
        }
        else return "";
    };







    // http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=6c43957997d9e000c1678ee52dbacd54&format=json&artist=davidguetta&track=titanium


    // Convertors
    ////////////////////////////////////

    $rootScope.convertFromShrinkToRaw = function () {
        convertShrinkSongsListToRawSongsList();
    };

    $rootScope.convertFromRawToShrink = function () {
        convertRawSongListToShrinkSongList();
    };

    function convertRawSongListToShrinkSongList() {
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


var app = angular.module('appUtils', [
    'ngMaterial',
    'dpAppUtils',
    'ngclipboard'
]);

app.run(['$rootScope', '$http', function ($rootScope, $http) {

    /// debugger; 

    // $rootScope.readyToValidate = false;

    $http.get("data/songs/songsShrink20Genres.json")
        .then(function (response) {
            $rootScope.songsShrink = response.data;

            $http.get("data/songs/songsRaw20Genres.json")
                .then(function (response) {
                    $rootScope.songsRaw = response.data;
                    validateSongLists();
                });
        });

    function validateSongLists() {
        if ($rootScope.songsShrink.length != $rootScope.songsRaw.length) {
            alert("raw list and shring list are different");

        }
        $rootScope.runningSongIndex = $rootScope.songsShrink.length;
    }

}]);


app.controller('appUtilsController', appUtilsController);
appUtilsController.$inject = ["$rootScope", 'dpAppUtils', '$http', '$window',];
function appUtilsController($rootScope, dpAppUtils, $http, $window) {


    $rootScope.currentNavItem = 'page1';
    $rootScope.data = {};
    $rootScope.data.takeSongName = true;
    $rootScope.genreInputStyle = { "width": "100px" };



    // var mapOfGenres = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];
    // var newMapOfGenres2 = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "R&B", "Rock", "Soul"];
    // var newMapOfGenres = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Rock", "Soul", "Trance"];
    var newMapOfGenres = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Reggaeton", "Rock", "Soul", "Trance"];




    // Adding Songs

    $rootScope.song = {
        "id": '',
        "artist": '',
        "songName": '',
        "songGenres": [0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0]
    };


    $rootScope.songToAdd = '';
    $rootScope.fromRawToShrink = '';
    $rootScope.fromShrinkToRaw = '';
    
    

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
        newSong.index = $rootScope.runningSongIndex;
        newSong.id = currentSong.id;
        newSong.details = {};
        // newSong.details.artist = currentSong.artist.trim();
        // newSong.details.songName = currentSong.songName.trim();
        newSong.details.artist = currentSong.artist;
        newSong.details.songName = $rootScope.data.takeSongName ? currentSong.songName : $rootScope.song.songNameAPI;
        newSong.genreWeights = {};
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var key = newMapOfGenres[i];
            newSong.genreWeights[key] = currentSong.songGenres[i];
        }
        var newSongStr = JSON.stringify(newSong);
        console.log(newSongStr);

        $rootScope.songToAdd += newSongStr;
        $rootScope.songToAdd += ",";
        $rootScope.runningSongIndex++;

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
            "songGenres": [0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0]
        };
        $rootScope.APIResult = "";
        // $rootScope.musixAPIResult = "";
        $rootScope.data.takeSongName = true;
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
        var songToAddstr = $rootScope.songToAdd;
        if (songId !== "" && songToAddstr.indexOf(songId) !== -1) {
            return false;
        }
        //TODO - check if the song is in the new songs to add
        return true;

    };

    $rootScope.getSongNameAndParseFullTitle = function () {
        var url = "https://www.googleapis.com/youtube/v3/videos?";
        url += "id=";
        url += $rootScope.song.id;
        url += "&part=snippet, statistics";
        url += "&key=AIzaSyA14y8xNuOkVU-G4GzdOM2H7vmJ78becgA";
        $http.get(url).
            then(function (response) {
                $rootScope.YTSongResult = response.data;
                parseYTSongResult();
            });


    };


    $rootScope.getSongGneres = function () {
        var url = "http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=6c43957997d9e000c1678ee52dbacd54&format=json";
        url += "&artist=";
        url += $rootScope.song.artistAPI;
        url += "&track=";
        url += $rootScope.song.songNameAPI;
        $http.get(url).
            then(function (response) {
                $rootScope.APIResultRaw = response.data;
                parseAPIResult();
            });
    };


    //http://api.musixmatch.com/ws/1.1/track.search?apikey=a69153fed18cb21638969ef9946de5ac&format=json&page_size=1&page=1&q_artist=Bruno Mars&24k

    //http://api.musixmatch.com/ws/1.1/track.search?apikey=a69153fed18cb21638969ef9946de5ac&format=json&page_size=1&page=1&q_artist=John Legend&q_track=All of Me


    // $rootScope.getSongGneresMusix = function () {
    //     var url = "http://api.musixmatch.com/ws/1.1/track.search?apikey=a69153fed18cb21638969ef9946de5ac&format=json&page_size=1&page=1";
    //     url += "&q_artist=";
    //     url += $rootScope.song.artistAPI;
    //     url += "&q_track=";
    //     url += $rootScope.song.songNameAPI;
    //     $http.get(url).
    //         then(function (response) {
    //             $rootScope.musixAPIResultRaw = response.data;
    //             parseMusixAPIResult();
    //         });
    // };

    $rootScope.parseFullTitleAndGetData = function () {
        $rootScope.getSongArtist();
        $rootScope.getSongName();
        $rootScope.parseSongName();
        $rootScope.getSongGneres();
        // $rootScope.getSongGneresMusix();
    };



    $rootScope.getSongArtist = function () {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            if (dashIndex === -1) {
                dashIndex = fullSongTitle.indexOf(":");
            }
            var artist = fullSongTitle.substring(0, dashIndex).trim();
            $rootScope.song.artist = artist;
            $rootScope.song.artistAPI = artist;
        }
    };


    $rootScope.getSongName = function () {
        var fullSongTitle = $rootScope.song.fullTitle;
        if (angular.isDefined(fullSongTitle)) {
            var dashIndex = fullSongTitle.indexOf("-");
            if (dashIndex === -1) {
                dashIndex = fullSongTitle.indexOf(":");
            }
            var songName = fullSongTitle.substring(dashIndex + 1).trim();
            $rootScope.song.songName = songName;
        }
    };

    // $rootScope.parseSongName = function () {
    //     var songName = $rootScope.song.songName;
    //     if (angular.isDefined(songName)) {
    //         var bracket = songName.indexOf("(");
    //         if (bracket === -1) {
    //             bracket = songName.indexOf("[");
    //         }
    //         if (bracket !== -1) {
    //             $rootScope.data.takeSongName = false;
    //         }
    //         var songNameAPI = bracket != -1 ? songName.substring(0, bracket - 1).trim() : songName;
    //         $rootScope.song.songNameAPI = songNameAPI;
    //     }
    // };

    $rootScope.parseSongName = function () {
        var songName = $rootScope.song.songName;
        if (angular.isDefined(songName)) {
            var bracket = songName.indexOf("(");
            if (bracket === -1) {
                bracket = songName.indexOf("[");
            }
            if (bracket !== -1) {
                $rootScope.data.takeSongName = false;
            }
            //remove all brackets and it's content
            songName = songName.replace(/ *\([^)]*\) */g, " ").trim();
            songName = songName.replace(/ *\[[^\]]*]/, '').trim();

            // songName = songName.replace(/[\[\]']+/g,'').trim();

            bracket = songName.indexOf("ft");
            var songNameAPI = bracket != -1 ? songName.substring(0, bracket - 1).trim() : songName;

            $rootScope.song.songNameAPI = songNameAPI;
        }
    };


    $rootScope.cleanResult = function () {
        $rootScope.APIResultRaw = "";
        // $rootScope.musixAPIResultRaw = "";
    };

    $rootScope.goToBottom = function () {
        $window.scrollTo(0, document.body.scrollHeight);
    };



    function parseYTSongResult() {
        var songTitle = "";
        var publishDate = "";
        var viewCount = 0;
        dataToParse = $rootScope.YTSongResult;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            songTitle = "No YT Result";
        } else if (angular.isUndefined(dataToParse.items) || dataToParse.items === '') {
            songTitle = "Error in Result - no items";
        } else if (dataToParse.items.length === 0) {
            songTitle = "No Results results";
        } else if (dataToParse.items.length > 1) {
            songTitle = "Too many results";
        } else if (angular.isUndefined(dataToParse.items[0].snippet) || dataToParse.items[0].snippet === '') {
            songTitle = "Error in Result - no snippet";
        } else {
            songTitle = dataToParse.items[0].snippet.title;
            publishDate = dataToParse.items[0].snippet.publishedAt;
            viewCount = dataToParse.items[0].statistics.viewCount;
        }
        $rootScope.song.fullTitle = songTitle;
        $rootScope.song.publishDate = publishDate.substring(0, 10).trim();
        $rootScope.song.viewCount = viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        $rootScope.parseFullTitleAndGetData();

    }





    // function parseMusixAPIResult() {
    //     var textResult = "";
    //     dataToParse = $rootScope.musixAPIesultRaw;
    //     if (angular.isUndefined(dataToParse) || dataToParse === '') {
    //         // alert("No API Result");
    //         textResult = "No API Result";
    //     } else if (angular.isUndefined(dataToParse.toptags) || dataToParse.toptags === '') {
    //         // alert("Error in Result - no toptags");
    //         textResult = "Error in Result - no toptags";
    //     } else {
    //         var genresScores = dataToParse.toptags.tag;
    //         for (var i = 0; i < genresScores.length; i++) {
    //             currentScore = genresScores[i];
    //             // textResult += "Genre: ";
    //             textResult += currentScore.name;
    //             textResult += " | ";

    //             // textResult += " | Count: ";
    //             textResult += currentScore.count;
    //             textResult += "\n";
    //         }
    //     }
    //     $rootScope.musixAPIResult = textResult;
    // }

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
            return { "color": "blue" };
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
            for (var j = 0; j < newMapOfGenres.length; j++) {
                var currentGenre = newMapOfGenres[j];
                genresweightsOfSong[j] = genres[currentGenre];
            }
            newSong.g = genresweightsOfSong;
            shrinkSongList[i] = newSong;
        }
        var fromRawToShrink = JSON.stringify(shrinkSongList);
        console.log(fromRawToShrink);
        $rootScope.fromRawToShrink = fromRawToShrink;
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
                var key = newMapOfGenres[j];
                newSong.genreWeights[key] = currentSong.g[j];
            }
            rawSongsList[i] = newSong;
        }
        var fromShrinkToRaw = JSON.stringify(rawSongsList);
        console.log(fromShrinkToRaw);
        $rootScope.fromShrinkToRaw = fromShrinkToRaw;

    }


    /// Test



    $rootScope.runAllTests = function () {
        checkDuplicates();
    };

    function checkDuplicates() {
        $rootScope.duplicatesStatus = true;
        var songsData = $rootScope.songsShrink;
        var songsIds = songsData.map(function (songObj) {
            return songObj.id;
        });
        var sortedSongsIds = songsIds.slice().sort();
        var duplicatesArr = [];
        for (var i = 0; i < songsIds.length - 1; i++) {
            if (sortedSongsIds[i + 1] == sortedSongsIds[i]) {
                duplicatesArr.push(sortedSongsIds[i]);
                console.log(sortedSongsIds[i]);
            }
        }
        if (duplicatesArr.length !== 0) {
            $rootScope.duplicatesStatus = false;
        }
    }

    $rootScope.getDuplicatesTestResult = function () {
        if (angular.isDefined($rootScope.duplicatesStatus)) {
            if ($rootScope.duplicatesStatus) {
                return "PASS";
            } else {
                return "FAIL";
            }
        }
        return "CLICK ON RUN TEST";
    };



    //// Statistics

    $rootScope.createMapOfGenresDataStat = function () {
        // initallGenresStat();
        var genresStatData = calculateGenresStatData();

        $rootScope.allGenresStat = [];
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var currentGenre = newMapOfGenres[i];
            var currentGenreStat = {};
            currentGenreStat.name = currentGenre;
            currentGenreStat.weight = genresStatData[i];
            $rootScope.allGenresStat[i] = currentGenreStat;
        }

    };

    function calculateGenresStatData() {
        var songsData = $rootScope.songsShrink;
        var mapOfAveragesByGenres = Array.apply(null, Array(newMapOfGenres.length)).map(Number.prototype.valueOf, 0);
        var lengthOfSongData = songsData.length;
        for (var i = 0; i < lengthOfSongData; i++) {
            var currentSongData = songsData[i];
            for (var j = 0; j < currentSongData.g.length; j++) {
                mapOfAveragesByGenres[j] += currentSongData.g[j];
            }
        }

        for (var k = 0; k < mapOfAveragesByGenres.length; k++) {

            mapOfAveragesByGenres[k] = Math.round((mapOfAveragesByGenres[k] / lengthOfSongData) * 100) / 100;
        }
        return mapOfAveragesByGenres;

    }



    /// fixSongList


    $rootScope.fixSongList = function () {
        var rawSongList = $rootScope.songsRaw;
        var newRawSongList = [];
        for (var i = 0; i < rawSongList.length; i++) {
            var currentSong = rawSongList[i];
            var oldGenres = currentSong.genreWeights;
            var newGenresWeightsOfSongObj = {};
            for (var k = 0; k < newMapOfGenres.length; k++) {
                var key = newMapOfGenres[k];
                newGenresWeightsOfSongObj[key] = 0;
            }
            for (var genre in oldGenres) {
                var currentGenreWeight = oldGenres[genre];
                newGenresWeightsOfSongObj[genre] = currentGenreWeight;
            }
            currentSong.genreWeights = newGenresWeightsOfSongObj;
            newRawSongList[i] = currentSong;
        }
        console.log(JSON.stringify(newRawSongList));
    };


    /// FIX SONGS


    $rootScope.runningSongIndexFromList = 89;

    $rootScope.loadSongFromList = function () {
        var rawSongList = $rootScope.songsRaw;
        var currentSong = rawSongList[$rootScope.runningSongIndexFromList];
        $rootScope.song.id = currentSong.id;
        for (var i = 0; i < newMapOfGenres.length; i++) {
            $rootScope.song.songGenres[i] = currentSong.genreWeights[newMapOfGenres[i]];
        }
        $rootScope.getSongNameAndParseFullTitle();
    };

    $rootScope.addSong2 = function () {
        validateSong();
        var currentSong = $rootScope.song;
        var newSong = {};
        newSong.index = $rootScope.runningSongIndexFromList;
        newSong.id = currentSong.id;
        newSong.details = {};
        // newSong.details.artist = currentSong.artist.trim();
        // newSong.details.songName = currentSong.songName.trim();
        newSong.details.artist = currentSong.artist;
        newSong.details.songName = $rootScope.data.takeSongName ? currentSong.songName : $rootScope.song.songNameAPI;
        newSong.genreWeights = {};
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var key = newMapOfGenres[i];
            newSong.genreWeights[key] = currentSong.songGenres[i];
        }
        var newSongStr = JSON.stringify(newSong);
        console.log(newSongStr);

        $rootScope.songToAdd += newSongStr;
        $rootScope.songToAdd += ",";
        $rootScope.runningSongIndexFromList++;

        $rootScope.cleanSong();
        $rootScope.data.takeSongName = true;


    };

}


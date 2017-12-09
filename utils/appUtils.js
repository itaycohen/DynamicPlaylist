var app = angular.module('appUtils', [
    'ngMaterial',
    'dpAppUtils',
    'ngclipboard'
]);

app.run(['$rootScope', '$http', function ($rootScope, $http) {

    //  debugger; 

    $http.get("data/songs/tagging.1/songsShrinkTagging.json")
        .then(function (response) {
            $rootScope.songsShrink = response.data;

            $http.get("data/songs/tagging.1/songsRawTagging.json")
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
appUtilsController.$inject = ["$rootScope", 'dpAppUtils', '$http', '$window'];
function appUtilsController($rootScope, dpAppUtils, $http, $window) {


    var LAST_FM_API_KEY = "6c43957997d9e000c1678ee52dbacd54";
    var LAST_FM_REQ_PREFIX = "http://ws.audioscrobbler.com/2.0/";

    var ACOUSTIC_BRAINZ_REQ_PREFIX = "http://acousticbrainz.org/api/v1/";

    var DISCOGS_API_KEY = "yRRYrVyDLpIeNaGgKMJR";
    var DISCOGS_API_TOKEN = "kaTeeDorKwsemjQopZyPsGbloNcoJotb";
    var DISCOGS_REQ_PREFIX = "https://api.discogs.com/database/search?";

    var MUSIC_BRAINZ_QUERY_REQ_PREFIX = "http://musicbrainz.org/ws/2/recording/";

    var rapid = new RapidAPI("default-application_5a0c63eee4b0218e3e35bf81", "e1bf6022-791c-4a2b-b878-4f0800b5ee14");


    var VIEW_COUNT_HIT_NORMALIZED_THRESHOLD = 100000000; //100M
    var DIFF_DAYS_NEW_THRESHOLD = 350;
    var DIFF_DAYS_TRENDING_THRESHOLD = 300;
    var VIEW_COUNT_TRENDING_NORMALIZED_THRESHOLD;
    var TRENDING_FACTOR_THRESHOLD = 250000; //25k


    $rootScope.currentNavItem = 'page1';
    $rootScope.data = {};
    $rootScope.data.takeYoutube = false;
    $rootScope.data.takeAPI = false;
    $rootScope.data.takeExisting = false;
    $rootScope.data.takeItunes = false;
    
    
    $rootScope.isFixingSongsFlow = false;
    $rootScope.genreInputStyle = { "width": "100px" };

    $rootScope.toggleExisting = function() {
        $rootScope.data.takeExisting = !$rootScope.isFixingSongsFlow;
    };


    // TODO - change to array with object: {genreName, weight, index}
    // var mapOfGenres = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];
    // var newMapOfGenres2 = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "R&B", "Rock", "Soul"];
    // var newMapOfGenres = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Rock", "Soul", "Trance"];
    var newMapOfGenres = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Reggaeton", "Rock", "Soul", "Trance"];
    var mapOfHitFactorByGenre = [{ "Alternative": 2 }, { "Chill Out": 3 }, { "Country": 2.5 }, { "Dance": 0.7 }, { "Folk": 3 }, { "Funk": 3 }, { "Hip-Hop": 0.8 }, { "Indie": 3 }, { "Latin": 0.7 }, { "Love": 2 }, { "Metal": 3 }, { "Pop": 0.5 }, { "Punk": 2 }, { "R&B": 0.8 }, { "Rap": 0.8 }, { "Reggae": 1.2 }, { "Reggaeton": 0.8 }, { "Rock": 1 }, { "Soul": 1 }, { "Trance": 2 }];
    var mapOfHitFactors = [2, 3, 2.5, 0.7, 3, 3, 0.8, 3, 0.7, 2, 3, 0.5, 2, 0.8, 0.8, 1.2, 0.8, 1, 1, 2];


    var duplicatesSongNames = ["Gold", "Home", "Paradise", "Sorry","Human", "Alone", "Animals", "Get Low", "Perfect", "Sledgehammer"];


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
        newSong.index = $rootScope.isFixingSongsFlow ? $rootScope.runningSongIndexFromList : $rootScope.runningSongIndex;
        newSong.id = currentSong.id;
        newSong.details = {};
        if ($rootScope.data.takeItunes) {
            newSong.details.artist = $rootScope.itunesResArtist;
            newSong.details.songName = $rootScope.itunesResSongName;
        } else if ($rootScope.data.takeExisting) {
            newSong.details.artist = $rootScope.song.exisitArtist;
            newSong.details.songName = $rootScope.song.exisitSongName;
        } else if ($rootScope.data.takeAPI) {
            newSong.details.artist = $rootScope.song.artistAPI;
            newSong.details.songName =  $rootScope.song.songNameAPI;
        } else {
            newSong.details.artist = currentSong.artist;
            newSong.details.songName = currentSong.songName;
        }

        
        newSong.misc = {};
        if (angular.isUndefined(currentSong.year) || currentSong.year === "") {
            alert("No year!");
            currentSong.year = "NA";
            return;
        }
        newSong.misc.year = currentSong.year;

        if (angular.isUndefined(currentSong.artwork) || currentSong.artwork === "") {
            alert("No artwork!");
            newSong.misc.artwork = "NA";
            return;
            
        }
        newSong.misc.artwork = currentSong.artwork;

        if (angular.isUndefined(currentSong.duration) || currentSong.duration === "") {
            alert("No duration!");
            newSong.misc.duration = "NA";
            return;
            
        }
        newSong.misc.duration = currentSong.duration;
        

        if (hasSameNameLikeOtherSong(newSong.details.songName)) {
            alert("warning! we have a song with the same name");
            // we don't return because this song can be ok
        }

        newSong.genreWeights = {};
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var key = newMapOfGenres[i];
            newSong.genreWeights[key] = currentSong.songGenres[i];
        }
        newSong.tagging = {};

        newSong.tagging.new = isSongNew($rootScope.YTSongResult);
        newSong.tagging.hit = isSongHit($rootScope.YTSongResult, newSong);
        newSong.tagging.trending = isSongTrending($rootScope.YTSongResult, newSong);

        var newSongStr = JSON.stringify(newSong);
        console.log(newSongStr);

        $rootScope.songToAdd += newSongStr;
        $rootScope.songToAdd += ",";
        if ($rootScope.isFixingSongsFlow) {
            $rootScope.runningSongIndexFromList++;
        } else {
            $rootScope.runningSongIndex++;
        }

        $rootScope.cleanSong();
        $rootScope.data.takeYoutube = true;
    };

    function validateSong() {
        var currentSong = $rootScope.song;
        if (angular.isUndefined(currentSong) || currentSong.id === '' || currentSong.artist === '' || currentSong.songName === '') {
            alert("Error in song details");
            return;
        }
    }

    $rootScope.parseFullTitleAndGetData = function () {
        $rootScope.getSongArtist();
        $rootScope.getSongName();
        $rootScope.parseSongName();
        $rootScope.getItunesData();
        //TODO - uncomment
        // $rootScope.getTopTagsData();
        // $rootScope.getDiscogsData();
        // $rootScope.getMusixData();
        // $rootScope.getMusicBrainzQueryData();
        
    };

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
        $rootScope.lastFmResultParsed = "";
        $rootScope.brainzResultParsed = "";
        $rootScope.discogsResultParsed = "";
        $rootScope.musixResultParsed = "";
        $rootScope.itunesResultParsed = "";

        $rootScope.lastFmMbid = "";
        $rootScope.musixMbidOne = "";
        $rootScope.musixMbidTwo = "";
        $rootScope.brainzQueryOneMbid = "";
        $rootScope.brainzQueryOneFullSongName = "";
        $rootScope.brainzQueryTwoMbid = "";
        $rootScope.brainzQueryTwoFullSongName = "";

        $rootScope.itunesResArtist = "";
        $rootScope.itunesResSongName = "";

        
        $rootScope.data.takeYoutube = true;
    };

    $rootScope.cleanAllSongs = function () {
        $rootScope.songToAdd = '';
    };

    $rootScope.cleanLastFmResult = function () {
        $rootScope.lastFmResultParsed = "";
    };

    $rootScope.cleanAcousticResult = function () {
        $rootScope.brainzResultParsed = "";
    };

    $rootScope.cleanDiscogsResult = function () {
        $rootScope.discogsResultParsed = "";
    };

    $rootScope.cleanMusixResult = function () {
        $rootScope.musixResultParsed = "";
    };

    $rootScope.cleanItunesResult = function () {
        $rootScope.itunesResultParsed = "";
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

    function hasSameNameLikeOtherSong(songName) {
        if ($rootScope.isFixingSongsFlow) {
            return false;
        }
        var songsData = $rootScope.songsShrink;
        var songsNames = songsData.map(function (songObj) {
            return songObj.s;
        });
        for (var i = 0; i < songsNames.length - 1; i++) {
            if (songsNames[i].indexOf(songName) !== -1 || songName.indexOf(songsNames[i]) !== -1) {
                return true;
            }
        }
        var songToAddstr = $rootScope.songToAdd;
        if (songName !== "" && songToAddstr.indexOf(songName) !== -1) {
            return true;
        }
        return false;
    };



    $rootScope.getSongNameAndParseFullTitle = function () {
        var url = "https://www.googleapis.com/youtube/v3/videos?";
        url += "id=";
        url += $rootScope.song.id;
        url += "&part=snippet, statistics, contentDetails";
        url += "&key=AIzaSyA14y8xNuOkVU-G4GzdOM2H7vmJ78becgA";
        $http.get(url).
            then(function (response) {
                $rootScope.YTSongResult = response.data;
                parseYTSongResult();
            });

    };

    $rootScope.getAllData = function () {
        $rootScope.getTopTagsData();
        $rootScope.getDiscogsData();
        $rootScope.getMusixData();
        $rootScope.getItunesData();
        $rootScope.getMusicBrainzQueryData();
    };


    


    $rootScope.getTopTagsData = function () {
        var url = "";
        url += LAST_FM_REQ_PREFIX;
        url += "?method=track.gettoptags";
        url += "&api_key=";
        url += LAST_FM_API_KEY;
        url += "&format=json";
        url += "&artist=";
        url += $rootScope.song.artistAPI;
        url += "&track=";
        url += $rootScope.song.songNameAPI;
        $http.get(url).
            then(function (response) {
                $rootScope.topTagsDataRes = response.data;
                parseTopTagsReqResult();
            });
    };



    //http://api.musixmatch.com/ws/1.1/track.search?apikey=a69153fed18cb21638969ef9946de5ac&format=json&page_size=1&page=1&q_artist=Bruno Mars&24k

    //http://api.musixmatch.com/ws/1.1/track.search?apikey=a69153fed18cb21638969ef9946de5ac&format=json&page_size=1&page=1&q_artist=John Legend&q_track=All of Me


    $rootScope.getMusixData = function () {
        var url = "https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/track.search?page=1&page_size=2&s_track_rating=desc";
        url += "&q_artist=";
        url += $rootScope.song.artistAPI;
        url += "&q_track=";
        url += $rootScope.song.songNameAPI;
        var config = {
            headers : {
                'Access-Control-Allow-Origin' : '*',
                "X-Mashape-Key": "xhbXUJofP3mshxXnY4aqqwZp42N3p1JLJ86jsnZ477l7kWuHrQ",
                "X-Mashape-Host": "musixmatchcom-musixmatch.p.mashape.com"
            }
           };
        $http.get(url, config).
            then(function (response) {
                $rootScope.musixDataRes = response.data;
                parseMusixResult();
            });
    };


    function parseMusixResult() {
        var textResult = "";
        dataToParse = $rootScope.musixDataRes;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            textResult = "No API Result";
        } else if (dataToParse.length === 0) {
            textResult = "Empty result";
        } else {
            var resultsArr = dataToParse;
            var primGenresStrPre = "Primary Genres: \n";
            var secGenresStrPre = "\nSecondary Genres: \n";
            var primGenresStr = "";
            var secGenresStr = "";
            $rootScope.musixMbidOne = "";
            $rootScope.musixMbidTwo = "";
            
            for (var i = 0; i < resultsArr.length; i++) {
                var currentSong = resultsArr[i];
                if (!angular.isUndefined(currentSong.track_mbid)) {
                    if (i === 0 ){
                        $rootScope.musixMbidOne = currentSong.track_mbid;
                    } else if (i === 1) {
                        $rootScope.musixMbidTwo = currentSong.track_mbid;
                    }
                }
                if (!angular.isUndefined(currentSong.primary_genres) && !angular.isUndefined(currentSong.primary_genres.music_genre)) {
                    var primaryGenresArr = currentSong.primary_genres.music_genre;
                    for (var j = 0; j < primaryGenresArr.length; j++) {
                        var currentGenre = primaryGenresArr[j].music_genre_name;
                        if (!primGenresStr.includes(currentGenre)) {
                            primGenresStr += currentGenre;
                            primGenresStr += "\n";
                        }
                    }
                }
                if (!angular.isUndefined(currentSong.secondary_genres) && !angular.isUndefined(currentSong.secondary_genres.music_genre)) {
                    var secondaryGenresArr = currentSong.secondary_genres.music_genre;
                    for (var k = 0; k < secondaryGenresArr.length; k++) {
                        var currentSecGenre = secondaryGenresArr[k].music_genre_name;
                        if (!secGenresStr.includes(currentSecGenre)) {
                            secGenresStr += currentSecGenre;
                            secGenresStr += "\n";
                        }
                    }
                }
            }
            primGenresStr = primGenresStr !== "" ? primGenresStr : "NO GENRES DATA";
            secGenresStr = secGenresStr !== "" ? secGenresStr : "NO STYLES DATA";
            textResult += primGenresStrPre + primGenresStr + secGenresStrPre + secGenresStr;
        }
        $rootScope.musixResultParsed = textResult;

        if ($rootScope.musixMbidOne !== "" || $rootScope.musixMbidTwo !== "") {
            getBrainzDataIfNeededByMusixMbid();
        }
    }

    function getBrainzDataIfNeededByMusixMbid() {
        // we want to wait until last fm for sure tried to bring mbid 
        // only than we will try to bring by using 
        sleepFor(500);
        // if (!angular.isUndefined($rootScope.lastFmMbid) && $rootScope.lastFmMbid === "") {
            // acoustice brainz used last fm mbid and didnt recevie data yet
        if (!$rootScope.acousticBrainzWithData) {
            getAcousticBrainzDataByMbid($rootScope.musixMbidOne, "Musix One");

            sleepFor(500);
            // acoustice brainz used musixMbidOne and didnt recevie data yet
            if (!$rootScope.acousticBrainzWithData) {
                getAcousticBrainzDataByMbid($rootScope.musixMbidTwo, "Musix two");
            }
        } 
    }

    $rootScope.getItunesData = function () {

        var termToSearch =  $rootScope.song.artistAPI + " " + $rootScope.song.songNameAPI;
        rapid.call('iTunes', 'searchMusic', { 
            'term': termToSearch,
            'country': 'us',
            'entity': 'song',
            'limit': '3'
        }).on('success', function (payload) {
            $rootScope.itunesDataRes = payload;
            parseItunesResult();
        }).on('error', function (payload) {
            console.log("lo tov");
        });

    };


    function parseItunesResult() {
        var textResult = "";
        dataToParse = $rootScope.itunesDataRes;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.results) || dataToParse.results.length === 0) {
            textResult = "Empty result";
        } else {
            var resultsArr = dataToParse.results;
            var genresStrPre = "Genres: \n";
            var genresStr = "";
            var releaseDate;
            var artworkUrl100;
            
            
            var firstSong = resultsArr[0];
            if (!angular.isUndefined(firstSong.artistName) &&
                !angular.isUndefined(firstSong.trackName)) {
                $rootScope.itunesResArtist = firstSong.artistName;
                $rootScope.itunesResSongName = firstSong.trackName;
            }

            if (!angular.isUndefined(firstSong.artworkUrl100) &&
                !angular.isUndefined(firstSong.releaseDate)) {
                artworkUrl100 = firstSong.artworkUrl100;
                 console.log(artworkUrl100);
                 alert(artworkUrl100);
                 releaseDate = firstSong.releaseDate;
                 $rootScope.song.artwork = artworkUrl100;
                //  $rootScope.song.artwork = getArrOfArtwork(artworkUrl30);

                $rootScope.song.year = getYearOfReleaseDate(releaseDate);
                 
            }

            for (var i = 0; i < resultsArr.length; i++) {
                var currentSong = resultsArr[i];
                if (!angular.isUndefined(currentSong.primaryGenreName)) {
                    var currentGenre = currentSong.primaryGenreName;
                    if (!genresStr.includes(currentGenre)) {
                        genresStr += currentGenre;
                        genresStr += "\n";
                        
                    }
                }
            }

            genresStr += "\n";
            genresStr += artworkUrl100 ? "artwork" : "NO artwork";
            genresStr += "\n";
            genresStr += releaseDate;
            genresStr += "\n";



            genresStr = genresStr !== "" ? genresStr : "NO GENRES DATA";
            textResult += genresStrPre + genresStr;
        }
        $rootScope.itunesResultParsed = textResult;
    }


    //[is,music,version,pre1,pre2,pre3,code]
    // http://is1.mzstatic.com/image/thumb/Music3/v4/81/bb/6f/81bb6f2b-228e-951b-9c91-8cf85e661b1c/source/30x30bb.jpg
    // http://is4.mzstatic.com/image/thumb/Music30/v4/ac/87/29/ac8729b1-329b-cc0d-3b30-6d0301994a02/source/30x30bb.jpg
    // (13) ["http:", "", "is1.mzstatic.com", "image", "thumb", "Music3", "v4", "81", "bb", "6f", "81bb6f2b-228e-951b-9c91-8cf85e661b1c", "source", "30x30bb.jpg"]
    function getArrOfArtwork(artworkUrl) {
        var artworkArr =[];
        var arrOfUrl = artworkUrl.split("/");
        var isStr = arrOfUrl[2].split(".")[0];
        artworkArr[0] = isStr.substring(2,isStr.length);; //is1 -> 1
        artworkArr[1] = arrOfUrl[5].substring(5,arrOfUrl[5].length); // Music3 -> 3
        artworkArr[2] = arrOfUrl[6].substring(1,arrOfUrl[6].length); // v4 -> 4;
        artworkArr[3] = arrOfUrl[7];
        artworkArr[4] = arrOfUrl[8];
        artworkArr[5] = arrOfUrl[9];
        artworkArr[6] = arrOfUrl[10];
        return artworkArr;
    }

    function getYearOfReleaseDate(releaseDateRaw) {
        var releaseDateStr = releaseDateRaw.substring(0, 10).trim();
        var releaseDate = new Date(releaseDateStr);
        var year = releaseDate.getFullYear();
        return year;
    }



    //http://musicbrainz.org/ws/2/recording/?query=recording:titanium%20AND%20artist:david%20guetta&fmt=json
    
    $rootScope.getMusicBrainzQueryData = function () {
        var url = "";
        url += MUSIC_BRAINZ_QUERY_REQ_PREFIX;
        url += "?query=";
        url += "recording:";
        url += $rootScope.song.songNameAPI;
        url += "%20AND%20";
        url += "artist:";
        url += $rootScope.song.artistAPI;
        url += "&limit=2&fmt=json";
        $http.get(url).
            then(function (response) {
                $rootScope.getMusicBrainzQueryRes = response.data;
                parseMusicBrainzQueryReqResult();
            });
    };


    function parseMusicBrainzQueryReqResult() {
        var textResult = "";
        dataToParse = $rootScope.getMusicBrainzQueryRes;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.recordings) || dataToParse.recordings.length === 0) {
            textResult = "Empty recordings result";
        } else {
            var recordingArr = dataToParse.recordings;
            var currentRecording = recordingArr[0];
            $rootScope.brainzQueryOneMbid = currentRecording.id;
            var songName = currentRecording.title;
            var artistName = currentRecording["artist-credit"][0].artist.name;
            $rootScope.brainzQueryOneFullSongName = artistName + " - " + songName;

            if (recordingArr.length == 2) {
                currentRecording = recordingArr[1];
                $rootScope.brainzQueryTwoMbid = currentRecording.id;
                songName = currentRecording.title;
                artistName = currentRecording["artist-credit"][0].artist.name;
                $rootScope.brainzQueryTwoFullSongName = artistName + " - " + songName;
            }
            return;

        }
        // in case there are no results
        $rootScope.brainzQueryOneFullSongName = textResult;
    }

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

            if (hasSameNameLikeOtherSong(songName)) {
                alert("warning! we have a song with the same name");
            }
        }
    };


    $rootScope.parseSongName = function () {
        var songName = $rootScope.song.songName;
        if (angular.isDefined(songName)) {
            var bracket = songName.indexOf("(");
            if (bracket === -1) {
                bracket = songName.indexOf("[");
            }
            if (bracket !== -1) {
                $rootScope.data.takeYoutube = false;
            }
            //remove all brackets and it's content
            songName = songName.replace(/ *\([^)]*\) */g, " ").trim();
            songName = songName.replace(/ *\[[^\]]*]/, '').trim();

            bracket = songName.indexOf("ft");
            var songNameAPI = bracket != -1 ? songName.substring(0, bracket - 1).trim() : songName;

            $rootScope.song.songNameAPI = songNameAPI;
            if (hasSameNameLikeOtherSong(songNameAPI)) {
                alert("warning! we have a song with the same name");
            }
        }
    };

    $rootScope.goToBottom = function () {
        $window.scrollTo(0, document.body.scrollHeight);
    };

    function parseYTSongResult() {
        var songTitle = "";
        var publishDate = "";
        var viewCount = 0;
        var duration = "";
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
            duration = dataToParse.items[0].contentDetails.duration;
        }
        $rootScope.song.fullTitle = songTitle;
        $rootScope.song.publishDate = publishDate.substring(0, 10).trim();
        $rootScope.song.viewCount = viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $rootScope.song.duration = formatYoutubeDuration(duration);
        console.log($rootScope.song.duration);

        $rootScope.parseFullTitleAndGetData();

    }


    function formatYoutubeDuration2(duration) {
        var a = duration.match(/\d+/g);
    
        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }
    
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }
    
        var str = "";
    
        if (a.length == 3) {
            str += a[0] + ":";
            str += a[1] + ":";
            str += a[2];
        }
    
        if (a.length == 2) {
            str += a[0] + ":";
            str += a[1];
        }
    
        if (a.length == 1) {
            str += a[0];
        }
        return str;
    }

    function formatYoutubeDuration(duration) {
        var output = [];
        var durationInSec = 0;
        var matches = duration.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
        var parts = [
          { // years
            pos: 1,
            multiplier: 86400 * 365
          },
          { // months
            pos: 2,
            multiplier: 86400 * 30
          },
          { // weeks
            pos: 3,
            multiplier: 604800
          },
          { // days
            pos: 4,
            multiplier: 86400
          },
          { // hours
            pos: 5,
            multiplier: 3600
          },
          { // minutes
            pos: 6,
            multiplier: 60
          },
          { // seconds
            pos: 7,
            multiplier: 1
          }
        ];

        for (var i = 0; i < parts.length; i++) {
            if (typeof matches[parts[i].pos] != 'undefined') {
              durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
            }
          }
          var totalSec = durationInSec;
          // Hours extraction
          if (durationInSec > 3599) {
            output.push(parseInt(durationInSec / 3600));
            durationInSec %= 3600;
          }
          // Minutes extraction with leading zero
          output.push(('' + parseInt(durationInSec / 60)).slice(-2));
          // Seconds extraction with leading zero
          output.push(('0' + durationInSec % 60).slice(-2));
        return output.join(':');
    }


    function parseTopTagsReqResult() {
        $rootScope.topTagsWithData = false;
        var textResult = "";
        dataToParse = $rootScope.topTagsDataRes;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            // alert("No API Result");
            textResult = "No API Result";
            // in this case we init the result of brainz from last call
            $rootScope.brainzResultParsed = "";
        } else if (angular.isUndefined(dataToParse.toptags) || dataToParse.toptags === '') {
            // alert("Error in Result - no toptags");
            textResult = "Error in Result - no toptags";
            // in this case we init the result of brainz from last call
            $rootScope.brainzResultParsed = "";
        } else if (dataToParse.toptags.tag.length === 0) {
            textResult = "empty toptags";
            // in this case we init the result of brainz from last call
            $rootScope.brainzResultParsed = "";
        } else {
            $rootScope.topTagsWithData = true;
            // if the call succeeds  we will try to get info about 'getInfo' for mbid 
            getLastFmMbidData();
            var genresScores = dataToParse.toptags.tag;
            for (var i = 0; i < genresScores.length; i++) {
                currentScore = genresScores[i];
                // textResult += "Genre: ";
                textResult += currentScore.name;
                textResult += " | ";
                textResult += currentScore.count;
                textResult += "\n";
            }
        }
        $rootScope.lastFmResultParsed = textResult;
    }

    function getLastFmMbidData() {
        var url = "";
        url += LAST_FM_REQ_PREFIX;
        url += "?method=track.getInfo";
        url += "&api_key=";
        url += LAST_FM_API_KEY;
        url += "&format=json";
        url += "&artist=";
        url += $rootScope.song.artistAPI;
        url += "&track=";
        url += $rootScope.song.songNameAPI;
        $http.get(url).
            then(function (response) {
                $rootScope.getInfoDataRes = response.data;
                parseGetInfoReqResult();
            });

    }

    // for mbid 
    function parseGetInfoReqResult() {
        var textResult = "";
        $rootScope.lastFmMbid = "";
        dataToParse = $rootScope.getInfoDataRes;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            // alert("No API Result");
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.track) || dataToParse.track === '') {
            // alert("Error in Result - no toptags");
            textResult = "Error in Result - no track";
        } else if (angular.isUndefined(dataToParse.track.mbid) || dataToParse.track.mbid === '') {
            textResult = "empty mbid";
        } else {
            textResult = dataToParse.track.mbid;

            $rootScope.lastFmMbid = textResult;

            if (!angular.isUndefined($rootScope.lastFmMbid) || $rootScope.$rootScope.lastFmMbid !== '') {
                getAcousticBrainzDataByMbid($rootScope.lastFmMbid, "Last FM");
            }
            

        }

    }

    $rootScope.getLastFmTopInfoByMusixOneMbid = function () {
        getLastFmTopInfoByMbid($rootScope.musixMbidOne, "Musix1");
    };


    $rootScope.getLastFmTopInfoByMusixTwoMbid = function () {
        getLastFmTopInfoByMbid($rootScope.musixMbidTwo, "Musix2");
    };

    $rootScope.getLastFmTopInfoByBrainzQueryOneMbid = function () {
        getLastFmTopInfoByMbid($rootScope.brainzQueryOneMbid, "Music Brainz Qry One");
    };


    $rootScope.getLastFmTopInfoByBrainzQueryTwoMbid = function () {
        getLastFmTopInfoByMbid($rootScope.brainzQueryTwoMbid, "Music Brainz Qry Two");
    };


    function getLastFmTopInfoByMbid(mbid, byStr) {
        var url = "";
        url += LAST_FM_REQ_PREFIX;
        url += "?method=track.getInfo";
        url += "&api_key=";
        url += LAST_FM_API_KEY;
        url += "&format=json";
        url += "&mbid=";
        url += mbid;
        $http.get(url).
            then(function (response) {
                parseGetInfoByMbidResult(response.data, byStr);
            });
    }


    function parseGetInfoByMbidResult(dataToParse, byStr) {
        var textResult = "";
        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            // alert("No API Result");
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.track) || dataToParse.track === '') {
            // alert("Error in Result - no toptags");
            textResult = "Error in Result - no track";
        } else if (dataToParse.track.name === '') {
            textResult = "empty mbid";
        } else {
            var nameOfSong = dataToParse.track.name;
            var artist = dataToParse.track.artist.name;

            var url = "";
            url += LAST_FM_REQ_PREFIX;
            url += "?method=track.gettoptags";
            url += "&api_key=";
            url += LAST_FM_API_KEY;
            url += "&format=json";
            url += "&artist=";
            url += artist;
            url += "&track=";
            url += nameOfSong;
            $http.get(url).
                then(function (response) {
                    $rootScope.topTagsDataRes = response.data;
                    parseTopTagsReqResult();
                });
        }

        $rootScope.lastFmResultParsed = textResult;

    }


    // by click
    function getAcousticBrainzData() {
        if (!angular.isUndefined($rootScope.lastFmMbid) || $rootScope.$rootScope.lastFmMbid !== '') {
            getAcousticBrainzDataByMbid($rootScope.lastFmMbid, "Last FM");
        } else if (!angular.isUndefined($rootScope.musixMbidOne) || $rootScope.$rootScope.musixMbidOne !== '') {
            getAcousticBrainzDataByMbid($rootScope.musixMbidOne, "Musix1");
        } else if (!angular.isUndefined($rootScope.musixMbidTwo) || $rootScope.$rootScope.musixMbidTwo !== '') {
            getAcousticBrainzDataByMbid($rootScope.musixMbidTwo, "Musix2");
        } else {
            var textResult = "";
            textResult = "NO MBID";
            $rootScope.brainzResultParsed = textResult;
        }
    }


    $rootScope.getAcousticBrainzDataByMusixOneMbid = function() {
        getAcousticBrainzDataByMbid($rootScope.musixMbidOne, "Musix1");
    };

    $rootScope.getAcousticBrainzDataByMusixTwoMbid = function() {
        getAcousticBrainzDataByMbid($rootScope.musixMbidTwo, "Musix2");
    };


    $rootScope.getAcousticBrainzDataByBrainzQueryOneMbid = function() {
        getAcousticBrainzDataByMbid($rootScope.brainzQueryOneMbid, "Music Brainz Qry One");
    };

    $rootScope.getAcousticBrainzDataByBrainzQueryTwoMbid = function() {
        getAcousticBrainzDataByMbid($rootScope.brainzQueryTwoMbid, "Music Brainz Qry Two");
    };



    // http://acousticbrainz.org/api/v1/1a13c710-4b7e-4701-8968-cd61f2e58110/high-level
    function getAcousticBrainzDataByMbid(mbid, byStr) {
        var textResult = "";
        textResult += "By: ";
        textResult += byStr;
        textResult += "\n";

        if (angular.isUndefined(mbid) || mbid === '') {
            textResult = "NO MBID";
            $rootScope.brainzResultParsed = textResult;
            return;
        } else {
            var url = "";
            url += ACOUSTIC_BRAINZ_REQ_PREFIX;
            url += mbid;
            url += "/high-level";
            $http.get(url).
                then(function (response) {
                    $rootScope.acousticBrainzData = response.data;
                    parseAcousticBrainzResult(textResult);
                });

        }

    }

    function parseAcousticBrainzResult(textResult) {

        dataToParse = $rootScope.acousticBrainzData;

        $rootScope.acousticBrainzWithData = false;
        if (angular.isUndefined(dataToParse) || dataToParse === '') {

            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.highlevel) || dataToParse.highlevel === '' ||
            angular.isUndefined(dataToParse.metadata) || dataToParse.metadata === '') {
            textResult = "Error in Result - no highlevel or metadata";
        } else {
            $rootScope.acousticBrainzWithData = true;
            textResult += "------------------------";

            textResult += "\nGENRES: \n";

            //main genre
            

            if (!angular.isUndefined(dataToParse.metadata.tags.genre) && dataToParse.metadata.tags.genre.length !== 0) {
                textResult += dataToParse.metadata.tags.genre[0];
                textResult += "\n";
            }
            

            var highLevelData = dataToParse.highlevel;
            
            //danceability
            // textResult += "G_Danceability: \n";
            textResult += highLevelData.danceability.value + ": ";
            textResult += Math.round(highLevelData.danceability.probability * 100);
            textResult += "\n";

            // genre_dortmund 
            // textResult += "G_Dortmund : \n";
            textResult += convertBrainzGenreName(highLevelData.genre_dortmund.value) + ": ";
            textResult += Math.round(highLevelData.genre_dortmund.probability * 100);
            textResult += "\n";

             // genre_electronic 
            //  textResult += "G_Electronic : \n";
             textResult += highLevelData.genre_electronic.value + ": ";
             textResult += Math.round(highLevelData.genre_electronic.probability * 100);
             textResult += "\n";

             //genre_rosamerica
            //  textResult += "G_Rosamerica : \n";
             textResult += convertBrainzGenreName(highLevelData.genre_rosamerica.value) + ": ";
             textResult += Math.round(highLevelData.genre_rosamerica.probability * 100);
             textResult += "\n";

             //genre_tzanetakis
            //  textResult += "G_Tzanetakis : \n";
             textResult += convertBrainzGenreName(highLevelData.genre_tzanetakis.value) + ": ";
             textResult += Math.round(highLevelData.genre_tzanetakis.probability * 100);
             textResult += "\n";
             
             textResult += "\n";
             textResult += "MOODS: \n";

            //mood_acoustic
            // textResult += "M_Acoustic: \n";
            textResult += highLevelData.mood_acoustic.value + ": ";
            textResult += Math.round(highLevelData.mood_acoustic.probability * 100);
            textResult += "\n";

            //mood_aggressive
            // textResult += "M_Aggressive: \n";
            textResult += highLevelData.mood_aggressive.value + ": ";
            textResult += Math.round(highLevelData.mood_aggressive.probability * 100);
            textResult += "\n";

            //mood_electronic
            // textResult += "M_Electronic: \n";
            textResult += highLevelData.mood_electronic.value + ": ";
            textResult += Math.round(highLevelData.mood_electronic.probability * 100);
            textResult += "\n";

            //mood_happy
            // textResult += "M_Happy: \n";
            textResult += highLevelData.mood_happy.value + ": ";
            textResult += Math.round(highLevelData.mood_happy.probability * 100);
            textResult += "\n";
            
            //mood_party
            // textResult += "M_Party: \n";
            textResult += highLevelData.mood_party.value + ": ";
            textResult += Math.round(highLevelData.mood_party.probability * 100);
            textResult += "\n";
            
            //mood_relaxed
            // textResult += "M_Relaxed: \n";
            textResult += highLevelData.mood_relaxed.value + ": ";
            textResult += Math.round(highLevelData.mood_relaxed.probability * 100);
            textResult += "\n";
            
            //mood_sad
            // textResult += "M_Sad: \n";
            textResult += highLevelData.mood_sad.value + ": ";
            textResult += Math.round(highLevelData.mood_sad.probability * 100);
            textResult += "\n";
            
            // OUT:
            //ismir04_rhythm
            // gender
            // moods_mirex
            // timbre
            // tonal_atonal
            // voice_instrumental
            
            textResult += "------------------------ \n";
            
                        // Additional data
                        // showing only if above 10 precent

            textResult += "\nMORE GENRES: \n";
            // genre_dortmund 
            // textResult += "G_dortmund : \n";
            textResult += addMoreGenresToString(highLevelData.genre_dortmund);

            // genre_electronic 
            // textResult += "G_electronic  : \n";
            textResult += addMoreGenresToString(highLevelData.genre_electronic);

            // genre_rosamerica 
            // textResult += "G_rosamerica : \n";
            textResult += addMoreGenresToString(highLevelData.genre_rosamerica);
 
            // genre_tzanetakis 
            // textResult += "G_tzanetakis : \n";
            textResult += addMoreGenresToString(highLevelData.genre_tzanetakis);
            

        }
        //TODO parse all high level

        $rootScope.brainzResultParsed = textResult;


        //rYEDA3JcQqw

    }


    function addMoreGenresToString(genresObject) {
        var allGenres = genresObject.all;
        var mainGenre = genresObject.value;
        var resStr = "";
        for (var genre in allGenres) {
            var currentGenreValue = allGenres[genre];
            var currentGenreValueFormatted = Math.round(currentGenreValue * 100);
            if (genre !== mainGenre && currentGenreValueFormatted > 10) {
                resStr += convertBrainzGenreName(genre) + ": ";
                resStr += Math.round(currentGenreValueFormatted);
                resStr += "\n";
            }
        }
        resStr += "\n";
        return resStr;
    }

    function convertBrainzGenreName(shortName) {
        switch (shortName) {
            case "cla":
                return "classical";
            case "dan":
                return "dance";
            case "hip":
                return "hip-hop";
            case "jaz":
                return "jazz";
            case "dan":
                return "classical";
            case "rhy":
                return "R&B";
            case "roc":
                return "rock";
            case "spe":
                return "speech";
            case "cou":
                return "country";
            case "dan":
                return "classical";
            case "dis":
                return "disco";
            case "met":
                return "metal";
            case "reg":
                return "reggae";
            case "folkcountry":
                return "folk/country";
            case "funksoulrnb":
                return "funk/soul/rnb";
            case "raphiphop":
                return "rap/hip hop";
            case "blu":
                return "blues";
            default:
                return shortName;
        }
    }


    // EXMPLAE:
    // https://api.discogs.com/database/search?per_page=10&page=1&key=yRRYrVyDLpIeNaGgKMJR&secret=kaTeeDorKwsemjQopZyPsGbloNcoJotb&release_title=swalla&artist=Jason%20Derulo

    $rootScope.getDiscogsData = function () {
        var url = "";
        url += DISCOGS_REQ_PREFIX;
        url += "key=";
        url += DISCOGS_API_KEY;
        url += "&secret=";
        url += DISCOGS_API_TOKEN;
        url += "&per_page=2&page=1";
        url += "&artist=";
        url += $rootScope.song.artistAPI;
        url += "&release_title=";
        url += $rootScope.song.songNameAPI;
        $http.get(url).
            then(function (response) {
                $rootScope.discogsRes = response.data;
                parseDiscogsReqResult();
            });
    };

    function parseDiscogsReqResult() {

        dataToParse = $rootScope.discogsRes;

        var textResult = "";

        if (angular.isUndefined(dataToParse) || dataToParse === '') {
            textResult = "No API Result";
        } else if (angular.isUndefined(dataToParse.results) || dataToParse.results === '') {
            textResult = "Error in Result - no results tag";
        } else {
            var resultsArr = dataToParse.results;
            var genresStrPre = "GENRES: \n";
            var stylesStrPre = "\nSTYLES: \n";
            var genresStr = "";
            var stylesStr = "";
            for (var i = 0; i < resultsArr.length; i++) {
                var currentSong = resultsArr[i];
                if (!angular.isUndefined(currentSong.genre)) {
                    var genresArr = currentSong.genre;
                    for (var j = 0; j < genresArr.length; j++) {
                        currentGenre = genresArr[j];
                        if (!genresStr.includes(currentGenre)) {
                            genresStr += currentGenre;
                            genresStr += "\n";
                        }
                    }
                }
                if (!angular.isUndefined(currentSong.style)) {
                    var styleArr = currentSong.style;
                    for (var k = 0; k < styleArr.length; k++) {
                        currentStyle = styleArr[k];
                        if (!stylesStr.includes(currentStyle)) {
                            stylesStr += currentStyle;
                            stylesStr += "\n";
                        }
                    }
                }
            }
            genresStr = genresStr !== "" ? genresStr : "NO GENRES DATA";
            stylesStr = stylesStr !== "" ? stylesStr : "NO STYLES DATA";
            textResult += genresStrPre + genresStr + stylesStrPre + stylesStr;
        }
        $rootScope.discogsResultParsed = textResult;
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

            newSong.y = currentSong.misc.year;
            newSong.w = getArrOfArtwork(currentSong.misc.artwork);
            newSong.d = currentSong.misc.duration;

            var currentTagging = currentSong.tagging;
            newSong.t = {};
            newSong.t.n = convertBooleanToNum(currentTagging.new);
            newSong.t.h = convertBooleanToNum(currentTagging.hit);
            newSong.t.t = convertBooleanToNum(currentTagging.trending);
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

            newSong.misc = {};

            newSong.misc.year = currentSong.y;
            newSong.misc.artwork = getUrlOfWork(currentSong.w);
            newSong.misc.duration = currentSong.d;

            var currentTagging = currentSong.t;
            newSong.tagging = {};
            newSong.tagging.new = convertNumToBoolean(currentTagging.n);
            newSong.tagging.hit = convertNumToBoolean(currentTagging.h);
            newSong.tagging.trending = convertNumToBoolean(currentTagging.t);

            rawSongsList[i] = newSong;
        }
        var fromShrinkToRaw = JSON.stringify(rawSongsList);
        console.log(fromShrinkToRaw);
        $rootScope.fromShrinkToRaw = fromShrinkToRaw;

    }

    function getUrlOfWork(artworkArr) {
        //TODO fallback
        return "http://is" + artworkArr[0] + ".mzstatic.com/image/thumb/Music" + artworkArr[1] + "/v" + artworkArr[2] + "/" + artworkArr[3] + "/"  + artworkArr[4] + "/"   + artworkArr[5] + "/" + artworkArr[6] + "/source/60x60bb.jpg" ;
    }

    function convertBooleanToNum(booleanVal) {
        return booleanVal ? 1 : 0;
    }

    function convertNumToBoolean(booleanVal) {
        return booleanVal ? true : false;
    }

    /// Test

    $rootScope.runAllTests = function () {
        checkDuplicatesIds();
        checkDuplicatesSongNames();
        checkSongsListIndexes();
        checkBadSongNames();
    };

    function checkDuplicatesIds() {
        $rootScope.duplicatesIdsStatus = true;
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
            $rootScope.duplicatesIdsStatus = false;
        }
    }

    function checkDuplicatesSongNames() {
        $rootScope.duplicatesSongNamesStatus = true;
        var songsData = $rootScope.songsShrink;
        var songsNames = songsData.map(function (songObj) {
            return songObj.s;
        }).filter(function(songName) {
            return duplicatesSongNames.indexOf(songName) == -1;
        });
        var sortedSongsNames = songsNames.slice().sort();
        var duplicatesArr = [];
        for (var i = 0; i < songsNames.length - 1; i++) {
            if (sortedSongsNames[i + 1] == sortedSongsNames[i]) {
                duplicatesArr.push(sortedSongsNames[i]);
                console.log(sortedSongsNames[i]);
            }
        }
        if (duplicatesArr.length !== 0) {
            $rootScope.duplicatesSongNamesStatus = false;
        }
    }

    function checkSongsListIndexes() {
        $rootScope.songsListIndexesStatus = true;
        var rawSongList = $rootScope.songsRaw;
        for (var i = 0; i < rawSongList.length; i++) {
            var currentSong = rawSongList[i];
            if (currentSong.index !== i) {
                console.log("currentSong.index: " + currentSong.index);
                $rootScope.songsListIndexesStatus = false;
                // /we dont return - we eant to check all foo console
            }
        }
    }

    

    $rootScope.getSongsListIndexesTestResult = function () {
        if (angular.isDefined($rootScope.songsListIndexesStatus)) {
            if ($rootScope.songsListIndexesStatus) {
                return "PASS";
            } else {
                return "FAIL";
            }
        }
        return "CLICK ON RUN TEST";
    };


    function checkBadSongNames() {
        $rootScope.badSongsNameStatus = true;
        var shrinkSongList = $rootScope.songsShrink;
        for (var i = 0; i < shrinkSongList.length; i++) {
            var currentSong = shrinkSongList[i];
            if (currentSong.s.toLowerCase().indexOf("official") != -1 ||  currentSong.s.toLowerCase().indexOf("audio") != -1 ) {
                console.log(currentSong.s);
                $rootScope.badSongsNameStatus = false;
                return;
            }
        }
    }

    $rootScope.getSongsBadNamesTestResult = function () {
        if (angular.isDefined($rootScope.badSongsNameStatus)) {
            if ($rootScope.badSongsNameStatus) {
                return "PASS";
            } else {
                return "FAIL";
            }
        }
        return "CLICK ON RUN TEST";
    };



    

    $rootScope.getDuplicatesIdsTestResult = function () {
        if (angular.isDefined($rootScope.duplicatesIdsStatus)) {
            if ($rootScope.duplicatesIdsStatus) {
                return "PASS";
            } else {
                return "FAIL";
            }
        }
        return "CLICK ON RUN TEST";
    };


    $rootScope.getDuplicatesSongNamesTestResult = function () {
        if (angular.isDefined($rootScope.duplicatesSongNamesStatus)) {
            if ($rootScope.duplicatesSongNamesStatus) {
                return "PASS";
            } else {
                return "FAIL";
            }
        }
        return "CLICK ON RUN TEST";
    };

    

    //// Statistics

    $rootScope.createMapOfGenresDataStat = function () {
        var genresStatData = calculateGenresStatData();

        $rootScope.allGenresStat = [];
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var currentGenre = newMapOfGenres[i];
            var currentGenreStat = {};
            currentGenreStat.name = currentGenre;
            currentGenreStat.weight = genresStatData[i];
            $rootScope.allGenresStat[i] = currentGenreStat;
        }
        calculateTaggingStatData();
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

    function calculateTaggingStatData() {
        var songsData = $rootScope.songsRaw;
        var newCount = 0;
        var hitCount = 0;
        var trendingCount = 0;
        for (var i = 0; i < songsData.length; i++) {
            var currentSongtaggingData = songsData[i].tagging;
            if (currentSongtaggingData.new) {
                newCount++;
            }
            if (currentSongtaggingData.hit) {
                hitCount++;
            }
            if (currentSongtaggingData.trending) {
                trendingCount++;
            }
        }
        $rootScope.songStat = {};
        $rootScope.songStat.numOfNew = newCount;
        $rootScope.songStat.numOfHit = hitCount;
        $rootScope.songStat.numOfTrending = trendingCount;

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
        var fixedSongsList = JSON.stringify(newRawSongList);
        console.log(fixedSongsList);
        $rootScope.fixedSongsList = fixedSongsList;
    };


    $rootScope.fixSongListTagging = function () {
        var rawSongList = $rootScope.songsRaw;
        var newRawSongList = [];
        for (var i = 0; i < rawSongList.length; i++) {
            var currentSong = rawSongList[i];
            currentSong.tagging = {};
            currentSong.tagging.new = false;
            currentSong.tagging.hit = false;
            currentSong.tagging.trending = false;
            newRawSongList[i] = currentSong;
        }

        var fixedSongsList = JSON.stringify(newRawSongList);
        console.log(fixedSongsList);
        $rootScope.fixedSongsList = fixedSongsList;
    };


    $rootScope.fixSongListIndexes = function () {
        var rawSongList = $rootScope.songsRaw;
        var newRawSongList = [];
        for (var i = 0; i < rawSongList.length; i++) {
            var currentSong = rawSongList[i];
            currentSong.index = i;
            newRawSongList[i] = currentSong;
        }
        var fixedSongsList = JSON.stringify(newRawSongList);
        console.log(fixedSongsList);
        $rootScope.fixedSongsList = fixedSongsList;
    };


    /// FIX SONGS

    $rootScope.runningSongIndexFromList = 46;




    $rootScope.loadSongFromList = function () {
        $rootScope.isFixingSongsFlow = true;
        var rawSongList = $rootScope.songsRaw;
        var currentSong = rawSongList[$rootScope.runningSongIndexFromList];
        $rootScope.song.id = currentSong.id;
        for (var i = 0; i < newMapOfGenres.length; i++) {
            $rootScope.song.songGenres[i] = currentSong.genreWeights[newMapOfGenres[i]];
            $rootScope.song.exisitArtist = currentSong.details.artist;
            $rootScope.song.exisitSongName = currentSong.details.songName;
        }
        $rootScope.getSongNameAndParseFullTitle();
    };


    // Update Tagging


    $rootScope.updateTagging = function () {
        $rootScope.updatedRawSongList = "";
        var rawSongList = $rootScope.songsRaw;
        // rawSongList = rawSongList.slice(0,SONG_COUNT);
        var newRawSongList = [];
        angular.forEach(rawSongList, function (song) {
            updateCurrentSong(song, newRawSongList);
        });
        console.log(JSON.stringify(newRawSongList));
    };

    function updateCurrentSong(currentSong, newRawSongList) {

        sleepFor(200);

        var i = currentSong.index;
        currentSong.tagging = {};
        var songId = currentSong.id;
        var youTubeData;
        var url = "https://www.googleapis.com/youtube/v3/videos?";
        url += "id=";
        url += songId;
        url += "&part=snippet, statistics";
        url += "&key=AIzaSyA14y8xNuOkVU-G4GzdOM2H7vmJ78becgA";
        $http.get(url).
            then(function (response) {
                youTubeData = response.data;

                currentSong.tagging.new = isSongNew(youTubeData);
                currentSong.tagging.hit = isSongHit(youTubeData, currentSong);
                currentSong.tagging.trending = isSongTrending(youTubeData, currentSong);
                newRawSongList[i] = currentSong;

                if (newRawSongList.length === $rootScope.songsRaw.length && validateUpdatedRawSongList(newRawSongList)) {
                    // if (newRawSongList.length === SONG_COUNT && validateUpdatedRawSongList(newRawSongList) ) {
                    var newRawSongListStr = JSON.stringify(newRawSongList);
                    $rootScope.updatedRawSongList = newRawSongListStr;
                    console.log(newRawSongListStr);
                }
            });

    }

    function validateUpdatedRawSongList(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'undefined') {
                return false;
            }
        }
        return true;
    }

    function isSongNew(youTubeData) {
        if (isYouTubeDataValid(youTubeData)) {
            var diffDays = getDiffDaysOfSongDate(youTubeData);
            return diffDays < DIFF_DAYS_NEW_THRESHOLD; //200
        }
        return false;
    }

    function getDiffDaysOfSongDate(youTubeData) {
        var publishDateRawStr = youTubeData.items[0].snippet.publishedAt;
        var publishDateStr = publishDateRawStr.substring(0, 10).trim();
        var publishDate = new Date(publishDateStr);
        var currentDate = new Date();
        var timeDiff = currentDate.getTime() - publishDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    function isSongHit(youTubeData, currentSong) {
        if (isYouTubeDataValid(youTubeData)) {
            var viewCount = getYouTubeViewCount(youTubeData);
            var normalizedViewCount = calculateNormalizedViewCount(viewCount, currentSong);
            return normalizedViewCount > VIEW_COUNT_HIT_NORMALIZED_THRESHOLD; //100000000;
        }
        return false;
    }

    function isSongTrending(youTubeData, currentSong) {
        if (isYouTubeDataValid(youTubeData)) {
            var diffDays = getDiffDaysOfSongDate(youTubeData);
            if (diffDays < DIFF_DAYS_TRENDING_THRESHOLD) {
                var viewCount = getYouTubeViewCount(youTubeData);
                var normalizedViewCountInMil = calculateNormalizedViewCount(viewCount, currentSong);
                var trendingFactor = normalizedViewCountInMil / diffDays;
                return trendingFactor >= TRENDING_FACTOR_THRESHOLD;
            }
        }
        return false;
    }

    function calculateNormalizedViewCount(viewCount, currentSong) {
        var currentSongGenresCount = 0;
        var sumOfHitsFactor = 0;
        var avgHitsFactor = 0;
        var currentSongGenres = currentSong.genreWeights;
        for (var i = 0; i < newMapOfGenres.length; i++) {
            var currentGenre = newMapOfGenres[i];
            var currentGenreWeight = currentSongGenres[currentGenre];
            if (currentGenreWeight > 0) {
                currentSongGenresCount++;
                var currentGenreNormalized = currentGenreWeight / 5;
                var genreHitFactor = mapOfHitFactors[i];
                sumOfHitsFactor += genreHitFactor * currentGenreNormalized;
            }
        }
        avgHitsFactor = currentSongGenresCount > 0 ? sumOfHitsFactor / currentSongGenresCount : sumOfHitsFactor;
        return avgHitsFactor * viewCount;
    }

    function getYouTubeViewCount(youTubeData) {
        return youTubeData.items[0].statistics.viewCount;
    }

    function isYouTubeDataValid(youTubeData) {
        dataToParse = $rootScope.YTSongResult;
        if (angular.isUndefined(youTubeData) || youTubeData === '') {
            console.error("No YT Result");
            return false;
        } else if (angular.isUndefined(youTubeData.items) || youTubeData.items === '') {
            console.error("Error in Result - no items");
            return false;
        } else if (youTubeData.items.length === 0) {
            console.error("No Results results");
            return false;
        } else if (youTubeData.items.length > 1) {
            console.error("Too many results");
            return false;
        } else if (angular.isUndefined(youTubeData.items[0].snippet) || youTubeData.items[0].snippet === '') {
            console.error("Error in Result - no snippet");
            return false;
        } else {
            return true;
        }
    }



    // UTILS

    function sleepFor(sleepDuration) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
    }

    function getSongGenresCount(currentSong) {
        var currentSongGenres = currentSong.genreWeights;
        var count = 0;
        for (var i = 0; i < currentSongGenres.length; i++) {
            if (currentSongGenres[i] > 0) {
                count++;
            }
        }
        return count;
    }

}


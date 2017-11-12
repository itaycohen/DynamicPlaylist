angular
    .module('dpSongsListLogic', [])
    .factory('dpSongsListLogic', dpSongsListLogic);

dpSongsListLogic.$inject = ['$rootScope', 'dpSongsListUtils', '$location'];

function dpSongsListLogic($rootScope, dpSongsListUtils, $location) {

    var FAKE_GENRE_WEIGHT = 2.5;
    var DEFAULT_WEIGHT = 3;
    // var allGenresNames = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];
    // var allGenresNames = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "R&B", "Rock", "Soul"];
    // var allGenresNames = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Rock", "Soul", "Trance"];
    var allGenresNames = ["Alternative", "Chill Out", "Country", "Dance", "Folk", "Funk", "Hip-Hop", "Indie", "Latin", "Love", "Metal", "Pop", "Punk", "R&B", "Rap", "Reggae", "Reggaeton", "Rock", "Soul", "Trance"];
    var allTagsNames = ["New", "Hit", "Trending"];

    var defaultGenresMap = [3, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, 4, -1, -1, -1, -1, -1, -1, -1, -1];
    var LOCAL_STORAGE_GENRES_KEY = 'mm-data-genres';

    var defaultTagsMap = [0, 0, 0]; // new, hit, trending
    var LOCAL_STORAGE_TAGS_KEY = 'mm-data-tags';

    var LOCAL_STORAGE_GENRES_AND_TAGS_KEY = 'mm-data-genrestags';

    var VIDEO_ID_PARAM = "v";
    var MAXIMUM_GENRES = 5;
    



    var service = {
        initCalcSongsList: initCalcSongsList,
        initUserData: initUserData,
        // TODO - think what to do with these 3
        getSongsIndexesList: getSongsIndexesList,
        getUserGenresNames: getUserGenresNames,
        setSelectedGenresByNames: setSelectedGenresByNames,
        getWeightOfGenre: getWeightOfGenre,
        getTagStateByName: getTagStateByName,
        geAllGenresNames: geAllGenresNames,
        popSongIndexFromListAndUpdate: popSongIndexFromListAndUpdate,
        getNextSongId: getNextSongId,
        updateGenreWeightsDistancesList: updateGenreWeightsDistancesList,
        updateGenreWeightsDistancesListByCurrentWidget: updateGenreWeightsDistancesListByCurrentWidget,
        updateSongIndexesListByTagIfNeeded : updateSongIndexesListByTagIfNeeded,
        getCurrentPlayingSongIndex: getCurrentPlayingSongIndex,
        updateSongsIndexesList: updateSongsIndexesList,
        initUrlParams : initUrlParams,
        // move
        getSongNameByIndex: getSongNameByIndex,
        getSongArtistByIndex: getSongArtistByIndex,
        updateWeightDistanceFactor: updateWeightDistanceFactor,
        updateUserTagsMap : updateUserTagsMap,

        setNewUserGenresAndTagsData: setNewUserGenresAndTagsData
    };
    return service;

    //////////


    /** 								ALL LISTS - DOC
	// --------------------------------------------------------------------------
	// 1. songsList
	// 		Structure: { index, id, genreWeights {'Dance', 'Indie-Rock', 'Pop', 'R&B', 'Soul'} }  
	//		The original static songs list.
	// 		This list will never changed, order is fix.

	// 2. songIndexesList
	// 		Structure: {index}
	// 		The CURRENT SORTED songs' indexes .
	//		This list will be updated after each change in ranges.

	// 3. genreWeightsDistancesList
    // 		Structure: {index, avgDistance, genreWeightsDistance {'Dance', 'Indie-Rock', 'Pop', 'R&B', 'Soul' } }
    // 		New Structure: {index, avgDistance, genreWeightsDistance [distances] }
	// 		New Structure2: {index, score, genreWeightsDistance [distances] }
	// 		The calculated current genres weights ditances list - the absoulte distance between 
	//		 the original song genre weight and the curent genre range value.
	// 		This list values will be updated according to change in the ranged,
	//		BUT the order of it is fix.

	//4. alreadyPlayedSongIndexesListSingleCycle
	//		Structure: {index}
	//		This list containes the indexes of the alradey played songs in cycle
	// 		Will be updated after each song is played (and not in the end of the playing).

	//5. alreadyPlayedSongIndexesListFull
	//		Structure: {index}
	//		This list containes the indexes of the alradey played songs.
	// 		Will be updated after each song is played (and not in the end of the playing).
    */


    /**
     * Init the calculation of songs list methods
     */
    function initCalcSongsList() {
        initSongsIndexesList();
        updateWeightDistanceFactor();
        // init genres weights list
        initGenreWeightsDistancesList();
        initAlreadyPlayedSongsIndexes();

        //update the list according to the existing genre widgets
        updateGenreWeightsDistancesListByCurrentWidget();
        // PLACEHOLDER - this method should go over all the current widget (selectedGenre) and init the hidden ones to zero

        // init current song index
        initCurrentSongIndex();
    }

    function updateWeightDistanceFactor() {
        var factor;
        var count = 0;
        var userGenresMap = getUserGenresMap();
        for (var i = 0; i < userGenresMap.length; i++) {
            if (userGenresMap[i] > 0) {
                count++;
            }
        }
        switch (count) {
            case 1:
                factor = 6.5;
                break;
            case 2:
                factor = 7;
                break;
            case 3:
                factor = 9;
                break;
            case 4:
                factor = 10;
                break;
            case 5:
                factor = 11;
                break;
            default:
                factor = 7;
                break;
        }
        // 1 genre -> low
        // 4,5 genres -> high 
        // $rootScope.weightDistanceFactor = count >= 4 ? 15 : 5 - count;
        $rootScope.weightDistanceFactor = factor;

    }

    // TODO - can move to different service - user data service 
    function initUserData() {
        // initUserGenresData();
        // initUserTagsData();
        if (isUrlWithParams()) {
            // getting the genres and tags array of the given url video id
            var videoGenresAndTagsPairArr = getVideoGenresAndTagsPairArr(getUrlVideoId());
            // fix the genre arr  1. switch all zeros to -1
            //                    2.in case there are more than 5 genres
            var videoGenreArr = fixVideoGenreArr(videoGenresAndTagsPairArr[0]);
            var vidoeTagsArr = videoGenresAndTagsPairArr[1];
            initUserDataWithValues([videoGenreArr, vidoeTagsArr], true);
        } else {
            initUserDataWithValues([defaultGenresMap, defaultTagsMap], false);
        }
    }

            
    function fixVideoGenreArr(genresArr) {
        // counting genres weightes bigger than 0
        var countBiggerThanZero = 0;
        for (var i = 0; i < genresArr.length; i++) {
            var currentGenreWeight = genresArr[i];
            // replacing all the '0's to '-1's in order to remove the sliders
            if (currentGenreWeight === 0) {
                genresArr[i] = -1;
            }
            if (currentGenreWeight > 0) {
                countBiggerThanZero++;
            }
        }
        var gneresArrPairs = [];
        if (countBiggerThanZero > MAXIMUM_GENRES) {
            //mapping the genre arr to {index : weight}
            for (var j = 0; j < genresArr.length; j++) {
                var pair = {};
                // i is key name of song index, j is the index
                // g is key name for  genres
                pair = {i: j, g : genresArr[j]};
                gneresArrPairs[j] = pair;
            }
            // sorting this new arr
            gneresArrPairs.sort(function(genrePairA, genrePairB) {
                return genrePairA.g - genrePairB.g;
            });
            var fixGenresArr = Array.apply(null, Array(gneresArrPairs.length)).map(Number.prototype.valueOf,-1);
            for (var k = 0; k < 5; k++) {
                // getting the higheset pair in the arr and reducing by 1 each time
                topGenreArrPair = gneresArrPairs[gneresArrPairs.length - (k + 1)];
                fixGenresArr[topGenreArrPair.i] = topGenreArrPair.g;
            }
            return fixGenresArr;
        } else {
            return genresArr;
        }
    }


    /**
     * getting the genres and the tag (we dont use the tags) of a given vidoe id from URL
     *  we use the UrlVideoIdIndex that we already calculated before
     * we will get a pair of two arrays [videoGenreArr, vidoeTagsArr]
     */
    function getVideoGenresAndTagsPairArr(urlVideoId) {
        var genreAndTagsPair = [];
        var songList = $rootScope.rawSongsList;
        // the index of the videoId in the url
        var urlVideoIdIndex = getUrlVideoIdIndex();
        songDataByIndexOfUrl = songList[getUrlVideoIdIndex()];
        // checking for safety if the index in the array of all songs is the same as in the song data
        if (urlVideoIdIndex === songDataByIndexOfUrl.i) {
            return [songDataByIndexOfUrl.g, songDataByIndexOfUrl.t];
        } else {
            consolo.error("the index in the array of all songs is not the same as in the song data");
            for (var i; i < songList.length; i++) {
                var currentSongData = songList[i];
                if (currentSongData.id === urlVideoId) {
                    return [currentSongData.g, currentSongData.t];
                }
            }
        }
    }

    function initUserDataWithValues(genresAndTagsPairArr, isUrlWithParams) {
        //fallback if the user doesnt have localStorage
        $rootScope.userGenresMap = genresAndTagsPairArr[0];
        $rootScope.userTagsMap = genresAndTagsPairArr[1];

        // user browser supports in localStorage
        if (localStorage) {
            // TODO 
            // cleanHistoricDataStructure();
            //setting function for leaving the application
            // window.onbeforeunload = storeUserGenresData;

            // the user didnt have video id as url params - regular flow
            if (!isUrlWithParams) {
                // Retrieve the users data.
                var userGenresAndTagsDataStr = localStorage.getItem(LOCAL_STORAGE_GENRES_AND_TAGS_KEY);
                if (isObjectDefined(userGenresAndTagsDataStr)) {
                    var userGenresAndTagsDataObj;
                    try {
                        userGenresAndTagsDataObj = JSON.parse(userGenresAndTagsDataStr);
                        if (isValidUserGenresAndTagsDataObj(userGenresAndTagsDataObj)) {
                            $rootScope.userGenresMap = userGenresAndTagsDataObj.genres;
                            $rootScope.userTagsMap = userGenresAndTagsDataObj.tags;
                            return;
                        } else {
                            // thu user has the an old data structure of userData
                            setNewUserGenresAndTagsData();
                        }
                    } catch (e) {
                        console.error("Error: " + e + " | Unable to parse local storage data. value: " + userGenresAndTagsDataStr);
                    }
                    // doc else - userGenresMap = defaultGenresMap;
                } // doc else no user data setNewUserGenresData();
            }
            // 1. the user uses video id in url params -> need to store new data OR
            // 2. the user doesn't have the app data (mmData) - first login or clear cache 
            //    setting the default genres for the user data 
            setNewUserGenresAndTagsData();
        }         //doc else  // No support
        // $rootScope.userGenresMap = defaultGenresMap;
    }




    //TODO - unify 
    // function initUserGenresData() {
    //     //fallback if the user doesnt have localStorage
    //     $rootScope.userGenresMap = defaultGenresMap;

    //     // user browser supports in localStorage
    //     if (localStorage) {
    //         //setting function for leaving the application
    //         // window.onbeforeunload = storeUserGenresData;

    //         // Retrieve the users data.
    //         var userGenresData = localStorage.getItem(LOCAL_STORAGE_GENRES_KEY);
    //         if (isObjectDefined(userGenresData)) {
    //             var userGenresDataArr;
    //             try {
    //                 userGenresDataArr = JSON.parse(userGenresData);
    //                 if (isValidGenresData(userGenresDataArr)) {
    //                     $rootScope.userGenresMap = userGenresDataArr;
    //                     return;
    //                 } else {
    //                     // thu user has the an old data structure of userData
    //                     setNewUserGenresAndTagsData();
    //                 }
    //             } catch (e) {
    //                 console.error("Error: " + e + " | Unable to parse local storage data. value: " + userGenresData);
    //             }
    //             // doc else - userGenresMap = defaultGenresMap;
    //         } else { //the user doesn't have the app data (mmData) - first login or clear cache
    //             // setting the default genres for the user data 
    //             setNewUserGenresAndTagsData();
    //         }
    //     }
    //     //doc else  // No support
    //     // $rootScope.userGenresMap = defaultGenresMap;
    // }

    // function initUserTagsData() {
    //     //fallback if the user doesnt have localStorage
    //     $rootScope.userTagsMap = defaultTagsMap;

    //     // user browser supports in localStorage
    //     if (localStorage) {
    //         //setting function for leaving the application
    //         // window.onbeforeunload = setNewUserGenresAndTagsData;

    //         // Retrieve the users data.
    //         var userTagsData = localStorage.getItem(LOCAL_STORAGE_TAGS_KEY);
    //         if (isObjectDefined(userTagsData)) { // TODO isObjectDefined
    //         // if (typeof userTagsData !== 'undefined' && userTagsData != 'undefined' && userTagsData !== null) { // TODO isObjectDefined
    //             var userTagsDataArr;
    //             try {
    //                 userTagsDataArr = JSON.parse(userTagsData);
    //                 if (isValidTagsData(userTagsDataArr)) {
    //                     $rootScope.userTagsMap = userTagsDataArr;
    //                     return;
    //                 } else {
    //                     // thu user has the an old data structure of userData
    //                     setNewUserTagsData(); 
    //                 }
    //             } catch (e) {
    //                 console.error("Error: " + e + " | Unable to parse local storage data. value: " + userTagsData);
    //             }
    //             // doc else - userTagsMap = defaultTagsMap;
    //         } else { //the user doesn't have the app data (mmData) - first login or clear cache
    //             // setting the default tags for the user data 
    //             setNewUserTagsData();
    //         }
    //     }
    //     //doc else  // No support
    //     // $rootScope.userTagsMap = defaultTagsMap;
    // }



    function isValidUserGenresAndTagsDataObj(dataObj) {
        return isValidGenresData(dataObj.genres) && isValidTagsData(dataObj.tags);

    }

    function isValidGenresData(genresArr) {
        return genresArr.length === allGenresNames.length;
    }

    function isValidTagsData(tagsObj) {
        return  Object.keys(tagsObj).length === allTagsNames.length;
    }

    //TODO - change to this one
    // function storeUserDataByType(dataType) {
    //     var userDataToStore = {};
    //     var localStorageKey;
    //     if (dataType === "genres") {
    //         localStorageKey = LOCAL_STORAGE_GENRES_KEY;
    //         userDataToStore = JSON.stringify($rootScope.userGenresMap);
    //     } else if (dataType === "tags"){
    //         localStorageKey = LOCAL_STORAGE_GENRES_KEY;
    //         userDataToStore = JSON.stringify($rootScope.userTagsMap);
    //     }
    //     try {
    //         localStorage.setItem(localStorageKey, userDataToStore);
    //     }
    //     catch (e) {
    //         console.error("Error: " + e + " | Unable to set item to local storage data");
    //     }
    // }

    // function storeUserGenresData() {
    //     var userGenresDataToStore = JSON.stringify($rootScope.userGenresMap);
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_GENRES_KEY, userGenresDataToStore);
    //     }
    //     catch (e) {
    //         console.error("Error: " + e + " | Unable to set genre map item to local storage data");
    //     }
    // }

    // function storeUserTagsData() {
    //     var userTagsDataToStore = JSON.stringify($rootScope.userTagsMap);
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, userTagsDataToStore);
    //     }
    //     catch (e) {
    //         console.error("Error: " + e + " | Unable to set tags map item to local storage data");
    //     }
    // }

    //TODO - replace
    // function setNewUserDataByType(dataType) {
    //     var localStorageKey;
    //     var newUserDataToStore = {};
    //     if (dataType === "genres") {
    //         $rootScope.userGenresMap = defaultGenresMap;
    //         localStorageKey = LOCAL_STORAGE_GENRES_KEY;
    //         newUserDataToStore = JSON.stringify(defaultGenresMap);
    //     } else if (dataType === "tags"){
    //         $rootScope.userTagsMap = defaultTagsMap;
    //         localStorageKey = LOCAL_STORAGE_GENRES_KEY;
    //         newUserDataToStore = JSON.stringify(defaultTagsMap);
    //     }
    //     try {
    //         localStorage.setItem(localStorageKey, newUserDataToStore);
    //     }
    //     catch (e) {
    //         console.error("Error: " + e + " | Unable to set item to local storage data");
    //     }
    //     return;
    // }


    function setNewUserGenresAndTagsData() {
        var newUserGenreAndTagsData = {};
        newUserGenreAndTagsData.genres = $rootScope.userGenresMap;
        newUserGenreAndTagsData.tags = $rootScope.userTagsMap;
        try {
            localStorage.setItem(LOCAL_STORAGE_GENRES_AND_TAGS_KEY, JSON.stringify(newUserGenreAndTagsData));
        }
        catch (e) {
            console.error("Error: " + e + " | Unable to set item to local storage data");
        }
        return;
    }

    // function setNewUserTagsData() {
    //     $rootScope.userTagsMap = defaultTagsMap;
    //     var newUserTagsData = {};
    //     newUserTagsData = JSON.stringify(defaultTagsMap);
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, newUserTagsData);
    //     }
    //     catch (e) {
    //         console.error("Error: " + e + " | Unable to set item to local storage data");
    //     }
    //     return;
    // }


    function getSongsIndexesList() {
        return $rootScope.songsIndexesList;
    }

    /**
     * Init & Create the songs indexes list
     * Smart list will contain only indexes of Songs
     *  rawSongsList --> songsIndexesList 
     */
    function initSongsIndexesList() {
        var lengthOfRawSongsList = $rootScope.rawSongsList.length;
        // create songListIndexes - only the indexes of the songes 
        var songsListIndexes = Array.apply(null, { length: lengthOfRawSongsList }).map(Number.call, Number);
        // dpSongsListUtils.shuffle(songsListIndexes);
        $rootScope.songsIndexesList = songsListIndexes;
    }

    // createGenreWeightsDistancesList
    // structure:
    // index: i  / avgDistance: dis / genreWeightsDistance: {dance:x, pop: y ...}
    // new structure:
    // index: i  / avgDistance: dis / genreWeightsDistance: []
    // new structure 2:
    // index: i  / score: score / genreWeightsDistance: []
    function initGenreWeightsDistancesList() {
        var arr = [];
        var rawSongsList = $rootScope.rawSongsList;
        var len = rawSongsList.length;
        var userGenresMap = getUserGenresMap();
        for (var i = 0; i < len; i++) {

            var currentSong = rawSongsList[i];
            var currentSongWeights = currentSong.g;
            // var avgDistance = calculateAvgDistance(currentSongWeights/*, true*/);
            var songScore = calculateSongScore(currentSongWeights, userGenresMap/*, true*/);

            // var genreWeightsDistanceMap = buildGenreWeightsDistance(currentSongWeights);

            arr.push({
                index: i,
                score: songScore,
                // genreWeightsDistance: genreWeightsDistanceMap
            });
        }

        $rootScope.genreWeightsDistancesList = arr;
    }

    function initAlreadyPlayedSongsIndexes() {
        $rootScope.alreadyPlayedSongsIndexesListSingleCycle = [];
    }

    function calculateSongScore(songWeights, userGenresMap/*, isInitialCreation*/) {
        var calculatedCurrentScore = 0,
            totalScore = 0;
        var sumOfGenresBiggerThanZero = calculateSumOfGenresBiggerThanZero(songWeights);
        for (var i = 0; i < userGenresMap.length; i++) {
            var currentGenreWeight = userGenresMap[i];
            var currentSongWeight = songWeights[i];
            if (currentGenreWeight > 0 && currentSongWeight > 0) {
                calculatedCurrentScore = Math.pow(5 - Math.abs(currentGenreWeight - currentSongWeight), 2);
                var relativeScoreFactor = sumOfGenresBiggerThanZero > 0 ? currentSongWeight / sumOfGenresBiggerThanZero : 1;

                totalScore += currentGenreWeight === currentSongWeight ?
                    (calculatedCurrentScore + 10) * relativeScoreFactor : calculatedCurrentScore * relativeScoreFactor;
            } else if ((currentGenreWeight === 0 || currentGenreWeight === -1) && currentSongWeight === 0) {
                //increase total score by one for each 'zero match'
                totalScore += 0.25;
            } else if (currentGenreWeight === 0 || currentSongWeight === 0) {
                // one of the weights is zero (and the other is more than it) -> need to reduce total score
                calculatedCurrentScore = 5 - Math.abs(currentGenreWeight - currentSongWeight);
                totalScore -= calculatedCurrentScore;
            }
        }
        return Math.round(totalScore * 100) / 100;
    }

    function calculateSumOfGenresBiggerThanZero(songWeights) {
        var sum = 0;
        for (var i = 0; i < songWeights.length; i++) {
            var currentGenreWeight = songWeights[i];
            if (currentGenreWeight> 0) {
                sum += currentGenreWeight;
            }
        }
        return sum;
    }

    // TODO - consider move ti utils
    function getGenreWeightFromFakeMiddle(genreWeight) {
        return Math.abs(genreWeight - FAKE_GENRE_WEIGHT);
    }

    //pop song for the application loading
    function initCurrentSongIndex() {
        if (isUrlWithParams()) {
            // the url has params, need to check if the song exists 
            var urlVideoIdIndex = getUrlVideoIdIndex();
            if (urlVideoIdIndex !== -1) {
                // false because this 'pop' was not excuted by action
                // urlVideoIdIndex - we have the index that we want to play (from url video id)
                popSongIndexFromListAndUpdate(false, urlVideoIdIndex);
            }
        } else {
            // false because this 'pop' was not excuted by action
            popSongIndexFromListAndUpdate(false);
        }
    }

    // pop song from list and update alreadyPlayedSongsIndexesListSingleCycle
    function popSongIndexFromListAndUpdate(byAction, indexOfSong) {

        var orderOfSong;
        var songIndex;

        // regular play (auto)
        if (angular.isUndefined(indexOfSong)) {
            orderOfSong = 0;
            // get the first song index in list
            songIndex = $rootScope.songsIndexesList[0];
        } else { // play by pressing on song on playlist OR play by url params 
            orderOfSong = $rootScope.songsIndexesList.indexOf(indexOfSong);
            songIndex = indexOfSong;
        }

        //TODO change url to video id
        
        // update currentPlayingSongIndex
        $rootScope.currentPlayingSongIndex = songIndex;

        // remove songIndex out from songsIndexesList
        var removedSongsIndexes;
        var spliceStartIndex;
        if (isPlayByUrlParams(byAction, indexOfSong)) {
            // taking put the songIndex from the array
            removedSongsIndexes = $rootScope.songsIndexesList.splice(orderOfSong, 1);
        } else {
            // cut orderOfSong=numberOf elements from the array from index 0 
            removedSongsIndexes = $rootScope.songsIndexesList.splice(0, orderOfSong + 1);
        }

        var i, len, playedSongIndex;
        for (i = 0, len = removedSongsIndexes.length; i < len; i++) {
            // note: this index can be of song that was skipped by click on other song play button
            playedSongIndex = removedSongsIndexes[i];
            // insert to alreadyPlayedSongsIndexesListSingleCycle
            $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(playedSongIndex);
        }

        updateSongsIndexesList();

        if (!byAction) {
            $rootScope.$apply();
        }
    }

    function isPlayByUrlParams(byAction, indexOfSong) {
        return !byAction && angular.isDefined(indexOfSong);
    }

    // update the songs indexes list after change in genre weights 
    // sort it by avgDistance
    //TODO - break to sub methods
    // TODO - check number of calls - check cal lstack - on update genres weight - 
    // check if we can call this function only one time in the end
    function updateSongsIndexesList() {

        var rawGenreWeightsDistancesList = $rootScope.genreWeightsDistancesList.slice();

        //filter rawGenreWeightsDistancesList by tags
        rawGenreWeightsDistancesList = filterRawGenreWeightsDistancesListByTags(rawGenreWeightsDistancesList);

        // array for genre weights distances OBJECTS that are smaller or equal to WeightDistanceFactor
        var lowerGenreWeightDistancesListToSort = [];
        // // array for genre weights distances INDEXES that are bigger than WeightDistanceFactor
        var biggerGenreWeightDistancesIndexesToNotSort = [];
        // splitting the rawGenreWeightsDistancesList to 2 arrays 
        for (var i = 0; i < rawGenreWeightsDistancesList.length; i++) {
            var currentGenreWeightDistance = rawGenreWeightsDistancesList[i];
            if (currentGenreWeightDistance.score < getWeightDistanceFactor()) {
                biggerGenreWeightDistancesIndexesToNotSort.push(currentGenreWeightDistance.index);
            } else {
                lowerGenreWeightDistancesListToSort.push(currentGenreWeightDistance);
            }
        }
        // console.log("length of lowerGenreWeightDistancesListToSort: " + lowerGenreWeightDistancesListToSort.length);
        // handle case when lowerGenreWeightDistancesListToSort length is lower than 10
        //// BUG - songs are withput order
        var lowerGenreWeightDistancesListToSortLen = lowerGenreWeightDistancesListToSort.length;
        if (lowerGenreWeightDistancesListToSortLen <= 10) {
            var lowerGenreWeightDistancesListToSortFallback = [];
            for (var k = 0; k < rawGenreWeightsDistancesList.length; k++) {
                var currentGenreWeightDistanceFallback = rawGenreWeightsDistancesList[k];
                lowerGenreWeightDistancesListToSortFallback.push(currentGenreWeightDistanceFallback);
            }
            lowerGenreWeightDistancesListToSort = lowerGenreWeightDistancesListToSortFallback;
        }
        // if we've played all the lowerGenreWeightDistances songs (+1 first random song) we would like to init
        // 	the alreadyPlayedSongsIndexesListSingleCycle 
        if (lowerGenreWeightDistancesListToSort.length <= $rootScope.alreadyPlayedSongsIndexesListSingleCycle.length) {
            $rootScope.alreadyPlayedSongsIndexesListSingleCycle = [];
        }
        var sortedLowerGenreWeightsDistancesList = [];
        // special sort, songs that alrady played will be after songs that never played
        var date = new Date();
        var indexOfDay = (date.getDay() + 1) * (date.getMonth() + 1);
        lowerGenreWeightDistancesListToSort.sort(
            function (genreWeightsDistanceA, genreWeightsDistanceB) {
                var dif;
                if (isIndexAlreadyPlayedInCycle(genreWeightsDistanceA.index) &&
                    !isIndexAlreadyPlayedInCycle(genreWeightsDistanceB.index)) {
                    return 1;
                } else if (!isIndexAlreadyPlayedInCycle(genreWeightsDistanceA.index) &&
                    isIndexAlreadyPlayedInCycle(genreWeightsDistanceB.index)) {
                    return -1;
                } else {
                    dif = genreWeightsDistanceB.score - genreWeightsDistanceA.score;
                    if (dif !== 0) {
                        return dif;
                    } else {
                        // in case the dif is the same we want to give each song unique order
                        // but we want it to be different from time to time
                        var uniqueValueA = genreWeightsDistanceA.index % indexOfDay;
                        var uniqueValueB = genreWeightsDistanceB.index % indexOfDay;
                        return uniqueValueB - uniqueValueA;
                    }
                }
            });
        for (var j = 0; j < lowerGenreWeightDistancesListToSort.length; j++) {
            sortedLowerGenreWeightsDistancesList.push(lowerGenreWeightDistancesListToSort[j].index);
        }
        // concat the 2 arrays - the sorted lower than factor and the unsorted bigger than factor
        var sortedGenreWeightsDistancesList = [];
        sortedGenreWeightsDistancesList = sortedLowerGenreWeightsDistancesList.concat(biggerGenreWeightDistancesIndexesToNotSort);
        // update the relevant songsIndexesList
        $rootScope.songsIndexesList = sortedGenreWeightsDistancesList;
    }

    function filterRawGenreWeightsDistancesListByTags(rawGenreWeightsDistancesList) {
        var currentUserTags = $rootScope.userTagsMap;
        // if there is no need to filter songs we continue - e.g. user tags data is [0,0,0] - didnt click on any button
        if (!needToFilter(currentUserTags)) {
            return rawGenreWeightsDistancesList;
        }
        var rawSongList = $rootScope.rawSongsList;
        var updatedRawGenreWeightsDistancesList = rawGenreWeightsDistancesList.filter(function(currentSong){
            var currentSongTagData = rawSongList[currentSong.index].t;
            return validateTagsOfSong(currentSongTagData, currentUserTags);
        });
        return updatedRawGenreWeightsDistancesList;
    }

    function validateTagsOfSong(currentSongTagData, currentUserTags) {
        var aggBoolean = true;
        for (var i = 0; i < currentUserTags.length; i++) {
            var currentUserTagVal = currentUserTags[i];
            // the user "wants" only new songs for example
            if (currentUserTagVal === 1) {
                // the song is new (tag = 1), if no (tag = 0) it will not be inside
                aggBoolean = aggBoolean && currentSongTagData[getTagShortName(allTagsNames[i])] === 1;
            }
        }
        // user tag is 0 - the song is inside
        return aggBoolean;
    } 

    function needToFilter(userTags) {
        for (var i = 0; i < userTags.length; i++) {
            if (userTags[i] === 1) {
                return true;
            }
        }
        return false;
    }

    //TODO - consider utils
    //TODO 5 - chnage method - is index in list
    function isIndexAlreadyPlayedInCycle(index) {
        return ($rootScope.alreadyPlayedSongsIndexesListSingleCycle.indexOf(index) != -1);
    }

    // TODO - conisder to move to differnt service
    function getNextSongId() {
        var songIndex = $rootScope.currentPlayingSongIndex;
        return $rootScope.rawSongsList[songIndex].id;
    }

    function updateUserTagsMap(tagName, tagState) {
        $rootScope.userTagsMap[allTagsNames.indexOf(tagName)] = convertBooleanToNum(tagState);
    }

    function updateSongIndexesListByTagIfNeeded(tagName, tagState) {

        // console.log("new tag name: " + tagName + " new tagState " + tagState);

        updateSongsIndexesList();

        // var rawSongList = $rootScope.rawSongsList;
        // var tagNumState = convertBooleanToNum(tagState);
        // var tagShortName = getTagShortName(tagName);

        // var updatedSongsIndexesList =  $rootScope.songsIndexesList.filter(function(songIndex){
        //     var currentSongData = rawSongList[songIndex];
        //     console.log("currentSongData: " + currentSongData);
        //     var currentSongTagState = currentSongData.t[tagShortName];
        //     return tagNumState === currentSongTagState;
        //   });

        //   $rootScope.songsIndexesList = updatedSongsIndexesList;



    }

    function getTagShortName(tagName) {
        switch (tagName) {
            case "New":
                return "n";
            case "Hit":
                return "h";
            case "Trending":
                return "t";
            default:
                console.error("couldn't find tag short name | tag name: " + tagName);
                return "n";
        }
    }


    function updateGenreWeightsDistancesList(genre, newWeightValue) {
        // TODO - check if change was occur at all?

        // start of time stamp
        // var time0 = new Date();
        //printArrayWithObjToConsole($scope.genreWeightsDistancesList);


        // TODO - remove to method - udate user genre map - check the '-1' update!!!
        $rootScope.userGenresMap[allGenresNames.indexOf(genre)] = newWeightValue;
        updateWeightDistanceFactor();

        var userGenresMap = getUserGenresMap();
        var len = $rootScope.genreWeightsDistancesList.length;
        for (var i = 0; i < len; i++) {
            var currentSongGenreWeightDistances = $rootScope.genreWeightsDistancesList[i];
            var songGenreWeights = getSongGenreWeightsByIndex(i);
            var newSongScore = calculateSongScore(songGenreWeights, userGenresMap);
            currentSongGenreWeightDistances.score = newSongScore;
            $rootScope.genreWeightsDistancesList[i] = currentSongGenreWeightDistances;
        }

        //printArrayWithObjToConsole($rootScope.genreWeightsDistancesList);
        updateSongsIndexesList();

        //update $rootScope.userGenresMap 

        //$scope.$apply();
        // end of time stamp
        // var time1 = new Date();
        // var difTime = (time1 - time0) / 1000;
        // console.log("updateGenreWeightsDistancesList - duration: " + difTime);
    }

    function getSongSpecificGenreWeightByIndex(index, genre) {
        var songGenreWeights = getSongGenreWeightsByIndex(index);
        var indexOfGenre = allGenresNames.indexOf(genre);
        var songSpecificGenreWeight = songGenreWeights[indexOfGenre];
        return songSpecificGenreWeight;
    }

    // move to list utils
    function getSongGenreWeightsByIndex(index) {
        var songObject = getSongObjectByIndex(index);
        var songGenreWeights = songObject.g;
        return songGenreWeights;
    }

    //TODO - add list to signture
    function getSongObjectByIndex(index) {
        return $rootScope.rawSongsList[index];
    }

    function getCurrentPlayingSongIndex() {
        return $rootScope.currentPlayingSongIndex;
    }

    function getSongNameByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index];
        return songDetails.s;
    }

    function getSongArtistByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index];
        return songDetails.a;
    }

    function getUserGenresNames() {
        return convertGenresMapToNames(getUserGenresMap());
    }

    function getUserGenresMap() {
        if (typeof $rootScope.userGenresMap !== 'undefined' && $rootScope.userGenresMap != 'undefined' && $rootScope.userGenresMap !== null) {
            return $rootScope.userGenresMap;
        }
        console.error("$rootScope.userGenresMap was npt defined, $rootScope.userGenresMap: " + $rootScope.userGenresMap);
        $rootScope.userGenresMap = defaultGenresMap;
        return $rootScope.userGenresMap;
    }


    // [3, -1, 3, 3, -1, -1, -1] --> ['Pop', 'R&B', 'Dance']
    function convertGenresMapToNames(genresMap) {
        var genresNames = [];
        for (var i = 0; i < genresMap.length; i++) {
            currentGenreEntry = genresMap[i];
            if (currentGenreEntry !== -1) {
                genresNames.push(allGenresNames[i]);
            }
        }
        return genresNames;
    }

    // ['Pop', 'R&B', 'Dance'] --> [3, -1, 3, 3, -1, -1, -1] 
    function convertGenresNamesToMap(selectedGenresNames) {
        var genresMap = [];
        // going over all genres names
        for (var i = 0; i < allGenresNames.length; i++) {
            currentGenreName = allGenresNames[i];
            // the current genre name is one of the selected genres
            if (selectedGenresNames.indexOf(currentGenreName) > -1) {
                var existingGenreWeight = $rootScope.userGenresMap[i];
                // it's a new genre which was added by the user using the genre selector
                if (existingGenreWeight === -1) {
                    genresMap.push(DEFAULT_WEIGHT);
                } else { // it's an existing genre - (prob) onloading flow
                    genresMap.push(existingGenreWeight);
                }
            } else { // the current genre name is not selected
                genresMap.push(-1);
            }
        }
        return genresMap;
    }

    function setSelectedGenresByNames(updatedSelectedGenres) {
        $rootScope.userGenresMap = convertGenresNamesToMap(updatedSelectedGenres);
    }

    function geAllGenresNames() {
        return allGenresNames;
    }

    function getWeightOfGenre(genre) {
        return $rootScope.userGenresMap[allGenresNames.indexOf(genre)];
    }

    function getTagStateByName(tagName) {
        return convertNumToBoolean($rootScope.userTagsMap[allTagsNames.indexOf(tagName)]);
    }

    function getWeightDistanceFactor() {
        return $rootScope.weightDistanceFactor;
    }

    function updateGenreWeightsDistancesListByCurrentWidget() {
        var selectedGenresMap = $rootScope.userGenresMap;
        for (var i = 0; i < selectedGenresMap.length; i++) {
            currentGenreWeight = selectedGenresMap[i];
            currentGenreName = allGenresNames[i];
            if (currentGenreWeight !== -1) {
                updateGenreWeightsDistancesList(currentGenreName, currentGenreWeight);
            } else { //currentGenreWeight == -1 -> genre is not selected
                updateGenreWeightsDistancesList(currentGenreName, -1);
            }
        }
    }

    //setting the url video id varaible
    // we set it to "" in case there is no url video id
    function initUrlParams() {
        var urlVideoId = gettingUrlParams();
        // it can be also ""
       
        // searching for this video Id in our song list
        // consider moving to a method
        var songsList = $rootScope.rawSongsList; 
        // init the url video id to "", in case this is a regular url 
        $rootScope.urlVideoId = "";
        // init the video id to -1, in case this is a regular url
        $rootScope.urlVideoIdIndex = -1;
        // we dont need to look for the video id when there is no video Id in the url
        if (urlVideoId !== "") { 
            for (var i = 0; i < songsList.length; i++) {
                var currentSongData = songsList[i];
                if (currentSongData.id === urlVideoId) {
                    $rootScope.urlVideoId = urlVideoId;
                    $rootScope.urlVideoIdIndex = currentSongData.i;
                    break;
                }
            }
        }
    }

    // parsing the url params into youtube video id 
    function gettingUrlParams() {
        var rawUrlParams = window.location.search.slice(1);
        // checking if the url params == ""
        if (rawUrlParams) {
            // stuff after # is not part of query string, so get rid of it
            rawUrlParams = rawUrlParams.split('#')[0];

            // split our query string into its component parts
            var arr = rawUrlParams.split('&');
            for (var i = 0; i < arr.length; i++) {
                var pair = arr[i].split("=");
                if (pair[0] === VIDEO_ID_PARAM) { // if key of url params pair is equal to 'v';
                    return pair[1];
                }
            }
        }
        return rawUrlParams;
    }

    function getUrlVideoId() {
        return $rootScope.urlVideoId;
    }

    function isUrlWithParams() {
        var urlVideoId = getUrlVideoId();
        // urlVideoId can be "" also
        return isObjectDefined(urlVideoId) && urlVideoId !== "";
    }

    function getUrlVideoIdIndex() {
        return $rootScope.urlVideoIdIndex;
    }
    



    // MOVE TO UTILS

    // replace all places and move to utils
    function isObjectDefined(object) {
        return typeof object !== 'undefined' && object != 'undefined' && object !== null;
    }

    function convertNumToBoolean(numVal) {
        return numVal ? true : false;
    }

    function convertBooleanToNum(booleanVal) {
        return booleanVal ? 1 : 0;
    }

}
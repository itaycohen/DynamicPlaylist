angular
    .module('dpSongsListLogic', [])
    .factory('dpSongsListLogic', dpSongsListLogic);

dpSongsListLogic.$inject = ['$rootScope', 'dpSongsListUtils'];

function dpSongsListLogic($rootScope, dpSongsListUtils) {

    var FAKE_GENRE_WEIGHT = 2.5;
    var WEIGHT_DISTANCE_FACTOR = 2;
    var isFirstCycle;
    var defaultGenres = ['House', 'Pop', 'R&B'];
    var allGenres = ['House', 'Indie-Rock', 'Pop', 'R&B', 'Soul'];

    var service = {
        initCalcSongsList: initCalcSongsList,
        // TODO - think what to do with these 3
        getRawSongsList: getRawSongsList,
        getSongsIndexesList: getSongsIndexesList,
        getDefaultSelectedGenres: getDefaultSelectedGenres,
        getSelectedGenres: getSelectedGenres,
        setSelectedGenres: setSelectedGenres,
        getHiddenGenres: getHiddenGenres,
        geAllGenres: geAllGenres,
        getAlreadyPlayedSongsIndexesListFull: getAlreadyPlayedSongsIndexesListFull,
        popSongIndexFromListAndUpdate: popSongIndexFromListAndUpdate,
        getNextSongId: getNextSongId,
        updateGenreWeightsDistancesList: updateGenreWeightsDistancesList,
        updateGenreWeightsDistancesListByCurrentWidget: updateGenreWeightsDistancesListByCurrentWidget,
        getCurrentPlayingSongIndex: getCurrentPlayingSongIndex,
        updateSongsIndexesList: updateSongsIndexesList,


        // move
        getSongArtistAndNameByIndex: getSongArtistAndNameByIndex,
        getSongNameByIndex: getSongNameByIndex,
        getSongArtistByIndex: getSongArtistByIndex

    };
    return service;

    //////////


    /** 								ALL LISTS - DOC
	// --------------------------------------------------------------------------
	// 1. songsList
	// 		Structure: { index, id, genreWeights {'House', 'Indie-Rock', 'Pop', 'R&B', 'Soul'} }  
	//		The original static songs list.
	// 		This list will never changed, order is fix.

	// 2. songIndexesList
	// 		Structure: {index}
	// 		The CURRENT SORTED songs' indexes .
	//		This list will be updated after each change in ranges.

	// 3. genreWeightsDistancesList
    // 		Structure: {index, avgDistance, genreWeightsDistance {'House', 'Indie-Rock', 'Pop', 'R&B', 'Soul' } }
	// 		New Structure: {index, avgDistance, genreWeightsDistance [distances] }
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
        // init genres weights list
        initGenreWeightsDistancesList();
        initAlreadyPlayedSongsIndexes();

        //update the list according to the existing genre widgets
        updateGenreWeightsDistancesListByCurrentWidget();
        // PLACEHOLDER - this method should go over all the current widget (selectedGenre) and init the hidden ones to zero
        //TODO - consider to moive to a new service widget genres service
        $rootScope.selectedGenres = getDefaultSelectedGenres();

        // init current song index
        initCurrentSongIndex();
        isFirstCycle = true;
    }

    function getRawSongsList() {
        return $rootScope.rawSongsList;
    }

    function getSongsIndexesList() {
        return $rootScope.songsIndexesList;
    }


    function getAlreadyPlayedSongsIndexesListFull() {
        return $rootScope.alreadyPlayedSongsIndexesListFull;
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
    // index: i  / avgDistance: dis / genreWeightsDistance: {house:x, pop: y ...}
    // new structure:
    // index: i  / avgDistance: dis / genreWeightsDistance: []

    function initGenreWeightsDistancesList() {
        var arr = [];
        var rawSongsList = $rootScope.rawSongsList;
        var len = rawSongsList.length;
        for (var i = 0; i < len; i++) {

            var currentSong = rawSongsList[i];
            var currentSongWeights = currentSong.g;
            var avgDistance = calculateAvgDistance(currentSongWeights, true);
            var genreWeightsDistanceMap = buildGenreWeightsDistance(currentSongWeights);

            arr.push({
                index: i,
                avgDistance: avgDistance,
                genreWeightsDistance: genreWeightsDistanceMap
            });
        }

        $rootScope.genreWeightsDistancesList = arr;
    }

    function initAlreadyPlayedSongsIndexes() {
        $rootScope.alreadyPlayedSongsIndexesListSingleCycle = [];
        $rootScope.alreadyPlayedSongsIndexesListFull = [];
    }

    function calculateAvgDistance(songWeights, isInitialCreation) {
        var total = 0,
            count = 0;
        for (var genre in songWeights) {
            var genreWeight = songWeights[genre];
            if (isInitialCreation) {
                genreWeight = getGenreWeightFromFakeMiddle(genreWeight);
            }
            total += genreWeight;
            count++;
        }
        return total / count;
    }

    function buildGenreWeightsDistance(songWeights) {
        var genreWeightsDistanceMap = [];
        for (var i = 0; i < songWeights.length; i++) {
            genreWeightsDistanceMap[i] = getGenreWeightFromFakeMiddle(songWeights[i]);
        }
        return genreWeightsDistanceMap;
    }

    // TODO - consider move ti utils
    function getGenreWeightFromFakeMiddle(genreWeight) {
        return Math.abs(genreWeight - FAKE_GENRE_WEIGHT);
    }

    //pop song for the application loading
    function initCurrentSongIndex() {
        popSongIndexFromListAndUpdate(false);
    }

    //     // pop song from list and update alreadyPlayedSongsIndexesListSingleCycle
    // function popSongIndexFromListAndUpdate(byAction, indexOfSong) {

    //     var orderOfSong;
    //     var songIndex;


    //     // regular play (auto)
    //     if (angular.isUndefined(indexOfSong)) {
    //         orderOfSong = 0;
    //         // get the first song index in list

    //         songIndex = $rootScope.songsIndexesList[0];

    //         $rootScope.songsIndexesList.shift();

    //         $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(songIndex);
    //         $rootScope.alreadyPlayedSongsIndexesListFull.push(songIndex);

    //     } else { // play by pressing on soong
    //         orderOfSong = $rootScope.songsIndexesList.indexOf(indexOfSong);
    //         songIndex = indexOfSong;
    //     }

    //     // update currentPlayingSongIndex
    //     $rootScope.currentPlayingSongIndex = songIndex;

    //     // remove songIndex out from songsIndexesList
    //     // $rootScope.songsIndexesList.shift();
    //     // cut orderOfSong=numberOf elements from the array from index 0 
    //     var removedSongsIndexes = $rootScope.songsIndexesList.splice(0, orderOfSong + 1);
    //     var i, len, playedSongIndex;


    //     // $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(songIndex);
    //     // $rootScope.alreadyPlayedSongsIndexesListFull.push(songIndex);

    //     // for (i = 0, len = removedSongsIndexes.length; i < len; i++) {
    //     //     // note: this index can be of song that was skipped by click on other song play button
    //     //     playedSongIndex = removedSongsIndexes[i];
    //     //     // insert to alreadyPlayedSongsIndexesListSingleCycle
    //     //     $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(playedSongIndex);
    //     //     $rootScope.alreadyPlayedSongsIndexesListFull.push(playedSongIndex);
    //     // }

    //     updateSongsIndexesList();

    //     if (!byAction) {
    //         $rootScope.$apply();
    //     }
    // }

    // pop song from list and update alreadyPlayedSongsIndexesListSingleCycle
    function popSongIndexFromListAndUpdate(byAction, indexOfSong) {

        var orderOfSong;
        var songIndex;


        // regular play (auto)
        if (angular.isUndefined(indexOfSong)) {
            orderOfSong = 0;
            // get the first song index in list

            songIndex = $rootScope.songsIndexesList[0];

            $rootScope.songsIndexesList.shift();

            $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(songIndex);
            $rootScope.alreadyPlayedSongsIndexesListFull.push(songIndex);

        } else { // play by pressing on soong
            orderOfSong = $rootScope.songsIndexesList.indexOf(indexOfSong);
            songIndex = indexOfSong;
        }

        // update currentPlayingSongIndex
        $rootScope.currentPlayingSongIndex = songIndex;

        // remove songIndex out from songsIndexesList
        // $rootScope.songsIndexesList.shift();
        // cut orderOfSong=numberOf elements from the array from index 0 
        var removedSongsIndexes = $rootScope.songsIndexesList.splice(0, orderOfSong + 1);
        var i, len, playedSongIndex;


        //$rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(songIndex);
        //$rootScope.alreadyPlayedSongsIndexesListFull.push(songIndex);

        for (i = 0, len = removedSongsIndexes.length; i < len; i++) {
            // note: this index can be of song that was skipped by click on other song play button
            playedSongIndex = removedSongsIndexes[i];
            // insert to alreadyPlayedSongsIndexesListSingleCycle
            $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(playedSongIndex);
            $rootScope.alreadyPlayedSongsIndexesListFull.push(playedSongIndex);
        }

        updateSongsIndexesList();

        if (!byAction) {
            $rootScope.$apply();
        }
    }

    // update the songs indexes list after change in genre weights 
    // sort it by avgDistance
    //TODO - break to sub methods
    function updateSongsIndexesList() {

        // avoiding the case where the last played song is playing again
        var lastPlayedIndex = $rootScope.alreadyPlayedSongsIndexesListSingleCycle[$rootScope.alreadyPlayedSongsIndexesListSingleCycle.length - 1];

        var rawGenreWeightsDistancesList = $rootScope.genreWeightsDistancesList.slice();
        // array for genre weights distances OBJECTS that are smaller or equal to WEIGHT_DISTANCE_FACTOR
        var lowerGenreWeightDistancesListToSort = [];
        // // array for genre weights distances INDEXES that are bigger than WEIGHT_DISTANCE_FACTOR
        var biggerGenreWeightDistancesIndexesToNotSort = [];
        // splitting the rawGenreWeightsDistancesList to 2 arrays 
        for (var i = 0; i < rawGenreWeightsDistancesList.length; i++) {
            var currentGenreWeightDistance = rawGenreWeightsDistancesList[i];
            if (currentGenreWeightDistance.avgDistance > WEIGHT_DISTANCE_FACTOR) {
                biggerGenreWeightDistancesIndexesToNotSort.push(currentGenreWeightDistance.index);
            } else {
                lowerGenreWeightDistancesListToSort.push(currentGenreWeightDistance);
            }
        }
        // if we've played all the lowerGenreWeightDistances songs (+1 first random song) we would like to init
        // 	the alreadyPlayedSongsIndexesListSingleCycle 
        if (lowerGenreWeightDistancesListToSort.length === $rootScope.alreadyPlayedSongsIndexesListSingleCycle.length - (isFirstCycle ? 1 : 0)) {
            $rootScope.alreadyPlayedSongsIndexesListSingleCycle = [];
            isFirstCycle = false;
        }
        var sortedLowerGenreWeightsDistancesList = [];
        // special sort, songs that alrady played will be after songs that never played
        var date = new Date();
        var indexOfDay = date.getDay() * date.getMonth();
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
                    dif = genreWeightsDistanceA.avgDistance - genreWeightsDistanceB.avgDistance;
                    if (dif !== 0) {
                        return dif;
                    } else {
                        // in case the dif is the same we want to give each song unique order
                        // but we want it to be different from time to time
                        var uniqueValueA = genreWeightsDistanceA.index % indexOfDay;
                        var uniqueValueB = genreWeightsDistanceB.index % indexOfDay;
                        return uniqueValueA - uniqueValueB;
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

    //TODO - consider utils
    //TODO 5 - chnage method - is index in list
    function isIndexAlreadyPlayedInCycle(index) {
        return ($rootScope.alreadyPlayedSongsIndexesListSingleCycle.indexOf(index) != -1);
    }

    // TODO - conisder to move to differnt service
    function getNextSongId() {
        console.log("getNextSongId");
        var songIndex = $rootScope.currentPlayingSongIndex;
        return $rootScope.rawSongsList[songIndex].id;
    }

    function updateGenreWeightsDistancesList(genre, newWeightValue) {
        // start of time stamp
        // var time0 = new Date();
        //printArrayWithObjToConsole($scope.genreWeightsDistancesList);

        var len = $rootScope.genreWeightsDistancesList.length;
        for (var i = 0; i < len; i++) {
            //get the current genre weights distances
            var currentSongGenreWeightDistances = $rootScope.genreWeightsDistancesList[i];
            // get the original genre weight of the specific genre
            var currentSongGenreWeight = getSongSpecificGenreWeightByIndex(i, genre);
            var newGenreWeightDistance = Math.abs(currentSongGenreWeight - newWeightValue);
            // update the genre weight distances object with the new genre weight distances of the genre
            var genreIndex = allGenres.indexOf(genre);
            currentSongGenreWeightDistances.genreWeightsDistance[genreIndex] = newGenreWeightDistance;

            // calculate the avg ditances of all genres toghter 
            var newAvgDistance = calculateAvgDistance(currentSongGenreWeightDistances.genreWeightsDistance, false);
            currentSongGenreWeightDistances.avgDistance = newAvgDistance;

            // update the genreWeightsDistancesList
            //TODO : delete currentSongGenreWeightDistances
            // 		and use only $scope.genreWeightsDistancesList[i]
            $rootScope.genreWeightsDistancesList[i] = currentSongGenreWeightDistances;

        }
        //printArrayWithObjToConsole($rootScope.genreWeightsDistancesList);
        updateSongsIndexesList();

        //$scope.$apply();
        // end of time stamp
        // var time1 = new Date();
        // var difTime = (time1 - time0) / 1000;
        // console.log("updateGenreWeightsDistancesList - duration: " + difTime);
    }

    function getSongSpecificGenreWeightByIndex(index, genre) {
        var songGenreWeights = getSongGenreWeightsByIndex(index);
        var indexOfGenre = allGenres.indexOf(genre);
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

    //TODO - add list to signture
    function getSongArtistAndNameByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index];
        // TODO - const " "
        return songDetails.a + " - " + songDetails.s;
    }

    function getSongNameByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index];
        return songDetails.s;
    }

    function getSongArtistByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index];
        return songDetails.a;
    }

    function getDefaultSelectedGenres() {
        $rootScope.selectedGenres = defaultGenres;
        return $rootScope.selectedGenres;
    }

    function getSelectedGenres() {
        if (angular.isUndefined($rootScope.selectedGenres)) {
            return defaultGenres;
        }
        return $rootScope.selectedGenres;
    }

    function setSelectedGenres(updatedSelectedGenres) {
        $rootScope.selectedGenres = updatedSelectedGenres;
    }

    function geAllGenres() {
        return allGenres;
    }

    function getHiddenGenres() {
        var selectedGenres = $rootScope.selectedGenres;
        if (angular.isUndefined(selectedGenres)) {
            selectedGenres = getDefaultSelectedGenres();
        }
        var allHiddenGenres = allGenres.filter(function (el) {
            return selectedGenres.indexOf(el) < 0;
        });
        return allHiddenGenres;
    }


    function updateGenreWeightsDistancesListByCurrentWidget() {
        var selectedGenres = getSelectedGenres();
        //go over all hidden and set to zero their genre
        for (var i = 0; i < selectedGenres.length; i++) {
            selectedGenre = selectedGenres[i];
            updateGenreWeightsDistancesList(selectedGenre, 3);
        }
        var hiddenGenres = getHiddenGenres();
        //go over all hidden and set to zero their genre
        for (var j = 0; j < hiddenGenres.length; j++) {
            hiddenGenre = hiddenGenres[j];
            updateGenreWeightsDistancesList(hiddenGenre, 0);
        }
    }

}
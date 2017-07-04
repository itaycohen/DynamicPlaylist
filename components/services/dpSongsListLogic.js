angular
    .module('dpSongsListLogic', [])
    .factory('dpSongsListLogic', dpSongsListLogic);

dpSongsListLogic.$inject = ['$rootScope', 'dpSongsListUtils'];

function dpSongsListLogic($rootScope, dpSongsListUtils) {

    var FAKE_GENRE_WEIGHT = 2.5;
    var WEIGHT_DISTANCE_FACTOR = 1.9;
    var isFirstCycle;
    // var defaultGenres = ['House', 'Pop', 'R&B', 'Indie-Rock'];
    var defaultGenres = ['House', 'Pop'];
    var allGenres = ['House', 'Pop', 'R&B', 'Indie-Rock', 'Soul'];

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
        updateGenreWeightsDistancesListByCurrentWidget : updateGenreWeightsDistancesListByCurrentWidget,
        getCurrentPlayingSongIndex: getCurrentPlayingSongIndex,
        getGenreLabel: getGenreLabel,
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
	// 		Structure: { index, id, genreWeights {house, pop, rb, ir, soul } }  
	//		The original static songs list.
	// 		This list will never changed, order is fix.

	// 2. songIndexesList
	// 		Structure: {index}
	// 		The CURRENT SORTED songs' indexes .
	//		This list will be updated after each change in ranges.

	// 3. genreWeightsDistancesList
	// 		Structure: {index, avgDistance, genreWeightsDistance {house, pop, rb, ir, soul } }
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
    function initGenreWeightsDistancesList() {
        var arr = [];
        var len = $rootScope.rawSongsList.length;
        for (var i = 0; i < len; i++) {

            var currentSong = $rootScope.rawSongsList[i];
            var currentSongWeights = currentSong.genreWeights;
            var avgDistance = calculateAvgDistance(currentSongWeights, true);

            arr.push({
                index: i,
                avgDistance: avgDistance,
                genreWeightsDistance:
                {
                    house: getGenreWeightFromFakeMiddle(currentSongWeights.house),
                    pop: getGenreWeightFromFakeMiddle(currentSongWeights.pop),
                    rb: getGenreWeightFromFakeMiddle(currentSongWeights.rb),
                    ir: getGenreWeightFromFakeMiddle(currentSongWeights.ir),
                    soul: getGenreWeightFromFakeMiddle(currentSongWeights.soul)
                }
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

    // TODO - consider move ti utils
    function getGenreWeightFromFakeMiddle(genreWeight) {
        return Math.abs(genreWeight - FAKE_GENRE_WEIGHT);
    }

    //pop song for the application loading
    function initCurrentSongIndex() {
        popSongIndexFromListAndUpdate(false);
    }

    // pop song from list and update alreadyPlayedSongsIndexesListSingleCycle
    function popSongIndexFromListAndUpdate(byAction) {
        console.log("popSongIndexFromListAndUpdate");
        // get the first song index in list
        var songIndex = $rootScope.songsIndexesList[0];

        // update currentPlayingSongIndex
        $rootScope.currentPlayingSongIndex = songIndex;

        // remove songIndex out from songsIndexesList
        $rootScope.songsIndexesList.shift();
        // remove from genreWeightsDistancesList

        // insert to alreadyPlayedSongsIndexesListSingleCycle
        $rootScope.alreadyPlayedSongsIndexesListSingleCycle.push(songIndex);
        $rootScope.alreadyPlayedSongsIndexesListFull.push(songIndex);

        updateSongsIndexesList();

        if (!byAction) {
            $rootScope.$apply();
        }
    }

    // update the songs indexes list after change in genre weights 
    // sort it by avgDistance
    //TODO - break to sub methods
    function updateSongsIndexesList() {
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
        lowerGenreWeightDistancesListToSort.sort(
            function (genreWeightsDistanceA, genreWeightsDistanceB) {
                if (isIndexAlreadyPlayedInCycle(genreWeightsDistanceA.index) &&
                    !isIndexAlreadyPlayedInCycle(genreWeightsDistanceB.index)) {
                    return 1;
                } else if (!isIndexAlreadyPlayedInCycle(genreWeightsDistanceA.index) &&
                    isIndexAlreadyPlayedInCycle(genreWeightsDistanceB.index)) {
                    return -1;
                } else {
                    return genreWeightsDistanceA.avgDistance - genreWeightsDistanceB.avgDistance;
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
            currentSongGenreWeightDistances.genreWeightsDistance[genre] = newGenreWeightDistance;

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
        return getSongGenreWeightsByIndex(index)[genre];
    }

    // move to list utils
    function getSongGenreWeightsByIndex(index) {
        return getSongObjectByIndex(index).genreWeights;
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
        var songDetails = $rootScope.rawSongsList[index].details;
        // TODO - const " "
        return songDetails.artist + " - " + songDetails.songName;
    }

    function getSongNameByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index].details;
        return songDetails.songName;
    }

    function getSongArtistByIndex(index) {
        var songDetails = $rootScope.rawSongsList[index].details;
        return songDetails.artist;
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
            updateGenreWeightsDistancesList(getGenreShortName(selectedGenre), 3);
        }
        var hiddenGenres = getHiddenGenres();
        //go over all hidden and set to zero their genre
        for (var j = 0; j < hiddenGenres.length; j++) {
            hiddenGenre = hiddenGenres[j];
            updateGenreWeightsDistancesList(getGenreShortName(hiddenGenre), 0);
        }
    }

    function getGenreLabel(genre) {
        switch (genre) {
            case "house":
                return "House";
            case "pop":
                return "Pop";
            case "rb":
                return "R&B";
            case "ir":
                return "Indie-Rock";
            case "soul":
                return "Soul";
            default:
                return "Genre";

        }
    }

    function getGenreShortName(genre) {
        switch (genre) {
            case "House":
                return "house";
            case "Pop":
                return "pop";
            case "R&B":
                return "rb";
            case "Indie-Rock":
                return "ir";
            case "Soul":
                return "soul";
            default:
                return "Genre";

        }
    }


}
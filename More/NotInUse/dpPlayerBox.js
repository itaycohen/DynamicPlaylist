var dpPlayerBoxComponent = angular.module('dpPlayerBoxComponent', []);

dpPlayerBoxComponent.factory('youtubeEmbed', ['$document', '$q', '$rootScope',

	function ($document, $q, $rootScope) {
		var y = $q.defer();
		function onScriptLoad() {
			y.resolve(window.yt);
		}
		var scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		//TODO - consider change to https
		scriptTag.src = 'http://www.youtube.com/iframe_api';
		scriptTag.onreadystatechange = function () {
			if (this.readyState == 'complete')
				onScriptLoad();
		};
		scriptTag.onload = onScriptLoad();
		var s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);
		return {
			yt: function () { return y.promise; }
		};
	}]);

dpPlayerBoxComponent.directive("dpPlayerBox", ['youtubeEmbed', '$window', '$http', function (youtubeEmbed, $window, $http) {
    var directive = {
        restrict: "E",
        // scope: {
        //     // TODO - TF-1 change to song id 
        //     dpSongUrl : "@",
        //     state: '=',
		//     currentTime: '='
        // },
        template: '<div id="player"></div>',
        controller: dpPlayerBoxController,
        link: dpPlayerBoxPostLink

    };
    return directive;

    function dpPlayerBoxPostLink($scope, element, attrs) {

		$http.get('songs.json')
			.then(function(res) {
				$scope.myNewFile = res;
				alert("Success");
			});

		// TODO - HIGH IMPORTANT move to pre/init area
		// TODO - consider unify these 2 functions below
		$scope.initSongIndexesList();

		// init genres weights list
		$scope.initGenreWeightsDistancesList();

		// init current song index
		$scope.initCurrentSongIndex();

		youtubeEmbed.yt().then(function (yt) {
			$window.onYouTubePlayerAPIReady = function () {
				$scope.player = new YT.Player('player', {
					height: '390',
					width: '640',
					// TODO - consider handle list with Ids
					playerVars: { 'autoplay': 0, 'controls': 1, 'playlist': ['oyEuk8j8imI', 'lp-EO5I60KA'] },
					videoId: $scope.getNextSongId(),
					// playerVars: { 
					// 	'autoplay': 1, 
					// },
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange
					}

				});

				// function onPlayerReady(event) { 
				// 	event.target.loadPlaylist({list: "PLW_RBtE1degILYYm3WD142aFvDV3072eg", index: 1, startSeconds: 10,suggestedQuality: "small"});
				// }

				function onPlayerReady(event) {
					event.target.playVideo();
					// event.target.loadPlaylist(['PVzljDmoPVs','9NwZdxiLvGo']);
				}

				function onPlayerStateChange(event) {
					var playerStatus = event.data;
					switch (playerStatus) {
						case YT.PlayerState.PLAYING:
							handlePlayerPlaying();
							break;
						case YT.PlayerState.PAUSED:
							handlePlayerPaused();
							break;
						case YT.PlayerState.ENDED:
							handlePlayerEnded();
							break;
					}
				}

				function handlePlayerPlaying() {
					console.log("handlePlayerPlaying");
				}

				function handlePlayerPaused() {
					console.log("handlePlayerPaused");
				}


				function handlePlayerEnded() {
					console.log("handlePlayerEnded");
					$scope.popSongIndexFromListAndUpdate();
					$scope.player.videoId = $scope.getNextSongId();
					$scope.player.loadVideoById($scope.player.videoId);
					$scope.player.playVideo();
				}

			};

		});
	}

}]);


dpPlayerBoxController.$inject = ["$scope", "$http"];
function dpPlayerBoxController($scope, $http) {

	var WEIGHT_DISTANCE_FACTOR = 1.9;
	var FAKE_GENRE_WEIGHT = 2.5;

	var isFirstCycle = true;

	// 								ALL LISTS - DOC
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


	var songsListTest = [
		{
			index: 0,
			id: 'oyEuk8j8imI',
			genreWeights: {
				house: 0,
				pop: 5,
				rb: 0,
				ir: 1,
				soul: 4
			},
			details:
			{
				artist: 'Justin Bieber',
				songName: 'Love Yourself'
			}
		},
		{
			index: 1,
			id: '9NwZdxiLvGo',
			genreWeights: {
				house: 5,
				pop: 2,
				rb: 0,
				ir: 0,
				soul: 0
			},
			details:
			{
				//TODO - consider change to array
				artist: 'Skrillex & Diplo',
				songName: 'To Ü ft AlunaGeorge'
			}
		},
		{
			index: 2,
			id: 'lp-EO5I60KA',
			genreWeights: {
				house: 0,
				pop: 4,
				rb: 0,
				ir: 3,
				soul: 5
			},
			details:
			{
				artist: 'Ed Sheeran',
				songName: 'Thinking Out Loud'
			}
		},
		{
			index: 3,
			id: 'fRh_vgS2dFE',
			genreWeights: {
				house: 2,
				pop: 5,
				rb: 0,
				ir: 1,
				soul: 3
			},
			details:
			{
				artist: 'Justin Bieber',
				songName: 'Sorry'
			}
		},
		{
			index: 4,
			id: 'kOkQ4T5WO9E',
			genreWeights: {
				house: 5,
				pop: 4,
				rb: 1,
				ir: 0,
				soul: 2
			},
			details:
			{
				artist: 'Calvin Harris ft. Rihanna',
				songName: 'This Is What You Came For'
			}
		},
		{
			index: 5,
			id: 'ebXbLfLACGM',
			//TODO - handle duplicate weights
			genreWeights: {
				house: 5,
				pop: 4,
				rb: 0,
				ir: 0,
				soul: 0
			},
			details:
			{
				artist: 'Calvin Harris',
				songName: 'Summer'
			}
		},
		{
			index: 6,
			id: 'JRfuAukYTKg',
			genreWeights: {
				house: 4,
				pop: 5,
				rb: 0,
				ir: 0,
				soul: 2
			},
			details:
			{
				artist: 'David Guetta ft. Sia',
				songName: 'Titanium'
			}
		},
		{
			index: 7,
			id: 'PVzljDmoPVs',
			genreWeights: {
				house: 5,
				pop: 4,
				rb: 0,
				ir: 0,
				soul: 1
			},
			details:
			{
				artist: 'David Guetta ft. Sia',
				songName: 'She Wolf (Falling To Pieces)'
			}
		},
		{
			index: 8,
			id: 'UtF6Jej8yb4',
			genreWeights: {
				house: 5,
				pop: 4,
				rb: 0,
				ir: 0,
				soul: 1
			},
			details:
			{
				artist: 'Avicii',
				songName: 'The Nights'
			}
		},
		{
			index: 9,
			id: 'YxIiPLVR6NA',
			genreWeights: {
				house: 5,
				pop: 4,
				rb: 0,
				ir: 0,
				soul: 1
			},
			details:
			{
				artist: 'Avicii',
				songName: 'Hey Brother'
			}
		}


	];

	// Songs list
	// rb = r&b
	// ir == indie rock

	$scope.songsList = songsListTest;

	// *** song list utils *** 

	$scope.getSongObjectByIndex = function (index) {
		return $scope.songsList[index];
	};

	$scope.getSongGenreWeightsByIndex = function (index) {
		return $scope.getSongObjectByIndex(index).genreWeights;
	};

	//$scope.getSongWeightByGenre = 

	$scope.getSongIdByIndex = function (index) {
		//TODO - check length
		return $scope.songsList[index].id;
	};

	$scope.getSongNameByIndex = function (index) {
		return $scope.songsList[index].details.songName;
	};

	$scope.getSongArtistByIndex = function (index) {
		return $scope.songsList[index].details.artist;
	};

	$scope.getSongArtistAndNameByIndex = function (index) {
		var songDetails = $scope.songsList[index].details;
		// TODO - const " "
		return songDetails.artist + " - " + songDetails.songName;
	};

	$scope.getSongSpecificGenreWeightByIndex = function (index, genre) {
		return $scope.getSongGenreWeightsByIndex(index)[genre];
	};


	$scope.alreadyPlayedSongIndexesListSingleCycle = [];
	$scope.alreadyPlayedSongIndexesListFull = [];


	// TODO - consider/test - just write in the controller - initSongIndexesList (without calling)
	// smart list will contain only indexes of Songs
	$scope.initSongIndexesList = function () {
		var lengthOfSongsList = $scope.songsList.length;
		// create songListIndexes - only the indexes of the songes 
		var songListIndexes = Array.apply(null, { length: lengthOfSongsList }).map(Number.call, Number);
		shuffle(songListIndexes);
		$scope.songIndexesList = songListIndexes;
	};

	//pop song for the application loading
	$scope.initCurrentSongIndex = function () {
		$scope.popSongIndexFromListAndUpdate();
	};


	// pop song from list and update alreadyPlayedSongIndexesListSingleCycle
	$scope.popSongIndexFromListAndUpdate = function () {
		// get the first song index in list
		var songIndex = $scope.songIndexesList[0];

		//update currentPlayingSongIndex
		$scope.currentPlayingSongIndex = songIndex;

		// remove songIndex out from songIndexesList
		$scope.songIndexesList.shift();
		// remove from genreWeightsDistancesList

		// insert to alreadyPlayedSongIndexesListSingleCycle
		$scope.alreadyPlayedSongIndexesListSingleCycle.push(songIndex);
		$scope.alreadyPlayedSongIndexesListFull.push(songIndex);

		updateSongIndexesList();

		$scope.$apply();
	};

	function shuffle(arr) {
		var j, x, i;
		for (i = arr.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = arr[i - 1];
			arr[i - 1] = arr[j];
			arr[j] = x;
		}
	}

	// initGenreWeightsDistancesList
	$scope.initGenreWeightsDistancesList = function () {
		createGenreWeightsDistancesList();
	};

	// createGenreWeightsDistancesList
	// structure:
	// index: i  / avgDistance: dis / genreWeightsDistance: {house:x, pop: y ...}
	function createGenreWeightsDistancesList() {
		var arr = [];
		var len = $scope.songsList.length;
		for (var i = 0; i < len; i++) {

			var currentSong = $scope.songsList[i];
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

		$scope.genreWeightsDistancesList = arr;
	}

	function getGenreWeightFromFakeMiddle(genreWeight) {
		return Math.abs(genreWeight - FAKE_GENRE_WEIGHT);
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

	$scope.updateGenreWeightsDistancesList = function (genre, newWeightValue) {

		// start of time stamp
		var time0 = new Date();
		//printArrayWithObjToConsole($scope.genreWeightsDistancesList);


		var len = $scope.genreWeightsDistancesList.length;
		for (var i = 0; i < len; i++) {
			//get the current genre weights distances
			var currentSongGenreWeightDistances = $scope.genreWeightsDistancesList[i];
			// get the original genre weight of the specific genre
			var currentSongGenreWeight = $scope.getSongSpecificGenreWeightByIndex(i, genre);
			var newGenreWeightDistance = Math.abs(currentSongGenreWeight - newWeightValue);
			// update the genre weight distances object with the new genre weight distances of the genre
			currentSongGenreWeightDistances.genreWeightsDistance[genre] = newGenreWeightDistance;

			// calculate the avg ditances of all genres toghter 
			var newAvgDistance = calculateAvgDistance(currentSongGenreWeightDistances.genreWeightsDistance, false);
			currentSongGenreWeightDistances.avgDistance = newAvgDistance;

			// update the genreWeightsDistancesList
			//TODO : delete currentSongGenreWeightDistances
			// 		and use only $scope.genreWeightsDistancesList[i]
			$scope.genreWeightsDistancesList[i] = currentSongGenreWeightDistances;

		}

		//printArrayWithObjToConsole($scope.genreWeightsDistancesList);

		updateSongIndexesList();

		//$scope.$apply();


		// end of time stamp
		var time1 = new Date();
		var difTime = (time1 - time0) / 1000;
		console.log("updateGenreWeightsDistancesList - duration: " + difTime);


	};


	// update the songs indexes list after change in genre weights 
	// sort it by avgDistance
	function updateSongIndexesList() {
		var rawGenreWeightsDistancesList = $scope.genreWeightsDistancesList.slice();
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
		// 	the alreadyPlayedSongIndexesListSingleCycle 
		if (lowerGenreWeightDistancesListToSort.length === $scope.alreadyPlayedSongIndexesListSingleCycle.length - (isFirstCycle ? 1 : 0)) {
			$scope.alreadyPlayedSongIndexesListSingleCycle = [];
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

		// update the relevant songIndexesList
		$scope.songIndexesList = sortedGenreWeightsDistancesList;
	}


	function isIndexAlreadyPlayedInCycle(index) {
		return ($scope.alreadyPlayedSongIndexesListSingleCycle.indexOf(index) != -1);
	}


    $scope.current = $scope.songsList[0];

    $scope.index = 0;

    // $scope.videoID = function(){
	// 	return $scope.current.id;
	// };

    $scope.nextVideo = function () {
		$scope.index = ($scope.index + 1) % $scope.songsList.length;
		$scope.current = $scope.songsList[$scope.index];
	};

    // $scope.go = function(){
	// 	$scope.nextVideo();
	// };

	//TODO - take of to utils
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$scope.getNextSongId = function () {
		var songIndex = $scope.currentPlayingSongIndex;
		return $scope.songsList[songIndex].id;
	};


	// utils functions - for testing

	function printArrayToConsole(arr) {
		console.log("PRINTING - START");
		for (var i = 0; i < arr.length; i++) {
			console.log(i + ". " + arr[i]);
		}
		console.log("PRINTING - END");
	}


	function printArrayWithObjToConsole(arr) {
		console.log("PRINTING - START");
		for (var i = 0; i < arr.length; i++) {
			console.log(i + ". " + JSON.stringify(arr[i], null, 4));
		}
		console.log("PRINTING - END");
	}

}
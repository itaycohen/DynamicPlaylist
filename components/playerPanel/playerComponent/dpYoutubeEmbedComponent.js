angular
	.module('dpYoutubeEmbedComponent', [])
	.factory('dpYoutubeEmbedService', dpYoutubeEmbedService)
	.directive("dpYoutubeEmbedDirective", dpYoutubeEmbedDirective);


dpYoutubeEmbedService.$inject = ['$document', '$q', '$rootScope', '$window'];

//TODO - investigate & change as our format
function dpYoutubeEmbedService($document, $q, $rootScope, $window) {


	// https://github.com/brandly/angular-youtube-embed/blob/master/src/angular-youtube-embed.js
	var isReady = false;

	var defer = $q.defer();
	function onScriptLoad() {
		var time0 = new Date();
		var mili0 = time0.getMilliseconds();
		console.log("service was loaded, time: " + time0);
		console.log("service was loaded, mili: " + mili0);
		defer.resolve(window.getYoutubeEmbed);
	}

	var scriptTag = $document[0].createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.async = true;
	//TODO - consider change to https
	scriptTag.src = 'https://www.youtube.com/iframe_api';
	scriptTag.onreadystatechange = function () {
		var time0 = new Date();
		var mili0 = time0.getMilliseconds();
		console.log("onreadystatechange was loaded, time: " + time0);
		console.log("onreadystatechange was loaded, mili: " + mili0);
		if (this.readyState == 'complete')
			onScriptLoad();
	};
	scriptTag.onload = onScriptLoad();
	var s = $document[0].getElementsByTagName('body')[0];

	var time0 = new Date();
	var mili0 = time0.getMilliseconds();
	console.log("appendChild was loaded, time: " + time0);
	console.log("appendChild was loaded, mili: " + mili0);

	s.appendChild(scriptTag);

	function applyServiceIsReady() {
        $rootScope.$apply(function () {
            isReady = true;
        });
    }

	// If the library isn't here at all,
    if (typeof YT === "undefined") {
        // ...grab on to global callback, in case it's eventually loaded
        $window.onYouTubeIframeAPIReady = applyServiceIsReady;
        console.log('Unable to find YouTube iframe library on this page.');
    } else if (YT.loaded) {
        isReady = true;
    } else {
        YT.ready(applyServiceIsReady);
    }

	function getYoutubeEmbed() {
		var time0 = new Date();
		var mili0 = time0.getMilliseconds();
		console.log("promise was loaded, time: " + time0);
		console.log("promise was loaded, mili: " + mili0);

		return defer.promise;
	}

	function isAPIReady() {
		return isReady;
	}

	//////////

	var service = {
		getYoutubeEmbed: getYoutubeEmbed,
		isAPIReady: isAPIReady
	};
	return service;
}




dpYoutubeEmbedDirective.$inject = ['dpYoutubeEmbedService', 'dpSongsListLogic', '$window', '$http'];

function dpYoutubeEmbedDirective(dpYoutubeEmbedService, dpSongsListLogic, $window, $http) {
	var directive = {
		restrict: "E",
		templateUrl: "components/playerPanel/playerComponent/dpYoutubeEmbedTemplate.html",
		link: dpPlayerBoxPostLink,
		controller: dpYoutubeEmbedController
	};
	return directive;

	function dpPlayerBoxPostLink($scope, element, attrs) {

		// dpYoutubeEmbedService.getYoutubeEmbed().then(
		// 	setTimeout(function () {
		// 		loadYoutubeEmbed();
		// 	}, 2)
		// );

		// dpYoutubeEmbedService.getYoutubeEmbed().then(
		// 	loadYoutubeEmbed()
		// );


		function loadYoutubeEmbed() {
			var time1 = new Date();
			var mili = time1.getMilliseconds();
			console.log("onYouTubePlayerAPIReady loading, time: " + time1);
			console.log("onYouTubePlayerAPIReady loading, mili: " + mili);
			// $window.onYouTubePlayerAPIReady = function () {
				console.log("$window.onYouTubePlayerAPIReady");
				$scope.player = new YT.Player('player', {
					// width: $scope.getPlayerWidth(),
					// height: $scope.getPlayerHeight(),
					// width: "100%",
					// height: "100%",
					// TODO - consider handle list with Ids
					// playerVars: { 'autoplay': 0, 'controls': 1, 'playlist': ['oyEuk8j8imI', 'lp-EO5I60KA'] },
					playerVars: {
						'autoplay': 1,
						'controls': 1,
						'showinfo': 1
					},
					videoId: getFirstSongId(),
					events: {
						'onReady': onPlayerReadyCB,
						'onStateChange': onPlayerStateChangeCB,
						'onPlaybackQualityChange': onPlaybackQualityChangeCB,
						'onPlaybackRateChange': onPlaybackRateChangeCB,
						'onError': onErrorCB
					}
				});



			// };
		}


		function getFirstSongId() {
			// return 'oyEuk8j8imI';
			return dpSongsListLogic.getNextSongId();
		}

		function onPlayerReadyCB(event) {
			//TODO - aff name of directive
			console.log("Youtube Player Event - Player is ready");
			// $scope.isPlayingState = true;
			$scope.isPlaying = true;
			event.target.playVideo();
			// event.target.loadPlaylist(['PVzljDmoPVs','9NwZdxiLvGo']);
		}

		function onPlayerStateChangeCB(event) {
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
				case YT.PlayerState.UNSTARTED:
					console.log('unstarted');
					break;
				case YT.PlayerState.BUFFERING:
					console.log('buffering');
					break;
				case YT.PlayerState.CUED:
					console.log('video cued');
					break;
			}
		}

		function handlePlayerPlaying() {
			$scope.isPlaying = true;
			$scope.$apply();
			console.log("Youtube Player Event - handlePlayerPlaying");
		}

		function handlePlayerPaused() {
			$scope.isPlaying = false;
			$scope.$apply();
			//TODO - save time of video to session user - for recover
			console.log("Youtube Player Event - handlePlayerPaused");
		}


		function handlePlayerEnded() {
			console.log("Youtube Player Event - handlePlayerEnded");
			$scope.executePlayerEndedActions(false);
		}

		function onPlaybackQualityChangeCB(playbackQuality) {
			// console.log("Youtube Player Event - onPlaybackQualityChangeCB");
			// console.log('	playback quality changed to ' + playbackQuality.data);
		}

		function onPlaybackRateChangeCB(playbackRate) {
			// console.log("Youtube Player Event - onPlaybackRateChangeCB");
			// console.log('	playback rate changed to ' + playbackRate.data);
		}


		function onErrorCB(error) {
			console.log("Youtube Player Event - onErrorCB");
			console.log("	Error Data: " + e.data);

		}

		function getPlayerHeight() {
			return getPlayerWidth() * playerScreenRatio;
		}

		function getPlayerWidth() {
			var screenWidth = window.innerWidth;
			if (screenWidth > maxPlayerWidth) {
				return maxPlayerWidth;
			}
			return screenWidth;
		}

		var stopWatchingReady = $scope.$watch(
			function () {
				return dpYoutubeEmbedService.isAPIReady();
			},
			function (isReady) {
				if (isReady) {
					stopWatchingReady();
					loadYoutubeEmbed();
				}
			});


	} // dpPlayerBoxPostLink
} // dpYoutubeEmbedDirective


dpYoutubeEmbedController.$inject = ["$scope", "dpSongsListLogic"];
function dpYoutubeEmbedController($scope, dpSongsListLogic) {

	var playerScreenRatio = 0.52;
	var playerwidthReducerFactor = 0.5; // factor that decide how wide the player width can be
	var MINIMUM_WIDTH_OF_SCREEN = 768;

	var maxPlayerWidth = 800; 

	//hooking the dpSongsListLogic on logicService for html access
    $scope.logicService = dpSongsListLogic;

	$scope.isPlaying = getIsPlayingValue();

	$scope.onPauseSongClick = function () {
		console.log("pasue was clicked");
		$scope.isPlaying = false;
		$scope.player.pauseVideo();
	};

	$scope.onPlaySongClick = function () {
		console.log("play was clicked");
		$scope.isPlaying = true;
		$scope.player.playVideo();
	};

	$scope.executePlayerEndedActions = function (byAction) {
		dpSongsListLogic.popSongIndexFromListAndUpdate(byAction);
		$scope.player.videoId = dpSongsListLogic.getNextSongId();
		$scope.player.loadVideoById($scope.player.videoId);
		$scope.player.playVideo();

	};

	$scope.onNextSongClick = function () {
		console.log("Next Song was clicked");
		$scope.player.stopVideo();
		$scope.executePlayerEndedActions(true);

	};

	function getIsPlayingValue() {
		var isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		return !isIOSDevice;
	}



	/**
	 *  when do we show play/pause buttons
	 * -1 – unstarted 	-> show play
	 * 	0 – ended		-> show play
	 * 	1 – playing		-> show pause
	 * 	2 – paused		-> show play
	 * 	3 – buffering	-> show pause
	 * 	5 – video cued	-> show pause
	 */
	// NOT IN USE - TEMP FOR MORE STATES
	function isPlayState() {
		var playerState = $scope.getPlayerState();
		switch (playerState) {
			case '-1':
				return true;
			case '0':
				return true;
			case '1':
				return false;
			case '2':
				return true;
			case '3':
				return false;
			case '5':
				return false;
			default:
				return true;
		}
	}

	// $scope.shoudShowPlayButton = function () {
	// 	return $scope.isPlayingState;
	// };

	// $scope.shoudShowPauseButton = function () {
	// 	return !$scope.shoudShowPlayButton();
	// };

	$scope.getPlayerHeight = function () {
		return $scope.getPlayerWidth() * playerScreenRatio;
	};

	$scope.getPlayerWidth = function () {
		var screenWidth = window.innerWidth;
		if (screenWidth <= MINIMUM_WIDTH_OF_SCREEN) {
			return screenWidth;
		}
		var calculatedPlayerWidth = screenWidth * playerwidthReducerFactor;
		if (screenWidth > calculatedPlayerWidth) {
			return calculatedPlayerWidth > maxPlayerWidth ? maxPlayerWidth : calculatedPlayerWidth;
		}
		return screenWidth;
	};

	$scope.getBarWidth = function () {
		var playerWidth = $scope.getPlayerWidth();
		return { "width": playerWidth + "px" };

	};


	/**
	 * return player state code
	 * -1 – unstarted
	 * 	0 – ended
	 * 	1 – playing
	 * 	2 – paused
	 * 	3 – buffering
	 * 	5 – video cued
	 * otherwise return null
	 */
	$scope.getPlayerState = function () {
		return angular.isDefined($scope.player) ? $scope.player.getPlayerState() : 0;
	};


	// watchers

	// $scope.$watch("getPlayerState", showMeTheState);
	// $scope.$watch(function () {
	// 	return $scope.getPlayerState();
	// }, showMeTheState);

	// $scope.$watch(function () {
	// 	return $scope.isPlayingState;
	// }, [$scope.shoudShowPlayButton, $scope.shoudShowPauseButton]);

	// $scope.$watch(function () {
	// 	return $scope.isPlayingState;
	// }, $scope.shoudShowPauseButton);

	// function showMeTheState() {
	// 	var state = $scope.getPlayerState();
	// 	console.log("state was change to " + state);
	// }



}
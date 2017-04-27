angular
	.module('dpYoutubeEmbedDirective', ['dpYoutubeEmbedService'])
	.directive("dpYoutubeEmbedDirective", dpYoutubeEmbedDirective);


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


		dpYoutubeEmbedService.getYoutubeEmbed().then(function () {
			$window.onYouTubePlayerAPIReady = function () {
				$scope.player = new YT.Player('player', {
					width: $scope.getPlayerWidth(),
					height: $scope.getPlayerHeight(),
					// TODO - consider handle list with Ids
					// playerVars: { 'autoplay': 0, 'controls': 1, 'playlist': ['oyEuk8j8imI', 'lp-EO5I60KA'] },
					playerVars: { 'autoplay': 1, 'controls': 1 },
					videoId: getFirstSongId(),
					events: {
						'onReady': onPlayerReadyCB,
						'onStateChange': onPlayerStateChangeCB,
						'onPlaybackQualityChange': onPlaybackQualityChangeCB,
						'onPlaybackRateChange': onPlaybackRateChangeCB,
						'onError': onErrorCB
					}
				});

				function getFirstSongId() {
					// return 'oyEuk8j8imI';
					return dpSongsListLogic.getNextSongId();
				}

				function onPlayerReadyCB(event) {
					//TODO - aff name of directive
					console.log("Youtube Player Event - Player is ready");
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
							// console.log('unstarted');
							break;
						case YT.PlayerState.BUFFERING:
							// console.log('buffering');
							break;
						case YT.PlayerState.CUED:
							// console.log('video cued');
							break;
					}
				}

				function handlePlayerPlaying() {
					console.log("Youtube Player Event - handlePlayerPlaying");
				}

				function handlePlayerPaused() {
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


			};

		});
	} // dpPlayerBoxPostLink
} // dpYoutubeEmbedDirective


dpYoutubeEmbedController.$inject = ["$scope", "dpSongsListLogic"];
function dpYoutubeEmbedController($scope, dpSongsListLogic) {

	var playerScreenRatio = 0.52;
	var maxPlayerWidth = 960;

	//hooking the dpSongsListLogic on logicService for html access
    $scope.logicService = dpSongsListLogic;

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

	$scope.getPlayerHeight = function () {
		return $scope.getPlayerWidth() * playerScreenRatio;
	};

	$scope.getPlayerWidth = function () {
		var screenWidth = window.innerWidth;
		if (screenWidth > maxPlayerWidth) {
			return maxPlayerWidth;
		}
		return screenWidth;
	};

	$scope.getBarWidth = function () {
		var playerWidth = $scope.getPlayerWidth();
		return { "width": playerWidth + "px" };

	};

}
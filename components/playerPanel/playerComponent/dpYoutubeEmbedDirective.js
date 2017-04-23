angular
	.module('dpYoutubeEmbedDirective', ['dpYoutubeEmbedService'])
	.directive("dpYoutubeEmbedDirective", dpYoutubeEmbedDirective);


dpYoutubeEmbedDirective.$inject = ['dpYoutubeEmbedService', 'dpSongsListLogic', '$window', '$http'];


function dpYoutubeEmbedDirective(dpYoutubeEmbedService, dpSongsListLogic, $window, $http) {
	var directive = {
		restrict: "E",
		templateUrl: "components/playerPanel/playerComponent/dpYoutubeEmbedTemplate.html",
		link: dpPlayerBoxPostLink
	};
	return directive;

	function dpPlayerBoxPostLink($scope, element, attrs) {

		var playerScreenRatio = 0.52;
		var maxPlayerWidth = 960;

		dpYoutubeEmbedService.getYoutubeEmbed().then(function () {
			$window.onYouTubePlayerAPIReady = function () {
				$scope.player = new YT.Player('player', {
					width: getPlayerWidth(),
					height: getPlayerHeight(),
					// TODO - consider handle list with Ids
					// playerVars: { 'autoplay': 0, 'controls': 1, 'playlist': ['oyEuk8j8imI', 'lp-EO5I60KA'] },
					playerVars: { 'autoplay': 1, 'controls': 1 },
					videoId: getFirstSongId(),
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange
					}
				});

				// function onPlayerReady(event) { 
				// 	event.target.loadPlaylist({list: "PLW_RBtE1degILYYm3WD142aFvDV3072eg", index: 1, startSeconds: 10,suggestedQuality: "small"});
				// }

				function getFirstSongId() {
					// return 'oyEuk8j8imI';
					return dpSongsListLogic.getNextSongId();
				}

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
					dpSongsListLogic.popSongIndexFromListAndUpdate();
					$scope.player.videoId = dpSongsListLogic.getNextSongId();
					$scope.player.loadVideoById($scope.player.videoId);
					$scope.player.playVideo();
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
	}

}
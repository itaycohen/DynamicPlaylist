angular
	.module('dpYoutubeEmbedService', [])
	.factory('dpYoutubeEmbedService', dpYoutubeEmbedService);

dpYoutubeEmbedService.$inject = ['$document', '$q', '$rootScope'];

//TODO - investigate & change as our format
function dpYoutubeEmbedService($document, $q, $rootScope) {

	var defer = $q.defer();
	function onScriptLoad() {
		setTimeout(function () {

			console.log('sleep');
			// defer.resolve(window.getYoutubeEmbed);
		}, 5000);
		defer.resolve(window.getYoutubeEmbed);

	}
	var scriptTag = $document[0].createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.async = true;
	//TODO - consider change to https
	scriptTag.src = 'https://www.youtube.com/iframe_api';
	scriptTag.onreadystatechange = function () {
		if (this.readyState == 'complete')
			onScriptLoad();
	};
	scriptTag.onload = onScriptLoad();
	var s = $document[0].getElementsByTagName('body')[0];
	s.appendChild(scriptTag);

	function getYoutubeEmbed() {
		return defer.promise;
	}

	//////////

	var service = {
		getYoutubeEmbed: getYoutubeEmbed
	};
	return service;
}
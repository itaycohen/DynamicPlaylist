angular
    .module('dpSongsListLoaderService', [])
    .factory('dpSongsListLoaderService', dpSongsListLoaderService);

dpSongsListLoaderService.$inject = ["$http", "$q"];


function dpSongsListLoaderService($http, $q) {

    var service = {
        loadSongsList: loadSongsList,
    };
    return service;

    function loadSongsList() {
        var deferred = $q.defer();

        $http.get("data/songs/songsShrink.json")
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });

        return deferred.promise;
    }




}


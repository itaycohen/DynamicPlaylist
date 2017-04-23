var dpPlayerPanelService = angular.module('dpPlayerPanelService', []);

dpPlayerPanelService.factory('dpPlayerPanelService',['$rootScope' ,function ($rootScope) {



    //TODO - return from json
    function getSongIdByIndex(index) {
        return songsList;
    }



    return {
        getSongIdByIndex: getSongIdByIndex
    };

}]);
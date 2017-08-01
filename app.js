var app = angular.module('dynamicPlaylistApp', [
    'ngMaterial',
    'dpSongsListLoaderService',
    'dpSongsListUtils',
    'dpSongsListLogic',
    'dpPlayerPanelService',
    'dpYoutubeEmbedComponent',
    'dpGenreWidgetManagerComponent',
    'dpGenreWidgetComponent',
    'dpDynamicPlaylist'
]);

app.run(['$rootScope', 'dpSongsListLoaderService', 'dpSongsListLogic', function ($rootScope, dpSongsListLoaderService, dpSongsListLogic) {

    // RoadmapSettings.load({
    //     id: "597f7f5a864eaf57933fae86" // find on Settings page, Widget tab
    //     // email: "itay2002@gmail.com" // email of current user
    //     // first: user.first, // first name of current user
    //     // last: user.last, // last name of current user
    //     // revenue: parseInt(user.planAmount), // MRR of current user
    // });

    $rootScope.rawSongsList = dpSongsListLoaderService.getSongsList();
    dpSongsListLogic.initCalcSongsList();
}]);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan')
        .accentPalette('cyan');
});

app.controller('appController', appController);
appController.$inject = ["$scope", "$mdMedia", "$mdDialog"];
function appController($scope, $mdMedia, $mdDialog) {

    $scope.getMainViewClass = function () {
        if (!$mdMedia('max-width: 959px')) {
            return "main-view-big";
        }
    };

    $scope.openFeedbackForm = function (ev) {
        $mdDialog.show({
            // controller: DialogController,
            templateUrl: 'components/app/feedbackForm.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };
}


angular
    .module('dpPlayingBar', [])
    .directive("dpPlayingBar", dpPlayingBar);

dpPlayingBar.$inject = ["dpSongsListLogic"];
function dpPlayingBar() {
    var directive = {
        restrict: "E",
        template: "<ng-include src='getBarTemplateUrl()'/>",
        controller: dpPlayingBarController
    };
    return directive;
}

dpPlayingBarController.$inject = ['$scope', 'dpSongsListLogic', 'dpAppUtils', 'dpPlayerService', 'dpYoutubeEmbedService', '$window', '$timeout', '$interval'];
function dpPlayingBarController($scope, dpSongsListLogic, dpAppUtils, dpPlayerService, dpYoutubeEmbedService, $window, $timeout, $interval) {

    dpSongsListLogic.printTime("dpPlayingBarController");

    $scope.logicService = dpSongsListLogic;
    $scope.playerService = dpPlayerService;

    $scope.currentPlayerDuration = "0:00";
    
    
    // $rootScope.$watch(function() {
    //     return YT;
    // }, function(newValue) {
    //     console.log("test");
    // });

    // $rootScope.$watch(
    //     function () {
    //         return dpYoutubeEmbedService.isAPIReady();
    //     },
    //     function (isReady) {
    //         if (isReady) {
    //             console.log("ready");
    //             dpSongsListLogic.printTime("ready");
    //             $rootScope.getCurrentPlayerDuration();
    //         } else {
    //             console.log("not ready");
    //             dpSongsListLogic.printTime("not ready");
                
                
    //         }
    //     });

    // $rootScope.$watch(
    //     function () {
    //         if (dpYoutubeEmbedService.isAPIReady() && (typeof YT !== 'undefined' && typeof YT.get === "function")) {
    //             return true;
    //         } else {
    //             return false;
    //         }

    //     },
    //     function (ready) {
    //         if (ready) {
    //             console.log("ready");
    //             dpSongsListLogic.printTime("ready");
    //             $rootScope.getCurrentPlayerDuration();
    //         } else {
    //             console.log("not ready");
    //             dpSongsListLogic.printTime("not ready");
                
                
    //         }
    //     });


    // $rootScope.$watch(
    //     function () {
    //         if (typeof YT !== 'undefined' && typeof YT.get === "function") {
    //             var playerRef = getPlayerRef();
    //             // even if 'YT' was loaded, we need to check if 'loadVideoById' is available    
    //             if (typeof playerRef !== 'undefined' && typeof  playerRef.loadVideoById === "function") {
    //                 return true;
    //             } else {
    //                 return false;
                    
    //                 // setTimeout(function() {
    //                 //     $rootScope.$apply();
    //                 //   }, 2000);
    //             }
    //         } else {
    //             return false;
    //         }
    //     },
    //     function (ready) {
    //         if (ready) {
    //             console.log("ready");
    //             dpSongsListLogic.printTime("ready");
    //             $rootScope.getCurrentPlayerDuration();
    //         } else {
    //             console.log("not ready");
    //             dpSongsListLogic.printTime("not ready");
                
                
    //         }
    //     });


    // $rootScope.$watch(
    //     function () {
    //         if (typeof YT !== 'undefined' && typeof YT.get === "function") {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     },
    //     function (ready) {
    //         if (ready) {
    //             var playerRef = getPlayerRef();
    //             if (typeof playerRef !== 'undefined' && typeof  playerRef.loadVideoById === "function") {
    //                 console.log("ready");
    //                 dpSongsListLogic.printTime("ready");
    //                 $rootScope.getCurrentPlayerDuration();
    //             } else {
    //                 console.log("not ready");
    //                 $rootScope.$apply();

    //             }
                
                
    //         } else {
    //             console.log("not ready");
    //             dpSongsListLogic.printTime("not ready");
                
                
    //         }
    //     });



        $scope.$watch(
        function () {
            if (typeof YT !== 'undefined' && typeof YT.get === "function") {
                var playerRef = getPlayerRef();
                // even if 'YT' was loaded, we need to check if 'loadVideoById' is available    
                if (typeof playerRef !== 'undefined' && typeof  playerRef.loadVideoById === "function") {
                    return true;
                } else {
                    return false;
                    
                    // setTimeout(function() {
                    //     $rootScope.$apply();
                    //   }, 2000);
                }
            } else {
                return false;
            }
        },
        function (ready) {
            if (ready) {
                console.log("ready");
                dpSongsListLogic.printTime("ready");
                //playing();
                // $scope.currentPlayerDuration = dpPlayerService.getPlayerCurrentDuration();
            } else {
                console.log("not ready");
                dpSongsListLogic.printTime("not ready");
                
                
            }
        });


        function playing() {
            $interval(function () {

                    $scope.currentPlayerDuration = dpPlayerService.getPlayerCurrentDuration();




    }, 1000);   



        }


        $interval(function () {
            
                                   //     if (dpPlayerService.isPlaying()) {
            if (dpPlayerService.isPlayerEnabled()) {
                $scope.currentPlayerDuration = dpPlayerService.getPlayerCurrentDuration();
            }
            
            
            
            
                }, 1000);   
    


    // setTimeout(function () {

    //     if (dpPlayerService.isPlaying()) {
    //         if (dpPlayerService.isPlayerEnabled()) {
    //             $scope.currentPlayerDuration = dpPlayerService.getPlayerCurrentDuration();
    //         }
    //     }


    // }, 1000);   

    


    $scope.getBarTemplateUrl = function () {
        if (dpAppUtils.isDesktop()) {
            //big view - row layout (not small as in mobile - row)
            // we want scrollbar on the playlit (not like in mobile that we want to use the "device" scroll)
            return "components/playingBar/dpPlayingBarFixWideScreen.html";
        }
        return "components/playingBar/dpPlayingBarLongVerticalScreen.html";
    };

    $scope.onPlayPauseClick = function() {
        if (dpPlayerService.isPlaying()) {// needs to stop
            dpPlayerService.onPauseSongClick();
        } else {// needs to play
            dpPlayerService.onPlaySongClick();
        }

    };

   // no playing -> the pause icon is shown
    $scope.getPlayPauseStyle = function() {
        return dpPlayerService.isPlaying() ? "" : "paused";
    };

    // $rootScope.getCurrentPlayerDuration = function() {
    //     // return "5";
    //     setTimeout(function() {
    //         if (dpPlayerService.isPlayerEnabled()) {
    //             var a = dpPlayerService.getPlayerCurrentDuration();
    //             return a;
    //         } else {
    //             return "";
    //         }
     //       }, 1000);

    // };



    // $scope.getCurrentPlayerDuration = function() {
    //     return "6";
    //     setTimeout(function () {
            
    //                 if (dpPlayerService.isPlaying()) {
    //                     if (dpPlayerService.isPlayerEnabled()) {
    //                         return dpPlayerService.getPlayerCurrentDuration();
    //                     }
    //                 } else {
    //                     return "666";

    //                 }
            
            
    //             }, 1000);   
        
    //     // return dpPlayerService.getPlayerCurrentDuration() || "0:00";
        
    // };



    // };

    function getPlayerRef() {
        return YT.get("player");
    }

    // $rootScope.$watch(function() {
    //     return dpPlayerService.isPlayerEnabled();
    // }, function() {
    //     console.log(dpPlayerService.isPlayerEnabled());
    // });
    

}
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

    $scope.logicService = dpSongsListLogic;
    $scope.playerService = dpPlayerService;

    $scope.currentPlayerDurationText = "0:00";

    $scope.data = {};
    $scope.data.progressBarDuration = 0;
    $scope.data.currentVolumeLevel = 100;

    $scope.currentVolumeLevel = dpPlayerService.getVolumeLevel();

    // Watchers
    $scope.$watch(
        function () {
            return dpPlayerService.getVolumeLevel();
        },
        function () {
            $scope.data.currentVolumeLevel = dpPlayerService.getVolumeLevel();
    });

    $scope.$watch(
        function () {
            return dpPlayerService.isPlayerMuted();
        },
        function () {
            if (dpPlayerService.isPlayerMuted()) {
                setVolumeBarToMute();
            } else if ($scope.data.currentVolumeLevel === 0) {
                setVolumeBarToUnMute();
            }
    });


    // changing the progress bar duration time (text)
    $interval(function () {
        if (dpPlayerService.isPlayerEnabled()) {
            $scope.currentPlayerDurationText = dpPlayerService.getPlayerCurrentDurationFormatted(); // the duration text
        }
    }, 100);   
    

    // changing the progress bar duration (visual)
    var duringChange = false;
    $interval(function () {
        if (dpPlayerService.isPlayerEnabled() && !duringChange) {
            $scope.data.progressBarDuration = dpPlayerService.getPlayerCurrentDuration();  // the progress bar duration
        }
    }, 1000);   

    // IMPORTANT - WORKING!!!!! ALSO
    // $scope.$watch(
    //     function () {
    //         return dpPlayerService.getPlayerCurrentDuration();
    //     },
    //     function () {
            
    //         $scope.data.progressBarDuration = dpPlayerService.getPlayerCurrentDuration();
    //         $scope.currentPlayerDurationText = dpPlayerService.getPlayerCurrentDurationFormatted(); // the duration text
    // });

    $scope.getRawDurationByIndex = function(index) {
        return formattedDurationToRaw(dpSongsListLogic.getSongDurationByIndex(index));
    };


    // pressing on progress bar
    $scope.onProgressBarChangeDown = function () {
        //removine md-active class so we will not see the 'thumb' on the slider
        removeActiveClass("progress-bar")
        if (dpPlayerService.isPlayerEnabled()) {
            dpPlayerService.onPauseSongClick();
            dpPlayerService.playerSeekTo($scope.data.progressBarDuration);
        }
    }
    

    // release progress bar press
    $scope.onProgressBarChangeUp = function () {
        if (dpPlayerService.isPlayerEnabled()) {
            dpPlayerService.onPlaySongClick();
            duringChange = false;
        }
    }

    $scope.onVolumeBarChange = function() {
        //removine md-active class so we will not see the 'thumb' on the slider
        removeActiveClass("volume-slider");
        
        if ($scope.data.currentVolumeLevel === 0) {
            dpPlayerService.mutePlayer();
        } else if ($scope.isMuted()) {
            dpPlayerService.unMutePlayer();
        }
        dpPlayerService.setVolumeLevel($scope.data.currentVolumeLevel);
    };


    function removeActiveClass(className) {
        document.getElementById(className).classList.remove("md-active");
    }
    
    function formattedDurationToRaw(formattedDuration) {
        var splitDuration = formattedDuration.split(':');
        var totalSeconds = (+splitDuration[0]) * 60 + (+splitDuration[1]); 
        return totalSeconds;
    }

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

    function getPlayerRef() {
        return YT.get("player");
    }

    $scope.isMuted = function() {
        return dpPlayerService.isPlayerMuted();
    };

    $scope.onSpeakerIconClick = function() {
        if ($scope.isMuted()) {
            dpPlayerService.unMutePlayer();
            setVolumeBarToUnMute();
        } else {
            dpPlayerService.mutePlayer();
            setVolumeBarToMute();
        }
    };

    function setVolumeBarToMute() {
        $scope.data.currentVolumeLevel = 0;
    }

    function setVolumeBarToUnMute() {
        $scope.data.currentVolumeLevel = dpPlayerService.getVolumeLevel();
    }

    $scope.getNameMaxWidth = function () {
        // remove the width of the other elements in the control bar, sum of: 
        // play & next - 107
        // workart - 55
        // song name - 10
        var maxWidth = window.innerWidth - 172;
        maxWidth = maxWidth + "px";
        return {"max-width": maxWidth};
    }

}



// $scope.$watch(
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
//             //playing();
//             // $scope.currentPlayerDurationText = dpPlayerService.getPlayerCurrentDuration();
//         } else {
//             console.log("not ready");
//             dpSongsListLogic.printTime("not ready");
            
            
//         }
// }); 


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

        // };






    // $scope.$watch(function () {
    //     return $scope.progressBarDuration;
    // }, function () {
    //     console.log($scope.progressBarDuration);
    //     dpPlayerService.playerSeekTo($scope.progressBarDuration);
    // });


///------------------------


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


        // $rootScope.$watch(function() {
    //     return dpPlayerService.isPlayerEnabled();
    // }, function() {
    //     console.log(dpPlayerService.isPlayerEnabled());
    // });
angular
    .module('dpSongsListUtils', [])
    .factory('dpSongsListUtils', dpSongsListUtils);

function dpSongsListUtils() {


    var service = {
        findInitSongId: findInitSongId,
        shuffle: shuffle,
        printArrayToConsole: printArrayToConsole,
        printArrayWithObjToConsole: printArrayWithObjToConsole

    };
    return service;

    //////////

    //TODO - return from json
    function findInitSongId(songsList) {
        return songsList;
    }

    function shuffle(arr) {
        var j, x, i;
        for (i = arr.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = arr[i - 1];
            arr[i - 1] = arr[j];
            arr[j] = x;
        }
    }

    function printArrayToConsole(arr) {
        // console.log("PRINTING - START");
        for (var i = 0; i < arr.length; i++) {
            console.log(i + ". " + arr[i]);
        }
        // console.log("PRINTING - END");
    }

    function printArrayWithObjToConsole(arr) {
        // console.log("PRINTING - START");
        for (var i = 0; i < arr.length; i++) {
            console.log(i + ". " + JSON.stringify(arr[i], null, 4));
        }
        // console.log("PRINTING - END");
    }



}


angular
    .module('dpSongsListLoaderService', [])
    .factory('dpSongsListLoaderService', dpSongsListLoaderService);

dpSongsListLoaderService.$inject = ["$http", "$q"];


function dpSongsListLoaderService($http, $q) {

    var songsShrink = [
        {
            "i": 0,
            "id": "oyEuk8j8imI",
            "a": "Justin Bieber",
            "s": "Love Yourself",
            "g": [
                0,
                1,
                5,
                0,
                4
            ]
        },
        {
            "i": 1,
            "id": "9NwZdxiLvGo",
            "a": "Skrillex & Diplo",
            "s": "To Ü ft AlunaGeorge",
            "g": [
                5,
                0,
                2,
                0,
                0
            ]
        },
        {
            "i": 2,
            "id": "lp-EO5I60KA",
            "a": "Ed Sheeran",
            "s": "Thinking Out Loud",
            "g": [
                0,
                3,
                4,
                0,
                5
            ]
        },
        {
            "i": 3,
            "id": "fRh_vgS2dFE",
            "a": "Justin Bieber",
            "s": "Sorry",
            "g": [
                2,
                1,
                5,
                0,
                3
            ]
        },
        {
            "i": 4,
            "id": "kOkQ4T5WO9E",
            "a": "Calvin Harris ft. Rihanna",
            "s": "This Is What You Came For",
            "g": [
                5,
                0,
                4,
                1,
                2
            ]
        },
        {
            "i": 5,
            "id": "ebXbLfLACGM",
            "a": "Calvin Harris",
            "s": "Summer",
            "g": [
                5,
                0,
                4,
                0,
                0
            ]
        },
        {
            "i": 6,
            "id": "JRfuAukYTKg",
            "a": "David Guetta ft. Sia",
            "s": "Titanium",
            "g": [
                4,
                0,
                5,
                0,
                2
            ]
        },
        {
            "i": 7,
            "id": "PVzljDmoPVs",
            "a": "David Guetta ft. Sia",
            "s": "She Wolf (Falling To Pieces)",
            "g": [
                5,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 8,
            "id": "UtF6Jej8yb4",
            "a": "Avicii",
            "s": "The Nights",
            "g": [
                5,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 9,
            "id": "YxIiPLVR6NA",
            "a": "Avicii",
            "s": "Hey Brother",
            "g": [
                5,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 11,
            "id": "papuvlVeZg8",
            "a": "Clean Bandit",
            "s": "Rockabye ft. Sean Paul & Anne-Marie",
            "g": [
                5,
                0,
                4,
                0,
                0
            ]
        },
        {
            "i": 12,
            "id": "L3wKzyIN1yk",
            "a": "Human",
            "s": "Rag'n'Bone Man",
            "g": [
                0,
                2,
                4,
                0,
                3
            ]
        },
        {
            "i": 13,
            "id": "59Q_lhgGANc",
            "a": "Jain",
            "s": "Makeba",
            "g": [
                3,
                2,
                5,
                0,
                2
            ]
        },
        {
            "i": 14,
            "id": "nYh-n7EOtMA",
            "a": "Sia",
            "s": "Cheap Thrills",
            "g": [
                1,
                0,
                5,
                0,
                2
            ]
        },
        {
            "i": 15,
            "id": "iOxzG3jjFkY",
            "a": "WILLY WILLIAM",
            "s": "Ego",
            "g": [
                4,
                0,
                4,
                0,
                0
            ]
        },
        {
            "i": 16,
            "id": "euCqAq6BRa4",
            "a": "DJ Snake",
            "s": "Let Me Love You ft. Justin Bieber",
            "g": [
                2,
                0,
                5,
                0,
                3
            ]
        },
        {
            "i": 17,
            "id": "-2U0Ivkn2Ds",
            "a": "A Great Big World, Christina Aguilera",
            "s": "Say Something",
            "g": [
                0,
                0,
                3,
                0,
                5
            ]
        },
        {
            "i": 18,
            "id": "RhU9MZ98jxo",
            "a": "The Chainsmokers",
            "s": "Paris Lyric",
            "g": [
                0,
                2,
                2,
                0,
                4
            ]
        },
        {
            "i": 20,
            "id": "7Qp5vcuMIlk",
            "a": "Ed Sheeran",
            "s": "Castle On The Hill",
            "g": [
                0,
                3,
                1,
                0,
                4
            ]
        },
        {
            "i": 21,
            "id": "qFLhGq0060w",
            "a": "The Weeknd",
            "s": "I Feel It Coming ft. Daft Punk",
            "g": [
                0,
                0,
                4,
                4,
                2
            ]
        },
        {
            "i": 22,
            "id": "hn3wJ1_1Zsg",
            "a": "LP",
            "s": "Lost On You",
            "g": [
                3,
                1,
                4,
                0,
                3
            ]
        },
        {
            "i": 23,
            "id": "GzU8KqOY8YA",
            "a": "Sean Paul",
            "s": "No Lie ft. Dua Lipa",
            "g": [
                2,
                0,
                2,
                4,
                0
            ]
        },
        {
            "i": 24,
            "id": "IcrbM1l_BoI",
            "a": "Avicii",
            "s": "Wake Me Up",
            "g": [
                5,
                0,
                2,
                0,
                1
            ]
        },
        {
            "i": 25,
            "id": "UqyT8IEBkvY",
            "a": "Bruno Mars",
            "s": "24K Magic",
            "g": [
                2,
                0,
                5,
                2,
                1
            ]
        },
        {
            "i": 26,
            "id": "b4Bj7Zb-YD4",
            "a": "Calvin Harris",
            "s": "My Way",
            "g": [
                4,
                0,
                2,
                0,
                1
            ]
        },
        {
            "i": 27,
            "id": "sG6aWhZnbfw",
            "a": "Sia",
            "s": "The Greatest ft. Kendrick Lamar",
            "g": [
                1,
                0,
                3,
                0,
                3
            ]
        },
        {
            "i": 28,
            "id": "UprcpdwuwCg",
            "a": "twenty one pilots",
            "s": "Heathens",
            "g": [
                1,
                2,
                3,
                0,
                2
            ]
        },
        {
            "i": 29,
            "id": "450p7goxZqg",
            "a": "John Legend",
            "s": "All of Me",
            "g": [
                0,
                1,
                1,
                0,
                5
            ]
        },
        {
            "i": 30,
            "id": "ru0K8uYEZWw",
            "a": "Justin Timberlake",
            "s": "CAN'T STOP THE FEELING!",
            "g": [
                1,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 31,
            "id": "Io0fBr1XBUA",
            "a": "The Chainsmokers",
            "s": "Don't Let Me Down ft. Daya",
            "g": [
                1,
                4,
                4,
                0,
                2
            ]
        },
        {
            "i": 32,
            "id": "MYSVMgRr6pw",
            "a": "Hozier",
            "s": "Take Me To Church",
            "g": [
                0,
                1,
                2,
                0,
                4
            ]
        },
        {
            "i": 33,
            "id": "uEJuoEs1UxY",
            "a": "Bebe Rexha",
            "s": "I Got You",
            "g": [
                4,
                0,
                4,
                0,
                0
            ]
        },
        {
            "i": 34,
            "id": "PT2_F-1esPk",
            "a": "The Chainsmokers",
            "s": "Closer (Lyric) ft. Halsey",
            "g": [
                0,
                3,
                2,
                0,
                1
            ]
        },
        {
            "i": 35,
            "id": "kJQP7kiw5Fk",
            "a": "Luis Fonsi",
            "s": "Despacito ft. Daddy Yankee",
            "g": [
                2,
                0,
                4,
                1,
                3
            ]
        },
        {
            "i": 36,
            "id": "1LXsm9y-z3I",
            "a": "Matt Simons",
            "s": "Catch & Release",
            "g": [
                1,
                0,
                2,
                0,
                3
            ]
        },
        {
            "i": 37,
            "id": "BR_DFMUzX4E",
            "a": "Armin van Buuren feat. Trevor Guthrie",
            "s": "This Is What It Feels Like",
            "g": [
                5,
                0,
                3,
                0,
                0
            ]
        },
        {
            "i": 38,
            "id": "7F37r50VUTQ",
            "a": "ZAYN, Taylor Swift",
            "s": "I Don’t Wanna Live Forever",
            "g": [
                0,
                0,
                3,
                1,
                3
            ]
        },
        {
            "i": 39,
            "id": "34Na4j8AVgA",
            "a": "The Weeknd",
            "s": "Starboy ft. Daft Punk",
            "g": [
                0,
                0,
                3,
                4,
                3
            ]
        },
        {
            "i": 40,
            "id": "OPf0YbXqDm0",
            "a": "Mark Ronson",
            "s": "Uptown Funk ft. Bruno Mars",
            "g": [
                1,
                0,
                4,
                1,
                2
            ]
        },
        {
            "i": 41,
            "id": "hT_nvWreIhg",
            "a": "OneRepublic",
            "s": "Counting Stars",
            "g": [
                1,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 42,
            "id": "2zNSgSzhBfM",
            "a": "MACKLEMORE & RYAN LEWIS",
            "s": "CAN'T HOLD US",
            "g": [
                2,
                0,
                3,
                0,
                2
            ]
        },
        {
            "i": 43,
            "id": "QK8mJJJvaes",
            "a": "MACKLEMORE & RYAN LEWIS",
            "s": "THRIFT SHOP FEAT. WANZ",
            "g": [
                1,
                0,
                4,
                2,
                0
            ]
        },
        {
            "i": 44,
            "id": "jGflUbPQfW8",
            "a": "OMI",
            "s": "Cheerleader (Felix Jaehn Remix)",
            "g": [
                1,
                0,
                4,
                1,
                2
            ]
        },
        {
            "i": 45,
            "id": "m-M1AtrxztU",
            "a": "Clean Bandit",
            "s": "Rather Be ft. Jess Glynne",
            "g": [
                2,
                1,
                3,
                0,
                2
            ]
        },
        {
            "i": 46,
            "id": "YqeW9_5kURI",
            "a": "Major Lazer & DJ Snake",
            "s": "Lean On (feat. MØ)",
            "g": [
                3,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 47,
            "id": "ktvTqknDobU",
            "a": "Imagine Dragons",
            "s": "Radioactive",
            "g": [
                2,
                2,
                3,
                0,
                2
            ]
        },
        {
            "i": 48,
            "id": "pUjE9H8QlA4",
            "a": "Mr. Probz",
            "s": "Waves (Robin Schulz Remix Radio Edit)",
            "g": [
                3,
                0,
                2,
                0,
                0
            ]
        },
        {
            "i": 49,
            "id": "DuFUtL8zUAk",
            "a": "Martin Garrix",
            "s": "Animals",
            "g": [
                5,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": 50,
            "id": "9Sc-ir2UwGU",
            "a": "Kygo",
            "s": "Firestone ft. Conrad Sewell",
            "g": [
                1,
                3,
                2,
                0,
                2
            ]
        },
        {
            "i": 51,
            "id": "foE1mO2yM04",
            "a": "Mike Posner",
            "s": "I Took A Pill In Ibiza (Seeb Remix)",
            "g": [
                4,
                0,
                3,
                0,
                0
            ]
        },
        {
            "i": 52,
            "id": "pXRviuL6vMY",
            "a": "twenty one pilots",
            "s": "Stressed Out",
            "g": [
                0,
                2,
                3,
                1,
                1
            ]
        },
        {
            "i": 53,
            "id": "60ItHLz5WEA",
            "a": "Alan Walker",
            "s": "Faded",
            "g": [
                5,
                0,
                2,
                0,
                0
            ]
        },
        {
            "i": 54,
            "id": "fyaI4-5849w",
            "a": "DJ Khaled",
            "s": "Wild Thoughts ft. Rihanna, Bryson Tiller",
            "g": [
                2,
                0,
                3,
                5,
                0
            ]
        },
        {
            "i": 55,
            "id": "nfs8NYg7yQM",
            "a": "Charlie Puth",
            "s": "Attention",
            "g": [
                0,
                1,
                5,
                0,
                4
            ]
        },
        {
            "i": 56,
            "id": "ozv4q2ov3Mk",
            "a": "Calvin Harris",
            "s": "Feels ft. Pharrell Williams, Katy Perry, Big Sean",
            "g": [
                2,
                1,
                5,
                0,
                1
            ]
        },
        {
            "i": 57,
            "id": "JGwWNGJdvx8",
            "a": "Ed Sheeran",
            "s": "Shape of You",
            "g": [
                2,
                1,
                5,
                0,
                3
            ]
        },
        {
            "i": 58,
            "id": "CTFtOOh47oo",
            "a": "French Montana",
            "s": "Unforgettable ft. Swae Lee",
            "g": [
                0,
                0,
                3,
                5,
                0
            ]
        },
        {
            "i": 59,
            "id": "7wtfhZwyrcc",
            "a": "Imagine Dragons",
            "s": "Believer",
            "g": [
                1,
                5,
                3,
                0,
                1
            ]
        },
        {
            "i": 60,
            "id": "FM7MFYoylVs",
            "a": "The Chainsmokers & Coldplay",
            "s": "Something Just Like This",
            "g": [
                1,
                2,
                5,
                0,
                3
            ]
        },
        {
            "i": 61,
            "id": "weeI1G46q0o",
            "a": "DJ Khaled",
            "s": "I'm the One ft. Justin Bieber, Quavo, Chance the Rapper, Lil Wayne",
            "g": [
                0,
                0,
                3,
                5,
                1
            ]
        },
        {
            "i": 62,
            "id": "NGLxoKOvzu4",
            "a": "Jason Derulo",
            "s": "Swalla (feat. Nicki Minaj & Ty Dolla $ign)",
            "g": [
                2,
                0,
                3,
                5,
                0
            ]
        },
        {
            "i": 63,
            "id": "aatr_2MstrI",
            "a": "Clean Bandit",
            "s": "Symphony feat. Zara Larsson",
            "g": [
                3.5,
                0,
                4,
                0,
                1
            ]
        },
        {
            "i": 64,
            "id": "xvZqHgFz51I",
            "a": "Future",
            "s": "Mask Off",
            "g": [
                0,
                0,
                0,
                5,
                1
            ]
        },
        {
            "i": 65,
            "id": "PKB4cioGs98",
            "a": "Jax Jones",
            "s": "You Don't Know Me ft. RAYE",
            "g": [
                4,
                0,
                3,
                0,
                0
            ]
        },
        {
            "i": 66,
            "id": "Y1_VsyLAGuk",
            "a": "Burak Yeter",
            "s": "Tuesday ft. Danelle Sandoval",
            "g": [
                3,
                2,
                2,
                0,
                0
            ]
        },
        {
            "i": 67,
            "id": "9sg-A-eS6Ig",
            "a": "Enrique Iglesias",
            "s": "SUBEME LA RADIO ft. Descemer Bueno, Zion & Lennox",
            "g": [
                2,
                0,
                4,
                0,
                2
            ]
        },
        {
            "i": 68,
            "id": "0yW7w8F2TVA",
            "a": "James Arthur",
            "s": "Say You Won't Let Go",
            "g": [
                0,
                0,
                2,
                0,
                5
            ]
        },
        {
            "i": 69,
            "id": "PMivT7MJ41M",
            "a": "Bruno Mars",
            "s": "That’s What I Like",
            "g": [
                0,
                0,
                4,
                0,
                2
            ]
        },
        {
            "i": 70,
            "id": "tvTRZJ-4EyI",
            "a": "Kendrick Lamar",
            "s": "HUMBLE",
            "g": [
                0,
                0,
                1,
                5,
                0
            ]
        },
        {
            "i": 71,
            "id": "6Mgqbai3fKo",
            "a": "Shakira",
            "s": "Chantaje ft. Maluma",
            "g": [
                1,
                0,
                3,
                0,
                2
            ]
        },
        {
            "i": 72,
            "id": "h--P8HzYZ74",
            "a": "Zedd, Alessia Cara",
            "s": "Stay ",
            "g": [
                3.8,
                0,
                3,
                0,
                0
            ]
        }
    ];

    var service = {
        loadSongsList: loadSongsList,
        getTempSongsList : getTempSongsList
    };
    return service;

    function getTempSongsList() {
        return songsShrink;
    }

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


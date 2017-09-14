angular
    .module('dpSongsListLoaderService', [])
    .factory('dpSongsListLoaderService', dpSongsListLoaderService);

dpSongsListLoaderService.$inject = ["$http", "$q"];


function dpSongsListLoaderService($http, $q) {

    // allGenresNames = ['Pop', 'Alternative', 'Dance', 'R&B', 'Latin', 'Soul', 'Hip-Hop'];

    var songsShrink = [
        {
            "i": 0,
            "id": "oyEuk8j8imI",
            "a": "Justin Bieber",
            "s": "Love Yourself",
            "g": [
                5,
                0,
                0,
                0,
                0,
                4,
                0
            ]
        },
        {
            "i": 1,
            "id": "9NwZdxiLvGo",
            "a": "Skrillex & Diplo",
            "s": "To Ü ft AlunaGeorge",
            "g": [
                2,
                0,
                5,
                0,
                0,
                0,
                2
            ]
        },
        {
            "i": 2,
            "id": "lp-EO5I60KA",
            "a": "Ed Sheeran",
            "s": "Thinking Out Loud",
            "g": [
                4,
                2,
                0,
                0,
                0,
                5,
                0
            ]
        },
        {
            "i": 3,
            "id": "fRh_vgS2dFE",
            "a": "Justin Bieber",
            "s": "Sorry",
            "g": [
                5,
                0,
                2,
                0,
                0,
                1,
                1
            ]
        },
        {
            "i": 4,
            "id": "kOkQ4T5WO9E",
            "a": "Calvin Harris ft. Rihanna",
            "s": "This Is What You Came For",
            "g": [
                4,
                0,
                5,
                1,
                0,
                1,
                1
            ]
        },
        {
            "i": 5,
            "id": "ebXbLfLACGM",
            "a": "Calvin Harris",
            "s": "Summer",
            "g": [
                4,
                0,
                5,
                0,
                0,
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
                5,
                0,
                4,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 7,
            "id": "PVzljDmoPVs",
            "a": "David Guetta ft. Sia",
            "s": "She Wolf (Falling To Pieces)",
            "g": [
                4,
                0,
                5,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 8,
            "id": "UtF6Jej8yb4",
            "a": "Avicii",
            "s": "The Nights",
            "g": [
                4,
                0,
                5,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 9,
            "id": "YxIiPLVR6NA",
            "a": "Avicii",
            "s": "Hey Brother",
            "g": [
                4,
                0,
                5,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 10,
            "id": "h--P8HzYZ74",
            "a": "Zedd, Alessia Cara",
            "s": "Stay ",
            "g": [
                3,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": 11,
            "id": "papuvlVeZg8",
            "a": "Clean Bandit",
            "s": "Rockabye ft. Sean Paul & Anne-Marie",
            "g": [
                4,
                0,
                5,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": 12,
            "id": "L3wKzyIN1yk",
            "a": "Rag'n'Bone Man",
            "s": "Human",
            "g": [
                4,
                3,
                0,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": 13,
            "id": "59Q_lhgGANc",
            "a": "Jain",
            "s": "Makeba",
            "g": [
                5,
                0,
                2,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 14,
            "id": "nYh-n7EOtMA",
            "a": "Sia",
            "s": "Cheap Thrills",
            "g": [
                5,
                0,
                1,
                0,
                0,
                2,
                0
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
                0,
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
                5,
                0,
                3,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 17,
            "id": "-2U0Ivkn2Ds",
            "a": "A Great Big World, Christina Aguilera",
            "s": "Say Something",
            "g": [
                3,
                0,
                0,
                0,
                0,
                5,
                0
            ]
        },
        {
            "i": 18,
            "id": "RhU9MZ98jxo",
            "a": "The Chainsmokers",
            "s": "Paris",
            "g": [
                3,
                0,
                2,
                0,
                0,
                4,
                0
            ]
        },
        {
            "i": 19,
            "id": "6Mgqbai3fKo",
            "a": "Shakira",
            "s": "Chantaje ft. Maluma",
            "g": [
                3,
                0,
                1,
                0,
                4,
                2,
                0
            ]
        },
        {
            "i": 20,
            "id": "7Qp5vcuMIlk",
            "a": "Ed Sheeran",
            "s": "Castle On The Hill",
            "g": [
                3,
                3,
                0,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 21,
            "id": "qFLhGq0060w",
            "a": "The Weeknd",
            "s": "I Feel It Coming ft. Daft Punk",
            "g": [
                4,
                0,
                1,
                4,
                0,
                2,
                1
            ]
        },
        {
            "i": 22,
            "id": "hn3wJ1_1Zsg",
            "a": "LP",
            "s": "Lost On You",
            "g": [
                4,
                2,
                2,
                0,
                0,
                3,
                0
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
                3,
                0,
                0,
                2
            ]
        },
        {
            "i": 24,
            "id": "IcrbM1l_BoI",
            "a": "Avicii",
            "s": "Wake Me Up",
            "g": [
                2,
                0,
                5,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 25,
            "id": "UqyT8IEBkvY",
            "a": "Bruno Mars",
            "s": "24K Magic",
            "g": [
                5,
                0,
                1,
                3,
                0,
                1,
                2
            ]
        },
        {
            "i": 26,
            "id": "b4Bj7Zb-YD4",
            "a": "Calvin Harris",
            "s": "My Way",
            "g": [
                2,
                0,
                4,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 27,
            "id": "sG6aWhZnbfw",
            "a": "Sia",
            "s": "The Greatest ft. Kendrick Lamar",
            "g": [
                3,
                0,
                1,
                2,
                0,
                3,
                2
            ]
        },
        {
            "i": 28,
            "id": "UprcpdwuwCg",
            "a": "twenty one pilots",
            "s": "Heathens",
            "g": [
                3,
                3,
                1,
                0,
                0,
                2,
                2
            ]
        },
        {
            "i": 29,
            "id": "450p7goxZqg",
            "a": "John Legend",
            "s": "All of Me",
            "g": [
                3,
                0,
                0,
                3,
                0,
                5,
                0
            ]
        },
        {
            "i": 30,
            "id": "ru0K8uYEZWw",
            "a": "Justin Timberlake",
            "s": "CAN'T STOP THE FEELING!",
            "g": [
                4,
                0,
                2,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 31,
            "id": "Io0fBr1XBUA",
            "a": "The Chainsmokers",
            "s": "Don't Let Me Down ft. Daya",
            "g": [
                4,
                0,
                2,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 32,
            "id": "MYSVMgRr6pw",
            "a": "Hozier",
            "s": "Take Me To Church",
            "g": [
                2,
                4,
                0,
                0,
                0,
                3,
                0
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
                0,
                0,
                2
            ]
        },
        {
            "i": 34,
            "id": "PT2_F-1esPk",
            "a": "The Chainsmokers",
            "s": "Closer ft. Halsey",
            "g": [
                4,
                0,
                3,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 35,
            "id": "kJQP7kiw5Fk",
            "a": "Luis Fonsi",
            "s": "Despacito ft. Daddy Yankee",
            "g": [
                4,
                0,
                2,
                1,
                4,
                3,
                0
            ]
        },
        {
            "i": 36,
            "id": "1LXsm9y-z3I",
            "a": "Matt Simons",
            "s": "Catch & Release",
            "g": [
                3,
                2,
                2,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 37,
            "id": "BR_DFMUzX4E",
            "a": "Armin van Buuren feat. Trevor Guthrie",
            "s": "This Is What It Feels Like",
            "g": [
                3,
                0,
                5,
                0,
                0,
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
                3,
                0,
                0,
                2,
                0,
                1,
                0
            ]
        },
        {
            "i": 39,
            "id": "34Na4j8AVgA",
            "a": "The Weeknd",
            "s": "Starboy ft. Daft Punk",
            "g": [
                3,
                0,
                1,
                4,
                0,
                3,
                0
            ]
        },
        {
            "i": 40,
            "id": "OPf0YbXqDm0",
            "a": "Mark Ronson",
            "s": "Uptown Funk ft. Bruno Mars",
            "g": [
                4,
                0,
                1,
                1,
                0,
                2,
                0
            ]
        },
        {
            "i": 41,
            "id": "hT_nvWreIhg",
            "a": "OneRepublic",
            "s": "Counting Stars",
            "g": [
                4,
                3,
                1,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 42,
            "id": "2zNSgSzhBfM",
            "a": "MACKLEMORE & RYAN LEWIS",
            "s": "CAN'T HOLD US",
            "g": [
                3,
                0,
                2,
                0,
                0,
                2,
                4
            ]
        },
        {
            "i": 43,
            "id": "QK8mJJJvaes",
            "a": "MACKLEMORE & RYAN LEWIS",
            "s": "THRIFT SHOP FEAT. WANZ",
            "g": [
                4,
                0,
                1,
                2,
                0,
                0,
                4
            ]
        },
        {
            "i": 44,
            "id": "jGflUbPQfW8",
            "a": "OMI",
            "s": "Cheerleader (Felix Jaehn Remix)",
            "g": [
                4,
                0,
                1,
                2,
                0,
                2,
                0
            ]
        },
        {
            "i": 45,
            "id": "m-M1AtrxztU",
            "a": "Clean Bandit",
            "s": "Rather Be ft. Jess Glynne",
            "g": [
                3,
                0,
                3,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 46,
            "id": "YqeW9_5kURI",
            "a": "Major Lazer & DJ Snake",
            "s": "Lean On (feat. MØ)",
            "g": [
                4,
                0,
                3,
                0,
                0,
                1,
                2
            ]
        },
        {
            "i": 47,
            "id": "ktvTqknDobU",
            "a": "Imagine Dragons",
            "s": "Radioactive",
            "g": [
                2,
                5,
                1,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 48,
            "id": "pUjE9H8QlA4",
            "a": "Mr. Probz",
            "s": "Waves (Robin Schulz Remix)",
            "g": [
                3,
                0,
                2,
                2,
                0,
                0,
                1
            ]
        },
        {
            "i": 49,
            "id": "DuFUtL8zUAk",
            "a": "Martin Garrix",
            "s": "Animals",
            "g": [
                0,
                0,
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
                2,
                0,
                3,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": 51,
            "id": "foE1mO2yM04",
            "a": "Mike Posner",
            "s": "I Took A Pill In Ibiza (Seeb Remix)",
            "g": [
                3,
                0,
                4,
                0,
                0,
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
                2,
                4,
                0,
                1,
                0,
                0,
                2
            ]
        },
        {
            "i": 53,
            "id": "60ItHLz5WEA",
            "a": "Alan Walker",
            "s": "Faded",
            "g": [
                2,
                0,
                5,
                0,
                0,
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
                1,
                5,
                0,
                1,
                4
            ]
        },
        {
            "i": 55,
            "id": "nfs8NYg7yQM",
            "a": "Charlie Puth",
            "s": "Attention",
            "g": [
                5,
                0,
                2,
                2,
                0,
                4,
                0
            ]
        },
        {
            "i": 56,
            "id": "ozv4q2ov3Mk",
            "a": "Calvin Harris",
            "s": "Feels ft. Pharrell Williams, Katy Perry, Big Sean",
            "g": [
                5,
                0,
                2,
                1,
                0,
                1,
                0
            ]
        },
        {
            "i": 57,
            "id": "JGwWNGJdvx8",
            "a": "Ed Sheeran",
            "s": "Shape of You",
            "g": [
                5,
                0,
                1,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": 58,
            "id": "CTFtOOh47oo",
            "a": "French Montana",
            "s": "Unforgettable ft. Swae Lee",
            "g": [
                3,
                0,
                0,
                4,
                0,
                1,
                5
            ]
        },
        {
            "i": 59,
            "id": "7wtfhZwyrcc",
            "a": "Imagine Dragons",
            "s": "Believer",
            "g": [
                3,
                5,
                1,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 60,
            "id": "FM7MFYoylVs",
            "a": "The Chainsmokers & Coldplay",
            "s": "Something Just Like This",
            "g": [
                5,
                0,
                2,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": 61,
            "id": "weeI1G46q0o",
            "a": "DJ Khaled",
            "s": "I'm the One ft. Justin Bieber, Quavo, Chance the Rapper, Lil Wayne",
            "g": [
                3,
                0,
                0,
                5,
                0,
                1,
                5
            ]
        },
        {
            "i": 62,
            "id": "NGLxoKOvzu4",
            "a": "Jason Derulo",
            "s": "Swalla (feat. Nicki Minaj & Ty Dolla $ign)",
            "g": [
                3,
                0,
                2,
                5,
                0,
                0,
                4
            ]
        },
        {
            "i": 63,
            "id": "aatr_2MstrI",
            "a": "Clean Bandit",
            "s": "Symphony feat. Zara Larsson",
            "g": [
                3,
                0,
                4,
                0,
                0,
                1,
                0
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
                3,
                0,
                1,
                5
            ]
        },
        {
            "i": 65,
            "id": "PKB4cioGs98",
            "a": "Jax Jones",
            "s": "You Don't Know Me ft. RAYE",
            "g": [
                3,
                0,
                4,
                0,
                0,
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
                1,
                0,
                3,
                0,
                0,
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
                3,
                0,
                1,
                0,
                4,
                1,
                0
            ]
        },
        {
            "i": 68,
            "id": "0yW7w8F2TVA",
            "a": "James Arthur",
            "s": "Say You Won't Let Go",
            "g": [
                3,
                2,
                0,
                0,
                0,
                4,
                0
            ]
        },
        {
            "i": 69,
            "id": "PMivT7MJ41M",
            "a": "Bruno Mars",
            "s": "That’s What I Like",
            "g": [
                4,
                0,
                0,
                4,
                0,
                2,
                2
            ]
        },
        {
            "i": 70,
            "id": "tvTRZJ-4EyI",
            "a": "Kendrick Lamar",
            "s": "HUMBLE",
            "g": [
                1,
                0,
                0,
                5,
                0,
                0,
                2
            ]
        },
        {
            "i": "71",
            "id": "qPTfXwPf_HM",
            "a": "Jonas Blue",
            "s": "Mama ft. William Singe",
            "g": [
                3,
                0,
                4,
                0,
                0,
                0,
                1
            ]
        },
        {
            "i": "72",
            "id": "SC4xMk98Pdc",
            "a": "Post Malone",
            "s": "Congratulations ft. Quavo",
            "g": [
                0,
                0,
                0,
                3,
                0,
                0,
                5
            ]
        },
        {
            "i": "73",
            "id": "-FyjEnoIgTM",
            "a": "Bruno Mars",
            "s": "Versace On The Floor",
            "g": [
                2,
                0,
                0,
                3,
                0,
                4,
                0
            ]
        },
        {
            "i": "74",
            "id": "k2qgadSvNyU",
            "a": "Dua Lipa",
            "s": "New Rules",
            "g": [
                4,
                0,
                3,
                1,
                0,
                0,
                0
            ]
        },
        {
            "i": "75",
            "id": "RqcjBLMaWCg",
            "a": "David Guetta ft Justin Bieber",
            "s": "2U",
            "g": [
                3,
                0,
                3,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "76",
            "id": "72UO0v5ESUo",
            "a": "Luis Fonsi, Daddy Yankee",
            "s": "Despacito ft. Justin Bieber",
            "g": [
                4,
                0,
                2,
                0,
                3,
                0,
                0
            ]
        },
        {
            "i": "77",
            "id": "87gWaABqGYs",
            "a": "Ed Sheeran",
            "s": "Galway Girl",
            "g": [
                4,
                0,
                0,
                1,
                0,
                1,
                0
            ]
        },
        {
            "i": "78",
            "id": "dmJefsOErr0",
            "a": "Rae Sremmurd",
            "s": "Swang",
            "g": [
                0,
                0,
                0,
                3,
                0,
                0,
                5
            ]
        },
        {
            "i": "79",
            "id": "Um7pMggPnug",
            "a": "Katy Perry",
            "s": "Chained To The Rhythm ft. Skip Marley",
            "g": [
                5,
                0,
                1,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "80",
            "id": "qN4ooNx77u0",
            "a": "Harry Styles",
            "s": "Sign of the Times",
            "g": [
                2,
                3,
                0,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "81",
            "id": "S-sJp1FfG7Q",
            "a": "Migos",
            "s": "Bad and Boujee ft Lil Uzi Vert",
            "g": [
                0,
                0,
                0,
                4,
                0,
                0,
                4
            ]
        },
        {
            "i": "82",
            "id": "5JxgDJvqGmM",
            "a": "Mike Perry",
            "s": "The Ocean ft. Shy Martin",
            "g": [
                3,
                0,
                4,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "83",
            "id": "xUVz4nRmxn4",
            "a": "Galantis",
            "s": "No Money",
            "g": [
                2,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "84",
            "id": "Ey_hgKCCYU4",
            "a": "Jonas Blue",
            "s": "Perfect Strangers ft. JP Cooper",
            "g": [
                2,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "85",
            "id": "GTyN-DB_v5M",
            "a": "Zara Larsson, MNEK",
            "s": "Never Forget You",
            "g": [
                3,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "86",
            "id": "D5drYkLiLI8",
            "a": "Kygo, Selena Gomez",
            "s": "It Ain't Me",
            "g": [
                3,
                0,
                2,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "87",
            "id": "waU75jdUnYw",
            "a": "The Weeknd",
            "s": "Earned It",
            "g": [
                1,
                0,
                0,
                3,
                0,
                4,
                0
            ]
        },
        {
            "i": "88",
            "id": "RgKAFK5djSk",
            "a": "Wiz Khalifa",
            "s": "See You Again ft. Charlie Puth",
            "g": [
                2,
                0,
                0,
                0,
                0,
                3,
                4
            ]
        },
        {
            "i": "89",
            "id": "4NJlUribp3c",
            "a": "Desiigner",
            "s": "Panda",
            "g": [
                0,
                0,
                0,
                2,
                0,
                0,
                4
            ]
        },
        {
            "i": "90",
            "id": "KEI4qSrkPAs",
            "a": "The Weeknd",
            "s": "Can't Feel My Face",
            "g": [
                2,
                0,
                2,
                4,
                0,
                2,
                1
            ]
        },
        {
            "i": "91",
            "id": "wnJ6LuUFpMo",
            "a": "J. Balvin, Willy William",
            "s": "Mi Gente",
            "g": [
                2,
                0,
                0,
                0,
                4,
                0,
                0
            ]
        },
        {
            "i": "92",
            "id": "Km4BayZykwE",
            "a": "J. Balvin",
            "s": "Si Tu Novio Te Deja Sola ft. Bad Bunny",
            "g": [
                1,
                0,
                0,
                3,
                5,
                1,
                0
            ]
        },
        {
            "i": "93",
            "id": "iOe6dI2JhgU",
            "a": "Ricky Martin",
            "s": "Vente Pa' Ca ft. Maluma",
            "g": [
                3,
                0,
                0,
                0,
                5,
                0,
                0
            ]
        },
        {
            "i": "94",
            "id": "1-xGerv5FOk",
            "a": "Alan Walker",
            "s": "Alone",
            "g": [
                1,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "95",
            "id": "yzTuBuRdAyA",
            "a": "The Weeknd",
            "s": "The Hills",
            "g": [
                3,
                0,
                0,
                3,
                0,
                2,
                0
            ]
        },
        {
            "i": "96",
            "id": "mWRsgZuwf_8",
            "a": "Imagine Dragons",
            "s": "Demons",
            "g": [
                3,
                5,
                0,
                null,
                0,
                null,
                0
            ]
        },
        {
            "i": "97",
            "id": "AJtDXIazrMo",
            "a": "Ellie Goulding",
            "s": "Love Me Like You Do",
            "g": [
                3,
                0,
                2,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": "98",
            "id": "C_3d6GntKbk",
            "a": "ZAYN",
            "s": "PILLOWTALK",
            "g": [
                3,
                0,
                0,
                1,
                0,
                3,
                0
            ]
        },
        {
            "i": "99",
            "id": "uxpDa-c-4Mc",
            "a": "Drake",
            "s": "Hotline Bling",
            "g": [
                2,
                0,
                0,
                2,
                0,
                1,
                4
            ]
        },
        {
            "i": "100",
            "id": "YQHsXMglC9A",
            "a": "Adele",
            "s": "Hello",
            "g": [
                3,
                0,
                0,
                0,
                0,
                4,
                0
            ]
        },
        {
            "i": "101",
            "id": "SXiSVQZLje8",
            "a": "Ariana Grande",
            "s": "Side To Side ft. Nicki Minaj",
            "g": [
                4,
                0,
                0,
                2,
                0,
                0,
                1
            ]
        },
        {
            "i": "102",
            "id": "fKopy74weus",
            "a": "Imagine Dragons",
            "s": "Thunder",
            "g": [
                2,
                5,
                0,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "103",
            "id": "w5tWYmIOWGk",
            "a": "Imagine Dragons",
            "s": "On Top Of The World",
            "g": [
                2,
                4,
                0,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "104",
            "id": "NRWUoDpo2fo",
            "a": "alt-J",
            "s": "Left Hand Free",
            "g": [
                2,
                5,
                0,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "105",
            "id": "rVeMiVU77wo",
            "a": "alt-J",
            "s": "Breezeblocks",
            "g": [
                1,
                5,
                0,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "106",
            "id": "S3fTw_D3l10",
            "a": "alt-J",
            "s": "Taro",
            "g": [
                1,
                5,
                0,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "107",
            "id": "dCCXq9QB-dQ",
            "a": "alt-J",
            "s": "Hunger Of The Pine",
            "g": [
                1,
                5,
                1,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "108",
            "id": "Q06wFUi5OM8",
            "a": "alt-J",
            "s": "Matilda",
            "g": [
                0,
                5,
                0,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": "109",
            "id": "hi4pzKvuEQM",
            "a": "Chet Faker",
            "s": "Gold",
            "g": [
                0,
                3,
                2,
                0,
                0,
                0,
                2
            ]
        },
        {
            "i": "110",
            "id": "Qg6BwvDcANg",
            "a": "alt-J",
            "s": "Tessellate",
            "g": [
                1,
                5,
                2,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "111",
            "id": "bpOSxM0rNPM",
            "a": "Arctic Monkeys",
            "s": "Do I Wanna Know?",
            "g": [
                1,
                5,
                0,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": "112",
            "id": "VQH8ZTgna3Q",
            "a": "Arctic Monkeys",
            "s": "R U Mine?",
            "g": [
                0,
                5,
                0,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "113",
            "id": "Y4NGoS330HE",
            "a": "Arctic Monkeys",
            "s": "I Wanna Be Yours",
            "g": [
                0,
                5,
                0,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": "114",
            "id": "Y4NGoS330HE",
            "a": "Arctic Monkeys",
            "s": "Fluorescent Adolescent",
            "g": [
                2,
                5,
                0,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "115",
            "id": "PVjiKRfKpPI",
            "a": "Hozier",
            "s": "Take Me To Church",
            "g": [
                2,
                5,
                0,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": "116",
            "id": "nntGTK2Fhb0",
            "a": "Skrillex and Diplo",
            "s": "Where Are Ü Now with Justin Bieber",
            "g": [
                3,
                0,
                4,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "117",
            "id": "-HjpL-Ns6_A",
            "a": "Louis Tomlinson",
            "s": "Back to You ft. Bebe Rexha, Digital Farm Animals",
            "g": [
                3,
                0,
                2,
                0,
                0,
                2,
                0
            ]
        },
        {
            "i": "118",
            "id": "3AtDnEC4zak",
            "a": "Charlie Puth",
            "s": "We Don't Talk Anymore (feat. Selena Gomez)",
            "g": [
                4,
                0,
                1,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": "119",
            "id": "dT2owtxkU8k",
            "a": "Shawn Mendes",
            "s": "There's Nothing Holdin' Me Back",
            "g": [
                4,
                2,
                3,
                0,
                0,
                3,
                0
            ]
        },
        {
            "i": "120",
            "id": "pBkHHoOIIn8",
            "a": "Portugal. The Man",
            "s": "Feel It Still",
            "g": [
                1,
                4,
                1,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "121",
            "id": "YykjpeuMNEk",
            "a": "Coldplay",
            "s": "Hymn For The Weekend",
            "g": [
                4,
                1,
                2,
                0,
                0,
                1,
                0
            ]
        },
        {
            "i": "122",
            "id": "HL1UzIK-flA",
            "a": "Rihanna",
            "s": "Work ft. Drake",
            "g": [
                2,
                0,
                1,
                4,
                0,
                0,
                0
            ]
        },
        {
            "i": "123",
            "id": "tD4HCZe-tew",
            "a": "Zara Larsson",
            "s": "Lush Life",
            "g": [
                3,
                1,
                3,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "124",
            "id": "XNWlrawfRAI",
            "a": "Fifth Harmony",
            "s": "Down ft. Gucci Mane",
            "g": [
                4,
                0,
                1,
                1,
                0,
                0,
                1
            ]
        },
        {
            "i": "125",
            "id": "lY2yjAdbvdQ",
            "a": "Shawn Mendes",
            "s": "Treat You Better",
            "g": [
                5,
                0,
                1,
                0,
                0,
                0,
                0
            ]
        },
        {
            "i": "126",
            "id": "Pw-0pbY9JeU",
            "a": "twenty one pilots",
            "s": "Ride",
            "g": [
                1,
                4,
                2,
                0,
                0,
                0,
                2
            ]
        },
        {
            "i": "127",
            "id": "VbfpW0pbvaU",
            "a": "Shawn Mendes",
            "s": "Stitches",
            "g": [
                5,
                0,
                2,
                1,
                0,
                2,
                0
            ]
        },
        {
            "i": "128",
            "id": "2vjPBrBU-TM",
            "a": "Sia",
            "s": "Chandelier",
            "g": [
                4,
                1,
                2,
                0,
                0,
                1,
                0
            ]
        }
    ];

    var service = {
        loadSongsList: loadSongsList,
        getTempSongsList: getTempSongsList
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


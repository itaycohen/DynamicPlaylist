angular
	.module('dpSongsListLoaderService', [])
	.factory('dpSongsListLoaderService', dpSongsListLoaderService);


function dpSongsListLoaderService() {


	var songsList = [
    {
        index: 0,
        id: 'oyEuk8j8imI',
        genreWeights: {
            house: 0,
            pop: 5,
            rb: 0,
            ir: 1,
            soul: 4
        },
        details:
        {
            artist: 'Justin Bieber',
            songName: 'Love Yourself'
        }
    },
    {
        index: 1,
        id: '9NwZdxiLvGo',
        genreWeights: {
            house: 5,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            //TODO - consider change to array
            artist: 'Skrillex & Diplo',
            songName: 'To Ü ft AlunaGeorge'
        }
    },
    {
        index: 2,
        id: 'lp-EO5I60KA',
        genreWeights: {
            house: 0,
            pop: 4,
            rb: 0,
            ir: 3,
            soul: 5
        },
        details:
        {
            artist: 'Ed Sheeran',
            songName: 'Thinking Out Loud'
        }
    },
    {
        index: 3,
        id: 'fRh_vgS2dFE',
        genreWeights: {
            house: 2,
            pop: 5,
            rb: 0,
            ir: 1,
            soul: 3
        },
        details:
        {
            artist: 'Justin Bieber',
            songName: 'Sorry'
        }
    },
    {
        index: 4,
        id: 'kOkQ4T5WO9E',
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 1,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Calvin Harris ft. Rihanna',
            songName: 'This Is What You Came For'
        }
    },
    {
        index: 5,
        id: 'ebXbLfLACGM',
        //TODO - handle duplicate weights
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Calvin Harris',
            songName: 'Summer'
        }
    },
    {
        index: 6,
        id: 'JRfuAukYTKg',
        genreWeights: {
            house: 4,
            pop: 5,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'David Guetta ft. Sia',
            songName: 'Titanium'
        }
    },
    {
        index: 7,
        id: 'PVzljDmoPVs',
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'David Guetta ft. Sia',
            songName: 'She Wolf (Falling To Pieces)'
        }
    },
    {
        index: 8,
        id: 'UtF6Jej8yb4',
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Avicii',
            songName: 'The Nights'
        }
    },
    {
        index: 9,
        id: 'YxIiPLVR6NA',
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Avicii',
            songName: 'Hey Brother'
        }
    },
    // {
    //     index: 10,
    //     id: 'UtF6Jej8yb4',
    //     genreWeights: {
    //         house: 5,
    //         pop: 4,
    //         rb: 0,
    //         ir: 0,
    //         soul: 1
    //     },
    //     details:
    //     {
    //         artist: 'Avicii',
    //         songName: 'The Nights'
    //     }
    // },
    {
        index: 11,
        id: 'papuvlVeZg8',
        genreWeights: {
            house: 5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Clean Bandit',
            songName: 'Rockabye ft. Sean Paul & Anne-Marie'
        }
    },
    {
        index: 12,
        id: 'L3wKzyIN1yk',
        genreWeights: {
            house: 0,
            pop: 4,
            rb: 0,
            ir: 2,
            soul: 3
        },
        details:
        {
            artist: 'Human',
            songName: "Rag'n'Bone Man"
        }
    },
    {
        index: 13,
        id: '59Q_lhgGANc',
        genreWeights: {
            house: 3,
            pop: 5,
            rb: 0,
            ir: 2,
            soul: 2
        },
        details:
        {
            artist: 'Jain',
            songName: 'Makeba'
        }
    },
    {
        index: 14,
        id: 'nYh-n7EOtMA',
        genreWeights: {
            house: 1,
            pop: 5,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Sia',
            songName: 'Cheap Thrills'
        }
    },
    {
        index: 15,
        id: 'iOxzG3jjFkY',
        genreWeights: {
            house: 4,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'WILLY WILLIAM',
            songName: 'Ego'
        }
    },
    {
        index: 16,
        id: 'euCqAq6BRa4',
        genreWeights: {
            house: 2,
            pop: 5,
            rb: 0,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'DJ Snake',
            songName: 'Let Me Love You ft. Justin Bieber'
        }
    },
    {
        index: 17,
        id: '-2U0Ivkn2Ds',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 5
        },
        details:
        {
            artist: 'A Great Big World, Christina Aguilera',
            songName: 'Say Something'
        }
    },
    {
        index: 18,
        id: 'RhU9MZ98jxo',
        genreWeights: {
            house: 0,
            pop: 2,
            rb: 0,
            ir: 2,
            soul: 4
        },
        details:
        {
            artist: 'The Chainsmokers',
            songName: 'Paris Lyric'
        }
    },
    // {
    //     index: 19,
    //     id: 'UtF6Jej8yb4',
    //     genreWeights: {
    //         house: 5,
    //         pop: 4,
    //         rb: 0,
    //         ir: 0,
    //         soul: 1
    //     },
    //     details:
    //     {
    //         artist: 'Avicii',
    //         songName: 'The Nights'
    //     }
    // },
    {
        index: 20,
        id: '7Qp5vcuMIlk',
        genreWeights: {
            house: 0,
            pop: 1,
            rb: 0,
            ir: 3,
            soul: 4
        },
        details:
        {
            artist: 'Ed Sheeran',
            songName: 'Castle On The Hill'
        }
    },
    {
        index: 21,
        id: 'qFLhGq0060w',
        genreWeights: {
            house: 0,
            pop: 4,
            rb: 4,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'The Weeknd',
            songName: 'I Feel It Coming ft. Daft Punk'
        }
    },
    {
        index: 22,
        id: 'hn3wJ1_1Zsg',
        genreWeights: {
            house: 3,
            pop: 4,
            rb: 0,
            ir: 1,
            soul: 3
        },
        details:
        {
            artist: 'LP',
            songName: 'Lost On You'
        }
    },
    {
        index: 23,
        id: 'GzU8KqOY8YA',
        genreWeights: {
            house: 2,
            pop: 2,
            rb: 4,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Sean Paul',
            songName: 'No Lie ft. Dua Lipa'
        }
    },
    {
        index: 24,
        id: 'IcrbM1l_BoI',
        genreWeights: {
            house: 5,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Avicii',
            songName: 'Wake Me Up'
        }
    },
    {
        index: 25,
        id: 'UqyT8IEBkvY',
        genreWeights: {
            house: 2,
            pop: 5,
            rb: 2,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Bruno Mars',
            songName: '24K Magic'
        }
    },
    {
        index: 26,
        id: 'b4Bj7Zb-YD4',
        genreWeights: {
            house: 4,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Calvin Harris',
            songName: 'My Way'
        }
    },
    {
        index: 27,
        id: 'sG6aWhZnbfw',
        genreWeights: {
            house: 1,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'Sia',
            songName: 'The Greatest ft. Kendrick Lamar'
        }
    },
    {
        index: 28,
        id: 'UprcpdwuwCg',
        genreWeights: {
            house: 1,
            pop: 3,
            rb: 0,
            ir: 2,
            soul: 2
        },
        details:
        {
            artist: 'twenty one pilots',
            songName: 'Heathens'
        }
    },
    {
        index: 29,
        id: '450p7goxZqg',
        genreWeights: {
            house: 0,
            pop: 1,
            rb: 0,
            ir: 1,
            soul: 5
        },
        details:
        {
            artist: 'John Legend',
            songName: 'All of Me'
        }
    },
    {
        index: 30,
        id: 'ru0K8uYEZWw',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Justin Timberlake',
            songName: "CAN'T STOP THE FEELING!"
        }
    },
    {
        index: 31,
        id: 'Io0fBr1XBUA',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 0,
            ir: 4,
            soul: 2
        },
        details:
        {
            artist: 'The Chainsmokers',
            songName: "Don't Let Me Down ft. Daya"
        }
    },
    {
        index: 32,
        id: 'MYSVMgRr6pw',
        genreWeights: {
            house: 0,
            pop: 2,
            rb: 0,
            ir: 1,
            soul: 4
        },
        details:
        {
            artist: 'Hozier',
            songName: 'Take Me To Church'
        }
    },
    {
        index: 33,
        id: 'uEJuoEs1UxY',
        genreWeights: {
            house: 4,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Bebe Rexha',
            songName: 'I Got You'
        }
    },
    {
        index: 34,
        id: 'PT2_F-1esPk',
        genreWeights: {
            house: 0,
            pop: 2,
            rb: 0,
            ir: 3,
            soul: 1
        },
        details:
        {
            artist: 'The Chainsmokers',
            songName: 'Closer (Lyric) ft. Halsey'
        }
    },
    {
        index: 35,
        id: 'kJQP7kiw5Fk',
        genreWeights: {
            house: 2,
            pop: 4,
            rb: 1,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'Luis Fonsi',
            songName: 'Despacito ft. Daddy Yankee'
        }
    },
    {
        index: 36,
        id: '1LXsm9y-z3I',
        genreWeights: {
            house: 1,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'Matt Simons',
            songName: 'Catch & Release'
        }
    },
    {
        index: 37,
        id: 'BR_DFMUzX4E',
        genreWeights: {
            house: 5,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Armin van Buuren feat. Trevor Guthrie',
            songName: 'This Is What It Feels Like'
        }
    },
    {
        index: 38,
        id: '7F37r50VUTQ',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 1,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'ZAYN, Taylor Swift',
            songName: 'I Don’t Wanna Live Forever'
        }
    },
    {
        index: 39,
        id: '34Na4j8AVgA',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 4,
            ir: 0,
            soul: 3
        },
        details:
        {
            artist: 'The Weeknd',
            songName: 'Starboy ft. Daft Punk'
        }
    },
    {
        index: 40,
        id: 'OPf0YbXqDm0',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 1,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Mark Ronson',
            songName: 'Uptown Funk ft. Bruno Mars'
        }
    },
    {
        index: 41,
        id: 'hT_nvWreIhg',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'OneRepublic',
            songName: 'Counting Stars'
        }
    },
    {
        index: 42,
        id: '2zNSgSzhBfM',
        genreWeights: {
            house: 2,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'MACKLEMORE & RYAN LEWIS',
            songName: "CAN'T HOLD US"
        }
    },
    {
        index: 43,
        id: 'QK8mJJJvaes',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 2,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'MACKLEMORE & RYAN LEWIS',
            songName: 'THRIFT SHOP FEAT. WANZ'
        }
    },
    {
        index: 44,
        id: 'jGflUbPQfW8',
        genreWeights: {
            house: 1,
            pop: 4,
            rb: 1,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'OMI',
            songName: 'Cheerleader (Felix Jaehn Remix)'
        }
    },
    {
        index: 45,
        id: 'm-M1AtrxztU',
        genreWeights: {
            house: 2,
            pop: 3,
            rb: 0,
            ir: 1,
            soul: 2
        },
        details:
        {
            artist: 'Clean Bandit',
            songName: 'Rather Be ft. Jess Glynne'
        }
    },
    {
        index: 46,
        id: 'YqeW9_5kURI',
        genreWeights: {
            house: 3,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Major Lazer & DJ Snake',
            songName: 'Lean On (feat. MØ)'
        }
    },
    {
        index: 47,
        id: 'ktvTqknDobU',
        genreWeights: {
            house: 2,
            pop: 3,
            rb: 0,
            ir: 2,
            soul: 2
        },
        details:
        {
            artist: 'Imagine Dragons',
            songName: 'Radioactive'
        }
    },
    {
        index: 48,
        id: 'pUjE9H8QlA4',
        genreWeights: {
            house: 3,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Mr. Probz',
            songName: 'Waves (Robin Schulz Remix Radio Edit)'
        }
    },
    {
        index: 49,
        id: 'DuFUtL8zUAk',
        genreWeights: {
            house: 5,
            pop: 0,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Martin Garrix',
            songName: 'Animals'
        }
    },
    {
        index: 50,
        id: '9Sc-ir2UwGU',
        genreWeights: {
            house: 1,
            pop: 2,
            rb: 0,
            ir: 3,
            soul: 2
        },
        details:
        {
            artist: 'Kygo',
            songName: 'Firestone ft. Conrad Sewell'
        }
    },
    {
        index: 51,
        id: 'foE1mO2yM04',
        genreWeights: {
            house: 4,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Mike Posner',
            songName: 'I Took A Pill In Ibiza (Seeb Remix)'
        }
    },
    {
        index: 52,
        id: 'pXRviuL6vMY',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 1,
            ir: 2,
            soul: 1
        },
        details:
        {
            artist: 'twenty one pilots',
            songName: 'Stressed Out'
        }
    },
    {
        index: 53,
        id: '60ItHLz5WEA',
        genreWeights: {
            house: 5,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Alan Walker',
            songName: 'Faded'
        }
    },
    {
        index: 54,
        id: 'fyaI4-5849w',
        genreWeights: {
            house: 2,
            pop: 3,
            rb: 5,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'DJ Khaled',
            songName: 'Wild Thoughts ft. Rihanna, Bryson Tiller'
        }
    },
    {
        index: 55,
        id: 'nfs8NYg7yQM',
        genreWeights: {
            house: 0,
            pop: 5,
            rb: 0,
            ir: 1,
            soul: 4
        },
        details:
        {
            artist: 'Charlie Puth',
            songName: 'Attention'
        }
    },
    {
        index: 56,
        id: 'ozv4q2ov3Mk',
        genreWeights: {
            house: 2,
            pop: 5,
            rb: 0,
            ir: 1,
            soul: 1
        },
        details:
        {
            artist: 'Calvin Harris',
            songName: 'Feels ft. Pharrell Williams, Katy Perry, Big Sean'
        }
    },
    {
        index: 57,
        id: 'JGwWNGJdvx8',
        genreWeights: {
            house: 2,
            pop: 5,
            rb: 0,
            ir: 1,
            soul: 3
        },
        details:
        {
            artist: 'Ed Sheeran',
            songName: 'Shape of You'
        }
    },
    {
        index: 58,
        id: 'CTFtOOh47oo',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 5,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'French Montana',
            songName: 'Unforgettable ft. Swae Lee'
        }
    },
    {
        index: 59,
        id: '7wtfhZwyrcc',
        genreWeights: {
            house: 1,
            pop: 3,
            rb: 0,
            ir: 5,
            soul: 1
        },
        details:
        {
            artist: 'Imagine Dragons',
            songName: 'Believer'
        }
    },
    {
        index: 60,
        id: 'FM7MFYoylVs',
        genreWeights: {
            house: 1,
            pop: 5,
            rb: 0,
            ir: 2,
            soul: 3
        },
        details:
        {
            artist: 'The Chainsmokers & Coldplay',
            songName: 'Something Just Like This'
        }
    },
    {
        index: 61,
        id: 'weeI1G46q0o',
        genreWeights: {
            house: 0,
            pop: 3,
            rb: 5,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'DJ Khaled',
            songName: "I'm the One ft. Justin Bieber, Quavo, Chance the Rapper, Lil Wayne"
        }
    },
    {
        index: 62,
        id: 'NGLxoKOvzu4',
        genreWeights: {
            house: 2,
            pop: 3,
            rb: 5,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Jason Derulo',
            songName: 'Swalla (feat. Nicki Minaj & Ty Dolla $ign)'
        }
    },
    {
        index: 63,
        id: 'aatr_2MstrI',
        genreWeights: {
            house: 3.5,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Clean Bandit',
            songName: 'Symphony feat. Zara Larsson'
        }
    },
    {
        index: 64,
        id: 'xvZqHgFz51I',
        genreWeights: {
            house: 0,
            pop: 0,
            rb: 5,
            ir: 0,
            soul: 1
        },
        details:
        {
            artist: 'Future',
            songName: 'Mask Off'
        }
    },
    {
        index: 65,
        id: 'PKB4cioGs98',
        genreWeights: {
            house: 4,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Jax Jones',
            songName: "You Don't Know Me ft. RAYE"
        }
    },
    {
        index: 66,
        id: 'Y1_VsyLAGuk',
        genreWeights: {
            house: 3,
            pop: 2,
            rb: 0,
            ir: 2,
            soul: 0
        },
        details:
        {
            artist: 'Burak Yeter',
            songName: 'Tuesday ft. Danelle Sandoval'
        }
    },
    {
        index: 67,
        id: '9sg-A-eS6Ig',
        genreWeights: {
            house: 2,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Enrique Iglesias',
            songName: 'SUBEME LA RADIO ft. Descemer Bueno, Zion & Lennox'
        }
    },
    {
        index: 68,
        id: '0yW7w8F2TVA',
        genreWeights: {
            house: 0,
            pop: 2,
            rb: 0,
            ir: 0,
            soul: 5
        },
        details:
        {
            artist: 'James Arthur',
            songName: "Say You Won't Let Go"
        }
    },
    {
        index: 69,
        id: 'PMivT7MJ41M',
        genreWeights: {
            house: 0,
            pop: 4,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Bruno Mars',
            songName: 'That’s What I Like'
        }
    },
    {
        index: 70,
        id: 'tvTRZJ-4EyI',
        genreWeights: {
            house: 0,
            pop: 1,
            rb: 5,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Kendrick Lamar',
            songName: 'HUMBLE'
        }
    },
    {
        index: 71,
        id: '6Mgqbai3fKo',
        genreWeights: {
            house: 1,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 2
        },
        details:
        {
            artist: 'Shakira',
            songName: 'Chantaje ft. Maluma'
        }
    },
    {
        index: 72,
        id: 'h--P8HzYZ74',
        genreWeights: {
            house: 3.8,
            pop: 3,
            rb: 0,
            ir: 0,
            soul: 0
        },
        details:
        {
            artist: 'Zedd, Alessia Cara',
            songName: 'Stay '
        }
    }



];

	var service = {
		getSongsList: getSongsList
	};
	return service;

    //TODO - return from json
	function getSongsList() {
		return songsList;
	}
	// $http.get('songs.json')
	// 	.then(function(res) {
	// 		$scope.myNewFile = res;
	// 		alert("Success");
	// 	});




    // ,
    // {
    //     index: XXX,
    //     id: 'AAA',
    //     genreWeights: {
    //         house: 0,
    //         pop: 0,
    //         rb: 0,
    //         ir: 0,
    //         soul: 0
    //     },
    //     details:
    //     {
    //         artist: 'BBB',
    //         songName: 'CCC'
    //     }
    // }

}


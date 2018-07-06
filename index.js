const {ApolloServer,gql} = require('apollo-server');

let tracks = [{
        id: 'fb4d4fbcfdafc6f2610a',
        name: 'Nonstop',
        band: 'Drake',
    },
    {
        id: 'eb0dafbc42abac61a192',
        name: 'Moonlight',
        band: 'XXXTENTACION',
    },
];

let playlists = [{
        id: 'fbbab83e03aa31044fe6',
        title: "Rap caviar",
        genre: "Rap",
        tracks: [{
                name: 'Nonstop',
                band: 'Drake',
            },
            {
                name: 'Moonlight',
                band: 'XXXTENTACION',
            }
        ]
    },
    {
        id: '7265a541f37ed2bc8e55',
        title: "Backyard BBQ",
        genre: "Pop",
        tracks: []
    },
];

const typeDefs = gql `
enum Genre {
    Pop
    House
    Minimal
    Techno
    Electro
    Jazz
    Rap
}
schema {
    query: Query
    mutation: Mutation
} 
type Query{
    tracks: [Track]
    track(id:ID!): [Track]
    playlists(offset:Int=0,limit:Int=10): [Playlist]
    playlist(id:ID!): [Playlist]
}
 type Mutation {
    createTrack(input: TrackInput): Track
    createPlaylist(input: PLaylistInput): Playlist
}
type Track{
    name: String
    band: String
}
type Playlist{
    title: String!
    genre: Genre
    tracks: [Track]
}
input TrackInput{
    name: String
    band: String
}
input PLaylistInput{
    title: String
    genre: Genre
}`;

class Track {
    constructor({id, name, band}) {
        this.id = id;
        this.name = name;
        this.band = band;
    }
}

class Playlist {
    constructor({id, title, genre}) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.tracks = [];
    }
}

const resolvers = {
    Query: {
        tracks: () => tracks,
        track(root, args, context) {
            return findById(tracks, args.id) || [];
        },
        playlists(root, args, context) {
            let playlistRecords = [];
            let pRecordsCount = playlists.length;
            let {offset, limit} = args;
            limit > pRecordsCount ? limit = pRecordsCount : limit;
            for(let i=offset; i<limit; i++){
                playlistRecords = [...playlistRecords, playlists[i]];
                console.log(playlists[i]);
            }
            return playlistRecords;
        },
        playlist(root, args, context) {
            return findById(playlists, args.id) || [];
        }
    },
    Mutation: {
        createTrack: (root, args, context) => {
            const _id = require('crypto').randomBytes(10).toString('hex');
            let newTrack = new Track({
                id: _id,
                name: args.input.name,
                band: args.input.band
            });
            tracks.push(newTrack);
            console.log(tracks);
            return newTrack;
        },
        createPlaylist: (root, args, context) => {
            const _id = require('crypto').randomBytes(10).toString('hex');
            let newPlaylist = new Playlist({
                id: _id,
                title: args.input.title,
                genre: args.input.genre,
                tracks: []
            });
            playlists.push(newPlaylist);
            console.log(playlists);
            return newPlaylist;
        }
    }
};

findById = (arr, id) => {
    return arr.filter(item => item.id == id);
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});
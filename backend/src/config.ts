export default {
  port: 6001,
  prettyPrint: process.env.NODE_ENV === 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/krawumms',
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '3603abd216f64074a015cf074dde3c06',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '0ee5219c2d1f4b84b044f8318364592b',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:6001/callback',
  },
};

export default {
  port: 6011,
  prettyPrint: process.env.NODE_ENV === 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost:27017',
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:6011/callback',
  },
};

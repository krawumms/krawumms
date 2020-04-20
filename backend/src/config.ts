export default {
  port: 6001,
  prettyPrint: process.env.NODE_ENV === 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/krawumms',
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '61a97409bdf64987a3d713db47cca0a0',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '498ded5196134b15a42196f59e956242',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:6011/callback',
  },
};

import SpotifyWebApi from 'spotify-web-api-node';

const clientId = process.env.SPOTIFY_CLIENT_ID || '3603abd216f64074a015cf074dde3c06';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '0ee5219c2d1f4b84b044f8318364592b';
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/oauth/callback';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
});

export default spotifyApi;

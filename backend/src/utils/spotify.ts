
import SpotifyWebApi from 'spotify-web-api-node';
import config from '../config';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

export default spotifyApi;
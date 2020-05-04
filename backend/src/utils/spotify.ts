import SpotifyWebApi from 'spotify-web-api-node';
import config from '../config';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

const createSpotifyApi = async () => {
  const { body: token } = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(token.access_token);
  return spotifyApi;
};

export const createUserSpotifyApi = async (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
};

export default createSpotifyApi;

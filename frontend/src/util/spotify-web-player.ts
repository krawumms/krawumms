import fetcher from 'isomorphic-unfetch';
import { Track } from '../interfaces';

class SpotifyWebPlayer {
  public player: Spotify.SpotifyPlayer;

  private deviceId = '';

  private accessToken = '';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    // eslint-disable-next-line no-undef
    this.player = new window.Spotify.Player({
      name: 'Krawumms Web Player',
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
    });

    // error handling for spotify player according to spotify example
    // eslint-disable no-console
    // Error handling
    this.player.on('initialization_error', (e) => console.error(e));
    this.player.on('authentication_error', (e) => console.error(e));
    this.player.on('account_error', (e) => console.error(e));
    this.player.on('playback_error', (e) => console.error(e));

    // State change
    this.player.on('player_state_changed', (state) => console.log(state));

    // Ready
    this.player.on('ready', (data) => {
      this.deviceId = data.device_id;
      console.log('Ready with Device ID: ', data.device_id);
    });

    // Not Ready
    this.player.on('not_ready', (data) => {
      this.deviceId = data.device_id;
      console.log('Device ID has gone offline', data.device_id);
    });

    // Connect to the player!
    this.player.connect();
  }

  public async play(track: Track) {
    const body = {
      uris: [track.uri],
    };

    const data = await fetcher(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: JSON.stringify(body),
    });

    console.log('PLAYER DATA: ', data);
  }
}

export default SpotifyWebPlayer;

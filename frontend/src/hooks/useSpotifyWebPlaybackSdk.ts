import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = () => {};

interface Options {
  name: string;
  getOAuthToken: () => Promise<string>;
  accountError?: (e: unknown) => void;
  onReady?: (deviceId: string) => void;
  onPlayerStateChanged?: Spotify.PlaybackStateListener;
}

export default ({
  name,
  getOAuthToken,
  accountError = doNothing,
  onReady = doNothing,
  onPlayerStateChanged = doNothing,
}: Options) => {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const playerRef = useRef<Spotify.SpotifyPlayer | null>(null);

  useEffect(() => {
    if (window.Spotify) {
      playerRef.current = new window.Spotify.Player({
        name,
        getOAuthToken: async (cb) => {
          const token = await getOAuthToken();
          cb(token);
        },
      });
      setIsReady(true);
    }

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new window.Spotify.Player({
        name,
        getOAuthToken: async (cb) => {
          const token = await getOAuthToken();
          cb(token);
        },
      });
      setIsReady(true);
    };

    if (!window.Spotify) {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';

      document.head!.appendChild(scriptTag);
    }
  }, [getOAuthToken, name]);

  const handleReady = useCallback(
    ({ device_id: readyDeviceId }) => {
      setDeviceId(readyDeviceId);

      if (onReady) {
        onReady(deviceId);
      }
    },
    [deviceId, onReady],
  );

  const handlePause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  }, [playerRef]);

  useEffect(() => {
    if (isReady) {
      playerRef.current!.connect();
    }
  }, [isReady]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const player = playerRef.current!;
    if (isReady) {
      player.addListener('account_error', accountError);
      player.addListener('ready', handleReady);
      player.addListener('initialization_error', accountError);
      player.addListener('authentication_error', accountError);
      player.addListener('not_ready', accountError);
      player.addListener('player_state_changed', onPlayerStateChanged);

      return () => {
        player.removeListener('account_error', accountError);
        player.removeListener('ready', handleReady);
        player.removeListener('player_state_changed', onPlayerStateChanged);
      };
    }
  }, [accountError, handleReady, isReady, onPlayerStateChanged]);

  return {
    player: playerRef.current,
    deviceId,
    isReady,
    handlePause,
  };
};

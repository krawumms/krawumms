import { NextApiRequest, NextApiResponse } from 'next';
import HttpStatus from 'http-status-codes';
import spotifyApi from '../../../util/spotify';
import cookies from '../../../util/cookies';
import config from '../../../config';

const tokenKey = 'krawummsToken';

const callback = async (req: NextApiRequest, res: NextApiResponse & { cookie: Function }) => {
  const code = req.query && req.query.code;
  const state = req.query && req.query.state;

  if (req.method === 'GET' && typeof code === 'string' && typeof state === 'string') {
    try {
      const { body } = await spotifyApi.authorizationCodeGrant(code);

      res.cookie(tokenKey, body, {
        httpOnly: true,
        path: '/',
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      req.accessToken = body.access_token;

      res
        .writeHead(HttpStatus.MOVED_TEMPORARILY, {
          Location: `${config.uiBaseUrl}${state}`,
        })
        .end();
      res.end();
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  res.status(HttpStatus.NOT_FOUND).end();
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default cookies(callback);

import { NextApiRequest, NextApiResponse } from 'next';
import HttpStatus from 'http-status-codes';
import spotifyApi from '../../../util/spotify';

const scopes = ['streaming', 'user-read-private', 'user-read-email'];

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const state = (req.query && req.query.state) || '/';

    if (typeof state === 'string') {
      res.writeHead(HttpStatus.MOVED_TEMPORARILY, {
        Location: spotifyApi.createAuthorizeURL(scopes, state),
      });
      res.end();
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
  res.status(HttpStatus.NOT_FOUND).end();
};

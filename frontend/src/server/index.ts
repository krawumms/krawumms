import Fastify, { FastifyInstance } from 'fastify';
import Next from 'next';
import fastifyCookie from 'fastify-cookie';
import queryString from 'querystring';
import SpotifyWebApi from 'spotify-web-api-node';
import HttpStatus from 'http-status-codes';

const clientId = process.env.SPOTIFY_CLIENT_ID || '3603abd216f64074a015cf074dde3c06';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '0ee5219c2d1f4b84b044f8318364592b';
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/oauth/callback';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
});

const server = Fastify({ logger: { level: 'error' } });

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const scopes = ['user-read-private', 'user-read-email'];
const tokenKey = 'oauth_token';

server.register(fastifyCookie);
server.register((fastify: FastifyInstance, _, next) => {
  const app = Next({ dev });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(() => {
      if (dev) {
        fastify.get('/_next/*', (req, reply) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          return app.handleRequest(req.req, reply.res).then(() => {
            // eslint-disable-next-line no-param-reassign
            reply.sent = true;
          });
        });
      }

      server.get('/oauth/login', async (req, reply) => {
        const state = (req.query && req.query.state) || '/';
        reply.redirect(spotifyApi.createAuthorizeURL(scopes, state));
      });

      // eslint-disable-next-line consistent-return
      fastify.get('/oauth/callback', async (req, reply) => {
        try {
          const code = req.query && req.query.code;
          const state = req.query && req.query.state;

          const { body } = await spotifyApi.authorizationCodeGrant(code);
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          reply.setCookie(tokenKey, queryString.stringify(body), {
            httpOnly: true,
            path: '/',
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          req.req.accessToken = body.access_token;

          return reply.redirect(state);
        } catch (error) {
          req.log.error(error);
          reply.send(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });

      fastify.all('/*', (req, reply) => {
        // console.log(req)
        const tokenCookie = req.cookies && req.cookies[tokenKey];
        const parsedTokenCookie = queryString.parse(tokenCookie);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        req.req.accessToken = parsedTokenCookie.access_token;
        return handle(req.req, reply.res).then(() => {
          // eslint-disable-next-line no-param-reassign
          reply.sent = true;
        });
      });

      fastify.setNotFoundHandler((req, reply) => {
        return app.render404(req.req, reply.res).then(() => {
          // eslint-disable-next-line no-param-reassign
          reply.sent = true;
        });
      });

      next();
    })
    .catch((err: Error) => next(err));
});

server.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

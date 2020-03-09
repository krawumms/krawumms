import config from './config';
import mongo from './mongo';
import app from './server';

export default async function serverless(req, res) {
  await app.ready();
  await mongo({ uri: config.db });

  app.server.emit('request', req, res);
}

import config from './config';
import mongo from './mongo';
import server from './server';

(async () => {
  try {
    await server.listen(config.port, '0.0.0.0');
    await mongo({ uri: config.db });
    server.blipp();
    server.swagger();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

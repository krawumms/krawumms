import Mongoose, { ConnectionOptions } from 'mongoose';
import debug from 'debug';

const mongoDebug = debug('MongoDB');

const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mongo = async ({ uri }: { uri: string }) => {
  Mongoose.connection.on('connected', () => {
    mongoDebug('connected');
  });

  Mongoose.connection.on('disconnected', () => {
    mongoDebug('disconnected');
  });

  await Mongoose.connect(uri, options);
};

export default mongo;

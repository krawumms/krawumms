import Mongoose, { ConnectionOptions } from 'mongoose';
import debug from 'debug';

const mongoDebug = debug('MongoDB');
let connection = null;

const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // and MongoDB driver buffering
};

const mongo = async ({ uri }: { uri: string }) => {
  Mongoose.connection.on('connected', () => {
    mongoDebug('connected');
  });

  Mongoose.connection.on('disconnected', () => {
    mongoDebug('disconnected');
  });

  if (!connection) {
    connection = await Mongoose.createConnection(uri, options);
  }
};

export default mongo;

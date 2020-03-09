export default {
  port: 6011,
  prettyPrint: process.env.NODE_ENV === 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost:27017',
};

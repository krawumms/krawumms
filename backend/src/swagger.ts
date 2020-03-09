export default {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Krawumms API',
      description: 'Famous Krawumms API',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:6011',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

import { IncomingMessage, Server, ServerResponse } from 'http';
import { Http2SecureServer, Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as https from 'https';

type HttpServer = Server | Http2Server | Http2SecureServer | https.Server;
type HttpRequest = IncomingMessage | Http2ServerRequest;
type HttpResponse = ServerResponse | Http2ServerResponse;

declare module 'fastify' {
  interface FastifyInstance<HttpServer, HttpRequest, HttpResponse> {
    auth: () => void;
    client: () => void;
  }

  interface FastifyRequest {
    user: {
      id: string;
    };
    clientUuid: string;
  }
}

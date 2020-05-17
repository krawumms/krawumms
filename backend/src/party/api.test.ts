import request from 'supertest';
import mongoose from 'mongoose';
import { OK, CREATED } from 'http-status-codes';

import server from '../server';

describe('Test party api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await server.ready();
  });

  beforeEach(async () => {
    await request(server.server)
      .post('/parties')
      .set(
        'Authorization',
        'Bearer BQC3pQyrPNlmD0CDs4JOww9O4YaEW5Kw5urn_freTar-wMptqNVUufxEfXGNEs4LGagQNWSZXqaTDQMjECF7PcJpWQ0qKpL5EqGme-fzc8_IsoFrWmosp8_bM9Z0hz7_PAzcwFjG6fRbqx8tMffiBAxWcoSnVB3cs3YXdg',
      )
      .send({
        id: '1',
        name: 'first test party',
      });
    await request(server.server)
      .post('/parties')
      .set(
        'Authorization',
        'Bearer BQC3pQyrPNlmD0CDs4JOww9O4YaEW5Kw5urn_freTar-wMptqNVUufxEfXGNEs4LGagQNWSZXqaTDQMjECF7PcJpWQ0qKpL5EqGme-fzc8_IsoFrWmosp8_bM9Z0hz7_PAzcwFjG6fRbqx8tMffiBAxWcoSnVB3cs3YXdg',
      )
      .send({
        id: '2',
        name: 'second test party',
      });
  });

  afterAll(() => {
    mongoose.disconnect();
    server.close();
  });

  it('Should create new Party', async () => {
    const response = await request(server.server)
      .post('/parties')
      .set(
        'Authorization',
        'Bearer BQC3pQyrPNlmD0CDs4JOww9O4YaEW5Kw5urn_freTar-wMptqNVUufxEfXGNEs4LGagQNWSZXqaTDQMjECF7PcJpWQ0qKpL5EqGme-fzc8_IsoFrWmosp8_bM9Z0hz7_PAzcwFjG6fRbqx8tMffiBAxWcoSnVB3cs3YXdg',
      )
      .send({
        id: '3',
        name: 'third test party',
      });
    expect(response.status).toEqual(CREATED);
    expect(response.body.id).toBe('3');
  });
  it('Should return all Parties', async () => {
    const response = await request(server.server)
      .get('/parties')
      .set(
        'Authorization',
        'Bearer BQC3pQyrPNlmD0CDs4JOww9O4YaEW5Kw5urn_freTar-wMptqNVUufxEfXGNEs4LGagQNWSZXqaTDQMjECF7PcJpWQ0qKpL5EqGme-fzc8_IsoFrWmosp8_bM9Z0hz7_PAzcwFjG6fRbqx8tMffiBAxWcoSnVB3cs3YXdg',
      )
      .send();
    expect(response.status).toEqual(OK);
    expect(response.body[0].id).toBe('1');
    expect(response.body[1].id).toBe('2');
    console.log(response.body);
  });

  it('Should return a party by code', async () => {
    const partyResponse = await request(server.server)
      .get('/parties')
      .set(
        'Authorization',
        'Bearer BQC3pQyrPNlmD0CDs4JOww9O4YaEW5Kw5urn_freTar-wMptqNVUufxEfXGNEs4LGagQNWSZXqaTDQMjECF7PcJpWQ0qKpL5EqGme-fzc8_IsoFrWmosp8_bM9Z0hz7_PAzcwFjG6fRbqx8tMffiBAxWcoSnVB3cs3YXdg',
      )
      .send();
    const coderesponse = await request(server.server).get(`/parties/byCode/${partyResponse.body[0].code}`).send();
    expect(coderesponse.status).toEqual(OK);
    expect(coderesponse.body.id).toBe('1');
  });

  it('Should return 404 for invalid ID in GET', async () => {
    const response = await request(server.server).get('/parties/1111').send();
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });

  it('Should return 404 for invalid ID in DELETE', async () => {
    const response = await request(server.server).delete('/parties/1111').send();
    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });

  it('Should add song to playlist', async () => {
    const response = await request(server.server).put('/parties/1/playlist').set('x-krawumms-client', '1234').send({
      id: 'test',
    });
    expect(response.status).toEqual(OK);
    expect(response.body.playlist.length).toEqual(1);
  });

  it('Should get songs from playlist', async () => {
    const response = await request(server.server).get('/parties/1/playlist');
    console.log(response.body);
    expect(response.body.length).toEqual(1);
    expect(response.status).toEqual(OK);
  });

  it('Should delete song from playlist', async () => {
    const response = await request(server.server)
      .delete('/parties/1/playlist')
      .send({
        body: {
          id: 'Test',
        },
      });
    expect(response.status).toEqual(OK);
  });

  it('Should return 404 for invalid ID in PUT', async () => {
    const response = await request(server.server).put('/parties/1111').set('Authorization', 'Bearer abcd').send();

    expect(response.status).toEqual(OK);
    expect(response.body).toEqual(404);
  });
});

import server from './server';

const port = parseInt(process.env.PORT || '3000', 10);

server.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

import fetch from 'isomorphic-unfetch';

export default async function (input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  return res.json();
}

import fetch from 'isomorphic-unfetch';

export default async function (input: RequestInfo, init?: RequestInit, ...rest: any[]) {
  console.log(input, rest)
  const res = await fetch(input, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init,
  });
  return res.json();
}

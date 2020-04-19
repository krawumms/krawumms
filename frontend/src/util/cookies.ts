import { CookieSerializeOptions, serialize } from 'cookie';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import queryString from 'querystring';

/**
 * This sets `cookie` on `res` object
 */
const cookie = (res: NextApiResponse, name: string, value: any, options: CookieSerializeOptions = {}) => {
  const stringValue = typeof value === 'object' ? queryString.stringify(value) : String(value);

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse & { cookie: Function }) => {
  res.cookie = (name: string, value: any, options: CookieSerializeOptions) => cookie(res, name, value, options);

  return handler(req, res);
};

export default cookies;

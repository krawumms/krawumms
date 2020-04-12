// @flow
/* eslint-env jest */

import * as Fetcher from './fetcher';

test('fetcher tests', async () => {
  const testResponse = { test: 'test' };
  const fetcherSpy = jest.spyOn(Fetcher, 'default').mockReturnValueOnce(Promise.resolve(testResponse));

  const fetcherRes = await Fetcher.default('test');

  expect(fetcherSpy).toHaveBeenCalled();
  expect(fetcherRes).toBe(testResponse);
});

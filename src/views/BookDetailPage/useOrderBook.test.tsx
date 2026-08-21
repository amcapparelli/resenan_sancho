/* eslint-disable no-underscore-dangle */
/**
 * Tests for useOrderBook.
 *
 * Two things must not regress:
 *  - the request shape, because it is the contract the API has always received
 *    (this hook replaced a `useFetch` call and had to reproduce it exactly);
 *  - the rejection behaviour. Unlike `useFetch`, which swallows every failure
 *    into state and always resolves, this hook has to reject — that rejection is
 *    the only signal ContactModal has to show its error banner — and only a
 *    business failure may reject with text that the user will read.
 */
import React from 'react';
import { renderHook } from '@testing-library/react';

import UserContext from '../../store/context/userContext/UserContext';
import { orderBook as orderBookUrl } from '../../config/routes';
import SubmitError from '../../utils/SubmitError';
import useOrderBook from './useOrderBook';

const userContextValue = {
  user: { _id: 'reviewer-1', token: 'token-abc' },
} as unknown as React.ContextType<typeof UserContext>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>
);

const renderOrderBook = () => renderHook(() => useOrderBook(), { wrapper }).result.current;

/** Stubs the response body the API would return. */
const mockFetchResolving = (body: unknown) => {
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(body) });
};

const fetchMock = () => global.fetch as jest.Mock;

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

describe('useOrderBook — request shape', () => {
  it('posts the order to the orderBook route with the auth headers and body', async () => {
    mockFetchResolving({ success: true });

    await renderOrderBook()('book-1', 'Hola Marina');

    expect(fetchMock()).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock().mock.calls[0];
    expect(url).toBe(orderBookUrl);
    expect(options).toEqual({
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      body: JSON.stringify({ message: 'Hola Marina', book: 'book-1', reviewer: 'reviewer-1' }),
      headers: {
        'Content-Type': 'application/json',
        'access-token': 'token-abc',
      },
    });
  });

  it('resolves when the API reports success', async () => {
    mockFetchResolving({ success: true, message: 'Mensaje enviado' });

    await expect(renderOrderBook()('book-1', 'Hola')).resolves.toBeUndefined();
  });
});

describe('useOrderBook — rejections', () => {
  it('rejects with the server text for a business failure, marked as not retryable', async () => {
    mockFetchResolving({ success: false, message: 'Ya no quedan ejemplares de este libro.' });

    const request = renderOrderBook()('book-1', 'Hola');

    await expect(request).rejects.toThrow(SubmitError);
    await expect(request).rejects.toThrow('Ya no quedan ejemplares de este libro.');
    await expect(request).rejects.toMatchObject({ retryable: false });
  });

  it('rejects with a plain Error when the failure carries no message', async () => {
    // A SubmitError here would render an empty banner: the form's own generic
    // copy is the only sensible thing left to show.
    mockFetchResolving({ success: false });

    await expect(renderOrderBook()('book-1', 'Hola')).rejects.not.toBeInstanceOf(SubmitError);
  });

  it('rejects with a plain Error when the message is whitespace only', async () => {
    mockFetchResolving({ success: false, message: '   ' });

    await expect(renderOrderBook()('book-1', 'Hola')).rejects.not.toBeInstanceOf(SubmitError);
  });

  it('rejects when the network request itself fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const request = renderOrderBook()('book-1', 'Hola');

    await expect(request).rejects.toThrow('Failed to fetch');
    // Transport failures must not masquerade as reviewed, user-facing wording.
    await expect(request).rejects.not.toBeInstanceOf(SubmitError);
  });

  it('rejects when the response is not JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON')),
    });

    const request = renderOrderBook()('book-1', 'Hola');

    await expect(request).rejects.toThrow(SyntaxError);
    await expect(request).rejects.not.toBeInstanceOf(SubmitError);
  });
});

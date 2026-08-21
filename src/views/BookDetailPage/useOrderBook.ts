/* eslint-disable no-underscore-dangle */
import { useCallback, useContext } from 'react';
import UserContext from '../../store/context/userContext/UserContext';
import { orderBook as orderBookUrl } from '../../config/routes';
import SubmitError from '../../utils/SubmitError';

type OrderBookRequest = (bookId: string, message: string) => Promise<void>;

/**
 * Requests a copy of a book for review.
 *
 * Deliberately not `useFetch`: that hook swallows every failure into state and
 * always resolves, while ContactModal's `onSubmit` contract needs a rejected
 * promise to show its error banner. The request shape is otherwise identical to
 * `useFetch`'s so the API keeps seeing the same call it has always received.
 */
const useOrderBook = (): OrderBookRequest => {
  const { user } = useContext(UserContext);

  return useCallback<OrderBookRequest>(async (bookId, message) => {
    const response = await fetch(orderBookUrl, {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      body: JSON.stringify({ message, book: bookId, reviewer: user._id }),
      headers: {
        'Content-Type': 'application/json',
        'access-token': user.token,
      },
    });

    // The API answers 200 with `success: false` for business errors (no copies
    // left, already requested…), so the status code alone is not enough.
    const result = await response.json();
    if (!result?.success) {
      const serverMessage = typeof result?.message === 'string' ? result.message.trim() : '';
      // A parsed answer with `success: false` is a business rule talking ("no
      // quedan ejemplares", "ya has pedido este libro"): worth showing verbatim,
      // and retrying the same request will not change it. Without a usable
      // message we fall through to a plain Error so the form shows its own copy
      // instead of an empty banner.
      if (serverMessage) throw new SubmitError(serverMessage, { retryable: false });
      throw new Error('orderBook request was not successful');
    }
  }, [user._id, user.token]);
};

export default useOrderBook;

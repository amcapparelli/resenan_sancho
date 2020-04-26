import { useState } from 'react';
import { Response } from '../../interfaces/response';

const useFetch = (): [any, Function] => {
  const [responseJSON, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const asyncRequest = async (url: string, method: string, body: object): Promise<void> => {
    try {
      const res = await fetch(url, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify({ ...body }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resJSON = await res.json();
      setResponse(resJSON);
    } catch (error) {
      setResponse(error);
    }
  };
  return [responseJSON, asyncRequest];
};

export default useFetch;

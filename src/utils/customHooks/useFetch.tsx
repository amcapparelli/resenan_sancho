import { useState } from 'react';
import { Response } from '../../interfaces/response';

const useFetch = (): [any, Function] => {
  const [responseJSON, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const asyncRequest = async (url: string, method: string, body: object): Promise<void> => {
    const options = {
      method,
      body: JSON.stringify({ ...body }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await fetch(url, options);
      const resJSON = await res.json();
      setResponse(resJSON);
    } catch (error) {
      setResponse(error);
    }
  };
  return [responseJSON, asyncRequest];
};

export default useFetch;

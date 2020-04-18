import { useState } from 'react';
import { Response } from '../../interfaces/response';

const useFetch = (): [any, Function] => {
  const [response, setResponse] = useState<Response>({
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
      const { message, success } = resJSON;
      setResponse({ message, success });
    } catch (error) {
      setResponse(error);
    }
  };
  return [response, asyncRequest];
};

export default useFetch;

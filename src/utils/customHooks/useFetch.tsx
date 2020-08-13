import { useState, useContext } from 'react';
import { Response } from '../../interfaces/response';
import UserContext from '../../store/context/userContext/UserContext';

const useFetch = (): [any, Function, boolean] => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [responseJSON, setResponse] = useState<Response>({
    success: undefined,
    message: '',
  });
  const asyncRequest = async (url: string, method: string, body: object): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify({ ...body }),
        headers: {
          'Content-Type': 'application/json',
          'access-token': user.token,
        },
      });
      const resJSON = await res.json();
      setResponse(resJSON);
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };
  return [responseJSON, asyncRequest, loading];
};

export default useFetch;

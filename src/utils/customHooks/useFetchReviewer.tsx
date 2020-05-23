import { useState } from 'react';
import { reviewer as URL } from '../../config/routes';

const useFetchReviewer = (): [Function, any, boolean] => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const fetchReviewer = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const resp = await fetch(`${URL}/${id}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      });
      const { reviewer } = await resp.json();
      setResponse(reviewer);
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };
  return [fetchReviewer, response, loading];
};

export default useFetchReviewer;

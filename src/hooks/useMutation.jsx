import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:3000';

const useMutation = (endpoint, onSuccess) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = async (method, data, id = null) => {
    setIsLoading(true);
    setIsError(false);
    let url = `${API_URL}/${endpoint}`;
    if (id) {
      url = `${API_URL}/${endpoint}/${id}`;
    }

    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };

      let response;
      if (method === 'POST') {
        response = await axios.post(url, data, config);
      } else if (method === 'DELETE') {
        response = await axios.delete(url, config);
      } else if (method === 'PATCH') {
        response = await axios.patch(url, data, config);
      } else {
        throw new Error('Unsupported mutation method');
      }

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, isError };
};

export default useMutation;

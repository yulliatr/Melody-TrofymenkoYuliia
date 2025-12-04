import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const useFetchData = (endpoint, initialValue = null, dependencies = []) => {
  const [data, setData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        setData(response.data);
      } catch (error) {
        setIsError(true);
        setData(initialValue);
      } finally {
        setIsLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint, ...dependencies]);

  return { data, isLoading, isError, setData };
};

export default useFetchData;

import { useState, useEffect } from 'react';
import { tableApi } from '../api';
import { Test } from '../../../../shared';

export function useGetTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [errorTests, setErrorTests] = useState<Error | null>(null);

  useEffect(() => {
    const { queryFn } = tableApi.getTests();
    const controller = new AbortController();

    queryFn({ signal: controller.signal })
      .then((response) => {
        setTests(response);
        setErrorTests(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErrorTests(err);
        }
      })
      .finally(() => {
        setLoadingTests(false);
      });
      
    return () => {
      controller.abort();
    };
  }, []);

  return { tests, loadingTests, errorTests };
}

export default useGetTests;
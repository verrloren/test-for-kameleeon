import { useState, useEffect } from 'react';
import { tableApi } from '../api';
import { Site } from '../../../../shared';

export function useGetSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [errorSites, setErrorSites] = useState<Error | null>(null);

  useEffect(() => {
    const { queryFn } = tableApi.getSites();
    const controller = new AbortController();

    queryFn({ signal: controller.signal })
      .then((response) => {
        setSites(response);
        setErrorSites(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErrorSites(err);
        }
      })
      .finally(() => {
        setLoadingSites(false);
      });
      
    return () => {
      controller.abort();
    };
  }, []);

  return { sites, loadingSites, errorSites };
}

export default useGetSites;
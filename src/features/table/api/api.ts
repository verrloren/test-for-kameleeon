import { jsonApiInstance, Site, Test } from "../../../shared";



export const tableApi = {
  baseKey: "table",
  getSites: () => {
    return {
      queryKey: [tableApi.baseKey],
      queryFn: (meta: { signal: AbortSignal }) =>
        jsonApiInstance<Site[]>(`/sites`, {
          signal: meta.signal,
          json: null,
        }),
    };
  },
	getSiteById: (id: number) => {
    // Note: no cancellation is implemented here for simplicity.
    return jsonApiInstance<Site>(`/sites/${id}`, {
      signal: new AbortController().signal,
      json: null,
    });
  },
	getTests: () => {
    return {
      queryKey: [tableApi.baseKey],
      queryFn: (meta: { signal: AbortSignal }) =>
        jsonApiInstance<Test[]>(`/tests`, {
          signal: meta.signal,
          json: null,
        }),
    };
  },
	
};

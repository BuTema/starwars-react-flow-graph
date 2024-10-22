import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to fetch data from an API with caching to prevent duplicate requests.
 * @param apiCall - Function that returns a Promise for the API call.
 * @param deps - Dependencies that trigger the effect when changed.
 * @returns [data, loading, error] - The fetched data, loading state, and any errors.
 */
export const useFetch = <T>(
  apiCall: () => Promise<T>,
  deps: any[] = [],
): [T | null, boolean, any] => {
  const [data, setData] = useState<T | null>(null); // State to store fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<any>(null); // State to store any errors
  const hasFetched = useRef(false); // Flag to ensure the request is only made once

  useEffect(() => {
    if (hasFetched.current) {
      return; // Exit if the request has already been made
    }
    hasFetched.current = true; // Set the flag to true after the first request

    setLoading(true);
    apiCall()
      .then((response) => {
        setData(response); // Store the response data
      })
      .catch((err) => {
        setError(err); // Store the error if one occurs
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request is completed
      });
  }, deps);

  return [data, loading, error];
};

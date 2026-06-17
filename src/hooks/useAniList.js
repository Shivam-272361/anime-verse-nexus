import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTrending, searchAnime, fetchAnimeDetails, searchCharacters } from '../api/anilistApi.js';

export function useTrending(perPage = 50) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchTrending(1, perPage, controller.signal)
      .then((page) => {
        setData(page.media);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [perPage]);

  return { data, loading, error };
}

export function useSearch(query, genre, sort = ['TRENDING_DESC']) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      controllerRef.current = controller;
      setLoading(true);
      searchAnime(query || '', genre, sort, 1, 20, controller.signal)
        .then((page) => {
          setResults(page.media || []);
          setError(null);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err);
        })
        .finally(() => setLoading(false));
    }, query ? 300 : 0);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query, genre, JSON.stringify(sort)]);

  return { results, loading, error };
}

export function useAnimeDetails(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setData(null);
    fetchAnimeDetails(id, controller.signal)
      .then((media) => {
        setData(media);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  return { data, loading, error };
}

export function useInfiniteAnime(genre, sort = ['TRENDING_DESC']) {
  const [anime, setAnime] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);
  const sortKey = JSON.stringify(sort);

  // Reset when filters change
  useEffect(() => {
    setAnime([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  }, [genre, sortKey]);

  useEffect(() => {
    if (loadingRef.current) return;
    const controller = new AbortController();
    loadingRef.current = true;
    setLoading(true);

    searchAnime('', genre, sort, page, 20, controller.signal)
      .then((result) => {
        setAnime((prev) => {
          const existing = new Set(prev.map((a) => a.id));
          const newItems = (result.media || []).filter((a) => !existing.has(a.id));
          return page === 1 ? result.media || [] : [...prev, ...newItems];
        });
        setHasMore(result.pageInfo?.hasNextPage ?? false);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });

    return () => controller.abort();
  }, [page, genre, sortKey]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  return { anime, loading, loadMore, hasMore, error };
}

export function useCharacters(searchQuery) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      controllerRef.current = controller;
      setLoading(true);
      searchCharacters(searchQuery || '', 1, 24, controller.signal)
        .then((page) => {
          setCharacters(page.characters || []);
          setError(null);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err);
        })
        .finally(() => setLoading(false));
    }, searchQuery ? 300 : 0);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [searchQuery]);

  return { characters, loading, error };
}

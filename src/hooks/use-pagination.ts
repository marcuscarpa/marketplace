'use client';

import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPerPage?: number;
  totalPages?: number;
}

export function usePagination({ initialPage = 1, initialPerPage = 24, totalPages }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const next = useCallback(() => setPage((p) => {
    if (totalPages !== undefined) return Math.min(totalPages, p + 1);
    return p + 1;
  }), [totalPages]);
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goTo = useCallback((pageNumber: number) => setPage(Math.max(1, pageNumber)), []);
  const reset = useCallback(() => setPage(1), []);

  const setItemsPerPage = useCallback((count: number) => {
    setPerPage(count);
    setPage(1);
  }, []);

  return {
    page,
    perPage,
    next,
    prev,
    goTo,
    reset,
    setItemsPerPage,
    offset: (page - 1) * perPage,
  };
}
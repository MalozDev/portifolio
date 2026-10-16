"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Fetch wrapper for console APIs — redirects to login on 401 and
 * refreshes server components after mutations.
 */
export function useConsoleApi() {
  const router = useRouter();

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const res = await fetch(path, {
        ...init,
        headers:
          init?.body instanceof FormData
            ? init?.headers
            : { "Content-Type": "application/json", ...init?.headers },
      });

      if (res.status === 401) {
        router.push("/console/login");
        router.refresh();
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      return res.json() as Promise<T>;
    },
    [router]
  );

  const get = useCallback(<T,>(path: string) => request<T>(path), [request]);

  const post = useCallback(
    <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    [request]
  );

  const put = useCallback(
    <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
    [request]
  );

  const del = useCallback(
    <T,>(path: string) => request<T>(path, { method: "DELETE" }),
    [request]
  );

  return { get, post, put, del };
}

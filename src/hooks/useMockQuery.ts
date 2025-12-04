import { useQuery, type QueryKey } from "@tanstack/react-query";

interface MockOptions {
  delay?: number;
  shouldError?: boolean;
}

const DEFAULT_DELAY = 450;

async function mockFetcher<T>(data: T, options?: MockOptions): Promise<T> {
  const delay = options?.delay ?? DEFAULT_DELAY;
  const shouldError = options?.shouldError ?? false;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldError) {
    throw new Error("Falha ao carregar dados. Tente novamente.");
  }

  return data;
}

export function useMockQuery<T>(key: QueryKey, data: T, options?: MockOptions) {
  return useQuery({
    queryKey: key,
    queryFn: () => mockFetcher(data, options),
    staleTime: 60_000,
    retry: 1,
  });
}

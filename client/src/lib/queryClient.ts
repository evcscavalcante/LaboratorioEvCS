import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { hybridStorage } from "./hybrid-storage";
import { auth } from "./firebase";
import { getIdToken } from "firebase/auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get Firebase token for authorization
  let authHeaders: Record<string, string> = {};
  
  if (auth.currentUser) {
    try {
      const token = await getIdToken(auth.currentUser);
      authHeaders.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.warn('Não foi possível obter token Firebase:', error);
    }
  }

  // Intercept API calls and use hybrid storage for Firebase/offline sync (only for test data)
  if (method === 'POST' && url.includes('/api/density-in-situ')) {
    const result = await hybridStorage.createDensityInSituTest(data as any);
    return new Response(JSON.stringify(result), { status: 200 });
  }
  
  if (method === 'POST' && url.includes('/api/real-density')) {
    const result = await hybridStorage.createRealDensityTest(data as any);
    return new Response(JSON.stringify(result), { status: 200 });
  }
  
  if (method === 'POST' && url.includes('/api/max-min-density')) {
    const result = await hybridStorage.createMaxMinDensityTest(data as any);
    return new Response(JSON.stringify(result), { status: 200 });
  }

  // For all other API calls (users, organizations, etc.), use direct server API
  const headers = {
    ...authHeaders,
    ...(data ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use hybrid storage for specific endpoints
    const url = queryKey[0] as string;
    
    if (url === '/api/tests/density-in-situ') {
      return await hybridStorage.getDensityInSituTests();
    }
    
    if (url === '/api/tests/real-density') {
      return await hybridStorage.getRealDensityTests();
    }
    
    if (url === '/api/tests/max-min-density') {
      return await hybridStorage.getMaxMinDensityTests();
    }

    // Get Firebase token for authorization
    let authHeaders: Record<string, string> = {};
    
    if (auth.currentUser) {
      try {
        const token = await getIdToken(auth.currentUser);
        authHeaders.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn('Não foi possível obter token Firebase:', error);
      }
    }

    const res = await fetch(url, {
      headers: authHeaders,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

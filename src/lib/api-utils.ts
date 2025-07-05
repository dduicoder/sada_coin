const API_BASE_URL = "http://127.0.0.1:5000";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  return response;
}

export async function apiGet(endpoint: string): Promise<any> {
  const response = await apiRequest(endpoint, { method: "GET" });
  return response.json();
}

export async function apiPost(endpoint: string, data: any): Promise<any> {
  const response = await apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}
// Base API service — replace BASE_URL with real backend later
const BASE_URL = 'https://api.greenaja.com'; // TODO: ganti dengan backend URL

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    return res.json();
  },

  post: async (endpoint: string, body: object) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};

export default api;

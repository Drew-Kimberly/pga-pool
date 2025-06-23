import axios from 'axios';

let getTokenFunction: (() => Promise<string>) | null = null;

export const setAuth0TokenGetter = (tokenGetter: () => Promise<string>) => {
  getTokenFunction = tokenGetter;
};

const authClient = axios.create({
  baseURL: process.env.REACT_APP_PGA_POOL_API_URL,
});

// Add auth token to requests
authClient.interceptors.request.use(async (config) => {
  try {
    if (getTokenFunction) {
      const token = await getTokenFunction();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    // User not authenticated, continue without token
  }
  return config;
});

export default authClient;

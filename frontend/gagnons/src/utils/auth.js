const ACCESS_KEY = "access_token";

export const setToken = (token) => {
  localStorage.setItem(ACCESS_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_KEY);
};

export const isAuthenticated = () => !!getToken();

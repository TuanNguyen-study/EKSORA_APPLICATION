const API = process.env.REACT_APP_API;

export const getNewProducts = () => {
  return fetch(`${API}/api/categories`).then((res) => res.json());
};

export const getInventory = () => {
  return fetch(`${API}/api/tours`).then((res) => res.json());
};

export const getPromo = () => {
  return fetch(`${API}/api/vouchers`).then((res) => res.json());
};

export const getCustomers = () => {
  return fetch(`${API}/categories`).then((res) => res.json());
};

export const getComments = () => {
  return fetch(`${API}/categories`).then((res) => res.json());
};

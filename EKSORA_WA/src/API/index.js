export const getNewProducts = () => {
    return fetch("https://api.popeyes.vn/api/v1/categories/pop-cheese").then((res) => res.json());
  };
  
  export const getRevenue = () => {
    return fetch("https://api-8d22.onrender.com/cart/get_all_cart").then((res) => res.json());
  };
  
  export const getInventory = () => {
    return fetch("https://api.popeyes.vn/api/v1/products/specific?tag=best-seller&limit=100").then((res) => res.json());
  };
  
  export const getPromo = () => {
    return fetch("https://api.popeyes.vn/api/v1/products/BOGO%20DELI%20206-5936").then((res) => res.json());
  };
  export const getCustomers = () => {
    return fetch("https://dummyjson.com/users").then((res) => res.json());
  };
  export const getComments = () => {
    return fetch("https://dummyjson.com/comments").then((res) => res.json());
  };
  
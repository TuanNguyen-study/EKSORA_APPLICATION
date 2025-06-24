const API = process.env.REACT_APP_API_URL;

// Tours
export const getInventory = () => {
  return fetch(`${API}/api/tours`).then((res) => res.json());
};

// Suppliers
export const getSuppliers = () => {
  return fetch(`${API}/api/suppliers`).then((res) => res.json());
};

// Customers (cái này chắc là /api/customers chứ không phải /categories ?)
export const getCustomers = () => {
  return fetch(`${API}/api/customers`).then((res) => res.json());
};

// Comments
export const getComments = () => {
  return fetch(`${API}/api/comments`).then((res) => res.json());
};

// Categories (nếu thực sự có)
export const getNewProducts = () => {
  return fetch(`${API}/api/categories`).then((res) => res.json());
};


// Vouchers
export const getVoucher = () => {
  return fetch(`${API}/api/vouchers`).then((res) => res.json());
};

export const postVoucher = (data) => {
  return fetch(`${API}/api/vouchers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const deleteVoucher = (id) => {
  return fetch(`${API}/api/vouchers/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
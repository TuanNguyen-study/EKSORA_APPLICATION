const API = process.env.REACT_APP_API;

// Tours
export const getInventory = () => {
  return fetch(`${API}/api/tours`).then((res) => res.json());
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

// suppliersa
export const getSuppliers = () => {
  return fetch(`${API}/api/suppliers`).then((res) => res.json()); // Sửa lại endpoint phù hợp
};

// Comments
export const getComments = () => {
  return fetch(`${API}/api/comments`).then((res) => res.json()); // Sửa lại endpoint phù hợp
};

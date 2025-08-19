import React from "react";
import useAutoLogout from "../hooks/useAutoLogout";

/**
 * Component wrapper để thực hiện auto logout
 * Phải được đặt bên trong Redux Provider
 */
export const AutoLogoutWrapper = ({ children }) => {
  // Thực hiện auto logout
  useAutoLogout();

  // Render children như bình thường
  return <>{children}</>;
};

export default AutoLogoutWrapper;

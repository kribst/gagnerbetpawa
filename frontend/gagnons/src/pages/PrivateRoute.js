import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * Entoure une route protégée. Si l'utilisateur est authentifié
 * (token présent dans localStorage), render children. Sinon redirect to "/".
 */
export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

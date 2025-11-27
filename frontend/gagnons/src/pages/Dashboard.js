import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Exemple : appeler endpoint protégé /api/hello/ en envoyant Authorization header
    const fetchProtected = async () => {
      try {
        const token = getToken();
        const res = await api.get("/api/hello/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message || "Bienvenue !");
      } catch (err) {
        // si token invalide ou erreur, supprimer token et renvoyer à login
        removeToken();
        navigate("/", { replace: true });
      }
    };
    fetchProtected();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Tableau de bord</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

# Guide de mise en place de l'authentification JWT

Ce guide explique comment mettre en place l'authentification JWT dans ce projet Django + React.

## 📋 Table des matières

1. [Backend (Django)](#backend-django)
2. [Frontend (React)](#frontend-react)
3. [Structure du projet](#structure-du-projet)
4. [Test de l'authentification](#test-de-lauthentification)

---

## 🔧 Backend (Django)

### Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Étape 1 : Créer l'environnement virtuel

```bash
# Se placer dans le dossier backend
cd backend

# Créer l'environnement virtuel
python -m venv env

# Activer l'environnement virtuel
# Sur Windows (PowerShell)
.\env\Scripts\Activate.ps1

# Sur Windows (CMD)
.\env\Scripts\activate.bat

# Sur Linux/Mac
source env/bin/activate
```

### Étape 2 : Installer les modules nécessaires

```bash
# Installer Django
pip install django

# Installer Django REST Framework
pip install djangorestframework

# Installer Simple JWT pour l'authentification JWT
pip install djangorestframework-simplejwt

# Installer django-cors-headers pour gérer les CORS
pip install django-cors-headers
```

**Modules installés :**
- `django` : Framework web Python
- `djangorestframework` : Framework pour créer des API REST
- `djangorestframework-simplejwt` : Authentification JWT
- `django-cors-headers` : Gestion des CORS pour permettre les requêtes depuis React

### Étape 3 : Créer le projet Django (si pas déjà fait)

```bash
# Créer le projet Django
django-admin startproject gagnerbet source

# Créer l'application API
cd source
python manage.py startapp api
```

### Étape 4 : Configurer settings.py

Dans `backend/source/gagnerbet/settings.py`, ajouter les configurations suivantes :

#### 4.1. Ajouter les applications dans INSTALLED_APPS

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",                    # Django REST Framework
    "rest_framework_simplejwt",         # JWT Authentication
    "corsheaders",                       # CORS Headers
    "api",                               # Application API
]
```

#### 4.2. Ajouter le middleware CORS

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Doit être en premier
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

#### 4.3. Configurer CORS

```python
# Autoriser toutes les origines (développement uniquement)
CORS_ALLOW_ALL_ORIGINS = True

# Ou spécifier les origines autorisées (production)
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]
```

#### 4.4. Configurer Django REST Framework avec JWT

```python
# Configuration DRF + JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
```

### Étape 5 : Configurer les URLs

#### 5.1. URLs principales (gagnerbet/urls.py)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
]
```

#### 5.2. URLs de l'API (api/urls.py)

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import hello_view

urlpatterns = [
    # Endpoint pour obtenir le token JWT (login)
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Endpoint pour rafraîchir le token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Endpoint protégé exemple
    path('api/hello/', hello_view, name='hello'),
]
```

### Étape 6 : Créer une vue protégée (api/views.py)

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello_view(request):
    return Response({"message": f"Bienvenue sur votre tableau de bord !"})
```

### Étape 7 : Créer un superutilisateur et lancer le serveur

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (pour tester)
python manage.py createsuperuser

# Lancer le serveur de développement
python manage.py runserver
```

Le serveur sera accessible sur `http://127.0.0.1:8000`

---

## ⚛️ Frontend (React)

### Prérequis

- Node.js 14 ou supérieur
- npm ou yarn

### Étape 1 : Créer le projet React (si pas déjà fait)

```bash
# Se placer dans le dossier frontend
cd frontend

# Créer le projet React
npx create-react-app gagnons

# Se placer dans le dossier du projet
cd gagnons
```

### Étape 2 : Installer les modules nécessaires

```bash
# Installer React Router pour la navigation
npm install react-router-dom

# Installer Axios pour les requêtes HTTP
npm install axios
```

**Modules installés :**
- `react-router-dom` : Routage et navigation dans React
- `axios` : Client HTTP pour faire des requêtes API

### Étape 3 : Structure des fichiers

#### 3.1. Configuration Axios (src/api/axios.js)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // URL du backend Django
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

#### 3.2. Utilitaires d'authentification (src/utils/auth.js)

```javascript
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
```

#### 3.3. Page de connexion (src/pages/Login.js)

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/login/", {
        username,
        password,
      });

      if (response.data && response.data.access) {
        setToken(response.data.access);
        navigate("/dashboard");
      } else {
        setError("Réponse inattendue du serveur.");
      }
    } catch (err) {
      setError("Échec de la connexion — identifiants incorrects ou serveur indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: 320, margin: "80px auto", textAlign: "center" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            required
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            required
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
```

#### 3.4. Route protégée (src/pages/PrivateRoute.js)

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
```

#### 3.5. Page Dashboard (src/pages/Dashboard.js)

```javascript
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = getToken();
        const res = await api.get("/api/hello/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message || "Bienvenue !");
      } catch (err) {
        // Si token invalide ou erreur, supprimer token et renvoyer à login
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
```

#### 3.6. Configuration du routage (src/App.js)

```javascript
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La racine "/" affiche Login par défaut */}
        <Route path="/" element={<Login />} />

        {/* Route protégée */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Tout autre chemin redirige vers "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 3.7. Point d'entrée (src/index.js)

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Étape 4 : Lancer le serveur de développement

```bash
# Lancer le serveur React
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

---

## 📁 Structure du projet

```
gagnerbetpawa/
├── backend/
│   ├── env/                    # Environnement virtuel Python
│   └── source/
│       ├── api/
│       │   

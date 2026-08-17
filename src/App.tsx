import React, { useEffect, useState } from "react";
import { Routes as RRoutes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import DriverLogin from "./pages/DriverLogin";
import Dashboard from "./pages/Dashboard";
import DriverApp from "./pages/DriverApp";
import RouteMapbox from "./pages/RouteMapbox";

type Role = "admin" | "driver" | null;

export default function App() {
  const { session, role, loading, refreshAuth } = useAuth();

  if (loading) {
    return (
      <div className="wrap">
        <div className="card">
          <b>Carregando...</b>
          <div className="muted" style={{ marginTop: 8 }}>
            validando sessão e perfil
          </div>
        </div>
      </div>
    );
  }

  return (
    <RRoutes>
      {/* LOGIN ADMIN / EMPRESA */}
      <Route
        path="/"
        element={
          session ? (
            role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : role === "driver" ? (
              <Navigate to="/driver" replace />
            ) : (
              <Login />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* LOGIN ENTREGADOR */}
      <Route
        path="/driver-login"
        element={
          session ? (
            role === "driver" ? (
              <Navigate to="/driver" replace />
            ) : role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <DriverLogin />
            )
          ) : (
            <DriverLogin />
          )
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          session ? (
            role === "admin" ? (
              <Dashboard />
            ) : role === "driver" ? (
              <Navigate to="/driver" replace />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* DRIVER */}
      <Route
        path="/driver"
        element={
          session ? (
            role === "driver" ? (
              <DriverApp />
            ) : role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/driver-login" replace />
            )
          ) : (
            <Navigate to="/driver-login" replace />
          )
        }
      />

      {/* MAPA */}
      <Route
        path="/route-mapbox"
        element={
          session ? (
            <RouteMapbox />
          ) : (
            <Navigate to="/driver-login" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RRoutes>
  );
}
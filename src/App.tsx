import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Login } from "./components/Login";
import { AuthRequired } from "./components/AuthRequired";
import Estacionamiento from "./components/Estacionamiento";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route element={<AuthRequired />}>
        <Route path="home" element={<Estacionamiento />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}

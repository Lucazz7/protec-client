/* eslint-disable no-constant-condition */
import { JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Chat from "../pages/chat";
import Login from "../pages/login";
import NotFound from "../pages/notfound";
import TrainingFiles from "../pages/trainingFiles";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // const { useAuth } = useAppSelector(userAuth);
  // const isAuthenticated =
  //   (useAuth?.jwt !== "" && useAuth?.isAuthenticated) ?? false;
  return true ? children : <Navigate to="/login" replace />;
};

export function Router() {
  // const { useAuth } = useAppSelector(userAuth);
  // const isAuthenticated = useAuth?.jwt && useAuth?.isAuthenticated;

  const publicRoutes = [{ path: "/login", element: <Login /> }];

  const privateRoutes = [
    {
      path: "/",
      element: <Chat />,
    },
    { path: "/chat/:id", element: <Chat /> },
    { path: "/training-files", element: <TrainingFiles /> },
  ];

  return (
    <BrowserRouter basename="/">
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="/" element={<Layout />}>
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              element={<ProtectedRoute children={route.element} />}
            >
              <Route key={index} path={route.path} element={route.element} />
            </Route>
          ))}
        </Route>
        <Route
          path="*"
          element={
            // isAuthenticated ? (
            //   <Navigate to="/dashboard" replace />
            // ) : (
            <Navigate to="/" replace />
            // )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

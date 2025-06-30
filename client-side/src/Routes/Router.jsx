import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../Pages/Home";
import Layout from "../Layout/Layout";
import Error from "../Pages/Error";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Layout></Layout>,
        errorElement: <Error></Error>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
        ]
    }
]);
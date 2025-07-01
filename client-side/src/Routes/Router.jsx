import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../Pages/Home";
import Layout from "../Layout/Layout";
import Error from "../Pages/Error";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import AddEvent from "../Pages/AddEvent";
import PrivateRoute from "./PrivateRoute";
import MyEvents from "../Pages/MyEvents";
import EditEvent from "../Pages/EditEvent";
import Events from "../Pages/Events";

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
            {
                path:"login",
                element:<Login></Login>
            },
            {
                path:"register",
                element:<Signup></Signup>
            },
            {
                path:"add-event",
                element:<PrivateRoute><AddEvent></AddEvent></PrivateRoute>
            },
            {
                path:"my-event",
                element:<PrivateRoute><MyEvents></MyEvents></PrivateRoute>
            },
            {
                path:"/edit-event/:id",
                element:<PrivateRoute><EditEvent></EditEvent></PrivateRoute>
            },
            {
                path:"/events",
                element:<PrivateRoute><Events></Events></PrivateRoute>
            },
        ]
    }
]);
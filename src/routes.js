import {createBrowserRouter, Navigate, Outlet} from "react-router-dom";
import Home from "./home/Home";
import Login from "./admin/login/Login";
import React, {useRef} from "react";
import {useSelector} from "react-redux";
import Navbar from "./common/components/navbar/Navbar";
import {Toast} from "primereact/toast";
import Footer from "./common/components/footer/Footer";

import adminRoutes from "./admin/routes";
import userRoutes from "./user/routes";
import merchantRoutes from "./merchant/routes";
import eventRoutes from "./events/routes";
import regionRoutes from "./region/routes";
import postRoutes from "./post/routes";
import commonRoutes from "./common/routes";
import partnerRoutes from "./partner/routes";
import currencyRoutes from "./currencies/routes";
import pageRoutes from "./page/routes";
import subscriptionRoutes from "./subscription/routes";
import formRoutes from "./Form/routes";

export let toast;

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useSelector((state) => state.login);

    if (!isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    return children;
};

const Layout = () => {
    toast = useRef(null);
    return (
        <div className="app">
            <Navbar/>
            <main className="main">
                <Outlet/>
                <Toast ref={toast}/>
            </main>
            <Footer/>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout/>
            </ProtectedRoute>
        ),
        // errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            ...adminRoutes,
            ...userRoutes,
            ...merchantRoutes,
            ...eventRoutes,
            ...regionRoutes,
            ...postRoutes,
            ...commonRoutes,
            ...partnerRoutes,
            ...currencyRoutes,
            ...pageRoutes,
            ...subscriptionRoutes,
            ...formRoutes
        ],
    },
    {
        path: "/login",
        element: <Login/>,
    },
]);
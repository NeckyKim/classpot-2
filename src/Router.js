import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Home from "./components/home/Home";




function AppRouter({ isLoggedIn, userObject }) {
    return (
        <div>
            <BrowserRouter>
                {
                    isLoggedIn && <Header />
                }

                <Routes>
                    {isLoggedIn ? <Route path="/" element={<Home userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;
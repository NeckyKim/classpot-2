import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Class from "./components/class/Class";
import Test from "./components/test/Test";


function AppRouter({ isLoggedIn, userObject }) {
    return (
        <div>
            <BrowserRouter>
                {
                    isLoggedIn && <Header />
                }

                <Routes>
                    {isLoggedIn ? <Route path="/" element={<Home userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                    {isLoggedIn ? <Route path="/class/:classId" element={<Class userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                    {isLoggedIn ? <Route path="/class/:classId/test/:testId" element={<Test userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;
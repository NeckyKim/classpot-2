import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HeaderTop from "./components/header/HeaderTop";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Class from "./components/class/Class";
import Test from "./components/test/Test";
import AnswerSheet from "./components/test/AnswerSheet";


function AppRouter({ isLoggedIn, userObject }) {
    return (
        <div>
            <BrowserRouter>
                {/* {
                    isLoggedIn && <HeaderTop />
                } */}

                <Routes>
                    {isLoggedIn ? <Route path="/" element={<Home userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                    {isLoggedIn ? <Route path="/class/:classId" element={<Class userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                    {isLoggedIn ? <Route path="/class/:classId/test/:testId" element={<Test userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                    {isLoggedIn ? <Route path="/class/:classId/test/:testId/answersheet/:studentId" element={<AnswerSheet userObject={userObject} />} /> : <Route path="/" element={<Login />} />}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;
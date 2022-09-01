import { useState, useEffect } from "react";

import { authService } from "./FirebaseModules";

import AppRouter from "./Router.js";

import './App.css';



function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObject, setUserObject] = useState(null);



    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserObject(user);
            }

            else {
                setIsLoggedIn(false);
            }

            setInit(true);
        })
    }, [])



    return (
        <div>
            {
                init

                    ?

                    <AppRouter isLoggedIn={isLoggedIn} userObject={userObject} />

                    :

                    <div>로딩중</div>
            }
        </div>
    );
}

export default App;
import { useState } from "react";

import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { setPersistence } from "firebase/auth";
import { browserSessionPersistence } from "firebase/auth";

import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";



function Login() {
    const [message, setMessage] = useState("")

    const auth = getAuth();



    async function onSocialClick(event) {
        const name = event.target.name;
        let provider;

        try {
            if (name === "google") {
                provider = new GoogleAuthProvider();
            }

            else if (name === "facebook") {
                provider = new FacebookAuthProvider();
            }

            else if (name === "twitter") {
                provider = new TwitterAuthProvider();
            }

            await setPersistence(auth, browserSessionPersistence)
                .then(() => {
                    return signInWithPopup(auth, provider);
                })
        }

        catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                setMessage("로그인이 취소되었습니다.");
            }

            else if (error.code === "auth/account-exists-with-different-credential") {
                setMessage("이미 다른 계정으로 가입된 이메일입니다.");
            }

            else {
                setMessage("로그인 중에 오류가 발생했습니다.");
            }
        }
    }



    return (
        <div>
            <h1>
                classpot
            </h1>

            <button name="google" onClick={onSocialClick}>
                Google 계정으로 로그인
            </button>
        </div>
    )
}

export default Login;
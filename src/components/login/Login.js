import { useState } from "react";

import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { setPersistence } from "firebase/auth";
import { browserSessionPersistence } from "firebase/auth";

import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";

import styles from "./Login.module.css"



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
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerLeft}>
                    <div className={styles.comment}>
                        학생과 선생이 하나가 되는<br />
                        온라인 교육 플랫폼
                    </div>

                    <img alt="icon" className={styles.logo} src={process.env.PUBLIC_URL + "/logo/classpot_white.png"} />

                    <img alt="icon" className={styles.graphic} src={process.env.PUBLIC_URL + "/graphic/auth_01.png"} />
                </div>

                <div className={styles.containerRight}>
                    <div className={styles.title}>
                        로그인
                    </div>

                    <button name="google" onClick={onSocialClick} className={styles.googleButton}>
                        <img alt="icon" className={styles.socialLoginIcon} src={process.env.PUBLIC_URL + "/auth/google.png"} />
                        Google 계정으로 로그인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;
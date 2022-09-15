import { useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc } from "firebase/firestore";

import Loading from "../../Loading";

import styles from "./NewUser.module.css";



function NewUser({ userObject, setInit }) {
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("student");
    const [profileIcon, setProfileIcon] = useState(1);

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);



    // 현재 사용자의 정보를 데이터베이스에 추가
    async function addUserToDatabase(event) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", userObject.uid), {
                userId: userObject.uid,
                userName: userName,
                userType: userType,
                email: userObject.email,
                profileIcon: profileIcon,
            })

            alert("사용자 등록이 완료되었습니다.");
            setInit(true);
        }

        catch (error) {
            alert("사용자 등록에 실패했습니다.");
        }
    }



    return (
        <div>
            {
                loading

                    ?

                    <Loading message="로딩중" />

                    :

                    <form className={styles.container} onSubmit={addUserToDatabase}>
                        <label className={styles.properties}>
                            이름
                        </label>

                        <input
                            type="text"
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                            required
                            spellCheck="false"
                            className={styles.inputBox}
                        />
                        <br />

                        <label className={styles.properties}>
                            유형
                        </label>
                        <input className={userType === "student" ? styles.typeSelectedLeft : styles.typeNotSelectedLeft} type="button" value="학생" onClick={() => setUserType("student")} />
                        <input className={userType === "teacher" ? styles.typeSelectedRight : styles.typeNotSelectedRight} type="button" value="선생님" onClick={() => setUserType("teacher")} />
                        <br />

                        <label className={styles.properties}>
                            아이콘
                        </label>
                        <br />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/1.png"} className={profileIcon === 1 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(1); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/2.png"} className={profileIcon === 2 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(2); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/3.png"} className={profileIcon === 3 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(3); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/4.png"} className={profileIcon === 4 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(4); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/5.png"} className={profileIcon === 5 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(5); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/6.png"} className={profileIcon === 6 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(6); }} />
                        <img alt="icon" src={process.env.PUBLIC_URL + "/profile/7.png"} className={profileIcon === 7 ? styles.iconSelected : styles.iconNotSelected} onClick={() => { setProfileIcon(7); }} />
                        <br /><br />

                        <input className={styles.addButton} type="submit" value="추가하기" />
                    </form>
            }
        </div>
    )
}

export default NewUser;
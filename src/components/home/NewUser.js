import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc } from "firebase/firestore";

import styles from "./NewUser.module.css";



function NewUser({ userObject, setInit }) {
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("student");
    const [profileIcon, setProfileIcon] = useState(1);



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
            <form onSubmit={addUserToDatabase}>
                <label>
                    이름
                </label>
                <br />
                <input
                    type="text"
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    required
                    spellCheck="false"
                />
                <br /><br />

                <label>
                    유형
                </label>
                <br />
                <input type="button" value="학생" onClick={(event) => setUserType("student")} />
                <input type="button" value="선생님" onClick={(event) => setUserType("teacher")} />
                <br /><br />

                <label>
                    유형
                </label>
                <br />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/1.png"} className={styles.icon} onClick={() => { setProfileIcon(1); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/2.png"} className={styles.icon} onClick={() => { setProfileIcon(2); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/3.png"} className={styles.icon} onClick={() => { setProfileIcon(3); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/4.png"} className={styles.icon} onClick={() => { setProfileIcon(4); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/5.png"} className={styles.icon} onClick={() => { setProfileIcon(5); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/6.png"} className={styles.icon} onClick={() => { setProfileIcon(6); }} />
                <img alt="icon" src={process.env.PUBLIC_URL + "/profile/7.png"} className={styles.icon} onClick={() => { setProfileIcon(7); }} />
                <br /><br />

                <input type="submit" value="추가하기" />
            </form>
        </div>
    )
}

export default NewUser;
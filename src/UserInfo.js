import { Link } from "react-router-dom";

import styles from "./UserInfo.module.css";



function UserInfo({userInfo}) {
    return (
        <div>
            <Link to="/">
                <div>
                    <img alt="icon" className={styles.homeButton} src={process.env.PUBLIC_URL + "/logo/classpot_mixed.png"} />
                </div>
            </Link>

            <img alt="icon" className={styles.profileIcon} src={process.env.PUBLIC_URL + "/profile/" + userInfo.profileIcon + ".png"} />

            <div className={styles.userName}>
                {userInfo.userName}
            </div>

            <div className={styles.email}>
                {userInfo.email}
            </div>

            <div className={userInfo.userType === "teacher" ? styles.userTypeTeacher : styles.userTypeStudent}>
                {userInfo.userType === "teacher" ? "선생님" : "학생"}
            </div>
        </div>
    )
}

export default UserInfo;
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { authService } from "../../FirebaseModules";

import styles from "./HeaderTop.module.css";



function Header() {
    const navigate = useNavigate();

    function logOut() {
        authService.signOut();
        navigate("/");
    }

    return (
        <div className={styles.container}>
            <Link to="/">
                <img alt="icon" className={styles.homeButton} src={process.env.PUBLIC_URL + "/logo/classpot_blue.png"} />
            </Link>

            <button onClick={logOut} className={styles.logOutButton}>
                로그아웃
            </button>
        </div>
    )
}

export default Header;
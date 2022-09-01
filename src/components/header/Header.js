import { useNavigate } from "react-router-dom";

import { authService } from "../../FirebaseModules";

import styles from "./Header.module.css";



function Header() {
    const navigate = useNavigate();

    function logOut() {
        authService.signOut();
        navigate("/");
    }

    return (
        <div className={styles.headerContainer}>
            <button onClick={logOut}>
                Log Out
            </button>
        </div>
    )
}

export default Header;
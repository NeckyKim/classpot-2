import styles from "./Error.module.css";



function Error({ message }) {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.messageText}>
                {message}
            </div>
        </div>
    )
}

export default Error;
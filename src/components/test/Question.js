import styles from "./Question.module.css";

function Question({ number, questionObject, answerSheet, setAnswerSheet, mode }) {
    function onChangeAnswerSheet(event) {
        event.preventDefault();

        setAnswerSheet((prev) => {
            return { ...prev, [number]: event.target.value }
        });
    }



    return (
        <div>
            {
                mode === "teacher"

                &&

                <div className={styles.questionElements}>
                    [질문]
                    <div className={styles.question}>
                        {questionObject.question}
                    </div>
                    <br />

                    [정답]
                    <div className={styles.answer}>
                        {questionObject.answer}
                    </div>
                </div>
            }

            {
                mode === "student"

                &&

                <div className={styles.questionElements}>
                    [질문]
                    <div className={styles.question}>
                        {questionObject.question}
                    </div>
                    <br />

                    [답안]
                    <br />
                    <textarea
                        type="text"
                        name={number}
                        onChange={onChangeAnswerSheet}
                        value={answerSheet}
                        spellCheck="false"
                    />
                </div>
            }
        </div>
    )
}

export default Question;
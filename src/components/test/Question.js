import styles from "./Question.module.css";

function Question({ number, questionObject, answerSheet, setAnswerSheet, mode }) {
    function onChangeAnswerSheet(event) {
        event.preventDefault();

        setAnswerSheet((prev) => {
            return { ...prev, [number]: event.target.value }
        });
    }



    return (
        <div className={styles.questionElements}>
            <div className={styles.questionHeader}>
                <div className={styles.questionNumber}>
                    {number}
                </div>

                <div className={styles.questionPoints}>
                    {questionObject.points}점
                </div>
            </div>


            <div className={styles.questionContent}>
                <div className={styles.questionZone}>
                    {questionObject.question}
                </div>

                {
                    mode === "teacher"

                    &&

                    <div>
                        {
                            questionObject.type === "객관식"

                            &&

                            <div>
                                <div className={styles.answerHeader}>
                                    보기
                                </div>

                                <div className={questionObject.answer === 0 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[0]}</div>
                                <div className={questionObject.answer === 1 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[1]}</div>
                                <div className={questionObject.answer === 2 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[2]}</div>
                                <div className={questionObject.answer === 3 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[3]}</div>
                                <div className={questionObject.answer === 4 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[4]}</div>
                                <div className={questionObject.answer === 5 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[5]}</div>
                                <div className={questionObject.answer === 6 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[6]}</div>
                                <div className={questionObject.answer === 7 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[7]}</div>
                                <div className={questionObject.answer === 8 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[8]}</div>
                                <div className={questionObject.answer === 9 ? styles.choicesGreen : styles.choicesNormal}>{questionObject.choices[9]}</div>
                            </div>
                        }

                        {
                            questionObject.type === "진위형"

                            &&

                            <div>
                                <div className={styles.answerHeader}>
                                    정답
                                </div>

                                <div className={styles.answerZone}>
                                    {questionObject.answer === true ? "참" : "거짓"}
                                </div>
                            </div>
                        }

                        {
                            questionObject.type === "주관식"

                            &&

                            <div>
                                <div className={styles.answerHeader}>
                                    정답
                                </div>

                                <div className={styles.answerZone}>
                                    {questionObject.answer}
                                </div>
                            </div>
                        }

                        {
                            questionObject.type === "서술형"

                            &&

                            <div>
                                <div className={styles.answerHeader}>
                                    정답
                                </div>

                                <div className={styles.answerZone}>
                                    {questionObject.answer}
                                </div>
                            </div>
                        }
                    </div>
                }

                {
                    mode === "student"

                    &&

                    <div>
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
        </div>
    )
}

export default Question;
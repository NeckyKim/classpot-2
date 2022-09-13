import styles from "./StudentQuestion.module.css";

function StudentQuestion({ number, questionObject, answerSheet, setAnswerSheet }) {
    function onChoiceClick(event) {
        setAnswerSheet((prev) => {
            return { ...prev, [number]: Number(event.target.value) }
        });
    }



    function onTrueFalseClick(event) {
        setAnswerSheet((prev) => {
            if (event.target.value === "true") { return { ...prev, [number]: true } }
            else { return { ...prev, [number]: false } }
        });
    }



    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionHeader}>
                <div className={styles.questionNumber}>
                    {number + 1}
                </div>

                <div className={styles.questionType}>
                    {questionObject.type}
                </div>

                <div className={styles.questionPoints}>
                    {questionObject.points}점
                </div>
            </div>

            <div className={styles.questionZone}>
                <div className={styles.questionLeft}>
                    <div className={styles.properties}>
                        질문
                    </div>

                    <div className={styles.questionContent}>
                        {questionObject.question}
                    </div>
                </div>

                <div className={styles.questionRight}>
                    <div className={styles.properties}>
                        답안
                    </div>

                    {
                        questionObject.type === "객관식"

                        &&

                        <div>
                            <div>
                                <button value={0} className={answerSheet[number] === 0 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                    {questionObject.choices[0]}
                                </button>
                            </div>

                            <div>
                                <button value={1} className={answerSheet[number] === 1 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                    {questionObject.choices[1]}
                                </button>
                            </div>

                            <div>
                                <button value={2} className={answerSheet[number] === 2 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                    {questionObject.choices[2]}
                                </button>
                            </div>

                            {
                                Object.keys(questionObject.choices).length >= 4

                                &&

                                <div>
                                    <button value={3} className={answerSheet[number] === 3 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[3]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 5

                                &&

                                <div>
                                    <button value={4} className={answerSheet[number] === 4 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[4]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 6

                                &&

                                <div>
                                    <button value={5} className={answerSheet[number] === 5 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[5]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 7

                                &&

                                <div>
                                    <button value={6} className={answerSheet[number] === 6 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[6]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 8

                                &&

                                <div>
                                    <button value={7} className={answerSheet[number] === 7 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[7]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 9

                                &&

                                <div>
                                    <button value={8} className={answerSheet[number] === 8 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[8]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 10

                                &&

                                <div>
                                    <button value={9} className={answerSheet[number] === 9 ? styles.answerChecked : styles.answerNotChecked} onClick={onChoiceClick}>
                                        {questionObject.choices[9]}
                                    </button>
                                </div>
                            }

                        </div>
                    }

                    {
                        questionObject.type === "진위형"

                        &&

                        <div>
                            <div>
                                <button value={true} className={answerSheet[number] === true ? styles.answerChecked : styles.answerNotChecked} onClick={onTrueFalseClick}>
                                    참
                                </button>
                            </div>

                            <div>
                                <button value={false} className={answerSheet[number] === false ? styles.answerChecked : styles.answerNotChecked} onClick={onTrueFalseClick}>
                                    거짓
                                </button>
                            </div>
                        </div>
                    }

                    {
                        (questionObject.type === "주관식" || questionObject.type === "서술형")

                        &&

                        <div>
                            <textarea
                                type="text"
                                name={number}
                                onChange={(event) => {
                                    setAnswerSheet((prev) => {
                                        return { ...prev, [number]: event.target.value }
                                    });
                                }}
                                value={answerSheet[number]}
                                spellCheck="false"
                                className={styles.answerInputBox}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default StudentQuestion;
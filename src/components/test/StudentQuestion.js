import styles from "./StudentQuestion.module.css";

function StudentQuestion({ number, questionObject, answerSheet, setAnswerSheet }) {
    function onTrueFalseClick(event) {
        setAnswerSheet((prev) => {
            if (event.target.value === "true") { return { ...prev, [number]: true } }
            else { return { ...prev, [number]: false } }
        });
    }

    if (questionObject.type === "객관식" && answerSheet[number] === undefined) {
        answerSheet[number] = [];
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
                                <button value={0} className={answerSheet[number]?.includes(0) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(0)) {
                                        temp.splice(temp.indexOf(0), 1)
                                    }
                                    else {
                                        temp.push(0);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                    {questionObject.choices[0]}
                                </button>
                            </div>

                            <div>
                                <button value={1} className={answerSheet[number]?.includes(1) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(1)) {
                                        temp.splice(temp.indexOf(1), 1)
                                    }
                                    else {
                                        temp.push(1);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                    {questionObject.choices[1]}
                                </button>
                            </div>

                            <div>
                                <button value={2} className={answerSheet[number]?.includes(2) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(2)) {
                                        temp.splice(temp.indexOf(2), 1)
                                    }
                                    else {
                                        temp.push(2);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                    {questionObject.choices[2]}
                                </button>
                            </div>

                            {
                                Object.keys(questionObject.choices).length >= 4

                                &&

                                <div>
                                    <button value={3} className={answerSheet[number]?.includes(3) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(3)) {
                                        temp.splice(temp.indexOf(3), 1)
                                    }
                                    else {
                                        temp.push(3);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[3]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 5

                                &&

                                <div>
                                    <button value={4} className={answerSheet[number]?.includes(4) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(4)) {
                                        temp.splice(temp.indexOf(4), 1)
                                    }
                                    else {
                                        temp.push(4);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[4]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 6

                                &&

                                <div>
                                    <button value={5} className={answerSheet[number]?.includes(5) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(5)) {
                                        temp.splice(temp.indexOf(5), 1)
                                    }
                                    else {
                                        temp.push(5);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[5]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 7

                                &&

                                <div>
                                    <button value={6} className={answerSheet[number]?.includes(6) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(6)) {
                                        temp.splice(temp.indexOf(6), 1)
                                    }
                                    else {
                                        temp.push(6);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[6]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 8

                                &&

                                <div>
                                    <button value={7} className={answerSheet[number]?.includes(7) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(7)) {
                                        temp.splice(temp.indexOf(7), 1)
                                    }
                                    else {
                                        temp.push(7);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[7]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 9

                                &&

                                <div>
                                    <button value={8} className={answerSheet[number]?.includes(8) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(8)) {
                                        temp.splice(temp.indexOf(8), 1)
                                    }
                                    else {
                                        temp.push(8);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
                                        {questionObject.choices[8]}
                                    </button>
                                </div>
                            }

                            {
                                Object.keys(questionObject.choices).length >= 10

                                &&

                                <div>
                                    <button value={9} className={answerSheet[number]?.includes(9) ? styles.answerChecked : styles.answerNotChecked} onClick={() => {
                                    var temp = [...answerSheet[number]];

                                    if (temp.includes(9)) {
                                        temp.splice(temp.indexOf(9), 1)
                                    }
                                    else {
                                        temp.push(9);
                                    }
    
                                    temp.sort();

                                    setAnswerSheet((prev) => {
                                        return { ...prev, [0]: temp }
                                    });
                                }}>
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
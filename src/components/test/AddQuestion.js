import { useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import styles from "./AddQuestion.module.css";


function AddQuestion({ setIsAddingQuestion }) {
    let { classId } = useParams();
    let { testId } = useParams();

    const [type, setType] = useState("객관식");
    const [points, setPoints] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(0);

    const [listOfChoices, setListOfChoices] = useState([]);
    const [numberOfChoices, setNumberOfChoices] = useState(3);



    // [선생님] 질문 추가
    async function addQuestion(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes", classId, "tests", testId, "questions")), {
                type: type,
                points: points,
                question: question,
                answer: answer,
                choices: listOfChoices,
                createdTime: Date.now()
            })

            setIsAddingQuestion(false);
            setQuestion("");
            setAnswer("");
        }

        catch (error) {
            alert("질문 추가에 실패했습니다.");
        }
    }



    function onChangeChoices(event) {
        setListOfChoices((prev) => {
            return { ...prev, [event.target.name]: event.target.value }
        });
    }



    return (
        <form onSubmit={addQuestion} className={styles.background}>
            <div className={styles.container}>
                <span className={styles.properties}>
                    유형
                </span>

                <input
                    type="button"
                    value="객관식"
                    className={type === "객관식" ? styles.typeSelectedLeft : styles.typeNotSelectedLeft }
                    onClick={() => { 
                        setType("객관식");
                        setListOfChoices([]);
                        setNumberOfChoices(3);
                        setAnswer(0);
                    }}
                />

                <input
                    type="button"
                    value="진위형"
                    className={type === "진위형" ? styles.typeSelectedCenter : styles.typeNotSelectedCenter }
                    onClick={() => { 
                        setType("진위형"); 
                        setAnswer(true);
                    }}
                />

                <input
                    type="button"
                    value="주관식"
                    className={type === "주관식" ? styles.typeSelectedCenter : styles.typeNotSelectedCenter }
                    onClick={() => { 
                        setType("주관식");
                        setAnswer(null);
                    }}
                />

                <input
                    type="button"
                    value="서술형"
                    className={type === "서술형" ? styles.typeSelectedRight : styles.typeNotSelectedRight }
                    onClick={() => { 
                        setType("서술형");
                        setAnswer(null);
                    }}
                />
                <br />



                <span className={styles.properties}>
                    배점
                </span>

                <input
                    type="number"
                    value={points}
                    className={styles.pointsInputBox}
                    onChange={(event) => setPoints(event.target.value)}
                    required
                />
                점
                <br />



                <span className={styles.properties}>
                    질문
                </span>

                <textarea
                    type="text"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    required
                    spellCheck="false"
                    className={styles.questionInputBox}
                />



                {
                    type === "객관식"

                    &&

                    <div>
                        <span className={styles.properties}>
                            선택지
                        </span>

                        <input type="button" value="증가 +" className={styles.choiceAddButton} onClick={(event) => {
                            if (numberOfChoices === 10) {
                                alert("더 이상 선택지를 추가할 수 없습니다.");
                            }

                            else {
                                setNumberOfChoices(numberOfChoices + 1);
                                setAnswer(0);
                            }
                        }} />

                        <input type="button" value="감소 -" className={styles.choiceDeleteButton} onClick={(event) => {
                            if (numberOfChoices === 3) {
                                alert("최소 3개의 선택지는 있어야합니다.");
                            }

                            else {
                                delete listOfChoices[numberOfChoices - 1];
                                setNumberOfChoices(numberOfChoices - 1);
                                setAnswer(0);
                            }
                        }} />



                        <div>
                            <input type="text" name={0} onChange={onChangeChoices} value={listOfChoices[0]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => { setAnswer(0) }} value="정답" className={answer === 0 ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        <div>
                            <input type="text" name={1} onChange={onChangeChoices} value={listOfChoices[1]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => { setAnswer(1) }} value="정답" className={answer === 1 ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        <div>
                            <input type="text" name={2} onChange={onChangeChoices} value={listOfChoices[2]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => { setAnswer(2) }} value="정답" className={answer === 2 ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        {numberOfChoices >= 4 &&
                            <div>
                                <input type="text" name={3} onChange={onChangeChoices} value={listOfChoices[3]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(3) }} value="정답" className={answer === 3 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 5 &&
                            <div>
                                <input type="text" name={4} onChange={onChangeChoices} value={listOfChoices[4]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(4) }} value="정답" className={answer === 4 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 6 &&
                            <div>
                                <input type="text" name={5} onChange={onChangeChoices} value={listOfChoices[5]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(5) }} value="정답" className={answer === 5 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 7 &&
                            <div>
                                <input type="text" name={6} onChange={onChangeChoices} value={listOfChoices[6]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(6) }} value="정답" className={answer === 6 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 8 &&
                            <div>
                                <input type="text" name={7} onChange={onChangeChoices} value={listOfChoices[7]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(7) }} value="정답" className={answer === 7 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 9 &&
                            <div>
                                <input type="text" name={8} onChange={onChangeChoices} value={listOfChoices[8]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(8) }} value="정답" className={answer === 8 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 10 &&
                            <div>
                                <input type="text" name={9} onChange={onChangeChoices} value={listOfChoices[9]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { setAnswer(9) }} value="정답" className={answer === 9 ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }
                    </div>
                }



                {
                    type === "진위형"

                    &&

                    <div>
                        <span className={styles.properties}>
                             정답
                        </span>

                        <input type="button" className={answer === true ? styles.answerTrueChecked : styles.answerTrueNotChecked} onClick={() => { setAnswer(true) }} value="참" />
                        <input type="button" className={answer === false ? styles.answerFalseChecked : styles.answerFalseNotChecked} onClick={() => { setAnswer(false) }} value="거짓" />
                    </div>
                }



                {
                    type === "주관식"

                    &&

                    <div>
                        <span className={styles.properties}>
                            정답
                        </span>
                    
                        <textarea
                            type="text"
                            value={answer}
                            onChange={(event) => setAnswer(event.target.value)}
                            required
                            spellCheck="false"
                            className={styles.answerInputBox}
                        />
                    </div>
                }



                <input
                    type="submit"
                    value="문제 생성"
                    className={styles.submitButton}
                />

                <input
                    type="button"
                    value="취소"
                    className={styles.cancelButton}
                    onClick={() => setIsAddingQuestion(false)}
                />
            </div>
        </form>
    )
}

export default AddQuestion;
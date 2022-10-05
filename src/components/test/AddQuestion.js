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
    const [answer, setAnswer] = useState([]);

    const [choices, setChoices] = useState([]);
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
                choices: choices,
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
        setChoices((prev) => {
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
                        setChoices([]);
                        setNumberOfChoices(3);
                        setAnswer([]);
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
                            }
                        }} />

                        <input type="button" value="감소 -" className={styles.choiceDeleteButton} onClick={(event) => {
                            if (numberOfChoices === 3) {
                                alert("최소 3개의 선택지는 있어야합니다.");
                            }

                            else {
                                delete choices[numberOfChoices - 1];
                                answer.splice(answer[numberOfChoices - 1], 1)
                                setNumberOfChoices(numberOfChoices - 1);
                            }
                        }} />



                        <div>
                            <input type="text" name={0} onChange={onChangeChoices} value={choices[0]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => {
                                setAnswer(() => {
                                    var temp = [...answer];

                                    if (temp.includes(0)) {
                                        temp.splice(temp.indexOf(0), 1)
                                    }
                                    else {
                                        temp.push(0);
                                    }
    
                                    temp.sort();
                                    return temp
                                });
                            }} value="정답" className={answer.includes(0) ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        <div>
                            <input type="text" name={1} onChange={onChangeChoices} value={choices[1]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => { 
                                setAnswer(() => {
                                    var temp = [...answer];

                                    if (temp.includes(1)) {
                                        temp.splice(temp.indexOf(1), 1)
                                    }
                                    else {
                                        temp.push(1);
                                    }
    
                                    temp.sort();
                                    return temp
                                });
                             }} value="정답" className={answer.includes(1) ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        <div>
                            <input type="text" name={2} onChange={onChangeChoices} value={choices[2]} className={styles.choiceInputBox} required />
                            <input type="button" onClick={() => { 
                                setAnswer(() => {
                                    var temp = [...answer];

                                    if (temp.includes(2)) {
                                        temp.splice(temp.indexOf(2), 1)
                                    }
                                    else {
                                        temp.push(2);
                                    }
    
                                    temp.sort();
                                    return temp
                                });
                             }} value="정답" className={answer.includes(2) ? styles.answerChecked : styles.answerNotChecked} />
                        </div>

                        {numberOfChoices >= 4 &&
                            <div>
                                <input type="text" name={3} onChange={onChangeChoices} value={choices[3]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(3)) {
                                            temp.splice(temp.indexOf(3), 1)
                                        }
                                        else {
                                            temp.push(3);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                 }} value="정답" className={answer.includes(3) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 5 &&
                            <div>
                                <input type="text" name={4} onChange={onChangeChoices} value={choices[4]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(4)) {
                                            temp.splice(temp.indexOf(4), 1)
                                        }
                                        else {
                                            temp.push(4);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                 }} value="정답" className={answer.includes(4) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 6 &&
                            <div>
                                <input type="text" name={5} onChange={onChangeChoices} value={choices[5]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(5)) {
                                            temp.splice(temp.indexOf(5), 1)
                                        }
                                        else {
                                            temp.push(5);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                 }} value="정답" className={answer.includes(5) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 7 &&
                            <div>
                                <input type="text" name={6} onChange={onChangeChoices} value={choices[6]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(6)) {
                                            temp.splice(temp.indexOf(6), 1)
                                        }
                                        else {
                                            temp.push(6);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                 }} value="정답" className={answer.includes(6) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 8 &&
                            <div>
                                <input type="text" name={7} onChange={onChangeChoices} value={choices[7]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(7)) {
                                            temp.splice(temp.indexOf(7), 1)
                                        }
                                        else {
                                            temp.push(7);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                 }} value="정답" className={answer.includes(7) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 9 &&
                            <div>
                                <input type="text" name={8} onChange={onChangeChoices} value={choices[8]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                    setAnswer(() => {
                                        var temp = [...answer];
    
                                        if (temp.includes(8)) {
                                            temp.splice(temp.indexOf(8), 1)
                                        }
                                        else {
                                            temp.push(8);
                                        }
        
                                        temp.sort();
                                        return temp
                                    });
                                }} value="정답" className={answer.includes(8) ? styles.answerChecked : styles.answerNotChecked} />
                            </div>
                        }

                        {numberOfChoices >= 10 &&
                            <div>
                                <input type="text" name={9} onChange={onChangeChoices} value={choices[9]} className={styles.choiceInputBox} required />
                                <input type="button" onClick={() => { 
                                   setAnswer(() => {
                                    var temp = [...answer];

                                    if (answer.includes(9)) {
                                        temp.splice(temp.indexOf(9), 1)
                                    }
                                    else {
                                        temp.push(9);
                                    }
    
                                    temp.sort();
                                    return temp
                                });
                                 }} value="정답" className={answer.includes(9) ? styles.answerChecked : styles.answerNotChecked} />
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
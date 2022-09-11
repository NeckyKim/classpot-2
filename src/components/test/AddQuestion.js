import { useEffect, useState } from "react";
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
    const [answer, setAnswer] = useState("");

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
        <div className={styles.background}>
            <form onSubmit={addQuestion} className={styles.container}>
                유형
                <br />

                <input
                    type="button"
                    value="객관식"
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
                    onClick={() => { 
                        setType("진위형"); 
                        setAnswer(true);
                    }}
                />
                <input
                    type="button"
                    value="주관식"
                    onClick={() => { 
                        setType("주관식");
                        setAnswer(null);
                    }}
                />
                <input
                    type="button"
                    value="서술형"
                    onClick={() => { 
                        setType("서술형");
                        setAnswer(null);
                    }}
                />
                <br /><br />



                배점
                <br />

                <input
                    type="number"
                    value={points}
                    onChange={(event) => setPoints(event.target.value)}
                    required
                />
                <br /><br />


                질문
                <br />

                <textarea
                    type="text"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    required
                    spellCheck="false"
                    className={styles.questionInputBox}
                />
                <br /><br />



                정답
                <br />

                {
                    type === "객관식"

                    &&

                    <div>
                        <div>
                            1번
                            <input type="text" name={0} onChange={onChangeChoices} value={listOfChoices[0]} required />
                            <input type="button" onClick={() => { setAnswer(0) }} value="정답" />
                        </div>

                        <div>
                            2번
                            <input type="text" name={1} onChange={onChangeChoices} value={listOfChoices[1]} required />
                            <input type="button" onClick={() => { setAnswer(1) }} value="정답" />
                        </div>

                        <div>
                            3번
                            <input type="text" name={2} onChange={onChangeChoices} value={listOfChoices[2]} required />
                            <input type="button" onClick={() => { setAnswer(2) }} value="정답" />
                        </div>

                        {numberOfChoices >= 4 &&
                            <div>
                                4번
                                <input type="text" name={3} onChange={onChangeChoices} value={listOfChoices[3]} required />
                                <input type="button" onClick={() => { setAnswer(3) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 5 &&
                            <div>
                                5번
                                <input type="text" name={4} onChange={onChangeChoices} value={listOfChoices[4]} required />
                                <input type="button" onClick={() => { setAnswer(4) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 6 &&
                            <div>
                                6번
                                <input type="text" name={5} onChange={onChangeChoices} value={listOfChoices[5]} required />
                                <input type="button" onClick={() => { setAnswer(5) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 7 &&
                            <div>
                                7번
                                <input type="text" name={6} onChange={onChangeChoices} value={listOfChoices[6]} required />
                                <input type="button" onClick={() => { setAnswer(6) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 8 &&
                            <div>
                                8번
                                <input type="text" name={7} onChange={onChangeChoices} value={listOfChoices[7]} required />
                                <input type="button" onClick={() => { setAnswer(7) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 9 &&
                            <div>
                                9번
                                <input type="text" name={8} onChange={onChangeChoices} value={listOfChoices[8]} required />
                                <input type="button" onClick={() => { setAnswer(8) }} value="정답" />
                            </div>
                        }

                        {numberOfChoices >= 10 &&
                            <div>
                                10번
                                <input type="text" name={9} onChange={onChangeChoices} value={listOfChoices[9]} required />
                                <input type="button" onClick={() => { setAnswer(9) }} value="정답" />
                            </div>
                        }

                        <input type="button" value="-" onClick={() => {
                            if (numberOfChoices === 3) {
                                alert("최소 3개의 선택지는 있어야합니다.")
                            }
                            setNumberOfChoices(numberOfChoices - 1);
                        }} />

                        <input type="button" value="+" onClick={() => {
                            if (numberOfChoices === 10) {
                                alert("더 이상 선택지를 추가할 수 없습니다.")
                            }
                            setNumberOfChoices(numberOfChoices + 1);
                        }} />
                    </div>
                }



                {
                    type === "진위형"

                    &&

                    <div>
                        <input type="button" onClick={() => { setAnswer(true) }} value="참" />
                        <input type="button" onClick={() => { setAnswer(false) }} value="거짓" />
                    </div>
                }


                {
                    type === "주관식"

                    &&

                    <textarea
                        type="text"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        required
                        spellCheck="false"
                        className={styles.answerInputBox}
                    />
                }



                {
                    type === "서술형"

                    &&

                    <textarea
                        type="text"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        required
                        spellCheck="false"
                        className={styles.answerInputBox}
                    />
                }


                <br /><br />

                <input
                    type="submit"
                    value="문제 생성"
                />

                <input
                    type="button"
                    value="취소"
                    onClick={() => setIsAddingQuestion(false)}
                />
            </form>
        </div>
    )
}

export default AddQuestion;
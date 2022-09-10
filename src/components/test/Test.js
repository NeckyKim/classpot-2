import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, setDoc, collection, documentId, orderBy } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import Question from "./Question";

import styles from "./Test.module.css";



function Test({ userObject }) {
    let { classId } = useParams();
    let { testId } = useParams();

    const [testInfo, setTestInfo] = useState([]);

    const [myStudents, setMyStudents] = useState([]);
    const [myQuestions, setMyQuestions] = useState([]);

    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [showNotice, setShowNotice] = useState(true);
    const [number, setNumber] = useState(0);
    const [answerSheet, setAnswerSheet] = useState({});


    // 학생 목록
    useEffect(() => {
        setMyStudents([]);

        onSnapshot(query(collection(dbService, "classes", classId, "students")), (snapshot) => {
            setMyStudents(snapshot.docs.map((current) => ({ userId: current.id, ...current.data() })));
        });
    }, [])



    // 시험 정보
    useEffect(() => {
        setTestInfo([]);

        onSnapshot(query(collection(dbService, "classes", classId, "tests"), where(documentId(), "==", testId)), (snapshot) => {
            setTestInfo(snapshot.docs.map((current) => ({ ...current.data() }))[0]);
        });
    }, [])



    // 질문 목록
    useEffect(() => {
        setMyQuestions([]);

        onSnapshot(query(collection(dbService, "classes", classId, "tests", testId, "questions"), orderBy("createdTime", "asc")), (snapshot) => {
            setMyQuestions(snapshot.docs.map((current) => ({ ...current.data() })));
        });
    }, [])



    // [선생님] 질문 추가
    async function addQuestion(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes", classId, "tests", testId, "questions")), {
                question: question,
                answer: answer,
                createdTime: Date.now()
            })

            setIsCreatingQuestion(false);
            setQuestion("");
            setAnswer("");
        }

        catch (error) {
            alert("질문 추가에 실패했습니다.");
        }
    }



    // [학생] 답안지 불러오기
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "tests", testId, "answersheets"), where(documentId(), "==", userObject.uid)), (snapshot) => {
            var temp = snapshot.docs.map((current) => ({ ...current.data() }))[0];

            if (temp === undefined) {
                var initAnswerSheet = {};

                for (var i = 0; i < myQuestions.length; i++) {
                    initAnswerSheet[i] = "";
                }

                setAnswerSheet(initAnswerSheet);
            }

            else {
                setAnswerSheet(temp);
            }
        });
    }, [myQuestions])



    // [학생] 답안지 제출
    async function sendAnswerSheet() {
        try {
            await setDoc(doc(dbService, "classes", classId, "tests", testId, "answersheets", userObject.uid), answerSheet);
        }

        catch (error) {
            console.log(error);
        }
    }



    return (
        <div>
            <br /><br /><br /><br />

            {
                // 선생님 전용 화면
                testInfo.teacherId === userObject.uid

                &&

                <div>
                    <button onClick={() => { setIsCreatingQuestion(true) }}>
                        문제 추가
                    </button>

                    {
                        myQuestions?.map((current) => (
                            <Question questionObject={current} answerSheet={answerSheet} setAnswerSheet={setAnswerSheet} mode="teacher" />
                        ))
                    }

                    {
                        isCreatingQuestion

                        &&

                        <form onSubmit={addQuestion}>
                            질문
                            <br />

                            <textarea
                                type="text"
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                required
                                spellCheck="false"
                                className={styles.questionInputZone}
                            />
                            <br />

                            정답
                            <br />

                            <textarea
                                type="text"
                                value={answer}
                                onChange={(event) => setAnswer(event.target.value)}
                                required
                                spellCheck="false"
                                className={styles.answerInputZone}
                            />
                            <br />

                            <input
                                type="submit"
                                value="문제 생성"
                            />

                            <input
                                type="button"
                                onClick={() => setIsCreatingQuestion(false)}
                                value="취소"
                            />
                        </form>
                    }
                </div>
            }

            {
                // 학생 전용 화면
                myStudents.map((row) => row.userId).includes(userObject.uid)

                &&

                <div>

                    <button onClick={() => {
                        if (number !== 0) {
                            setNumber(number - 1);
                            sendAnswerSheet();
                        }
                    }}>
                        이전
                    </button>

                    <button onClick={() => {
                        if (number !== myQuestions.length - 1) {
                            setNumber(number + 1);
                            sendAnswerSheet();
                        }
                    }}>
                        다음
                    </button>


                    <Question number={number} questionObject={myQuestions[number]} answerSheet={answerSheet[number]} setAnswerSheet={setAnswerSheet} mode="student" />

                </div>
            }
        </div>
    )
}

export default Test;
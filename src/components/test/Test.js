import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection, documentId, orderBy } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import HeaderBottom from "../header/HeaderBottom";
import TeacherQuestion from "./TeacherQuestion";
import StudentQuestion from "./StudentQuestion";
import AddQuestion from "./AddQuestion";

import styles from "./Test.module.css";



function Test({ userObject }) {
    let { classId } = useParams();
    let { testId } = useParams();

    let navigate = useNavigate();

    const [classInfo, setClassInfo] = useState([]);
    const [testInfo, setTestInfo] = useState([]);

    const [myStudents, setMyStudents] = useState([]);
    const [myQuestions, setMyQuestions] = useState([]);

    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    const [number, setNumber] = useState(0);
    const [answerSheet, setAnswerSheet] = useState({});


    // 학생 목록
    useEffect(() => {
        setMyStudents([]);

        onSnapshot(query(collection(dbService, "classes", classId, "students")), (snapshot) => {
            setMyStudents(snapshot.docs.map((current) => ({ userId: current.id, ...current.data() })));
        });
    }, [])



    // 수업 정보
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes"), where(documentId(), "==", classId)), (snapshot) => {
            setClassInfo(snapshot.docs.map((current) => ({ classId: current.id, ...current.data() }))[0]);
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
            setMyQuestions(snapshot.docs.map((current) => ({ questionId: current.id, ...current.data() })));
        });
    }, [])



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



    // [학생] 시험 종료
    function finishTest() {
        const ok = window.confirm("답안지를 제출하고, 시험을 종료하시겠습니까?");

        if (ok) {
            sendAnswerSheet();
            navigate("/class/" + classId);
        }
    }



    return (
        <div>
            {
                // 선생님 전용 화면
                testInfo.teacherId === userObject.uid

                &&

                <div>
                    <HeaderBottom className={classInfo?.className} classId={classId} testName={testInfo?.testName} testId={testId} />

                    <div className={styles.blank} />

                    <button className={styles.addButton} onClick={() => { setIsAddingQuestion(true) }}>
                        문제 추가
                    </button>

                    {
                        myQuestions?.map((current, index) => (
                            <TeacherQuestion number={index} questionObject={current} answerSheet={answerSheet} setAnswerSheet={setAnswerSheet} />
                        ))
                    }

                    {
                        isAddingQuestion

                        &&

                        <AddQuestion setIsAddingQuestion={setIsAddingQuestion} />
                    }
                </div>
            }

            {
                // 학생 전용 화면
                myStudents.map((row) => row.userId).includes(userObject.uid)

                &&

                <div>
                    <div className={styles.container}>
                        <div className={styles.headerInfo}>
                            <span className={styles.className}>
                                {classInfo?.className}
                            </span>

                            {
                                testInfo?.testName

                                &&


                                <span className={styles.testName}>
                                    {testInfo?.testName}
                                </span>
                            }
                        </div>

                        <button className={styles.submitButton} onClick={finishTest}>
                            시험 종료
                        </button>
                    </div >



                    <button className={styles.previousButton} onClick={() => {
                        if (number !== 0) {
                            setNumber(number - 1);
                            sendAnswerSheet();
                        }
                    }}>
                        이전
                    </button>

                    <button className={styles.nextButton} onClick={() => {
                        if (number !== myQuestions.length - 1) {
                            setNumber(number + 1);
                            sendAnswerSheet();
                        }
                    }}>
                        다음
                    </button>



                    {
                        myQuestions.length !== 0

                        &&

                        <StudentQuestion number={number} questionObject={myQuestions[number]} answerSheet={answerSheet} setAnswerSheet={setAnswerSheet} />
                    }
                </div>
            }
        </div>
    )
}

export default Test;
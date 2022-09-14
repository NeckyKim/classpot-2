import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection, documentId, orderBy } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import HeaderBottom from "../header/HeaderBottom";
import TeacherQuestion from "./TeacherQuestion";
import StudentQuestion from "./StudentQuestion";
import AddQuestion from "./AddQuestion";
import EditInfo from "./EditInfo";

import styles from "./Test.module.css";



function Test({ userObject }) {
    let { classId } = useParams();
    let { testId } = useParams();
    const [tab, setTab] = useState(1);

    let navigate = useNavigate();

    const [classInfo, setClassInfo] = useState([]);
    const [testInfo, setTestInfo] = useState([]);

    const [myStudents, setMyStudents] = useState([]);
    const [myQuestions, setMyQuestions] = useState([]);

    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    const [number, setNumber] = useState(0);
    const [answerSheet, setAnswerSheet] = useState({});

    const [status, setStatus] = useState(null);



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



    // 현재 시간
    const [time, setTime] = useState(new Date());

    function CurrentTime() {
        useEffect(() => {
            const id = setInterval(() => {setTime(new Date());}, 1000);
            return (() => clearInterval(id))
        }, []);

        return (<></>)
    }


    
    // 남은 시간
    function RemainingTime() {
        var currentTime = time
        var finishTime = new Date(testInfo?.startDate + Number(testInfo?.duration) * 60000);

        var minutes = Math.floor((finishTime.getTime() - currentTime.getTime()) / 60000);
        var seconds = Math.floor((((finishTime.getTime() - currentTime.getTime()) / 60000) - minutes) * 60);

        return (<>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>)
    }



    // 시험 응시 시간 확인
    function isTestTime() {
        var startTime = new Date(testInfo?.startDate)
        var currentTime = time
        var finishTime = new Date(testInfo?.startDate + Number(testInfo?.duration) * 60000);

        if (currentTime < startTime) {
            return "before";
        }

        else if (currentTime > startTime && currentTime < finishTime) {
            return "running";
        }

        else if (currentTime > finishTime) {
            return "after";
        }
    }

    

    // 시험 종료시 자동으로 답안지 제출
    if (String(time) === String(new Date(testInfo?.startDate + Number(testInfo?.duration) * 60000))) {
        sendAnswerSheet();
    }



    return (
        <div>
            {
                // 선생님 전용 화면
                testInfo?.teacherId === userObject.uid

                &&

                <div className={styles.container}>
                    <div className={styles.blank} />

                    <HeaderBottom className={classInfo?.className} classId={classId} testName={testInfo?.testName} testId={testId} />

                    <button className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1) }}>설정</button>
                    <button className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2) }}>문제</button>
                    <br />

                    {
                        tab === 1

                        &&

                        <div>
                            <button className={styles.addButton} onClick={() => {
                                setIsEditingInfo(true)
                            }}>
                                설정 변경
                            </button>
                            <br />

                            {testInfo.testName}<br />
                            {new Date(testInfo.startDate).toLocaleString()}<br />
                            {testInfo.duration}

                            {
                                isEditingInfo

                                &&

                                <EditInfo testInfo={testInfo} setIsEditingInfo={setIsEditingInfo} classId={classId} testId={testId} />
                            }
                        </div>
                    }

                    {
                        tab === 2

                        &&

                        <div>
                            <button className={styles.addButton} onClick={() => {
                                setIsAddingQuestion(true)
                            }}>
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
                </div>
            }

            {
                // 학생 전용 화면
                myStudents.map((row) => row.userId).includes(userObject.uid)

                &&

                <div className={styles.testModeContainer}>
                    <CurrentTime />

                    {
                        isTestTime() === "before"

                        &&

                        <div>
                            <div className={styles.blank} />
                            시험 시작 전입니다. <br />
                            시작 시간이 되면 자동으로 화면이 전환되면서 시험이 시작됩니다. <br /><br />

                            {/* {new Date(testInfo.startDate).toLocaleString()}<br />
                            {testInfo.duration} */}
                        </div>

                    }

                    {
                        isTestTime() === "running"

                        &&

                        <div>
                            <div className={styles.testHeader}>
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


                            <div className={styles.testNavigator}>
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

                                <div />

                                <div className={styles.timeIcon}>
                                    <img alt="icon" src={process.env.PUBLIC_URL + "/icon/clock.png"} />
                                </div>

                                <div className={styles.timeValue}>
                                    <RemainingTime />
                                </div>
                            </div>

                            {
                                myQuestions.length !== 0

                                &&

                                <div>
                                    <StudentQuestion number={number} questionObject={myQuestions[number]} answerSheet={answerSheet} setAnswerSheet={setAnswerSheet} />
                                </div>
                            }
                        </div>

                    }

                    {
                        isTestTime() === "after"

                        &&

                        <div>
                            <div className={styles.blank} />
                            시험 종료
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Test;
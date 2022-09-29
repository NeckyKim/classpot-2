import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, deleteDoc, collection, documentId, orderBy } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import HeaderBottom from "../header/HeaderBottom";
import TeacherQuestion from "./TeacherQuestion";
import StudentQuestion from "./StudentQuestion";
import AddQuestion from "./AddQuestion";
import EditInfo from "./EditInfo";
import Error from "../../Error";

import GetClassInfo from "../hooks/GetClassInfo";
import GetTestInfo from "../hooks/GetTestInfo";

import BeforeTestLoader from "react-spinners/RingLoader";
import AfterTestLoader from "react-spinners/PuffLoader";

import styles from "./Test.module.css";



function Test({ userObject }) {
    let { classId } = useParams();
    let { testId } = useParams();
    const [tab, setTab] = useState(1);

    let navigate = useNavigate();

    const classInfo = GetClassInfo(classId);
    const testInfo = GetTestInfo(classId, testId);

    const [myStudents, setMyStudents] = useState([]);
    const [myStudentsInfo, setMyStudentsInfo] = useState([]);
    const [myQuestions, setMyQuestions] = useState([]);

    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    const [number, setNumber] = useState(0);
    const [answerSheet, setAnswerSheet] = useState({});



    // 학생 목록
    useEffect(() => {
        setMyStudents([]);

        onSnapshot(query(collection(dbService, "classes", classId, "students")), (snapshot) => {
            setMyStudents(snapshot.docs.map((current) => ({ userId: current.id, ...current.data() })));
        });
    }, [])

    useEffect(() => {
        for (var i = 0; i < myStudents.length; i++) {
            const verified = myStudents[i].verified;
            getDoc(doc(dbService, "users", myStudents[i].userId)).then((doc) => {
                if (!myStudentsInfo.map((row) => row.userId).includes(doc.data().userId)) {
                    setMyStudentsInfo(prev => [...prev, { userId: doc.id, verified: verified, ...doc.data() }])
                }
            });
        }
    }, [myStudents])



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
            const id = setInterval(() => { setTime(new Date()); }, 1000);
            return (() => clearInterval(id))
        }, []);

        return (<></>)
    }



    // 시작 남은 시간
    function StartingTime() {
        var currentTime = time.getTime()
        var startTime = new Date(testInfo?.startDate).getTime();

        var diff = startTime - currentTime;

        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff - days * 86400000) / 3600000);
        var minutes = Math.floor((diff - days * 86400000 - hours * 3600000) / 60000);
        var seconds = Math.floor((diff - days * 86400000 - hours * 3600000 - minutes * 60000) / 1000);

        return (
            <>
                {days !== 0 && <>{days}일</>} {hours !== 0 && <>{hours}시간</>} {minutes !== 0 && <>{minutes}분</>} {seconds}초
            </>
        )
    }



    // 남은 시간
    function RemainingTime() {
        var currentTime = time
        var finishTime = new Date(testInfo?.startDate + Number(testInfo?.duration) * 60000);

        var diff = finishTime - currentTime;

        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff - minutes * 60000) / 1000);

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
                    <button className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3) }}>답안지</button>
                    <br />

                    {
                        tab === 1

                        &&

                        <div>
                            <button className={styles.addButton} onClick={() => {
                                setIsEditingInfo(true);
                            }}>
                                설정 변경
                            </button>

                            <button className={styles.deleteButton} onClick={async () => {
                                const ok = window.confirm("시험을 삭제하시겠습니까?");

                                if (ok) {
                                    await deleteDoc(doc(dbService, "classes", classId, "tests", testId));
                                    navigate("/class/" + classId);
                                }
                            }}>
                                시험 삭제
                            </button>
                            <br />

                            <label className={styles.testInfoProperties}>시험 이름</label>
                            <label className={styles.testInfoValues}>{testInfo.testName}</label><br />

                            <label className={styles.testInfoProperties}>시작 일시</label>
                            <label className={styles.testInfoValues}>{new Date(testInfo.startDate).toLocaleString()}</label><br />

                            <label className={styles.testInfoProperties}>응시 시간</label>
                            <label className={styles.testInfoValues}>{testInfo.duration}분</label><br />

                            <label className={styles.testInfoProperties}>종료 일시</label>
                            <label className={styles.testInfoValues}>{new Date(testInfo.startDate + testInfo.duration * 60000).toLocaleString()}</label><br />

                            <label className={styles.testInfoProperties}>시작 일시</label>
                            <label className={styles.testInfoValues}>{testInfo.feedback ? "공개 함" : "공개 안 함"}</label><br />

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

                    {
                        tab === 3

                        &&

                        <div>
                            {
                                myStudents.length

                                    ?

                                    <div>
                                        <div className={styles.headerElements}>
                                            <div className={styles.headerValue}>학생 이름</div>
                                        </div>

                                        {
                                            myStudentsInfo.map((current) => (
                                                <div className={styles.studentElements}>
                                                    <Link link to={"answersheet/" + current.userId} style={{ textDecoration: "none" }}>
                                                        <div className={styles.studentName}>
                                                            {current.verified ? current.userName : "인증 요청중"}
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    :

                                    <div className={styles.noStudents}>
                                        수업을 듣는 학생이 없습니다.
                                    </div>
                            }
                        </div>
                    }
                </div>
            }



            {
                // 학생 전용 화면
                myStudents.map((row) => row.userId).includes(userObject.uid)

                    ?

                    <div className={styles.testModeContainer}>
                        <CurrentTime />

                        {
                            // [학생] 시험 시작 전
                            isTestTime() === "before"

                            &&

                            <div>
                                <HeaderBottom className={classInfo?.className} classId={classId} testName={testInfo?.testName} testId={testId} />

                                <div className={styles.notTestLoader}>
                                    <BeforeTestLoader
                                        size={200}
                                        color="rgb(0, 200, 255)"
                                        speedMultiplier={0.5}
                                    />
                                </div>

                                <div className={styles.beforeTestBig}>
                                    시험 시작 전입니다.
                                </div>

                                <div className={styles.notTestSmall}>
                                    시작 시간이 되면 자동으로 화면이 전환되면서 시험이 시작됩니다.
                                </div>

                                <div className={styles.startingTime}>
                                    <span className={styles.startingTimeBig}>
                                        <StartingTime />
                                    </span>

                                    <span className={styles.startingTimeSmall}>
                                        후 시험 시작
                                    </span>
                                </div>
                            </div>

                        }

                        {
                            // [학생] 시험 진행 중
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
                            // [학생] 시험 종료 후
                            isTestTime() === "after"

                            &&

                            <div>
                                <div className={styles.blank} />

                                <HeaderBottom className={classInfo?.className} classId={classId} testName={testInfo?.testName} testId={testId} />

                                <div className={styles.notTestLoader}>
                                    <AfterTestLoader
                                        size={200}
                                        color="rgb(150, 150, 150)"
                                        speedMultiplier={0.5}
                                    />
                                </div>

                                <div className={styles.afterTestBig}>
                                    시험이 종료되었습니다.
                                </div>

                                <div className={styles.notTestSmall}>
                                    {
                                        testInfo.feedback 

                                            ? 

                                            <div>
                                                시험 종류 후 피드백이 공개된 시험입니다.

                                                <Link link to={"answersheet/" + userObject.uid} style={{ textDecoration: "none" }}>
                                                    <div>
                                                        피드백 확인하기
                                                    </div>
                                                </Link>
                                            </div>
                                    
                                            :

                                            <div>
                                                시험 종료 후 피드백이 공개되지 않은 시험입니다.
                                            </div>
                                        }
                                </div>
                            </div>
                        }
                    </div>

                    :

                    <div>
                        {
                            testInfo?.teacherId !== userObject.uid

                            &&

                            <Error message="수업에 등록되지 않은 학생입니다." />
                        }
                    </div>
            }
        </div>
    )
}

export default Test;
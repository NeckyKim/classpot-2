import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
import { onSnapshot, query, where, documentId, orderBy } from "firebase/firestore";

import AnswerSheetQuestion from "./AnswerSheetQuestion";
import Error from "../../Error";

import styles from "./AnswerSheet.module.css";



function AnswerSheet({ userObject }) {
    let { classId } = useParams();
    let { testId } = useParams();
    let { studentId } = useParams()

    const [testInfo, setTestInfo] = useState([]);

    const [myQuestions, setMyQuestions] = useState([]);
    const [answerSheet, setAnswerSheet] = useState([]);

    const [reportCard, setReportCard] = useState({});



    // 시험 정보
    useEffect(() => {
        setTestInfo([]);

        onSnapshot(query(collection(dbService, "classes", classId, "tests"), where(documentId(), "==", testId)), (snapshot) => {
            setTestInfo(snapshot.docs.map((current) => ({ ...current.data() }))[0]);
        });
    }, [])



    // 질문 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "tests", testId, "questions"), orderBy("createdTime", "asc")), (snapshot) => {
            setMyQuestions(snapshot.docs.map((current) => ({ questionId: current.id, ...current.data() })));
        });
    }, [])



    // 답안지 불러오기
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "tests", testId, "answersheets"), where(documentId(), "==", studentId)), (snapshot) => {
            setAnswerSheet(Object.values(snapshot.docs.map((current) => ({ ...current.data() }))[0]));
        });
    }, [])



    // 자동 채점
    useEffect(() => {
        if (testInfo.teacherId === userObject.uid) {
            if (reportCard[reportCard.length - 1] === true) {
                var temp = { autoGrading: true };

                for (var i = 0; i < myQuestions.length; i++) {
                    if (myQuestions[i].type !== "서술형") {
                        if (myQuestions[i].answer === answerSheet[i]) {
                            temp[i] = Number(myQuestions[i].points);
                        }

                        else {
                            temp[i] = 0;
                        }
                    }

                    else {
                        temp[i] = false;
                    }
                }

                try {
                    if (reportCard.length === 0) {
                        setDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), temp);
                    }

                    else {
                        updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), temp);
                    }
                }

                catch (error) {
                    console.log(error);
                }
            }
        }
    }, [myQuestions, answerSheet])



    // 채점표 불러오기
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "tests", testId, "reportcards"), where(documentId(), "==", studentId)), (snapshot) => {
            setReportCard(Object.values(snapshot.docs.map((current) => ({ ...current.data() }))[0]));
        });
    }, [])



    // 현재 시간
    const [time, setTime] = useState(new Date());

    function CurrentTime() {
        useEffect(() => {
            const id = setInterval(() => { setTime(new Date()); }, 1000);
            return (() => clearInterval(id))
        }, []);

        return (<></>)
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



    // 자동 채점 모드 변경
    function changeAutoGradingMode() {
        if (reportCard[reportCard.length - 1] === true) {
            const ok = window.confirm("자동 채점을 해제하시겠습니까?");

            if (ok) {
                updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), { autoGrading: false });
            }
        }

        else {
            const ok = window.confirm("자동 채점을 활성하시겠습니까? 수동으로 채점한 항목과 수정한 내용들이 모두 초기화되고 자동으로 채점됩니다.");

            if (ok) {
                updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), { autoGrading: true });
            }
        }
    }



    return (
        <div className={styles.container}>
            <div className={styles.blank} />

            {
                testInfo.teacherId === userObject.uid

                    ?

                    <div>
                        <label className={styles.autoGradingMode}>자동 채점</label>
                        
                        <button className={reportCard[reportCard.length - 1] ? styles.autoGradingOnLeft : styles.autoGradingOffLeft} disabled={reportCard[reportCard.length - 1]} onClick={changeAutoGradingMode}>
                            ON
                        </button>

                        <button className={!reportCard[reportCard.length - 1] ? styles.autoGradingOnRight : styles.autoGradingOffRight} disabled={!reportCard[reportCard.length - 1]} onClick={changeAutoGradingMode}>
                            OFF
                        </button>

                        {
                            myQuestions.map((current, index) => (
                                <div>
                                    <AnswerSheetQuestion number={index} questionObject={current} answer={answerSheet[index]} report={reportCard[index]} autoGrading={reportCard[reportCard.length - 1]} mode="teacher" />
                                </div>
                            ))
                        }
                    </div>

                    :

                    <div>
                        {
                            studentId === userObject.uid

                                ?

                                <div>
                                    <CurrentTime />

                                    {
                                        isTestTime() === "after"

                                            ?

                                            <div>
                                                {
                                                    myQuestions.map((current, index) => (
                                                        <div>
                                                            <AnswerSheetQuestion number={index} questionObject={current} answer={answerSheet[index]} autoGrading={reportCard[reportCard.length - 1]} report={reportCard[index]} mode="student" />
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            :

                                            <Error message="시험이 종료되지 않았습니다." />
                                    }
                                </div>

                                :

                                <Error message="수업에 등록되지 않은 학생입니다." />
                        }
                    </div>
            }
        </div>
    )
}

export default AnswerSheet;
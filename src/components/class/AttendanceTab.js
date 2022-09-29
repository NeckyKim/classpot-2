import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, collection, documentId, updateDoc, orderBy } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import AttendanceInfo from "./AttendanceInfo";

import GetClassInfo from "../hooks/GetClassInfo";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import styles from "./AttendanceTab.module.css";



function AttendanceTab({ userObject }) {
    let { classId } = useParams();

    const classInfo = GetClassInfo(classId);

    const [isCheckingAttendance, setIsCheckingAttendance] = useState(false);
    const [checkingTime, setCheckingTime] = useState(1);
    const [inputNumber, setInputNumber] = useState(null);
    const [progress, setProgress] = useState(null);

    const [currentAttendanceInfo, setCurrentAttendanceInfo] = useState(undefined);
    const [totalAttendanceInfo, setTotalAttendanceInfo] = useState(undefined);
    const [checkedStudents, setCheckedStudents] = useState([]);

    const [mode, setMode] = useState(true);
    const [day, setDay] = useState(null);

    const [myStudents, setMyStudents] = useState([]);
    const [myStudentsInfo, setMyStudentsInfo] = useState([]);



    // [선생님] 학생 정보 목록
    useEffect(() => {
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



    // 출석 번호 생성
    async function checkAttendance() {
        try {
            await setDoc(doc(collection(dbService, "classes", classId, "attendance")), {
                checkCode: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
                createdTime: Date.now(),
                checkingTime: checkingTime,
                nowChecking: true,
            })
        }

        catch (error) {
            alert("출석 번호 생성에 실패했습니다.");
        }
    }



    // 현재 출석 확인 여부
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "attendance"), where("nowChecking", "==", true)), (snapshot) => {
            setCurrentAttendanceInfo(snapshot.docs.map((current) => ({ attendanceId: current.id, ...current.data() }))[0]);

            if (currentAttendanceInfo !== undefined) {
                setIsCheckingAttendance(true);
            }
        });
    }, [])



    // 출석 확인
    function confirmAttendance() {
        if (String(inputNumber).padStart(4, '0') === currentAttendanceInfo.checkCode) {
            try {
                setDoc(doc(dbService, "classes", classId, "attendance", currentAttendanceInfo.attendanceId, "list", userObject.uid), {
                    status: "onTime",
                    time: Date.now()
                })

                setInputNumber(null);
                alert("출석이 완료되었습니다.");
            }

            catch (error) {
                alert("출석 확인에 실패했습니다.");
            }
        }

        else {
            alert("출석 번호가 올바르지 않습니다.");
        }
    }



    // 출석 학생
    useEffect(() => {
        if (currentAttendanceInfo) {
            onSnapshot(query(collection(dbService, "classes", classId, "attendance", currentAttendanceInfo.attendanceId, "list")), (snapshot) => {
                setCheckedStudents(snapshot.docs.map((current) => ({ studentId: current.id, ...current.data() })));
            });
        }
    }, [currentAttendanceInfo])



    // 현재 시간
    const [time, setTime] = useState(new Date());

    function CurrentTime() {
        useEffect(() => {
            const id = setInterval(() => { setTime(new Date()); }, 1000);
            return (() => clearInterval(id))
        }, []);

        return (<></>)
    }



    // 남은 시간
    function RemainingTime() {
        var currentTime = time
        var finishTime = new Date(currentAttendanceInfo?.createdTime + Number(currentAttendanceInfo?.checkingTime) * 60000);

        var diff = finishTime - currentTime;
        setProgress(diff / (Number(currentAttendanceInfo?.checkingTime) * 60000));

        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff - minutes * 60000) / 1000);

        return (<>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>)
    }



    // 출석 종료
    if (String(time) === String(new Date(currentAttendanceInfo?.createdTime + Number(currentAttendanceInfo?.checkingTime) * 60000))) {
        updateDoc(doc(dbService, "classes", classId, "attendance", currentAttendanceInfo.attendanceId), {
            nowChecking: false,
        })

        for (var i = 0; i < myStudents.length; i++) {
            if (!checkedStudents.map(row => row.studentId).includes(myStudents[i].userId)) {
                setDoc(doc(dbService, "classes", classId, "attendance", currentAttendanceInfo.attendanceId, "list", myStudents[i].userId), {
                    status: "absent",
                    time: null,
                })
            }
        }
    }



    // 전체 출석 날짜
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "attendance"), orderBy("createdTime", "asc")), (snapshot) => {
            setTotalAttendanceInfo(snapshot.docs.map((current) => ({ attendanceId: current.id, ...current.data() })));
        });
    }, [])



    return (
        <div>
            <CurrentTime />

            {
                mode

                    ?

                    // 출석 진행 모드
                    <div>
                        {
                            userObject.uid === classInfo.teacherId

                                ?

                                // 선생님 화면
                                <div>
                                    {
                                        currentAttendanceInfo

                                            ?

                                            <div className={styles.attendanceContainer}>
                                                <div className={styles.attendanceProgressBar}>
                                                    <CircularProgressbar
                                                        value={progress * 100}
                                                        strokeWidth={2}
                                                        text={<RemainingTime />}
                                                        styles={buildStyles({
                                                            strokeLinecap: "butt",
                                                            textColor: "rgb(0, 100, 255)",
                                                            pathColor: "rgb(0, 100, 255)",
                                                            trailColor: "rgb(220, 220, 220)"
                                                        })}
                                                    />
                                                </div>
                                                출석 확인 중
                                                {currentAttendanceInfo && userObject.uid === classInfo.teacherId && currentAttendanceInfo.checkCode}
                                            </div>

                                            :

                                            <div className={styles.attendanceContainer}>
                                                <div className={styles.attendanceProgressBar}>
                                                    <CircularProgressbar
                                                        value={progress}
                                                        strokeWidth={2}
                                                        text={time.toLocaleString()}
                                                        styles={buildStyles({
                                                            strokeLinecap: "butt",
                                                            textSize: "7px",
                                                            textColor: "rgb(0, 100, 255)",
                                                            trailColor: "rgb(220, 220, 220)"
                                                        })}
                                                    />
                                                </div>

                                                <button className={styles.startCheckButton} onClick={() => { checkAttendance() }}>출석 번호 생성</button>
                                                <button className={styles.totalAttendanceButton} onClick={() => { setMode(false) }}>출석부 확인</button>
                                            </div>
                                    }
                                </div>

                                :

                                // 학생 화면
                                <div>
                                    {
                                        currentAttendanceInfo

                                            ?

                                            <div>
                                                {
                                                    checkedStudents.map((row) => row.studentId).includes(userObject.uid)

                                                        ?

                                                        "출석 완료"

                                                        :

                                                        <div  className={styles.attendanceContainer}>
                                                            <div className={styles.attendanceProgressBar}>
                                                        <CircularProgressbar
                                                            value={progress * 100}
                                                            strokeWidth={2}
                                                            text={<RemainingTime />}
                                                            styles={buildStyles({
                                                                strokeLinecap: "butt",
                                                                textColor: "rgb(0, 100, 255)",
                                                                pathColor: "rgb(0, 100, 255)",
                                                                trailColor: "rgb(220, 220, 220)"
                                                            })}
                                                        />
                                                    </div>
                                                            출석 확인 중<br />

                                                            <input type="number" value={inputNumber} onChange={(event) => { setInputNumber(event.target.value) }} required />

                                                            <button onClick={() => { confirmAttendance() }}>출석하기</button>
                                                        </div>
                                                }
                                            </div>

                                            :

                                            <div>
                                                현재 생성된 출석 번호가 없습니다.
                                            </div>
                                    }
                                </div>
                        }
                    </div>

                    :

                    // 출석부 확인 모드
                    <div className={styles.totalAttendanceContainer}>
                        <div>
                            <button className={styles.goBackButton} onClick={() => { setMode(true) }}>돌아가기</button>
                            {
                                totalAttendanceInfo

                                &&

                                totalAttendanceInfo.map((current, index) => (
                                    <div>
                                        <button className={day === index ? styles.dateSelected : styles.dateNotSelected} onClick={() => { setDay(index) }}>
                                            {new Date(current.createdTime).toLocaleString()}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>

                        {day !== null && <AttendanceInfo attendanceObject={totalAttendanceInfo[day]} studentsObject={myStudentsInfo} />}
                    </div>
            }
        </div>
    )
}

export default AttendanceTab;
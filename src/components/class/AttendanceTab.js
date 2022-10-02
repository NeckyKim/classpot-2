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
    async function startCheckingAttendance() {
        try {
            if (checkingTime >= 1 && checkingTime <= 10) {
                await setDoc(doc(collection(dbService, "classes", classId, "attendance")), {
                    checkCode: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
                    createdTime: Date.now(),
                    checkingTime: checkingTime,
                    nowChecking: true,
                })
            }

            else {
                alert("출석 시간은 1분부터 10분까지 지정가능합니다.")
            }
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
        var finishTime = new Date(currentAttendanceInfo?.createdTime + Number(currentAttendanceInfo?.checkingTime) * Number(checkingTime) * 60000);

        var diff = finishTime - currentTime;
        setProgress(diff / (Number(currentAttendanceInfo?.checkingTime) * 60000));

        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff - minutes * 60000) / 1000);

        return (<>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</>)
    }



    // 출석 종료(시간 종료)
    if (String(time) === String(new Date(currentAttendanceInfo?.createdTime + Number(currentAttendanceInfo?.checkingTime) * 60000))) {
        updateDoc(doc(dbService, "classes", classId, "attendance", currentAttendanceInfo?.attendanceId), {
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



    // 출석 종료(직접 종료)
    async function stopCheckingAttendance() {
        try {
            const ok = window.confirm("출석 확인을 종료하시겠습니까?");

            if (ok) {
                await updateDoc(doc(dbService, "classes", classId, "attendance", currentAttendanceInfo?.attendanceId), {
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
        }

        catch (error) {
            alert("출석 확인 종료에 실패했습니다.");
            console.log(error)
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

                                            // 출석 확인 중
                                            <div className={styles.attendanceContainer}>
                                                <div>
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

                                                <div className={styles.attendanceComment}>
                                                    출석 확인 중
                                                </div>

                                                <div className={styles.attendanceNumber}>
                                                    {currentAttendanceInfo && userObject.uid === classInfo.teacherId && currentAttendanceInfo.checkCode}
                                                </div>

                                                <button className={styles.startCheckButton} onClick={() => { stopCheckingAttendance() }}>
                                                    출석 확인 종료
                                                </button>

                                            </div>

                                            :

                                            // 출석 확인 아닐 때
                                            <div className={styles.attendanceContainer}>
                                                <div>
                                                    <CircularProgressbar
                                                        value={0}
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

                                                <button className={styles.startCheckButton} onClick={() => { startCheckingAttendance() }}>
                                                    출석 번호 생성
                                                </button>

                                                <label className={styles.checkingTimeLabel}>
                                                    출석 확인 시간
                                                </label>
                                                <input className={styles.checkingTimeInput} type="number" value={checkingTime} min="1" max="10" onChange={(event) => setCheckingTime(Number(event.target.value))} />
                                                <label className={styles.checkingTimeMinute}>
                                                    분
                                                </label>

                                                <button className={styles.totalAttendanceButton} onClick={() => { setMode(false) }}>
                                                    출석부 확인
                                                </button>
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
                                                        <div className={styles.attendanceContainer}>
                                                            <div>
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

                                                            <div className={styles.attendanceComment}>
                                                                출석 완료
                                                            </div>
                                                        </div>

                                                        :

                                                        // 출석 확인 중
                                                        <div className={styles.attendanceContainer}>
                                                            <div>
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

                                                            <div className={styles.attendanceComment}>
                                                                출석 확인 중
                                                            </div>

                                                            <input className={styles.studentAttendanceNumberInput} type="number" value={inputNumber} onChange={(event) => { setInputNumber(event.target.value) }} required />

                                                            <button className={styles.studentCheckAttendanceButton} onClick={() => { confirmAttendance() }}>출석하기</button>
                                                        </div>
                                                }
                                            </div>

                                            :

                                            <div className={styles.studentNoAttendance}>
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
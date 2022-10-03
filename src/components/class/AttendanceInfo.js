import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";

import styles from "./AttendanceInfo.module.css";


function AttendanceInfo({ attendanceObject, studentsObject }) {
    let { classId } = useParams();

    const [attendanceList, setAttendanceList] = useState([]);


    // 해당 출석 정보 불러오기
    useEffect(() => {
        if (attendanceObject) {
            onSnapshot(query(collection(dbService, "classes", classId, "attendance", attendanceObject.attendanceId, "list")), (snapshot) => {
                setAttendanceList(snapshot.docs.map((current) => ({ studentId: current.id, ...current.data() })));
            });
        }
    }, [attendanceObject])



    return (
        <div>
            {
                attendanceObject

                &&

                <div>
                    <div>
                        <label className={styles.dateProperties}>출석 확인 일시</label>
                        <label className={styles.dateValue}>{attendanceObject && new Date(attendanceObject.createdTime).toLocaleString()}</label>
                    </div>

                    <div className={styles.headerElements}>
                        <div className={styles.headerValue}>학생 이름</div>
                        <div className={styles.headerValue}>출석 여부</div>
                        <div className={styles.headerValue}>출석 일시</div>
                        <div className={styles.headerValue}>출석 변경</div>
                    </div>

                    {
                        attendanceList.map((current) => (
                            <div className={styles.studentElements}>
                                <div className={styles.studentName}>
                                    {studentsObject[studentsObject.findIndex(i => i.userId === current.studentId)].userName}
                                </div>

                                <div className={styles.studentStatus}>
                                    {current.status === "onTime" && <label className={styles.statusOnTime}>출석</label>}
                                    {current.status === "absent" && <label className={styles.statusAbsent}>결석</label>}
                                    {current.status === "late" && <label className={styles.statusLate}>지각</label>}
                                </div>

                                <div className={styles.studentTime}>
                                    {new Date(current.time).toLocaleString()}
                                </div>

                                <div>
                                    <button className={styles.changeToOnTimeButton} onClick={() => {
                                        setDoc(doc(dbService, "classes", classId, "attendance", attendanceObject.attendanceId, "list", current.studentId), {
                                            status: "onTime",
                                            time: Date.now()
                                        })
                                    }}>
                                        출석
                                    </button>

                                    <button className={styles.changeToOnAbsentButton} onClick={() => {
                                        setDoc(doc(dbService, "classes", classId, "attendance", attendanceObject.attendanceId, "list", current.studentId), {
                                            status: "absent",
                                            time: Date.now()
                                        })
                                    }}>
                                        결석
                                    </button>

                                    <button className={styles.changeToOnLateButton} onClick={() => {
                                        setDoc(doc(dbService, "classes", classId, "attendance", attendanceObject.attendanceId, "list", current.studentId), {
                                            status: "late",
                                            time: Date.now()
                                        })
                                    }}>
                                        지각
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default AttendanceInfo;
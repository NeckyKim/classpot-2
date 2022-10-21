import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, collection, documentId } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import StudentTab from "./StudentTab";
import AttendanceTab from "./AttendanceTab";
import TestTab from "./TestTab";
import Error from "../../Error";
import UserInfo from "../../UserInfo";

import GetUserInfo from "../hooks/GetUserInfo";
import GetClassInfo from "../hooks/GetClassInfo";

import styles from "./Class.module.css";




function Class({ userObject }) {
    let { classId } = useParams();
    const [tab, setTab] = useState(1);

    const [teacherMyClasses, setTeacherMyClasses] = useState([]);
    const [studentMyClasses, setStudentMyClasses] = useState([]);

    const userInfo = GetUserInfo(userObject.uid)
    const classInfo = GetClassInfo(classId);

    const [verified, setVerified] = useState([]);



    // [선생님] 수업 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes"), where("teacherId", "==", userObject.uid)), (snapshot) => {
            setTeacherMyClasses(snapshot.docs.map((current) => ({ classId: current.id, ...current.data() })));
        });
    }, [])



    // [학생] 수강 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "users", userObject.uid, "classes")), (snapshot) => {
            setStudentMyClasses(snapshot.docs.map((current) => ({ classId: current.id, ...current.data() })));
        });
    }, [])



    // [학생] 수업 인증 여부
    useEffect(() => {
        getDoc(doc(dbService, "users", userObject.uid, "classes", classId)).then((doc) => { setVerified(doc.data().verified); });
    }, []);



    // [학생] 수업 인증 동의
    async function verify(event) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", userObject.uid, "classes", classId), {
                verified: true
            })

            await setDoc(doc(dbService, "classes", classId, "students", userObject.uid), {
                verified: true
            })

            alert("인증에 성공했습니다.");
            setVerified(true);
        }

        catch (error) {
            alert("인증에 실패했습니다.");
        }
    }



    return (
        <div>
            {
                // 선생님 화면
                userInfo?.userType === "teacher" && teacherMyClasses.map((row) => row.classId).includes(classId)

                &&

                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <UserInfo userInfo={userInfo} />

                        <button className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1) }}>학생</button>
                        <button className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2) }}>출결</button>
                        <button className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3) }}>시험</button>
                        <button className={tab === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(4) }}>공지사항</button>
                    </div>


                    {tab === 1 && <StudentTab classInfo={classInfo} />}
                    {tab === 2 && <AttendanceTab userInfo={userInfo} classInfo={classInfo} />}
                    {tab === 3 && <TestTab userInfo={userInfo} classInfo={classInfo} />}
                </div>
            }

            {
                // 학생 화면
                userInfo?.userType === "student" && verified === true

                &&

                <div>
                    {

                        studentMyClasses.map((row) => row.classId).includes(classId) && verified === true

                            ?

                            <div className={styles.container}>
                                <div className={styles.containerLeft}>
                                    <UserInfo userInfo={userInfo} />

                                    <button className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1) }}>출결</button>
                                    <button className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2) }}>시험</button>
                                    <button className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3) }}>공지사항</button>
                                </div>

                                

                                {tab === 1 && <AttendanceTab userInfo={userInfo} classInfo={classInfo} />}
                                {tab === 2 && <TestTab userInfo={userInfo} classInfo={classInfo} />}
                            </div>

                            :

                            <div>
                                <Error message="수업에 등록되지 않은 학생입니다." />
                            </div>

                    }
                </div>
            }

            {
                userInfo?.userType === "student" && studentMyClasses.map((row) => row.classId).includes(classId) && verified === false

                &&

                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <UserInfo userInfo={userInfo} />

                        <button className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1) }}>학생</button>
                        <button className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2) }}>출결</button>
                        <button className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3) }}>시험</button>
                        <button className={tab === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(4) }}>공지사항</button>
                    </div>


                    {tab === 1 && <StudentTab userObject={userObject} userData={userInfo} classId={classId} />}
                    {tab === 2 && <AttendanceTab userObject={userObject} userData={userInfo} classId={classId} />}
                    {tab === 3 && <TestTab userObject={userObject} userData={userInfo} classId={classId} />}
                </div>
            }
        </div>
    )
}

export default Class;
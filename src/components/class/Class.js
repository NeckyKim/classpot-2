import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, collection, documentId } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import HeaderBottom from "../header/HeaderBottom";
import StudentTab from "./StudentTab";
import TestTab from "./TestTab";



function Class({ userObject }) {
    let { classId } = useParams();
    const [tab, setTab] = useState(1);

    const [userData, setUserData] = useState(undefined);
    const [teacherMyClasses, setTeacherMyClasses] = useState([]);
    const [studentMyClasses, setStudentMyClasses] = useState([]);

    const [classInfo, setClassInfo] = useState([]);
    const [verified, setVerified] = useState([]);



    // 현재 사용자의 정보
    useEffect(() => {
        getDoc(doc(dbService, "users", userObject.uid)).then((doc) => { setUserData(doc.data()); });
    }, []);



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



    // 수업 정보
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes"), where(documentId(), "==", classId)), (snapshot) => {
            setClassInfo(snapshot.docs.map((current) => ({ classId: current.id, ...current.data() }))[0]);
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
                userData?.userType === "teacher" && teacherMyClasses.map((row) => row.classId).includes(classId)

                &&

                <div>
                    <br /><br /><br /><br /><br /><br /><br />
                    <HeaderBottom className={classInfo?.className} classCode={classInfo?.classId} />

                    <button onClick={() => { setTab(1) }}>학생</button>
                    <button onClick={() => { setTab(2) }}>출결</button>
                    <button onClick={() => { setTab(3) }}>시험</button>
                    <button onClick={() => { setTab(4) }}>공지사항</button>

                    { tab === 1 && <StudentTab userObject={userObject} userData={userData} classId={classId} /> }
                    { tab === 3 && <TestTab userObject={userObject} userData={userData} classId={classId} /> }
                </div>
            }

            {
                // 학생 화면
                userData?.userType === "student" && studentMyClasses.map((row) => row.classId).includes(classId) && verified === true

                &&

                <div>
                    <br /><br /><br />
                    강의실
                    <br />
                    {classInfo.className}
                    <br /><br />
                </div>

            }

            {
                userData?.userType === "student" && studentMyClasses.map((row) => row.classId).includes(classId) && verified === false

                &&
                <div>
                    <br /><br /><br />
                    인증 ㄱ?

                    <button onClick={verify}>
                        인증
                    </button>
                </div>
            }
        </div>
    )
}

export default Class;
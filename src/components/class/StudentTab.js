import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, deleteDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import Error from "../../Error";

import styles from "./StudentTab.module.css";



function StudentTab({ classInfo }) {
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [studentEmail, setStudentEmail] = useState("");
    const [findingResults, setFindingResults] = useState(undefined);
    const [findingMessage, setFindingMessage] = useState("");
    const [ableToSendRequest, setAbleToSendRequest] = useState(false);

    const [myStudents, setMyStudents] = useState([]);
    const [myStudentsInfo, setMyStudentsInfo] = useState([]);



    // [선생님] 학생 정보 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classInfo.classId, "students")), (snapshot) => {
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



    // [선생님] 이메일로 학생 찾기
    function findStudentByEmail(email) {
        setFindingResults([]);
        onSnapshot(query(collection(dbService, "users"), where("email", "==", email)), (snapshot) => {
            setFindingResults(snapshot.docs.map((current) => ({ ...current.data() }))[0]);
        });
    }

    useEffect(() => {
        if (findingResults === undefined) {
            if (studentEmail === "") {
                setAbleToSendRequest(false);
                setFindingMessage("");
            }

            else {
                setAbleToSendRequest(false);
                setFindingMessage("해당 학생의 이메일을 찾을 수 없습니다.");
            }
        }

        else {
            if (findingResults.userType === "teacher") {
                setAbleToSendRequest(false);
                setFindingMessage("선생님은 학생으로 추가할 수 없습니다.");
            }

            else {
                if (myStudentsInfo.map((row) => row.email).includes(findingResults.email)) {
                    setAbleToSendRequest(false);
                    setFindingMessage("이미 등록된 학생의 이메일입니다.");
                }

                else {
                    setAbleToSendRequest(true);
                    setFindingMessage("버튼을 누르면 해당 학생에게 인증을 요청합니다.");
                }
            }
        }
    }, [findingResults])



    // [선생님] 학생에게 인증 요청
    async function sendRequest(event) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", findingResults.userId, "classes", classInfo.classId), {
                verified: false
            })

            await setDoc(doc(dbService, "classes", classInfo.classId, "students", findingResults.userId), {
                verified: false
            })

            alert("학생 등록이 완료되었습니다.");
            setIsAddingStudent(false);
            setStudentEmail("");
            setFindingMessage("");
            setFindingResults(undefined);
        }

        catch (error) {
            alert("학생 등록에 실패했습니다.");
        }
    }



    // [선생님] 학생 삭제
    async function deleteStudent(userId) {
        try {
            const ok = window.confirm("해당 학생을 삭제하시겠습니까?");

            if (ok) {
                await deleteDoc(doc(dbService, "users", userId, "classes", classInfo.classId))
                await deleteDoc(doc(dbService, "classes", classInfo.classId, "students", userId))

                alert("학생이 삭제되었습니다.");
            }
        }

        catch (error) {
            alert("학생을 삭제하지 못했습니다.");
        }
    }



    return (
        <div className={styles.containerRight}>
            <div className={styles.containerRightTop}>
                <div className={styles.className}>
                    {classInfo.className}
                </div>

                <div className={styles.tabName}>
                    학생
                </div>
            </div>

            <div className={styles.containerRightBottom}>
                {
                    myStudents.length

                        ?

                        <div>
                            <div className={styles.headerElements}>
                                <div className={styles.headerValue}>학생 이름</div>
                                <div className={styles.headerValue}>이메일</div>
                            </div>

                            {
                                myStudentsInfo.map((current) => (
                                    <div className={styles.studentElements}>
                                        <div className={styles.studentName}>
                                            {current.verified ? current.userName : "인증 요청중"}
                                        </div>

                                        <div className={styles.studentEmail}>
                                            {current.email}
                                        </div>

                                        <button className={styles.deleteButton} onClick={() => { deleteStudent(current.userId) }}>
                                            삭제
                                        </button>
                                    </div>
                                ))
                            }
                        </div>

                        :

                        <div>
                            <Error message="현재 수강중인 학생이 없습니다." />
                        </div>
                }

                <button className={styles.addButton} onClick={() => { setIsAddingStudent(true) }}>
                    학생 추가
                </button>



                {
                    isAddingStudent

                    &&

                    <div className={styles.background}>
                        <div className={styles.addContainer}>
                            <div className={styles.comment}>
                                수업에 추가할 학생의 이메일을 입력하고, <span className={styles.commentHighlight}>이메일 찾기</span> 버튼을 누르세요.<br />

                                이메일이 존재하는 경우, <span className={styles.commentHighlight}>인증 요청</span> 버튼을 눌러서 학생에게 인증을 요청합니다.<br />

                                해당 학생이 요청을 <span className={styles.commentHighlight}>수락</span>하면 강의에 추가됩니다.
                            </div>

                            <input className={styles.emailInputBox} type="text" value={studentEmail} required onChange={(event) => { setStudentEmail(event.target.value) }} spellCheck={false} />

                            <button className={styles.emailSearchButton} onClick={() => { findStudentByEmail(studentEmail) }}>이메일 찾기</button>

                            <div className={ableToSendRequest === true ? styles.messageGreen : styles.messageRed}>
                                {findingMessage}
                            </div>

                            {
                                ableToSendRequest

                                &&

                                <div>
                                    <button className={styles.sendRequestButton} onClick={sendRequest}>인증 요청</button>
                                </div>
                            }

                            <button className={styles.cancelButton} onClick={() => {
                                setIsAddingStudent(false);
                                setAbleToSendRequest(false);
                                setStudentEmail("");
                                setFindingMessage("");
                            }}>
                                취소
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default StudentTab;
import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, deleteDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function Students({ userObject, userData, classId }) {
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [studentEmail, setStudentEmail] = useState("");
    const [findingResults, setFindingResults] = useState(undefined);
    const [ableToSendRequest, setAbleToSendRequest] = useState(false);

    const [myStudents, setMyStudents] = useState([]);
    const [myStudentsInfo, setMyStudentsInfo] = useState([]);


    // [선생님] 이메일로 학생 찾기
    function findStudentByEmail(email) {
        onSnapshot(query(collection(dbService, "users"), where("email", "==", email)), (snapshot) => {
            setFindingResults(snapshot.docs.map((current) => ({ ...current.data() }))[0]);

            if (findingResults !== undefined && findingResults.userType === "student") {
                setAbleToSendRequest(true);
            }
        });
    }



    // [선생님] 학생 정보
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "students")), (snapshot) => {
            setMyStudents(snapshot.docs.map((current) => ({ userId: current.id, ...current.data() })));
        });
    }, [])

    useEffect(() => {

        for (var i = 0; i < myStudents.length; i++) {
            const verified = myStudents[i].verified;
            getDoc(doc(dbService, "users", myStudents[i].userId)).then((doc) => { setMyStudentsInfo(prev => [...prev, { userId: doc.id, verified: verified, ...doc.data() }]) });
        }
    }, [myStudents])



    // [선생님] 학생에게 인증 요청
    async function sendRequest(event) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", findingResults.userId, "classes", classId), {
                verified: false
            })

            await setDoc(doc(dbService, "classes", classId, "students", findingResults.userId), {
                verified: false
            })

            alert("사용자 등록이 완료되었습니다.");
            setIsAddingStudent(false);
        }

        catch (error) {
            alert("사용자 등록에 실패했습니다.");
        }
    }



    // [선생님] 학생 삭제
    async function deleteStudent(userId) {
        try {
            await deleteDoc(doc(dbService, "users", userId, "classes", classId))
            await deleteDoc(doc(dbService, "classes", classId, "students", userId))

            alert("학생이 삭제되었습니다.");
        }

        catch (error) {
            alert("학생을 삭제하지 못했습니다.");
        }
    }



    return (
        <div>
            {
                myStudentsInfo.map((current) => (
                    <div>
                        {current.verified ? current.userName : "인증 요청중"}
                        {current.email}

                        <button onClick={() => {deleteStudent(current.userId)}}>
                            삭제
                        </button>
                    </div>
                ))
            }

            <button onClick={() => { setIsAddingStudent(true) }}>
                학생 추가
            </button>

            {
                isAddingStudent

                &&

                <div>
                    <label>
                        학생 이메일
                    </label>

                    <input type="text" value={studentEmail} onChange={(event) => { setStudentEmail(event.target.value) }} />

                    <input type="button" value="찾기" onClick={() => { findStudentByEmail(studentEmail) }} />

                    {
                        ableToSendRequest

                        &&

                        <input type="submit" value="인증 요청" onClick={sendRequest} />
                    }
                    <br />

                    <input type="button" value="취소" onClick={() => {
                        setIsAddingStudent(false);
                        setStudentEmail("");
                    }} />
                </div>
            }
        </div>
    )
}

export default Students;
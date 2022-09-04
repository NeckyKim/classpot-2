import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function ValidUser({ userObject, userData }) {
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [className, setClassName] = useState("");

    const [teacherMyClasses, setTeacherMyClasses] = useState([]);
    const [studentMyClasses, setStudentMyClasses] = useState([]);
    const [studentMyClassesInfo, setStudentMyClassesInfo] = useState([]);



    // [선생님] 수업 추가하기
    async function addClass(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes")), {
                className: className,
                teacherId: userData.userId,
                teacherName: userData.userName,
                createdTime: Date.now(),
            })

            alert("수업이 등록되었습니다.");
            setIsCreatingClass(false);
        }

        catch (error) {
            alert("수업 등록에 실패했습니다.");
        }
    }



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

    useEffect(() => {
        for (var i = 0; i < studentMyClasses.length; i++) {
            getDoc(doc(dbService, "classes", studentMyClasses[i].classId)).then((doc) => { setStudentMyClassesInfo(prev => [...prev, {classId: doc.id, ...doc.data()}]) });
        }
    }, [studentMyClasses])



    return (
        <div>
            {
                // 선생님 화면
                userData?.userType === "teacher"

                &&

                <div>
                    선생님
                    <br /><br />

                    {
                        teacherMyClasses.map((current, index) => (
                            <div key={index}>
                                <Link link to={"class/" + current.classId}>
                                    {current.className}
                                </Link>
                            </div>
                        ))
                    }
                    <br />

                    <button onClick={() => setIsCreatingClass(!isCreatingClass)}>
                        {isCreatingClass ? "취소" : "수업 추가"}
                    </button>
                </div>
            }



            {
                // 학생 화면
                userData?.userType === "student"

                &&

                <div>
                    학생
                    <br /><br />

                    {
                        studentMyClassesInfo.map((current, index) => (
                            <div key={index}>
                                <Link link to={"class/" + current.classId}>
                                    {current.className}
                                </Link>
                            </div>
                        ))
                    }
                    <br />
                </div>
            }



            {
                // [선생] 수업 생성 화면
                isCreatingClass

                &&

                <div>
                    <form onSubmit={addClass}>
                        <label>
                            수업 이름
                        </label>

                        <input
                            type="text"
                            value={className}
                            onChange={(event) => setClassName(event.target.value)}
                            required
                            spellCheck="false"
                        />
                        <br />

                        <input type="submit" value="추가하기" />
                    </form>
                </div>
            }
        </div>
    )
}

export default ValidUser;
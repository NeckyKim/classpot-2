import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import styles from "./ValidUser.module.css"



function ValidUser({ userObject, userData }) {
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [className, setClassName] = useState("");

    const [teacherMyClasses, setTeacherMyClasses] = useState([]);
    const [studentMyClasses, setStudentMyClasses] = useState([]);
    const [studentMyClassesInfo, setStudentMyClassesInfo] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(undefined);



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
            setTeacherMyClasses(snapshot.docs.map((current) => ({
                classId: current.id, ...current.data()
            })));
        });
    }, [])

    useEffect(() => {
        var temp = []

        for (var i = 0; i < teacherMyClasses.length; i++) {
            onSnapshot(query(collection(dbService, "classes", teacherMyClasses[i].classId, "students")), (snapshot) => {
                temp.push(snapshot.docs.length)
            })
        }

        setNumberOfStudents(temp);
    }, [teacherMyClasses])



    // [학생] 수강 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "users", userObject.uid, "classes")), (snapshot) => {
            setStudentMyClasses(snapshot.docs.map((current) => ({
                classId: current.id, ...current.data()
            })));
        });
    }, [])

    useEffect(() => {
        for (var i = 0; i < studentMyClasses.length; i++) {
            getDoc(doc(dbService, "classes", studentMyClasses[i].classId)).then((doc) => {
                setStudentMyClassesInfo((prev) => [...prev, { classId: doc.id, ...doc.data() }])
            });
        }
    }, [studentMyClasses])



    return (
        <div>
            <div className={styles.blank} />

            {
                // 선생님 화면
                userData?.userType === "teacher"

                &&

                <div className={styles.container}>
                    {
                        teacherMyClasses.length

                            ?

                            <div>
                                <div className={styles.headerElements}>
                                    <div className={styles.headerValue}>수업 이름</div>
                                    <div className={styles.headerValue}>수업 개설 날짜</div>
                                </div>

                                {
                                    teacherMyClasses.map((current, index) => (
                                        <Link link to={"class/" + current.classId} style={{ textDecoration: "none" }}>
                                            <div className={styles.classElements}>
                                                <div className={styles.className}>
                                                    {current.className}
                                                </div>

                                                <div className={styles.createdTime}>
                                                    {new Date(current.createdTime).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <br />
                            </div>

                            :

                            <div className={styles.noClasses}>
                                수업이 없습니다.
                            </div>
                    }

                    <button className={styles.addButton} onClick={() => setIsCreatingClass(true)}>
                        수업 추가
                    </button>
                </div>
            }



            {
                // 학생 화면
                userData?.userType === "student"

                &&

                <div className={styles.container}>
                    {
                        studentMyClassesInfo.length

                            ?

                            <div>
                                <div className={styles.headerElements}>
                                    <div className={styles.headerValue}>수업 이름</div>
                                    <div className={styles.headerValue}>수업 개설 날짜</div>
                                </div>

                                {
                                    studentMyClassesInfo.map((current, index) => (
                                        <Link link to={"class/" + current.classId} style={{ textDecoration: "none" }}>
                                            <div className={styles.classElements}>
                                                <div className={styles.className}>
                                                    {current.className}
                                                </div>

                                                <div className={styles.createdTime}>
                                                    {new Date(current.createdTime).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>

                            :

                            <div className={styles.noClasses}>
                                수업이 없습니다.
                            </div>
                    }

                    <br />
                </div>
            }



            {
                // [선생] 수업 생성 화면
                isCreatingClass

                &&
                <form className={styles.background} onSubmit={addClass}>
                    <div className={styles.addContainer}>
                        <label className={styles.properties}>
                            수업 이름
                        </label>

                        <input
                            type="text"
                            value={className}
                            className={styles.inputBox}
                            onChange={(event) => setClassName(event.target.value)}
                            required
                            spellCheck="false"
                        />
                        <br />

                        <input className={styles.addButton} type="submit" value="추가하기" />

                        <input className={styles.cancelButton} onClick={() => { setIsCreatingClass(false) }} type="button" value="취소하기" />
                    </div>
                </form>
            }
        </div>
    )
}

export default ValidUser;
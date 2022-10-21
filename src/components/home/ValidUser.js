import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import GetUserInfo from "../hooks/GetUserInfo";

import styles from "./ValidUser.module.css"



function ValidUser({ userObject }) {
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [className, setClassName] = useState("");

    const [teacherMyClasses, setTeacherMyClasses] = useState([]);
    const [studentMyClasses, setStudentMyClasses] = useState([]);
    const [studentMyClassesInfo, setStudentMyClassesInfo] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(undefined);

    const userInfo = GetUserInfo(userObject.uid)



    // [선생님] 수업 추가하기
    async function addClass(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes")), {
                className: className,
                teacherId: userInfo.userId,
                teacherName: userInfo.userName,
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
            {
                // 선생님 화면
                userInfo?.userType === "teacher"

                &&

                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <Link to="/">
                            <div>
                                <img alt="icon" className={styles.homeButton} src={process.env.PUBLIC_URL + "/logo/classpot_mixed.png"} />
                            </div>
                        </Link>

                        <img alt="icon" className={styles.profileIcon} src={process.env.PUBLIC_URL + "/profile/" + userInfo.profileIcon + ".png"} />

                        <div className={styles.userName}>
                            {userInfo.userName}
                        </div>

                        <div className={styles.email}>
                            {userInfo.email}
                        </div>

                        <div className={userInfo.userType === "teacher" ? styles.userTypeTeacher : styles.userTypeStudent}>
                            {userInfo.userType === "teacher" ? "선생님" : "학생"}
                        </div>
                    </div>

                    <div className={styles.containerRight}>
                        <div className={styles.containerRightTop}>
                            대시보드
                        </div>

                        <div className={styles.containerRightBottom}>
                            <div className={styles.Header}>
                                현재 진행중인 수업
                            </div>

                            {
                                teacherMyClasses.length

                                    ?

                                    <div>
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
                    </div>
                </div>
            }



            {
                // 학생 화면
                userInfo?.userType === "student"

                &&

                <div className={styles.container}>
                    <div className={styles.containerLeft}>
                        <Link to="/">
                            <div>
                                <img alt="icon" className={styles.homeButton} src={process.env.PUBLIC_URL + "/logo/classpot_mixed.png"} />
                            </div>
                        </Link>

                        <img alt="icon" className={styles.profileIcon} src={process.env.PUBLIC_URL + "/profile/" + userInfo.profileIcon + ".png"} />

                        <div className={styles.userName}>
                            {userInfo.userName}
                        </div>

                        <div className={styles.email}>
                            {userInfo.email}
                        </div>

                        <div className={userInfo.userType === "teacher" ? styles.userTypeTeacher : styles.userTypeStudent}>
                            {userInfo.userType === "teacher" ? "선생님" : "학생"}
                        </div>
                    </div>

                    <div className={styles.containerRight}>
                        <div className={styles.containerRightTop}>
                            대시보드
                        </div>

                        <div className={styles.containerRightBottom}>
                            <div className={styles.Header}>
                                현재 수강중인 수업
                            </div>

                            {
                                studentMyClassesInfo.length

                                    ?

                                    <div>
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
                        </div>
                    </div>
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
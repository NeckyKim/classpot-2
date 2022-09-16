import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";

import styles from "./TestTab.module.css";



function TestTab({ userObject, userData, classId }) {
    const [isCreatingTest, setIsCreatingTest] = useState(false);
    const [testName, setTestName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [duration, setDuration] = useState(null);
    const [feedback, setFeedback] = useState(false);

    const [myTests, setMyTests] = useState([]);



    // [선생님] 시험 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes", classId, "tests")), (snapshot) => {
            setMyTests(snapshot.docs.map((current) => ({ testId: current.id, ...current.data() })));
        });
    }, [])



    // [선생님] 시험 추가하기
    async function addTest(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes", classId, "tests")), {
                testName: testName,
                startDate: Date.parse(startDate),
                duration: Number(duration),
                feedback: feedback,
                teacherId: userData.userId,
                createdTime: Date.now(),
            })

            alert("시험이 등록되었습니다.");
            setIsCreatingTest(false);
            setTestName("");
            setStartDate("");
            setDuration(null);
        }

        catch (error) {
            alert("시험 생성에 실패했습니다.");
        }
    }



    return (
        <div>
            {
                myTests.length

                    ?

                    <div>
                        <div className={styles.headerElements}>
                            <div className={styles.headerValue}>시험 이름</div>
                            <div className={styles.headerValue}>시작 일시</div>
                            <div className={styles.headerValue}>응시 시간</div>
                        </div>

                        {
                            myTests.map((current, index) => (
                                <div key={index}>
                                    <Link link to={"test/" + current.testId} style={{ textDecoration: "none" }}>
                                        <div className={styles.testElements}>
                                            <div className={styles.testName}>
                                                {current.testName}
                                            </div>
                                            
                                            <div className={styles.startDate}>
                                                {new Date(current.startDate).toLocaleString()}
                                            </div>

                                            <div className={styles.startDate}>
                                                {current.duration}분
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>

                    :

                    <div className={styles.noTests}>
                        시험이 없습니다.
                    </div>
            }

            {
                userData.userType === "teacher"

                &&

                <button className={styles.addButton} onClick={() => { setIsCreatingTest(true) }}>
                    시험 추가
                </button>
            }



            {
                isCreatingTest

                &&

                <form className={styles.background} onSubmit={addTest}>
                    <div className={styles.container}>
                        <label className={styles.properties}>
                            시험 이름
                        </label>

                        <input className={styles.testNameInputBox} type="text" value={testName} onChange={(event) => { setTestName(event.target.value) }} required />
                        <br />

                        <label className={styles.properties}>
                            시작 일시
                        </label>

                        <input className={styles.testDateInputBox} type="datetime-local" value={startDate} onChange={(event) => { setStartDate(event.target.value) }} required />
                        <br />

                        <label className={styles.properties}>
                            응시 시간
                        </label>

                        <input className={styles.durationInputBox} type="number" value={duration} onChange={(event) => { setDuration(event.target.value) }} required />
                        분
                        <br />

                        <label className={styles.properties}>
                            피드백 공개
                        </label>

                        <input className={feedback === false ? styles.typeSelectedLeft : styles.typeNotSelectedLeft} type="button" value="공개 안 함" onClick={() => setFeedback(false)} />
                        <input className={feedback === true ? styles.typeSelectedRight : styles.typeNotSelectedRight} type="button" value="공개함" onClick={() => setFeedback(true)} />
                        <br />

                        <input className={styles.submitButton} type="submit" value="시험 생성" />

                        <input className={styles.cancelButton} type="button" value="취소" onClick={() => {
                            setIsCreatingTest(false);
                            setTestName("");
                            setStartDate("");
                            setDuration(null);
                        }} />
                    </div>
                </form>
            }
        </div>
    )
}

export default TestTab;
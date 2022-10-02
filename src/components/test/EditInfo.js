import { useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import styles from "./EditInfo.module.css";



function EditInfo({ testInfo, setIsEditingInfo, classId, testId }) {
    const [testName, setTestName] = useState(testInfo.testName);
    const [startDate, setStartDate] = useState(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString('en-US', { hour12: false }));
    const [duration, setDuration] = useState(testInfo.duration);
    const [feedback, setFeedback] = useState(testInfo.feedback);



    // [선생님] 설정 변경하기
    async function editInfo(event) {
        event.preventDefault();

        try {
            await updateDoc(doc(dbService, "classes", classId, "tests", testId), {
                testName: testName,
                startDate: Date.parse(startDate),
                duration: Number(duration),
                feedback: feedback,
            })

            alert("설정이 변경되었습니다.");
            setIsEditingInfo(false);
        }

        catch (error) {
            alert("설정 변경에 실패했습니다.");
        }
    }

    

    return (
        <form className={styles.background} onSubmit={editInfo}>
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

                <input className={styles.submitButton} type="submit" value="설정 변경" />

                <input
                    type="button"
                    value="취소"
                    className={styles.cancelButton}
                    onClick={() => { setIsEditingInfo(false); }}
                />
            </div>
        </form>
    )
}

export default EditInfo;
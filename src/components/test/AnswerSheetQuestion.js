import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import styles from "./AnswerSheetQuestion.module.css";



function AnswerSheetQuestion({ number, questionObject, answer, report, autoGrading, mode }) {
    let { classId } = useParams();
    let { testId } = useParams();
    let { studentId } = useParams()



    // 수동 채점
    function manualGrading() {
        var manualScore;

        if (report === false) {
            manualScore = Number(prompt("서술형을 채점합니다."));
        }

        else if (questionObject.type === "서술형") {
            manualScore = Number(prompt("점수를 변경합니다."));
        }

        else {
            manualScore = Number(prompt("해당 문제는 " + questionObject.type + " 유형 문제로 자동으로 채점되었습니다. 직접 점수를 부여할 경우 자동 채점이 해제됩니다."));
        }


        if (manualScore) {
            updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), { [number]: manualScore, autoGrading: false });
        }


        else if (isNaN(manualScore)) {
            alert("점수를 입력하세요.")
        }
    }



    // 오답 처리
    function changeToIncorrect() {
        const ok = window.confirm("해당 문제를 정답에서 오답으로 변경하시겠습니까?")

        if (ok) {
            updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), { [number]: 0 });
        }
    }

    

    // 정답 처리
    function changeToCorrect() {
        const ok = window.confirm("해당 문제를 오답에서 정답으로 변경하시겠습니까?")

        if (ok) {
            updateDoc(doc(dbService, "classes", classId, "tests", testId, "reportcards", studentId), { [number]: Number(questionObject.points) });
        }
    }



    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionHeader}>
                <div className={styles.questionNumber}>
                    {number + 1}
                </div>

                <div className={styles.questionType}>
                    {questionObject.type}
                </div>

                <div className={styles.questionPoints}>
                    {questionObject.points}점
                </div>
            </div>



            <div className={styles.questionContent}>
                <div className={styles.questionZone}>
                    {questionObject.question}
                </div>



                <div>
                    {
                        questionObject.type === "객관식"

                        &&

                        <div>
                            <div className={styles.answerHeader}>
                                보기
                            </div>

                            <div className={questionObject.answer.includes(0) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[0]}</div>
                            <div className={questionObject.answer.includes(1) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[1]}</div>
                            <div className={questionObject.answer.includes(2) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[2]}</div>

                            {Object.keys(questionObject.choices).length >= 4 && <div className={questionObject.answer.includes(3) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[3]}</div>}
                            {Object.keys(questionObject.choices).length >= 5 && <div className={questionObject.answer.includes(4) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[4]}</div>}
                            {Object.keys(questionObject.choices).length >= 6 && <div className={questionObject.answer.includes(5) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[5]}</div>}
                            {Object.keys(questionObject.choices).length >= 7 && <div className={questionObject.answer.includes(6) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[6]}</div>}
                            {Object.keys(questionObject.choices).length >= 8 && <div className={questionObject.answer.includes(7) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[7]}</div>}
                            {Object.keys(questionObject.choices).length >= 9 && <div className={questionObject.answer.includes(8) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[8]}</div>}
                            {Object.keys(questionObject.choices).length >= 10 && <div className={questionObject.answer.includes(9) ? styles.choicesAnswer : styles.choicesNormal}>{questionObject.choices[9]}</div>}

                            <div className={styles.answerSheetHeader}>
                                답안
                            </div>

                            <div className={Number(report) === Number(questionObject.points) ? styles.answerSheetZoneCorrect : styles.answerSheetZoneIncorrect}>
                                <div>
                                    {answer.includes(0) && <div>{questionObject.choices[0]}</div>}
                                    {answer.includes(1) && <div>{questionObject.choices[1]}</div>}
                                    {answer.includes(2) && <div>{questionObject.choices[2]}</div>}
                                    {answer.includes(3) && <div>{questionObject.choices[3]}</div>}
                                    {answer.includes(4) && <div>{questionObject.choices[4]}</div>}
                                    {answer.includes(5) && <div>{questionObject.choices[5]}</div>}
                                    {answer.includes(6) && <div>{questionObject.choices[6]}</div>}
                                    {answer.includes(7) && <div>{questionObject.choices[7]}</div>}
                                    {answer.includes(8) && <div>{questionObject.choices[8]}</div>}
                                    {answer.includes(9) && <div>{questionObject.choices[9]}</div>}
                                </div>

                                <div className={Number(report) === Number(questionObject.points) ? styles.reportContainerCorrect : styles.reportContainerIncorrect}>
                                    {report}점
                                </div>
                            </div>
                        </div>
                    }

                    {
                        questionObject.type === "진위형"

                        &&

                        <div>
                            <div className={styles.answerHeader}>
                                정답
                            </div>

                            <div className={styles.answerZone}>
                                {questionObject.answer === true ? "참" : "거짓"}
                            </div>

                            <div className={styles.answerSheetHeader}>
                                답안
                            </div>

                            <div className={Number(report) === Number(questionObject.points) ? styles.answerSheetZoneCorrect : styles.answerSheetZoneIncorrect}>
                                <div>
                                    {(answer === true || answer === false) && <span>{answer === true ? "참" : "거짓"}</span>}
                                </div>

                                <div className={Number(report) === Number(questionObject.points) ? styles.reportContainerCorrect : styles.reportContainerIncorrect}>
                                    {report}점
                                </div>
                            </div>
                        </div>
                    }

                    {
                        questionObject.type === "주관식"

                        &&

                        <div>
                            <div className={styles.answerHeader}>
                                정답
                            </div>

                            <div className={styles.answerZone}>
                                {questionObject.answer}
                            </div>

                            <div className={styles.answerSheetHeader}>
                                답안
                            </div>

                            <div className={Number(report) === Number(questionObject.points) ? styles.answerSheetZoneCorrect : styles.answerSheetZoneIncorrect}>
                                <div>
                                    {answer && answer}
                                </div>

                                <div className={Number(report) === Number(questionObject.points) ? styles.reportContainerCorrect : styles.reportContainerIncorrect}>
                                    {report}점
                                </div>
                            </div>
                        </div>
                    }

                    {
                        questionObject.type === "서술형"

                        &&

                        <div>
                            <div className={styles.answerSheetHeader}>
                                답안
                            </div>

                            <div className={
                                (
                                    report === false

                                        ?

                                        styles.answerSheetZoneNotGraded

                                        :

                                        (
                                            Number(report) === Number(questionObject.points)

                                                ?

                                                styles.answerSheetZoneCorrect

                                                :

                                                (
                                                    Number(report) === 0

                                                        ?

                                                        styles.answerSheetZoneIncorrect

                                                        :

                                                        styles.answerSheetZonePartiallyCorrect
                                                )
                                        )
                                )
                            }>
                                <div>
                                    {answer && answer}
                                </div>

                                <div className={
                                    (
                                        report === false

                                            ?

                                            styles.reportContainerNotGraded

                                            :

                                            (
                                                Number(report) === Number(questionObject.points)

                                                    ?

                                                    styles.reportContainerCorrect

                                                    :

                                                    (
                                                        Number(report) === 0

                                                            ?

                                                            styles.reportContainerIncorrect

                                                            :

                                                            styles.reportContainerPartiallyCorrect
                                                    )
                                            )
                                    )
                                }>
                                    {report === false ? "채점 안 됨" : <>{report}점</>}
                                </div>
                            </div>
                        </div>
                    }
                </div>

                {
                    mode === "teacher"

                    &&

                    <div>
                        {
                            questionObject.type === "서술형"

                                ?

                                <div>
                                    {
                                        report === false

                                            ?

                                            <div>
                                                <label className={styles.gradingButton} onClick={manualGrading}>서술형 채점</label>
                                                <label className={styles.changeToCorrectButton} onClick={changeToCorrect}>정답 처리</label>
                                                <label className={styles.changeToIncorrectButton} onClick={changeToIncorrect}>오답 처리</label>
                                            </div>

                                            :

                                            <div>
                                                {
                                                    ((report > 0) && (report < Number(questionObject.points)))

                                                        ?

                                                        <div>
                                                            <label className={styles.changeToCorrectButton} onClick={changeToCorrect}>정답 처리</label>
                                                            <label className={styles.changeToIncorrectButton} onClick={changeToIncorrect}>오답 처리</label>
                                                            <label className={styles.manualButton} onClick={manualGrading}>점수 수정</label>
                                                        </div>

                                                        :

                                                        <div>
                                                            {report < Number(questionObject.points) && <label className={styles.changeToCorrectButton} onClick={changeToCorrect}>정답 처리</label>}
                                                            {report > 0 && <label className={styles.changeToIncorrectButton} onClick={changeToIncorrect}>오답 처리</label>}
                                                            <label className={styles.manualButton} onClick={manualGrading}>점수 수정</label>
                                                        </div>
                                                }
                                            </div>
                                    }
                                </div>

                                :

                                <div>
                                    {
                                        !autoGrading

                                        &&

                                        <div>
                                            {report < Number(questionObject.points) && <label className={styles.changeToCorrectButton} onClick={changeToCorrect}>정답 처리</label>}
                                            {report > 0 && <label className={styles.changeToIncorrectButton} onClick={changeToIncorrect}>오답 처리</label>}
                                            <label className={styles.manualButton} onClick={manualGrading}>점수 수정</label>
                                        </div>
                                    }
                                </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default AnswerSheetQuestion;
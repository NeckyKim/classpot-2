import { useState } from "react";

import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, deleteDoc } from "firebase/firestore";

import EditQuestion from "./EditQuestion";

import styles from "./TeacherQuestion.module.css";



function TeacherQuestion({ number, questionObject, answerSheet, setAnswerSheet }) {
    let { classId } = useParams();
    let { testId } = useParams();

    const [isEditingQuestion, setIsEditingQuestion] = useState(false);



    // [선생님] 질문 삭제
    async function deleteQuestion(event) {
        event.preventDefault();
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            try {
                await deleteDoc(doc(dbService, "classes", classId, "tests", testId, "questions", questionObject.questionId))

            }

            catch (error) {
                alert("질문 삭제에 실패했습니다.");
            }
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
                        </div>
                    }

                    <button className={styles.editButton} onClick={() => { setIsEditingQuestion(true); }}>
                        수정
                    </button>

                    <button className={styles.deleteButton} onClick={deleteQuestion}>
                        삭제
                    </button>

                    {
                        isEditingQuestion

                        &&

                        <EditQuestion questionObject={questionObject} setIsEditingQuestion={setIsEditingQuestion} />
                    }
                </div>
            </div>
        </div>
    )
}

export default TeacherQuestion;
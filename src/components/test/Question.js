import styles from "./Question.module.css";

function Question({ number, questionObject, answerSheet, setAnswerSheet, mode }) {
    function onChangeAnswerSheet(event) {
        event.preventDefault();

        setAnswerSheet((prev) => {
            return { ...prev, [number]: event.target.value }
        });
    }



    return (
        <div className={styles.questionElements}>
            [질문]
            <div className={styles.question}>
                {questionObject.question}
            </div>
            <br />

            {
                questionObject.type === "객관식"

                &&

                <div>
                    [보기]
                    <br />

                    {questionObject.choices[0]}<br />
                    {questionObject.choices[1]}<br />
                    {questionObject.choices[2]}<br />
                    {questionObject.choices[3]}<br />
                    {questionObject.choices[4]}<br />
                    {questionObject.choices[5]}<br />
                    {questionObject.choices[6]}<br />
                    {questionObject.choices[7]}<br />
                    {questionObject.choices[8]}<br />
                    {questionObject.choices[9]}<br />
                    <br />
                </div>
            }

            {
                mode === "teacher"

                &&

                <div>
                    [정답]
                    <div className={styles.answer}>
                        {questionObject.answer}
                    </div>
                </div>
            }

            {
                mode === "student"

                &&

                <div>
                    [답안]
                    <br />
                    <textarea
                        type="text"
                        name={number}
                        onChange={onChangeAnswerSheet}
                        value={answerSheet}
                        spellCheck="false"
                    />
                </div>
            }
        </div>
    )
}

export default Question;
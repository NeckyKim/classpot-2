import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, getDoc, deleteDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";






function TestTab({ userObject, userData, classId }) {
    const [isCreatingTest, setIsCreatingTest] = useState(false);
    const [testName, setTestName] = useState("")

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
                teacherId: userData.userId,
                createdTime: Date.now(),
            })

            alert("시험이 등록되었습니다.");
            setIsCreatingTest(false);
        }

        catch (error) {
            alert("시험 생성에 실패했습니다.");
        }
    }



    return (
        <div>
            시험

            {
                myTests.map((current, index) => (
                    <div key={index}>
                        <Link link to={"test/" + current.testId}>
                            {current.testName}
                        </Link>
                    </div>
                ))
            }

            <button onClick={() => { setIsCreatingTest(true) }}>
                시험 추가
            </button>

            {
                isCreatingTest

                &&

                <div>
                    <label>
                        시험 이름
                    </label>

                    <input type="text" value={testName} onChange={(event) => { setTestName(event.target.value) }} />
                    <input type="submit" value="시험 생성" onClick={addTest} />

                    <input type="button" value="취소" onClick={() => {
                        setIsCreatingTest(false);
                        setTestName("");
                    }} />
                </div>
            }
        </div>
    )
}

export default TestTab;
import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { collection, documentId } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function GetTestInfo(classId, testId) {
    const [testInfo, setTestInfo] = useState([]);

    // 시험 정보
    useEffect(() => {
        setTestInfo([]);

        onSnapshot(query(collection(dbService, "classes", classId, "tests"), where(documentId(), "==", testId)), (snapshot) => {
            setTestInfo(snapshot.docs.map((current) => ({ ...current.data() }))[0]);
        });
    }, [])

    return testInfo;
}

export default GetTestInfo;
import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { collection, documentId } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function GetClassInfo(classId) {
    const [classInfo, setClassInfo] = useState([]);

    // 수업 정보
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes"), where(documentId(), "==", classId)), (snapshot) => {
            setClassInfo(snapshot.docs.map((current) => ({ classId: current.id, ...current.data() }))[0]);
        });
    }, [])

    return classInfo;
}

export default GetClassInfo;
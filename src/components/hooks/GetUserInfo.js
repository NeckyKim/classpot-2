import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, getDoc,  } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function GetUserInfo(userId) {
    const [userInfo, setUserInfo] = useState([]);

    // 현재 사용자의 정보
    useEffect(() => {
        getDoc(doc(dbService, "users", userId)).then((doc) => { setUserInfo(doc.data()); });
    }, []);

    return userInfo;
}

export default GetUserInfo;
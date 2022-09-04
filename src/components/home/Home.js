import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, addDoc } from "firebase/firestore";

import NewUser from "./NewUser";
import ValidUser from "./ValidUser";


function Home({ userObject }) {
    const [userData, setUserData] = useState(undefined);
    const [init, setInit] = useState();



    // 현재 사용자의 정보가 데이터베이스에 있는지 확인
    useEffect(() => {
        getDoc(doc(dbService, "users", userObject.uid)).then((doc) => { setUserData(doc.data()); });
    }, []);

    useEffect(() => {
        if (userData !== undefined) {
            setInit(true);
        }

        else {
            setInit(false);
        }
    })



    return (
        <div>
            <br /><br /><br />
            {
                init

                &&

                <ValidUser userObject={userObject} userData={userData} />
            }

            {
                !init

                &&

                <NewUser userObject={userObject} setInit={setInit} />
            }

        </div>
    )
}

export default Home;
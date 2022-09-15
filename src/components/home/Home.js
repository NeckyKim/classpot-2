import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { collection } from "firebase/firestore";
import { onSnapshot, query, where, documentId } from "firebase/firestore";

import NewUser from "./NewUser";
import ValidUser from "./ValidUser";


function Home({ userObject }) {
    const [userData, setUserData] = useState(undefined);
    const [init, setInit] = useState(null);



    useEffect(() => {
        onSnapshot(query(collection(dbService, "users"), where(documentId(), "==", userObject.uid)), (snapshot) => {
            setUserData(snapshot.docs.map((current) => ({
                ...current.data()
            }))[0]);
        });
    }, [])

    

    useEffect(() => {
        if (userData !== undefined) {
            setInit(true);
        }

        else {
            setInit(false);
        }
    }, [userData])



    return (
        <div>
            {
                init === true

                &&

                <ValidUser userObject={userObject} userData={userData} />
            }

            {
                init === false

                &&

                <NewUser userObject={userObject} setInit={setInit} />
            }
        </div>
    )
}

export default Home;
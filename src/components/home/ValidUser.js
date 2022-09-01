import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";



function ValidUser({ userObject, userData }) {
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [className, setClassName] = useState("");

    const [teacherMyClasses, setTeacherMyClasses] = useState([]);


    
    // 수업 추가하기
    async function addClass(event) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "classes")), {
                className: className,
                teacherId: userData.userId,
                teacherName: userData.userName,
                createdTime: Date.now(),
            })

            alert("수업이 등록되었습니다.");
        }

        catch (error) {
            alert("수업 등록에 실패했습니다.");
        }
    }



    // 수업 불러오기
    useEffect(() => {
        onSnapshot(query(collection(dbService, "classes"), where("teacherId", "==", userObject.uid)),
            (snapshot) => {
                setTeacherMyClasses(snapshot.docs.map((current) => ({ ...current.data() })));
            });

        console.log(teacherMyClasses);
    }, [])



    return (
        <div>
            {
                userData?.userType === "teacher"

                &&

                <div>
                    선생님

                    <button onClick={() => setIsCreatingClass(!isCreatingClass)}>
                        {isCreatingClass ? "취소" : "수업 추가"}
                    </button>
                </div>
            }

            {
                isCreatingClass

                &&

                <div>
                    <form onSubmit={addClass}>
                        <label>
                            수업 이름
                        </label>
                        <br />
                        <input
                            type="text"
                            value={className}
                            onChange={(event) => setClassName(event.target.value)}
                            required
                            spellCheck="false"
                        />
                        <br /><br />

                        <input type="submit" value="추가하기" />
                    </form>
                </div>
            }
        </div>
    )
}

export default ValidUser;
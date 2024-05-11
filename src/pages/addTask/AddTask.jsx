import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../backend/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuid } from "uuid";

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [theTask, setTheTask] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [data, setData] = useState();
  const [readData, setReadData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setdisable] = useState(true);
  const handleDeleteInputs = () => {
    setTaskTitle("");
    setTheTask("");
    setDateStart("");
    setDateEnd("");
  };

  useEffect(() => {
    if (taskTitle == "" || theTask == "") {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, [taskTitle, theTask]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set State Of Current User

        // Select Document From DataBase
        const docRef = doc(db, user.uid, "tasks");

        // Function Doc Snap
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Set State Of User Info From DataBase
              setData(docSnap.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      }
    });
    return unsubscribe;
  }, [readData]);

  const addTaskToDb = () => {
    const unique_id = uuid();
    setLoading(true);
    setdisable(true);

    const tasksRef = doc(db, auth.currentUser.uid, "tasks");
    updateDoc(tasksRef, {
      allTasks: [
        {
          id: unique_id,
          fullDate: handleAllDate(),
          date: handleDate(),
          taskTitle: taskTitle || "knowing",
          theTask: theTask || "knowing",
          dateStart: dateStart,
          dateEnd: dateEnd,
          done: false,
        },
        ...data.allTasks,
      ],
    }).finally(() => {
      setLoading(false);
      setdisable(false);

      setReadData((prev) => !prev); // تحديث الحالة لقراءة البيانات
      setTaskTitle(""); // إعادة تعيين قيم الحقول لتفريغها بعد الإضافة
      setTheTask("");
      setDateStart("");
      setDateEnd("");
    });
  };

  const handleDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  };

  const handleAllDate = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${handleDate()}  ${hour}:${minute}:${second}s`;
  };

  return (
    <div className="add-task">
      <h2 className="text-2xl text-center font-bold tracking-wider">Add Task</h2>
      <div className="container mt-5">
        <div className="inputs w-[400px] max-w-full grid gap-5 mx-auto">
          <label>
            <Input
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              className="text-xl"
              size="lg"
              label="Title Of Task"
              required
            />
          </label>

          <label>
            <Input value={theTask} onChange={(event) => setTheTask(event.target.value)} className="text-xl" size="lg" label="The Task" required />
          </label>

          <label>
            <Input
              value={dateStart}
              onChange={(event) => setDateStart(event.target.value)}
              type="datetime-local"
              className="text-xl"
              size="lg"
              label="date start"
            />
          </label>

          <label>
            <Input
              value={dateEnd}
              onChange={(event) => setDateEnd(event.target.value)}
              type="datetime-local"
              className="text-xl"
              size="lg"
              label="date end"
            />
          </label>

          <div className="flex justify-between xsm:flex-col gap-y-3">
            <Button
              disabled={disabled}
              loading={loading}
              onClick={() => {
                if (taskTitle == "" || theTask == "") {
                  false;
                } else {
                  addTaskToDb();
                }
              }}
              className="bg-green-600 text-sm"
            >
              Add Task
            </Button>
            <Button disabled={loading} onClick={handleDeleteInputs} className="bg-red-600 text-sm">
              Delete Inputs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;

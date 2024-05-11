import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../backend/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Spinner } from "@material-tailwind/react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import TaskBox from "../../components/notShared/taskBox/TaskBox";
import { alertDeleteTask, handleEdit, handleIsDone } from "../../function/TasksFunction";

const TasksNotDone = () => {
  // This is All Data
  const [data, setData] = useState(null);
  // To Show Sippner Or Not
  const [loading, setLoading] = useState(false);
  // Update Doucment After Delete Task
  const [upd, setUpd] = useState(false);
  // This is State For Done Tasks

  // Read Document From Data Base When Open The Page
  useEffect(() => {
    // To Show The Sippner
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Select Document From DataBase
        const docRef = doc(db, user.uid, "tasks");

        // Function Doc Snap
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Set State Of Tasks From DataBase
              setData(docSnap.data());
            } else {
              console.log("No such document!");
            }
          })
          // While Error
          .catch((error) => {
            console.error("Error getting document:", error);
          })
          // At The Least
          .finally(() => {
            // Hide The Sippner
            setLoading(false);
          });
      }
    });
    return unsubscribe;
  }, []);

  // This Is Check If Any Task In All Tasks Is Not Done
  const [anyTasksNotDone, setAnyTasksNotDone] = useState(false);

  useEffect(() => {
    // Filter To Return Tasks Not Done Only
    const filter = data?.allTasks.filter((item) => {
      return item.done == false;
    });
    if (filter?.length) {
      // To Show Tasks Not Done On The Page
      setAnyTasksNotDone(true);
    } else {
      // Show Anthor Message
      setAnyTasksNotDone(false);
    }
  }, [data, upd]);

  return (
    <div>
      <div className="container">
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <img className="block w-[350px] mx-auto" src="./loading.gif" alt="" />
          </div>
        ) : (
          <>
            {data?.allTasks.length ? (
              <div className={`all-tasks ${anyTasksNotDone ? "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5" : "block"} `}>
                {anyTasksNotDone ? (
                  <AnimatePresence>
                    {data.allTasks.map((item) => {
                      return (
                        !item.done && (
                          <TaskBox
                            allData={data}
                            setData={setData}
                            upd={upd}
                            setUpd={setUpd}
                            handleIsDone={handleIsDone}
                            handleEdit={handleEdit}
                            alertDeleteTask={alertDeleteTask}
                            item={item}
                            key={item.id}
                          />
                        )
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center">
                    <h2 className="text-center text-2xl font-bold text-gray-500">All Tasks Completed</h2>
                    <div className="image flex justify-center opacity-95">
                      <img className="w-[350px] max-w-full block" src="./tasksNotDone.svg" alt="All Tasks completed" />
                    </div>
                    <Link
                      to="/all-tasks"
                      className="text-lg text-gray-400 font-semibold underline tracking-wider hover:text-gray-600 transition duration-200"
                    >
                      all tasks
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center">
                <h2 className="text-center text-2xl font-bold text-gray-500">No Task Yet</h2>
                <div className="image flex justify-center opacity-95">
                  <img className="w-[350px] max-w-full block" src="./allTask.svg" alt="no task" />
                </div>
                <Link
                  to="/add-task"
                  className="text-lg text-gray-400 font-semibold underline tracking-wider hover:text-gray-600 transition duration-200"
                >
                  Add Task
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default TasksNotDone;

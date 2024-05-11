import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../backend/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

const Home = () => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        // Set State Of Current User
        setUser(auth.currentUser);

        // Select Document From DataBase For User Info
        const docRef = doc(db, user.uid, "info_user");
        // Function Doc Snap
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Set State Of User Info From DataBase
              setUserInfo(docSnap.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          })
          .finally(() => {
            setLoading(false);
          });

        const tasksRef = doc(db, user.uid, "tasks");
        // Function Doc Snap
        getDoc(tasksRef)
          .then((tasksRef) => {
            if (tasksRef.exists()) {
              // Set State Of User Info From DataBase
              setTasks(tasksRef.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [user]);
  return (
    <div>
      <div className="container">
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <img className="block w-[350px] mx-auto" src="./loading.gif" alt="" />
          </div>
        ) : (
          <div>
            {user ? (
              <>
                <h2 className="text-xl border-2 shadow-xl w-fit mx-auto p-3 rounded font-semibold capitalize">Hello {userInfo?.name} 👋</h2>
                <div className="info-of-website">
                  <div className="box text-xl mt-5 capitalize font-semibold border-2 shadow-xl p-3">hello and welcome to todo app</div>

                  <div className="main-page mt-10">
                    <h2 className="text-xl capitalize font-bold text-center">main pages</h2>
                    <div className="boxs grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] place-items-center gap-y-5 mt-5">
                      <div className="box border-2 shadow-xl p-5 rounded-lg">
                        <h3 className="text-lg capitalize text-center">tasks page</h3>
                        <div className="flex justify-center items-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/ujxzdfjx.json"
                            trigger="hover"
                            style={{ width: "60px", height: "60px" }}
                          ></lord-icon>
                        </div>
                        <Link to="/all-tasks" className="text-sm text-gray-500 underline text-center block mt-4">
                          All Tasks
                        </Link>
                      </div>
                      <div className="box border-2 shadow-xl p-5 rounded-lg">
                        <h3 className="text-lg capitalize text-center">tasks completed</h3>
                        <div className="flex justify-center items-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/dangivhk.json"
                            trigger="hover"
                            style={{ width: "60px", height: "60px" }}
                          ></lord-icon>
                        </div>
                        <Link to="/tasks-done" className="text-sm text-gray-500 underline text-center block mt-4">
                          Tasks Done
                        </Link>
                      </div>
                      <div className="box border-2 shadow-xl p-5 rounded-lg">
                        <h3 className="text-lg capitalize text-center">tasks page</h3>
                        <div className="flex justify-center items-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/pdsourfn.json"
                            trigger="hover"
                            style={{ width: "60px", height: "60px" }}
                          ></lord-icon>
                        </div>
                        <Link to="/add-task" className="text-sm text-gray-500 underline text-center block mt-4">
                          Add Task
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <hr className="mt-5 w-[calc(100%-50px)] mx-auto border-2" />
                    <hr className="mt-5 w-[calc(100%-50px)] mx-auto border-2" />
                  </div>
                </div>

                <div className="recent-tasks">
                  <h2 className="text-xl capitalize font-bold text-center mt-5">recent tasks</h2>
                  {tasks?.allTasks.length ? (
                    <div>
                      <div className="boxs mt-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                        {[0, 1, 2, 3].map((item) => {
                          return (
                            tasks.allTasks[item] && (
                              <Card key={item} className="mt-6 border shadow-xl">
                                <CardBody>
                                  <Typography variant="h5" color="blue-gray" className="mb-2 truncate">
                                    {tasks.allTasks[item].taskTitle}
                                  </Typography>
                                  <Typography style={{ display: "-webkit-box" }} className="mt-2 p-2  leading-[2] text-[#777] line-clamp-3">
                                    {tasks.allTasks[item].theTask}
                                  </Typography>
                                </CardBody>
                                <CardFooter className="pt-0">
                                  <Link to={`/all-tasks/${tasks.allTasks[item].id}`}>
                                    <Button>Read More</Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            )
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <h2 className="text-xl text-center mt-4 text-gray-500">No Tasks Recent</h2>
                  )}
                </div>
              </>
            ) : (
              <div className="h-[calc(100vh-200px)] flex justify-center items-center flex-col">
                <h2 className="text-2xl xxsm:text-xl text-center font-bold tracking-wider">You Must Sign In First</h2>
                <div className="image  flex justify-center items-center ">
                  <img className="w-[300px]" src="./error.webp" alt="error" />
                </div>
                <Link to="/auth/sign-up" className="text-xl xxsm:text-sm text-gray-500 underline hover:decoration-double">
                  {"Don't"} Have Accout ? Sign In
                </Link>
                <Link to="/auth/login" className="text-xl xxsm:text-sm text-gray-500 underline hover:decoration-double mt-4">
                  Have Accout ? Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

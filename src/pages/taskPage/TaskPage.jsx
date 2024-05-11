import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../backend/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Typography } from "@material-tailwind/react";

const TaskPage = () => {
  const { taskId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set State Of Current User

        // Select Document From DataBase
        const docRef = doc(db, user.uid, "tasks");

        // Function Doc Snap
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // Filter Data And Return The Task That Equel To Params
              const filter = docSnap.data().allTasks.filter((task) => {
                return task.id == taskId;
              });
              setData(filter[0]);
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
      }
    });
    return unsubscribe;
  }, []);

  const TABLE_HEAD = ["Title", "Value"];

  const TABLE_ROWS = [
    {
      name: "Title Of Task",
      job: data?.taskTitle,
    },
    {
      name: "The Task",
      job: data?.theTask,
    },
    {
      name: "Task Start At",
      job: data?.dateStart || "-- / -- / --",
    },
    {
      name: "Task End At",
      job: data?.dateEnd || "-- / -- / --",
    },
    {
      name: "Is Task Complete",
      job: data?.done ? "Yes Complete" : "Not Complete",
    },
    {
      name: "Created On",
      job: data?.fullDate,
    },
  ];

  return (
    <div>
      <div className="container flex flex-col justify-center items-center">
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <img className="block w-[350px] mx-auto" src="./loading.gif" alt="" />
        </div>
        ) : (
          <>
            {data ? (
              <>
                <h2 className="mb-5 text-2xl font-semibold capitalize tracking-wider bg-[#212121] text-white p-2 rounded">task info</h2>

                <Card className="h-full w-full overflow-scroll">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map(({ name, job }, index) => {
                        const isLast = index === TABLE_ROWS.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={name}>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-semibold text-[17px]">
                                {name}
                              </Typography>
                            </td>
                            <td className={`${classes} bg-blue-gray-50/50`}>
                              <Typography variant="small" color="blue-gray" className="font-normal text-[16px]">
                                {job}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
                <Link to="/all-tasks" className="mt-10 opacity-50 hover:opacity-100 transition-opacity duration-200">
                  <Button>Return To All Tasks Page</Button>
                </Link>
              </>
            ) : (
              <h2 className="capitalize text-center text-2xl font-bold text-gray-500">no data</h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskPage;

import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoOpenOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CgClose } from "react-icons/cg";

const TaskBox = ({ item, alertDeleteTask, handleIsDone, handleEdit, allData, setData, upd, setUpd }) => {
  const nav = useNavigate();
  const [editMenu, setEditMenu] = useState(false);
  const [taskTitle, setTaskTitle] = useState(item.taskTitle);
  const [theTask, setTheTask] = useState(item.theTask);
  const [dateStart, setDateStart] = useState(item.dateStart);
  const [dateEnd, setDateEnd] = useState(item.dateEnd);
  const [disabled, setdisable] = useState(true);

  // Delete Inputs When Click On Delete Button In Edit Window
  const handleDeleteInputs = () => {
    setTaskTitle("");
    setTheTask("");
    setDateStart("");
    setDateEnd("");
  };

  // To Display Edit Button If Inputs Is Empty
  useEffect(() => {
    if (taskTitle == "" || theTask == "") {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, [taskTitle, theTask]);

  // Alert Edit Successful
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
  });

  const variants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`border bg-gray-50 ${item.done ? "border-green-500" : "border-red-500"} relative rounded overflow-hidden`}
      key={item.id}
    >
      {/*  */}
      <AnimatePresence>
        {editMenu && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setEditMenu(false)}
            className="layout w-screen h-screen bg-[#00000097] inset-0 z-20 fixed"
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editMenu && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="edit-menu max-w-[95%] bg-white p-2 rounded-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="close-menu absolute right-2 border-2 rounded-full p-1 border-red-600 cursor-pointer"
            onClick={() => setEditMenu(false)}
            >
              <CgClose className="text-red-600" />
            </div>
            <div className="add-task">
              <h2 className="text-2xl text-center font-bold tracking-wider">Edit Task</h2>
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
                    <Input
                      value={theTask}
                      onChange={(event) => setTheTask(event.target.value)}
                      className="text-xl"
                      size="lg"
                      label="The Task"
                      required
                    />
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
                      onClick={() => {
                        if (taskTitle == "" || theTask == "") {
                          false;
                        } else {
                          handleEdit(item.id, allData, setData, upd, setUpd, taskTitle, theTask, dateStart, dateEnd);
                          setEditMenu(false);

                          Toast.fire({
                            icon: "success",
                            title: "Edit successfully",
                          });
                        }
                      }}
                      className="bg-green-600 text-sm"
                    >
                      Edit Task
                    </Button>
                    <Button onClick={handleDeleteInputs} className="bg-red-600 text-sm">
                      Delete Inputs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex justify-between gap-2 items-center ${item.done ? "bg-green-500" : "bg-red-500"} p-2 text-white transition duration-200`}>
        <h2 className="text-lg font-semibold capitalize truncate ">{item.taskTitle}</h2>
        <span className="text-gray-900 text-sm font-[monospace]">{item.date}</span>
      </div>

      <p className="mt-2 p-2 leading-[1.9] text-[#777] line-clamp-2">{item.theTask}</p>

      <div className="mt-5 p-2">
        <p className="text-sm capitalize">
          start in: <span className="inline-block bg-blue-gray-200 p-1 rounded"> {item.dateStart || "--/--/--"}</span>
        </p>
        <p className="text-sm capitalize mt-3">
          end in: <span className="inline-block bg-blue-gray-300 p-1 rounded"> {item.dateEnd || "--/--/--"}</span>
        </p>
      </div>

      <div className="flex items-center p-2">
        <p className="text-lg font-semibold capitalize">finish</p> :{" "}
        <div className="toggle-button-cover ">
          <div id="button-3" className="button r ">
            <input checked={item.done} onChange={() => handleIsDone(item.id, allData, setData, upd, setUpd)} className="checkbox " type="checkbox" />
            <div className="knobs"></div>
            <div className="layer"></div>
          </div>
        </div>
      </div>

      <div className="flex absolute bottom-0 right-0 w-fit ml-auto gap-3 bg-[#9e9e9e24] rounded text-xl">
        <div
          onClick={() => alertDeleteTask(item.id, allData, setData, upd, setUpd)}
          title="delete"
          className="p-1 flex justify-center items-center rounded-full w-[35px] h-[35px] cursor-pointer transition duration-200 hover:bg-red-300"
        >
          <MdDeleteForever className="text-xl" />
        </div>

        <div
          onClick={() => setEditMenu(true)}
          title="edit"
          className="p-1 flex justify-center items-center rounded-full w-[35px] h-[35px] cursor-pointer transition duration-200 hover:bg-gray-300"
        >
          <FaEdit className="text-xl" />
        </div>

        <div
          title="open"
          className="p-1 flex justify-center items-center rounded-full w-[35px] h-[35px] cursor-pointer transition duration-200 hover:bg-green-100"
          onClick={() => nav(`/all-tasks/${item.id}`)}
        >
          <IoOpenOutline className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskBox;

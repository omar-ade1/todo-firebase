import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../backend/firebase.config";
import Swal from "sweetalert2";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Handle Funcion Done Task
export const handleIsDone = (id, allData, setData, upd, setUpd) => {
  // This For All Tasks
  const newArrAllTasks = allData.allTasks;

  // This Map For Update Tasks After Click On Done Button
  newArrAllTasks.map((item) => {
    if (id == item.id) {
      // Make item.done = False If True And vice versa."
      item.done = !item.done;

      // fix
      // Updata State Data After Done Or Not Done Update Only allTasks
      setData((prevData) => ({
        ...prevData,
        allTasks: newArrAllTasks,
      }));
      // fix
    }
  });

  // todo
  // Update All Tasks In DateBase After Done Or Not Done
  const tasksRef = doc(db, auth.currentUser.uid, "tasks");
  updateDoc(tasksRef, {
    allTasks: allData.allTasks,
  });
  // todo

  // This For Update Page After Delete
  setUpd(!upd);
};

// Alert After Delete Task
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  showCloseButton: true,
});

// Alert Delete Task
export const alertDeleteTask = (id, allData, setData, upd, setUpd) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Run DeleteTask Function
      DeleteTask(id, allData, setData, upd, setUpd);
      Toast.fire({
        icon: "success",
        title: "Your Task has been deleted.",
      });
    }
  });
};

// Delete Task From DataBase
const DeleteTask = (id, allData, setData, upd, setUpd) => {
  // This For All Tasks
  let newArrAllTasks = allData.allTasks;
  // Filter Data To Delete Task
  const filter = newArrAllTasks.filter((task) => {
    return task.id != id;
  });
  // Updata State Data After Delete Update Only allTasks
  setData((prevData) => ({
    ...prevData,
    allTasks: filter,
  }));

  // Update All Tasks In DateBase After Delete
  const allTasksRef = doc(db, auth.currentUser.uid, "tasks");
  updateDoc(allTasksRef, {
    allTasks: filter,
  });

  // This For Update Page After Delete
  setUpd(!upd);
};

export const handleEdit = (id, allData, setData, upd, setUpd, taskTitle, theTask, dateStart, dateEnd) => {
  // This For All Tasks
  const newArrAllTasks = allData.allTasks;

  // This Map For Update Tasks After Click On Done Button
  newArrAllTasks.map((item) => {
    if (id == item.id) {
      // Make item.done = False If True And vice versa."
      item.taskTitle = taskTitle;
      item.theTask = theTask;
      item.dateStart = dateStart;
      item.dateEnd = dateEnd;
      // fix
      // Updata State Data After Edit Update Only allTasks
      setData((prevData) => ({
        ...prevData,
        allTasks: newArrAllTasks,
      }));
      // fix
    }
  });

  // todo
  // Update All Tasks In DateBase After Edit
  const tasksRef = doc(db, auth.currentUser.uid, "tasks");
  updateDoc(tasksRef, {
    allTasks: allData.allTasks,
  });
  // todo

  // This For Update Page After Edit
  setUpd(!upd);
};



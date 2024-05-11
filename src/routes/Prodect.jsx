import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { auth } from "../backend/firebase.config";

const Protect = ({ children }) => {
  const nav = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const [user, setUser] = useState();
  // Set User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
        console.warn("No User");
        nav("/");
        Toast.fire({
          icon: "error",
          title: "You Must Sign In First !!",
        });
      }
    });
    return unsubscribe;
  }, []);

  return user ? children : null;
};

export default Protect;

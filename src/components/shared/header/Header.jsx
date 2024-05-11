import { Button } from "@material-tailwind/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../backend/firebase.config";
import { IoLogOutSharp } from "react-icons/io5";
import Swal from "sweetalert2";

const Header = () => {
  const nav = useNavigate();

  const [user, setUser] = useState();
  // Set User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
        console.warn("No User");
      }
    });
    return unsubscribe;
  }, []);

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        nav("/auth/sign-up");
        Toast.fire({
          icon: "success",
          title: "Signed out successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "Signed out error",
        });
      });
  };

  // Alert
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
  });

  const alertSignOut = () => {
    Swal.fire({
      title: "Sign Out !",
      text: "Are You Want To Sign Out ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Sign Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        // Alert Successfull
      }
    });
  };

  return (
    <header className="shadow-xl fixed w-full z-[200] bg-white ">
      <div className="container h-[70px] flex justify-between items-center p-4">
        <div className="logo text-2xl uppercase font-bold">
          <Link to="/">todo</Link>
        </div>
        <nav>
          {user ? (
            <div title="log out" className="cursor-pointer p-2">
              <Button onClick={alertSignOut} className="flex justify-center items-center bg-red-700 gap-2 w-full px-2 ">
                <IoLogOutSharp className="text-lg" />

                <h3 className="text-nowrap">Log Out</h3>
              </Button>
            </div>
          ) : (
            <ul className="flex gap-5">
              <li>
                <Button onClick={() => nav("/auth/sign-up")}>sign up</Button>
              </li>
              <li>
                <Button onClick={() => nav("/auth/login")} variant="outlined">
                  login
                </Button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

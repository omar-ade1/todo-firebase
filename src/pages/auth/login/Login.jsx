import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { BiShowAlt, BiSolidError, BiSolidHide } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import GoogleButton from "../../../components/shared/googleButton/GoogleButton";
import { auth, db } from "../../../backend/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null);

  // Handle Input Password To Show Password When Click On Icon
  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const nav = useNavigate();

  // Login With Email And Password
  const handleLogin = () => {
    // Set Loading True To Show Sippner In The Button Submit And Disable It
    setLoading(true);

    // Start Login Function
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // No Error Message
        setError(null);

        // Alert Successful
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });

        // Finally Go TO Home Page
        nav("/");
      })

      // While Error
      .catch((error) => {
        const errorMessage = error.message;

        // There Is Error
        setError(errorMessage);

        // Alert Error
        Toast.fire({
          icon: "error",
          title: "Signed in failed",
        });
      })

      // In The Last
      .finally(() => {
        // Set Loading False To Hide Sippner In The Button Submit And Anable It
        setLoading(false);
      });
  };

  // Handle Login With Google
  const provider = new GoogleAuthProvider();
  const handleLoginWithGoogle = () => {
    // Set Loading True To Show Sippner In The Button Submit And Disable It
    setLoading(true);

    // Start Login Function
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // No Error Message
        setError(null);

        // Check If Document info_user Is Exists Or Not
        const docRefUser = doc(db, user.uid, "info_user");
        getDoc(docRefUser).then((docSnap) => {
          // If Exists Don't Create Document In DataBase
          if (docSnap.exists()) {
            console.log("user is already exists");
            // If Not Exists Create Document In DataBase
          } else {
            // Create Document
            const addUser = async () => {
              try {
                const docRef = await setDoc(doc(db, user.uid, "info_user"), {
                  name: user.displayName,
                });
                console.log("Document written with ID:");
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            };
            addUser();
          }
        });

        // Check If Document tasks Is Exists Or Not
        const docRefTasks = doc(db, user.uid, "tasks");
        getDoc(docRefTasks).then((docSnap) => {
          // If Exists Don't Create Document In DataBase
          if (docSnap.exists()) {
            console.log("user is already exists");

            // If Not Exists Create Document In DataBase
          } else {
            // Create Document
            const tasksUser = async () => {
              try {
                const docRef = await setDoc(doc(db, user.uid, "tasks"), {
                  allTasks: [],

                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            };
            tasksUser();
          }
        });
        //

        // Alert Successfull
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });

        // Go TO Home Page
        nav("/");
      })

      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        setError(errorMessage);

        // Alert Error
        Toast.fire({
          icon: "error",
          title: "Signed in failed",
        });
      })

      // In The Last
      .finally(() => {
        // Set Loading False To Hide Sippner In The Button Submit And Anable It
        setLoading(false);
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

  return (
    <div className="min-h-[calc(100vh-70px)] overflow-hidden">
      <div className="container min-h-[calc(100vh-70px)] flex justify-center items-center flex-col ">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
          Login
          <IoIosLogIn />
        </h2>
        <div className="flex w-full justify-around items-center xsm:flex-col">
          <div className="w-[400px] max-w-full flex flex-col gap-[20px]" action="">
            <label className="input input-bordered flex items-center gap-2">
              <Input className="text-lg" onChange={(event) => setEmail(event.target.value)} type="email" label="Email" required />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <Input
                className="text-lg"
                onChange={(event) => setPassword(event.target.value)}
                type={showPass ? "text" : "password"}
                label="Password"
                required
                icon={
                  showPass ? (
                    <BiShowAlt onClick={handleShowPass} className="cursor-pointer text-lg" />
                  ) : (
                    <BiSolidHide onClick={handleShowPass} className="cursor-pointer text-lg" />
                  )
                }
              />
            </label>

            <GoogleButton handleGoogleAuth={handleLoginWithGoogle} />

            {error && (
              <p className="text-red-600 font-semibold text-sm text-center flex justify-center items-center gap-2">
                <BiSolidError className="text-lg" /> {error}{" "}
              </p>
            )}
            <Button
              disabled={loading}
              onClick={handleLogin}
              className="w-full flex justify-center items-center bg-[var(--main-color)] text-sm"
              loading={loading}
            >
              Submit
            </Button>
            <Link to="/auth/sign-up" className="block text-center underline">
              {"Don't"} Have Account ? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

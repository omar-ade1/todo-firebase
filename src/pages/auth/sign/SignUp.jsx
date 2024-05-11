import React, { useRef, useState } from "react";
import { BiShowAlt, BiSolidError, BiSolidHide } from "react-icons/bi";
import { FaSignInAlt } from "react-icons/fa";
import { auth, db } from "../../../backend/firebase.config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import GoogleButton from "../../../components/shared/googleButton/GoogleButton";
import { GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null);

  // Handle Input Password To Show Password When Click On Icon
  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const nav = useNavigate();

  // Handle Sign In With Email And Password
  const handleSignIn = () => {
    // Set Loading True To Show Sippner In The Button Submit And Disable It
    setLoading(true);

    // Start Sign Function
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // No Error Message
        setError(null);

        // Set Display Name == Name State
        user.displayName = name;

        // Create a Document In DataBase == info_user
        const addUser = async () => {
          try {
            const docRef = await setDoc(doc(db, user.uid, "info_user"), {
              name: user.displayName,
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        };

        addUser();

        // Create A Document In DataBase == Tasks And It's Array
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

        // Alert Successful
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });

        // Go TO Home Page
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
        setLoading(false); // إلغاء حالة التحميل بعد الحصول على الرد من Firebase
      });
  };

  // Handle Sign In With Google
  const provider = new GoogleAuthProvider();
  const handleSignInGoogle = () => {
    // Set Loading True To Show Sippner In The Button Submit And Disable It
    setLoading(true);

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
            ("user is already exists");

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

        // Go To Home Page
        nav("/");

        // Alert Successfull
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
      })

      // While Error
      .catch((error) => {
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
    <div>
      <div className="min-h-[calc(100vh-70px)] overflow-hidden">
        <div className="container min-h-[calc(100vh-70px)] flex justify-center items-center flex-col ">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
            Create Account
            <FaSignInAlt />
          </h2>
          <div className="flex w-full justify-around items-center xsm:flex-col">
            {/* <div className="img">
            <img className="w-[400px]" src="./sign.svg" alt="" />
          </div> */}

            <div className="w-[400px] max-w-full flex flex-col gap-[20px]" action="">
              <label className="input input-bordered flex items-center gap-2">
                <Input className="text-lg" onChange={(event) => setName(event.target.value)} type="text" label="Name" required />
              </label>

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

              <GoogleButton handleGoogleAuth={handleSignInGoogle} />
              {error && (
                <p className="text-red-600 font-semibold text-sm text-center flex justify-center items-center gap-2">
                  <BiSolidError className="text-lg" /> {error}{" "}
                </p>
              )}
              <Button
                disabled={loading}
                onClick={handleSignIn}
                className="w-full flex justify-center items-center bg-[var(--main-color)] text-sm"
                loading={loading}
              >
                Submit
              </Button>
              <Link to="/auth/login" className="block text-center underline">
                Have Account ? login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

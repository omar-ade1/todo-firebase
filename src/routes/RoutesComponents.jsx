import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Auth from "../pages/auth/Auth";
import SignUp from "../pages/auth/sign/SignUp";
import Login from "../pages/auth/login/Login";
import Home from "../pages/home/Home";
import AllTasks from "../pages/allTasks/AllTasks";
import TasksDone from "../pages/tasksDone/TasksDone";
import TasksNotDone from "../pages/tasksNotDone/TasksNotDone";
import AddTask from "../pages/addTask/AddTask";
import TaskPage from "../pages/taskPage/TaskPage";
import Prodect from "./Prodect";
import ErrorPage from "../components/shared/error/ErrorPage"
const RoutesComponents = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/all-tasks",
          element: (
            <Prodect>
              <AllTasks />
            </Prodect>
          ),
        },
        {
          path: "/all-tasks/:taskId",
          element: (
            <Prodect>
              <TaskPage />
            </Prodect>
          ),
        },
        {
          path: "/tasks-done",
          element: (
            <Prodect>
              <TasksDone />
            </Prodect>
          ),
        },
        {
          path: "/tasks-not-done",
          element: (
            <Prodect>
              <TasksNotDone />
            </Prodect>
          ),
        },
        {
          path: "/add-task",
          element: (
            <Prodect>
              <AddTask />
            </Prodect>
          ),
        },
      ],
    },
    {
      path: "/auth",
      element: <Auth />,
      children: [
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RoutesComponents;

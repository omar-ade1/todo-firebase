import React, { useState } from "react";
import { BiTask, BiTaskX } from "react-icons/bi";
import { FaHome, FaTasks } from "react-icons/fa";
import { IoIosArrowForward, IoMdAddCircle, IoMdMenu } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { Button } from "@material-tailwind/react";

const varients = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
  exit: {
    opacity: 0,
  },
};

const SideBar = () => {
  const data = [
    {
      icon: <FaHome className="text-[25px] flex-shrink-0" />,
      title: "Home",
      linkTo: "/",
    },
    {
      icon: <FaTasks className="text-[25px] flex-shrink-0" />,
      title: "All Tasks",
      linkTo: "/all-tasks",
    },
    {
      icon: <BiTask className="text-[25px] flex-shrink-0" />,
      title: "Tasks Done",
      linkTo: "/tasks-done",
    },
    {
      icon: <BiTaskX className="text-[25px] flex-shrink-0" />,
      title: "Tasks Not Done",
      linkTo: "/tasks-not-done",
    },
    {
      icon: <IoMdAddCircle className="text-[25px] flex-shrink-0" />,
      title: "Add Task",
      linkTo: "/add-task",
    },
  ];

  // Handle Function To Open And Close SideBar
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={varients}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setIsOpen(false)}
            className="overLay fixed w-screen h-screen bg-[#00000063] z-10"
          ></motion.div>
        )}
      </AnimatePresence>

      <div onClick={() => setIsOpen(true)} className="xxsm:block hidden fixed bg-black left-0 top-1/4 p-1 rounded-r cursor-pointer  z-20">
        <IoIosArrowForward className="text-white" />
      </div>

      <div
        className={`fixed overflow-hidden h-[calc(100vh-70px)] ${
          isOpen ? "w-[200px]" : "w-[60px] xxsm:w-0"
        } bg-white shadow-xl  py-5 transition-all duration-300  z-50 mt-[70px]`}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div variants={varients} initial="hidden" animate="show" exit="exit">
              <IoCloseCircleOutline onClick={handleOpenSideBar} className="absolute right-2 text-2xl text-red-700 cursor-pointer" />
            </motion.div>
          ) : (
            <motion.div variants={varients} initial="hidden" animate="show" exit="exit">
              <IoMdMenu onClick={handleOpenSideBar} title="open sideBar" className="block w-full text-[35px] mb-10 cursor-pointer" />
            </motion.div>
          )}
        </AnimatePresence>
        {isOpen && (
          <motion.h2 variants={varients} initial="hidden" animate="show" exit="exit" className="text-xl font-bold text-center capitalize">
            sidebar
          </motion.h2>
        )}
        <div className={`container relative h-[calc(100%-20px)] overflow-y-auto overflow-x-hidden`}>
          {isOpen && (
            <motion.h2 variants={varients} initial="hidden" animate="show" exit="exit" className="capitalize my-2 font-semibold tracking-wider">
              pages
            </motion.h2>
          )}
          <ul className="grid gap-2 divide-y-2">
            <>
              {data.map((item, index) => {
                return (
                  <li key={index} className="cursor-pointer ">
                    <NavLink to={item.linkTo} className="flex p-2 gap-x-5 items-center">
                      {item.icon}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.h3 variants={varients} initial="hidden" animate="show" exit="exit" className="text-nowrap">
                            {item.title}
                          </motion.h3>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </li>
                );
              })}
              {isOpen && (
                <div className="absolute bottom-0">
                  <li className="mt-5 py-2">
                    <a className="" href="mailto:omar50001000@gmail.com">
                      <Button className="flex justify-center items-center capitalize text-sm mx-auto">
                        send Message
                        <MdEmail />
                      </Button>
                    </a>
                  </li>

                  <li className="py-2">
                    <h3 className="capitalize text-nowrap">
                      created by <span className="font-bold text-red-600">omar adel</span>
                    </h3>
                  </li>
                </div>
              )}
            </>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;

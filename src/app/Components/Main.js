/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
// import { BsPersonLinesFill } from "react-icons/bs";

const Main = () => {
  return (
    <div id="home" className="w-full h-screen text-center">
      <div className="max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <p className="uppercase text-sm tracking-widest text-gray-600">
            Let's Build Something Together
          </p>
          <h1 className="py-4 text-gray-700">
            Hello, I am <span className="text-[#7f6240]"> Vedant Gour</span>
          </h1>
          <h1 className="py-2 text-gray-700">I'm a Front End Developer.</h1>
          <p className="py-4  text-gray-600 max-w-[70%] m-auto">
            I am a frontend developer focused on crafting intuitive and visually
            compelling web experiences
          </p>
          <div className="flex items-center justify-between max-w-[270px] m-auto py-4">
            <a href="https://www.linkedin.com/in/vedantgour45">
              <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
                <FaLinkedin size={25} />
              </div>
            </a>
            <a href="https://github.com/vedantgour45">
              <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
                <FaGithub size={25} />
              </div>
            </a>
            <a href="mailto:vedantgour45@gmail.com">
              <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
                <BiLogoGmail size={25} />
              </div>
            </a>
            {/* <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <BsPersonLinesFill size={25} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

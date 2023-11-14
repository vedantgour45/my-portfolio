import React from "react";
import Image from "next/image";
import typingtest from "../../../public/assets/project2-typingtest.png";
import { CgCircleci } from "react-icons/cg";
import Link from "next/link";

const LinkedinPage = () => {
  return (
    <div className="w-full">
      <div className="w-sceen h-[30vh] lg:h-[40vh] sticky top-0">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/80 z-10"></div>
        <Image
          className="absolute z-1"
          src={typingtest}
          alt="projectimage"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Keys To Success | Typing Test Website</h2>
          <p>React.js | Firebase | Styled Icon</p>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p className="text-xl tracking-widest uppercase text-[#7f6240]">
            Project
          </p>
          <h2 className="py-4">Overview</h2>
          <p>
            This is Typing test website with different time modes where you can
            challenge yourself and see the stats like wpm(words per minute),
            accuracy and many more. With chart representation dive into detailed
            visualizations that showcase your typing performance over various
            sessions. Identify patterns, improvements, and areas that need more
            practice.
          </p>
          <div>
            <a
              href="https://keys-to-success-typing-test.netlify.app/"
              target="_blank"
            >
              <button className="px-8 py-2 mt-4 mr-8">Demo</button>
            </a>
            <a
              href="https://github.com/vedantgour45/typing-test-website"
              target="_blank"
            >
              <button className="px-8 py-2 mt-4">Code</button>
            </a>
          </div>
          <Link href="/#projects">
            <p className="underline cursor-pointer mt-7">Back</p>
          </Link>
        </div>
        <div className="col-span-4 md:col-span-1 shadow-xl shadow-gray-400 rounded-xl p-4 border border-neutral-200">
          <div className="p-2">
            <p className="font-bold pb-2">Technologies used</p>
            <div className="grid grid-cols-2 md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                React.js
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                Firebase
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                Styled Icon
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                React Tostify
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                Chart.js
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                Random words
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPage;

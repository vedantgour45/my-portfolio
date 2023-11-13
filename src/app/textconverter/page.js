import React from "react";
import Image from "next/image";
import textconverter from "../../../public/assets/project5-textconverter.png";
import { CgCircleci } from "react-icons/cg";
import Link from "next/link";

const LinkedinPage = () => {
  return (
    <div className="w-full">
      <div className="w-sceen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/80 z-10"></div>
        <Image
          className="absolute z-1"
          src={textconverter}
          alt="projectimage"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Text Conversion Application</h2>
          <p>React.js | JavaScript | Bootstrap</p>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p className="text-xl tracking-widest uppercase text-[#7f6240]">
            Project
          </p>
          <h2 className="py-4">Overview</h2>
          <p>
            This application allows users to easily manipulate and analyze text,
            providing features like copying to clipboard, Convert text to
            uppercase, lowercase, title case, and toggle case. User-friendly
            interface with light and dark mode options. Real-time alerts for
            successful actions. Integrated speech synthesis for text-to-speech
            functionality. Live analysis of word and character counts.
          </p>
          <div>
            <a href="https://my-text-converter.netlify.app/" target="_blank">
              <button className="px-8 py-2 mt-4 mr-8">Demo</button>
            </a>
            <a
              href="https://github.com/vedantgour45/my-text-converter"
              target="_blank"
            >
              <button className="px-8 py-2 mt-4">Code</button>
            </a>
          </div>
          <Link href="/#projects">
            <p className="underline cursor-pointer mt-7">Back</p>
          </Link>
        </div>
        <div className="col-span-4 md:col-span-1 shadow-xl shadow-gray-400 rounded-xl p-4">
          <div className="p-2">
            <p className="font-bold pb-2">Technologies used</p>
            <div className="grid grid-cols-2 md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                HTML
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                JavaScript
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                BootStrap
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPage;

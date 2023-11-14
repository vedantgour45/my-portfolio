import React from "react";
import Image from "next/image";
import linkedinImage from "../../../public/assets/project1-linkedin.jpg";
import { CgCircleci } from "react-icons/cg";
import Link from "next/link";

const LinkedinPage = () => {
  return (
    <div className="w-full">
      <div className="w-sceen h-[30vh] lg:h-[40vh] sticky top-0">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/90 z-10"></div>
        <Image
          className="absolute z-1"
          src={linkedinImage}
          alt="projectimage"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">LinkedIn Clone</h2>
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
            This project is a LinkedIn clone developed using React for the
            frontend and Firebase for backend services. It emulates the features
            and functionality of the popular professional networking platform
            LinkedIn. Users have the power to share photos, videos, and files,
            making it a versatile platform for professional content sharing.
            Moreover, it is a fully responsive clone, designed using styled
            components, React, and Firebase to ensure a seamless and enjoyable
            user experience.
          </p>
          <div>
            <a href="https://linkedin-clone-vg.netlify.app/" target="_blank">
              <button className="px-8 py-2 mt-4 mr-8">Demo</button>
            </a>
            <a
              href="https://github.com/vedantgour45/linkedin-clone"
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
                React Hot Toast
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                React Player
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                Axios
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                News API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPage;

import React from "react";
import Image from "next/image";
import bankist from "../../../public/assets/project3-bankist.png";
import { CgCircleci } from "react-icons/cg";
import Link from "next/link";

const LinkedinPage = () => {
  return (
    <div className="w-full">
      <div className="w-sceen h-[30vh] lg:h-[40vh] relative">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/80 z-10"></div>
        <Image
          className="absolute z-1"
          src={bankist}
          alt="projectimage"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Bankist | Banking Application</h2>
          <p>HTML | CSS | JavaScript</p>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p className="text-xl tracking-widest uppercase text-[#7f6240]">
            Project
          </p>
          <h2 className="py-4">Overview</h2>
          <p>
            This project is a comprehensive banking web application developed
            using a combination of HTML, CSS, and JavaScript technologies. With
            a user-friendly interface, the application empowers users to perform
            various banking tasks seamlessly. Users have the ability to initiate
            fund transfers, review transaction summaries for an overview of
            their financial activities, request loans to meet their financial
            needs, and conveniently submit requests for account closure. The
            application is designed to provide a secure and efficient platform
            for users to manage their banking transactions with ease. <br />
            Below are some users for trial purposes <br /> user: vg , password:
            1111 user: am , password: 2222 user: sk , password: 3333 user: rg ,
            password: 4444
          </p>
          <div>
            <a
              href="https://vedantgour45.github.io/Bankist-App/"
              target="_blank"
            >
              <button className="px-8 py-2 mt-4 mr-8">Demo</button>
            </a>
            <a
              href="https://github.com/vedantgour45/Bankist-App"
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
                CSS
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                JavaScript
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPage;

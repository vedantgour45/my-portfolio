/* eslint-disable react/no-unescaped-entities */

import React from "react";
import Image from "next/image";
import profilePicture from "../../../public/assets/profile.jpg";
import resume from "../../../public/assets/resume.pdf";

const About = () => {
  return (
    <div id="about" className="w-full md:h-screen p-2 flex item-center pt-20">
      <div className="max-w-[1240px] m-auto md:grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="uppercase text-xl tracking-widest text-[#7f6240]">
            About
          </p>
          <h2 className="py-4">Who I Am </h2>
          <p className="py-2 text-gray-600">Hello</p>
          <p className="py-2 text-gray-600">
            I'm a junior frontend developer with a passion for creating engaging
            and user-friendly web experiences. With a solid foundation in HTML,
            CSS, and JavaScript, I enjoy bringing designs to life and building
            intuitive interfaces.
          </p>
          <p className="py-2 text-gray-600">
            During my journey as a developer, I've gained experience in working
            with modern frontend frameworks like React.js and have a good
            understanding of responsive web design principles. I'm constantly
            learning and exploring new technologies to enhance my skills.
          </p>
          {/* <div className="py-2 text-gray-600 underline cursor-pointer"> */}
          <button className="px-8 py-2 mt-4 mr-8">
            <a href={resume} download="vedant_gour_resume">
              Resume
            </a>
          </button>

          {/* </div> */}
        </div>
        <div className="py-7 w-full h-auto m-auto flex items-center md:justify-center md:py-0">
          <Image
            className="shadow-xl shadow-gray-400 rounded-lg p-4 hover:scale-105 ease-in duration-300"
            src={profilePicture}
            alt="ProfilePicture"
            width="290"
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

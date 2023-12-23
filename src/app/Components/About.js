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
          <p className="py-2 text-gray-600">Hello!</p>
          <p className="py-2 text-gray-600">
            I'm a junior frontend developer with a passion for crafting
            captivating and user-friendly web experiences. Armed with a robust
            foundation in <b>HTML, CSS, and JavaScript</b>, I thrive on
            transforming designs into dynamic and intuitive interfaces.{" "}
          </p>
          <p className="py-2 text-gray-600">
            Throughout my journey in the world of development, I've not only
            honed my skills in modern frontend frameworks like <b>React.js</b>{" "}
            but have also delved into the power of state management with{" "}
            <b>Redux Toolkit</b>. My commitment to delivering seamless user
            experiences led me to explore the world of{" "}
            <b>Responsive web design</b> principles.
          </p>
          <p className="py-2 text-gray-600">
            Currently, I'm expanding my skill set further by diving into the
            realms of <b>Next.js</b>, a powerful React framework for building
            server-rendered and statically generated web applications.
            Additionally, I'm harnessing the efficiency and flexibility of 
            <b> Tailwind CSS</b> to streamline my styling process and enhance the
            visual appeal of my projects.
          </p>

          <p className="py-2 text-gray-600">
            Driven by a perpetual thirst for knowledge, I'm always on the
            lookout for new technologies and methodologies to elevate my
            abilities and stay at the forefront of the ever-evolving landscape
            of frontend development. Welcome to my journey of continuous
            learning and innovation!
          </p>
          {/* <div className="py-2 text-gray-600 underline cursor-pointer"> */}
          <button className="px-8 py-2 mt-4 mr-8">
            <a href={resume} download="vedant_gour_resume">
              My Resume
            </a>
          </button>

          {/* </div> */}
        </div>
        <div className="py-7 w-full h-auto m-auto flex items-center md:justify-center md:py-0">
          <Image
            className="shadow-xl shadow-gray-400 rounded-lg p-4 hover:scale-105 ease-in duration-300"
            src={profilePicture}
            alt="ProfilePicture"
            width="320"
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

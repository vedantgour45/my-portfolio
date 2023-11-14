"use client";
import Image from "next/image";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
// import { BsPersonLinesFill } from "react-icons/bs";
import { HiOutlineChevronDoubleUp } from "react-icons/hi";
import contactImage from "../../../public/assets/contactImage.jpeg";
import Link from "next/link";

const Contact = () => {
  // const handleSubmit = () => {
  //   alert("Form submitted successfully!!");
  // };

  return (
    <div id="contact" className="w-full lg:h-screen px-2 pt-20">
      <div className="max-w-[1240px] m-auto px-2 w-full">
        <p className="text-xl tracking-widest uppercase text-[#7f6240]">
          Contact
        </p>
        <h2 className="py-4">Get In Touch</h2>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left side */}
          <div className="col-span-3 lg:col-span-2 w-full h-full shadow-xl shadow-gray-400 rounded-xl p-4 border border-slate-200">
            <div className="lg:p-4 h-full">
              <div>
                <Image
                  className="rounded-xl hover:scale-105 ease-in duration-300"
                  src={contactImage}
                  alt="contact-image"
                />
              </div>
              <div>
                <h2 className="py-4">Vedant Gour</h2>
                <h3>Front End Developer</h3>
                <p className="py-4">
                  Available for frontend developer roles and freelance
                  opportunities. Feel free to connect with me for collaboration
                  or discussions about web development projects. Looking forward
                  to new challenges and exciting ventures!
                </p>
              </div>
              <div>
                <p className="uppercase pt-8">Connect with me</p>
                <div className="flex items-center gap-8 py-4">
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

          {/* Right Side */}
          <div className="col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl lg:p-4 border border-slate-200">
            <div className="p-4 flex flex-col justify-around">
              <form
                name="contact"
                method="POST"
                // action="/success/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
                <input type="hidden" name="form-name" value="contact" />
                <div className="grid md:grid-cols-2 gap-4 w-full py-2">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="uppercase text-sm py-2">
                      Name
                    </label>
                    <input
                      className="border-2 rounded-lg p-3 flex border-gray-300 bg-transparent"
                      type="text"
                      id="name"
                      name="name"
                    />
                  </div>
                  <div htmlFor="number" className="flex flex-col">
                    <label className="uppercase text-sm py-2">
                      Phone number
                    </label>
                    <input
                      className="border-2 rounded-lg p-3 flex border-gray-300 bg-transparent"
                      type="text"
                      id="number"
                      name="number"
                    />
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <label htmlFor="email" className="uppercase text-sm py-2">
                    email
                  </label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300 bg-transparent"
                    type="email"
                    id="email"
                    name="email"
                  />
                </div>
                <div htmlFor="subject" className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">Subject</label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300 bg-transparent"
                    type="text"
                    id="subject"
                    name="subject"
                  />
                </div>
                <div htmlFor="message" className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">Message</label>
                  <textarea
                    className="border-2 rounded-lg p-3 border-gray-300 bg-transparent"
                    rows="10"
                    id="message"
                    name="message"
                  ></textarea>
                </div>
                <button
                  className="w-full p-4  bg-gradient-to-r from-[#a98b52] to-[#9d794e] text-gray-100 mt-4"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <Link href="/#home">
            <div className="rounded-full shadow-lg shadow-gray-400 my-10 p-4 cursor-pointer  animate-bounce">
              <HiOutlineChevronDoubleUp className="text-[#7f6240]" size={20} />
            </div>
          </Link>
        </div>
        <p className="flex justify-center -mt-20">Back To Top</p>
      </div>
    </div>
  );
};

export default Contact;

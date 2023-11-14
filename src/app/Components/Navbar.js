"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";
import navlogo from "../../../public/assets/main-logo2.png";
import navLogoWhite from "../../../public/assets/main-logo2-white.png";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
// import { BsPersonLinesFill } from "react-icons/bs";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState("#FAF9F6");
  const [navlogoSwitch, setNavLogoSwitch] = useState(false);
  const [linkColor, setLinkColor] = useState("#1f2937");

  const route = usePathname();

  useEffect(() => {
    if (
      route === "/linkedin" ||
      route === "/typingtest" ||
      route === "/bankist" ||
      route === "/guessmynumber" ||
      route === "/textconverter"
    ) {
      setNavBg("transparent");
      setLinkColor("#ecf0f3");
      setNavLogoSwitch(true);
    } else {
      setNavBg("#FAF9F6");
      setLinkColor("#1f2937");
      setNavLogoSwitch(false);
    }
  }, [route]);

  const handleOpen = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleSideMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener("scroll", handleShadow);
  }, []);

  return (
    <div
      style={{ backgroundColor: `${navBg}` }}
      className={
        shadow
          ? "fixed w-full h-20 shadow-xl z-[100]"
          : "fixed w-full h-20 z-[100]"
      }
    >
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        {/* For lazy loading used Image */}
        <Link href="/">
          {navlogoSwitch ? (
            <Image src={navLogoWhite} alt="nav-logo" width="50" height="auto" />
          ) : (
            <Image src={navlogo} alt="nav-logo" width="50" height="auto" />
          )}
        </Link>
        {/* Menu */}
        <div>
          <ul style={{ color: `${linkColor}` }} className="hidden md:flex">
            <Link href="/#home">
              <li className="ml-10 text-sm uppercase hover:border-b border-neutral-400">
                Home
              </li>
            </Link>
            <Link href="/#about">
              <li className="ml-10 text-sm uppercase hover:border-b border-neutral-400">
                About
              </li>
            </Link>
            <Link href="/#skills">
              <li className="ml-10 text-sm uppercase hover:border-b border-neutral-400">
                Skills
              </li>
            </Link>
            <Link href="/#projects">
              <li className="ml-10 text-sm uppercase hover:border-b border-neutral-400">
                Projects
              </li>
            </Link>
            <Link href="/#contact">
              <li className="ml-10 text-sm uppercase hover:border-b border-neutral-400">
                Contact
              </li>
            </Link>
          </ul>
          <div className="md:hidden cursor-pointer" onClick={handleOpen}>
            <AiOutlineMenu style={{ color: linkColor }} size={25} />
          </div>
        </div>
      </div>

      {/* Menu design for mobile devices */}
      <div
        className={
          menuOpen
            ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70"
            : ""
        }
      >
        <div
          className={
            menuOpen
              ? "fixed left-0 top-0 w-[75%] sm:w-[65%] md:w-[45%] h-screen bg-[#FAF9F6] p-7 ease-in duration-500"
              : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
          }
        >
          <div>
            <div className="flex justify-between items-center w-full">
              <Link href="/#home">
                <Image src={navlogo} alt="nav-logo" height={45} width={45} />
              </Link>
              <div
                onClick={handleOpen}
                className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer"
              >
                <AiOutlineClose size={15} />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
              <p className="w-[85%] md:w-[90%] py-4">
                Let's build something together
              </p>
            </div>
          </div>
          <div className="py-4 flex flex-col">
            <ul className="uppercase">
              <Link href="/#home">
                <li onClick={handleSideMenu} className="py-4 text-sm">
                  Home
                </li>
              </Link>
              <Link href="/#about">
                <li onClick={handleSideMenu} className="py-4 text-sm">
                  About
                </li>
              </Link>
              <Link href="/#skills">
                <li onClick={handleSideMenu} className="py-4 text-sm">
                  Skills
                </li>
              </Link>
              <Link href="/#projects">
                <li onClick={handleSideMenu} className="py-4 text-sm">
                  Projects
                </li>
              </Link>
              <Link href="/#contact">
                <li onClick={handleSideMenu} className="py-4 text-sm">
                  Contact
                </li>
              </Link>
            </ul>

            <div className="pt-20">
              <p className="uppercase tracking-widest text-[#626262]">
                Let's Connect
              </p>
              <div className="flex items-center gap-8 my-4 w-full sm:w-[80%]">
                <a href="https://www.linkedin.com/in/vedantgour45">
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <FaLinkedin size={20} />
                  </div>
                </a>
                <a href="https://github.com/vedantgour45">
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <FaGithub size={20} />
                  </div>
                </a>
                <a href="mailto:vedantgour45@gmail.com">
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                    <BiLogoGmail size={20} />
                  </div>
                </a>

                {/* <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                  <BsPersonLinesFill size={20} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

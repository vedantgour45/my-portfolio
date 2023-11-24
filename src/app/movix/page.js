import React from "react";
import Image from "next/image";
import movix from "../../../public/assets/project-movix.png";
import { CgCircleci } from "react-icons/cg";
import Link from "next/link";

const Movix = () => {
  return (
    <div className="w-full">
      <div className="w-sceen h-[30vh] lg:h-[40vh] sticky top-0">
        <div className="absolute top-0 left-0 w-full h-[30vh] lg:h-[40vh] bg-black/90 z-10"></div>
        <Image
          className="absolute z-1"
          src={movix}
          alt="projectimage"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2">
          <h2 className="py-2">Movix | Movies & TV Shows App</h2>
          <p>React.js | SCSS | Redux</p>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 pt-8">
        <div className="col-span-4">
          <p className="text-xl tracking-widest uppercase text-[#7f6240]">
            Project
          </p>
          <h2 className="py-4">Overview</h2>
          <p>
            Movix is a web application that allows users to explore movies and
            TV shows, providing information such as trailers, cast details,
            ratings, directors, writers, and more. The app includes various
            sections like Similar, Popular, Trending, and Top Rated to enhance
            the user's entertainment experience. <br />
            <b> Features: </b>
            <br />
            Browse movies and TV shows by categories.
            <br />
            View trailers, cast details, ratings, directors, and writers for
            each title.
            <br />
            Explore sections such as Similar, Popular, Trending, and Top Rated.
            <br />
            Infinite scrolling, Skeleton loading and many more.
          </p>
          <div>
            <a href="https://movix-movies.netlify.app/" target="_blank">
              <button className="px-8 py-2 mt-4 mr-8">Demo</button>
            </a>
            <a href="https://github.com/vedantgour45/movie-app" target="_blank">
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
                Redux
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                React Router Dom
              </p>
              <p className="text-gray-600 py-2 flex items-center">
                <CgCircleci className="pr-1" />
                SCSS
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
                IMDB API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movix;

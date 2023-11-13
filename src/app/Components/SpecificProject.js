import React from "react";
import Link from "next/link";
import Image from "next/image";

const SpecificProject = ({
  projectImage,
  projectName,
  projectLink,
  // projectTechStack,
}) => {
  return (
    <div className="relative flex justify-center items-center h-auto w-full shadow-xl shadow-gray-400 rounded-xl p-4 group hover:bg-gradient-to-r from-[#a98b52] to-[#9d794e] border border-slate-200">
      <Image
        className="rounded-xl group-hover:opacity-10 ease-in duration-300"
        src={projectImage}
        alt="projectPhoto"
      />
      <div className="hidden group-hover:block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-xl text-white tracking-wider text-center py-36">
          {projectName}
        </h3>
        {/* <p className="pb-4 pt-2 text-white text-center">{projectTechStack}</p> */}
        <Link href={projectLink}>
          <p className="text-center py-2 rounded-lg bg-white text-gray-700 font-bold text-lg cursor-pointer">
            More Info
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SpecificProject;

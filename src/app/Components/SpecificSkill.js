import React from "react";
import Image from "next/image";

const SpecificSkill = ({ skillName, skillImage, skillImageAltText }) => {
  return (
    <div>
      <div className="p-3 shadow-xl rounded-xl hover:scale-105 ease-in duration-300 border border-slate-200">
        <div className="grid grid-cols-2 gap-4 justify-center items-center">
          <div className="m-auto">
            <Image
              src={skillImage}
              alt={skillImageAltText}
              width="90"
              height="90"
            />
          </div>
          <div className="flex justify-center flex-col items-center">
            <h3>{skillName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificSkill;

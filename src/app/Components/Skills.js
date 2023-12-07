import React from "react";
import htmlIcon from "../../../public/skills/html-icon.svg";
import cssIcon from "../../../public/skills/css-icon.svg";
import scssIcon from "../../../public/skills/scss-icon.svg";
import bootstrapIcon from "../../../public/skills/bootstrap-icon.svg";
import muiIcon from "../../../public/skills/mui-icon.svg";
import jsIcon from "../../../public/skills/js-icon.svg";
import reactIcon from "../../../public/skills/react-icon.svg";
import reduxIcon from "../../../public/skills/redux-icon.svg";
import nextIcon from "../../../public/skills/next-icon.svg";
import firebaseIcon from "../../../public/skills/firebase-icon.svg";
import gitIcon from "../../../public/skills/git-icon.svg";
import mySqlIcon from "../../../public/skills/mysql-icon.svg";
import tailwindCSS from "../../../public/skills/tailwind-css-icon.svg";
import SpecificSkill from "./SpecificSkill";

const Skills = () => {
  return (
    <div id="skills" className="w-full lg:h-screen p-2 pt-20">
      <div className="max-w-[1240px] mx-auto flex justify-center flex-col h-full">
        <p className="text-xl tracking-widest uppercase text-[#7f6240]">
          Skills
        </p>
        <h2 className="py-4">What I Can Do</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <SpecificSkill
            skillName="HTML"
            skillImage={htmlIcon}
            skillImageAltText="htmlIcon"
          />
          <SpecificSkill
            skillName="CSS"
            skillImage={cssIcon}
            skillImageAltText="cssIcon"
          />
          <SpecificSkill
            skillName="JavaScript"
            skillImage={jsIcon}
            skillImageAltText="jsIcon"
          />
          <SpecificSkill
            skillName="React.js"
            skillImage={reactIcon}
            skillImageAltText="reactIcon"
          />
          <SpecificSkill
            skillName="Redux Toolkit"
            skillImage={reduxIcon}
            skillImageAltText="reduxIcon"
          />
          <SpecificSkill
            skillName="Tailwind CSS"
            skillImage={tailwindCSS}
            skillImageAltText="tailwind"
          />
          <SpecificSkill
            skillName="Next.js"
            skillImage={nextIcon}
            skillImageAltText="nextIcon"
          />
          <SpecificSkill
            skillName="SCSS"
            skillImage={scssIcon}
            skillImageAltText="scssIcon"
          />
          <SpecificSkill
            skillName="Firebase"
            skillImage={firebaseIcon}
            skillImageAltText="firebaseIcon"
          />
          <SpecificSkill
            skillName="Material UI"
            skillImage={muiIcon}
            skillImageAltText="muiIcon"
          />
          <SpecificSkill
            skillName="Bootstrap"
            skillImage={bootstrapIcon}
            skillImageAltText="bootstrapIcon"
          />
          <SpecificSkill
            skillName="Git"
            skillImage={gitIcon}
            skillImageAltText="gitIcon"
          />
          <SpecificSkill
            skillName="MySQL"
            skillImage={mySqlIcon}
            skillImageAltText="mysqlIcon"
          />
        </div>
      </div>
    </div>
  );
};

export default Skills;

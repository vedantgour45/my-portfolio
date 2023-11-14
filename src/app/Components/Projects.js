import React from "react";
import project1 from "../../../public/assets/project1-linkedin.jpg";
import project2 from "../../../public/assets/project2-typingtest.png";
import project3 from "../../../public/assets/project3-bankist.png";
import project4 from "../../../public/assets/project4-numbergame.png";
import project5 from "../../../public/assets/project5-textconverter.png";
import SpecificProject from "./SpecificProject";

const Projects = () => {
  return (
    <div id="projects" className="w-full p-2 pt-20">
      <div className="max-w-[1240px] mx-auto px-2 py-16">
        <p className="text-xl tracking-widest uppercase text-[#7f6240]">
          Projects
        </p>
        <h2 className="py-4">What I've Built</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <SpecificProject
            projectImage={project1}
            projectName="LinkedIn Clone"
            projectLink="/linkedin"
            // projectTechStack="React.js | Firebase | Styled Icon"
          />
          <SpecificProject
            projectImage={project2}
            projectName="Keys To Success"
            projectLink="/typingtest"
            // projectTechStack="React.js | Firebase | Styled Icon"
          />
          <SpecificProject
            projectImage={project3}
            projectName="Bankist Application"
            projectLink="/bankist"
            // projectTechStack="HTML | CSS | JavaScript"
          />
          <SpecificProject
            projectImage={project4}
            projectName="Guess My Number"
            projectLink="/guessmynumber"
            // projectTechStack="HTML | CSS | JavaScript"
          />
          <SpecificProject
            projectImage={project5}
            projectName="Text Converter"
            projectLink="/textconverter"
            // projectTechStack="React.js | Bootstrap"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;

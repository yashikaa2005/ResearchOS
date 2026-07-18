// src/components/project/ProjectGrid.jsx
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";

const ProjectGrid = ({ projects = [], onCreateProject, onProjectClick }) => {
  return (
    <div className="mb-16">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CreateProjectCard onClick={onCreateProject} />
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;
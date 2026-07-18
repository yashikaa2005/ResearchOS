import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Folder, Calendar, Clock } from "lucide-react";
import { useProjects } from "../../context/ProjectContext";
import CreateProjectCard from "../../components/project/CreateProjectCard";
import ProjectCard from "../../components/project/ProjectCard";
import CreateProjectModal from "../../components/project/CreateProjectModal";

const Projects = () => {
  const { projects, loading, createProject } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, name
  const navigate = useNavigate();

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/projects/${project._id}`);
  };

  // Filter projects by search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <section className="px-8 pt-12 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">All Projects</h1>
          <p className="text-base text-muted-foreground mt-1">Manage and organize your research spaces.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      {loading && sortedProjects.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card/20">
          <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-55" />
          <h3 className="text-base font-semibold text-foreground">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {searchQuery ? "Try checking your spelling or searching for a different keyword." : "Create your first project to get started with your research workflow."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors cursor-pointer"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CreateProjectCard onClick={() => setIsCreateModalOpen(true)} />
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </section>
  );
};

export default Projects;

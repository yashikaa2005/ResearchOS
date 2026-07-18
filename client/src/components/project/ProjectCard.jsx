import { BookOpen } from "lucide-react";

// src/components/project/ProjectCard.jsx
const ProjectCard = ({ project, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative h-32 rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-accent hover:shadow-sm transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col items-start gap-1 w-full">
                    <BookOpen className="w-5 h-5 text-accent mb-1 shrink-0" />
                    <h3 className="text-sm font-semibold text-foreground text-left line-clamp-2 w-full">
                        {project.title}
                    </h3>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-left line-clamp-1">
                    {project.description}
                </p>
                <p className="text-xs text-muted-foreground">
                    Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
            </div>
        </button>
    );
};

export default ProjectCard;
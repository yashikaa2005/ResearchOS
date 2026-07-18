// src/components/project/CreateProjectCard.jsx
import { Plus } from "lucide-react";

const CreateProjectCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative h-32 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-accent hover:bg-secondary/50 transition-all duration-300 cursor-pointer"
    >
      <Plus className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium text-foreground">
        Create New Project
      </span>
    </button>
  );
};

export default CreateProjectCard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { File, FileText, Search, Plus } from "lucide-react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProjectGrid from "../../components/project/ProjectGrid";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import CreateProjectModal from "../../components/project/CreateProjectModal";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectContext";
import { getGlobalActivities } from "../../services/insight.service";

const Dashboard = () => {
    const { user } = useAuth();
    const { projects, loading, createProject } = useProjects();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await getGlobalActivities();
                setActivities(res.data || []);
            } catch (err) {
                console.error("Failed to load global activities:", err);
            }
        };
        fetchActivities();
    }, []);

    const handleCreateProject = async (projectData) => {
        try {
            await createProject(projectData);
            setIsCreateModalOpen(false);
            // Refresh activities
            const res = await getGlobalActivities();
            setActivities(res.data || []);
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    const handleProjectClick = (project) => {
        navigate(`/projects/${project._id}`);
    };

    const lastProject = projects && projects.length > 0 ? projects[0] : null;

    const quickActions = [
        { 
            id: 1, 
            label: "Upload Paper", 
            icon: File, 
            onClick: () => {
                if (lastProject) {
                    navigate(`/projects/${lastProject._id}?tab=papers`);
                } else {
                    setIsCreateModalOpen(true);
                }
            } 
        },
        { 
            id: 2, 
            label: "Create Note", 
            icon: FileText, 
            onClick: () => {
                if (lastProject) {
                    navigate(`/projects/${lastProject._id}?tab=notes&action=create`);
                } else {
                    setIsCreateModalOpen(true);
                }
            } 
        },
        { 
            id: 3, 
            label: "Search Research", 
            icon: Search, 
            onClick: () => {
                if (lastProject) {
                    navigate(`/projects/${lastProject._id}?tab=overview`);
                } else {
                    setIsCreateModalOpen(true);
                }
            } 
        },
        { 
            id: 4, 
            label: "Create Project", 
            icon: Plus, 
            onClick: () => setIsCreateModalOpen(true) 
        },
    ];

    return (
        <section className="px-8 pt-12 pb-8">
            <DashboardHeader user={user} />
            <ProjectGrid 
                projects={projects} 
                onCreateProject={() => setIsCreateModalOpen(true)}
                onProjectClick={handleProjectClick}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RecentActivity activities={activities} />
                <QuickActions actions={quickActions} />
            </div>

            <CreateProjectModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </section>
    );
};

export default Dashboard;
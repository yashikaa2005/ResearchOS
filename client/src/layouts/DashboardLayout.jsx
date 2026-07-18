
import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectContext";

const DashboardLayout = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const { projects } = useProjects();
    const location = useLocation();

    let title = "Dashboard";
    if (location.pathname === "/dashboard") {
      title = "Dashboard";
    } else if (location.pathname === "/projects") {
      title = "All Projects";
    } else if (location.pathname === "/settings") {
      title = "User Settings";
    } else if (id && projects && projects.length > 0) {
      const proj = projects.find(p => p._id === id);
      if (proj) {
        title = proj.title;
      } else {
        title = "Project Workspace";
      }
    } else if (id) {
      title = "Project Workspace";
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="ml-64 min-h-screen bg-background">
                <Topbar user={user} title={title} />
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
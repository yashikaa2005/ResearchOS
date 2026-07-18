import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FolderOpen,
    Settings
} from "lucide-react";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Projects", icon: FolderOpen, path: "/projects" },
    { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border pt-8 px-6">
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-white">
                            R
                        </div>
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">
                        ResearchOS
                    </h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon; //store the icon component
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-foreground hover:bg-secondary"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
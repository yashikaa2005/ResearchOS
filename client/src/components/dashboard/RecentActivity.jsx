import { File, FileText, Folder, Zap } from "lucide-react";

const getActivityIcon = (type) => {
  switch (type) {
    case "PROJECT_CREATED":
      return <Folder className="w-4 h-4 text-emerald-500" />;
    case "PAPER_UPLOADED":
      return <File className="w-4 h-4 text-blue-500" />;
    case "NOTE_CREATED":
      return <FileText className="w-4 h-4 text-amber-500" />;
    case "AI_SUMMARY_GENERATED":
      return <Zap className="w-4 h-4 text-purple-500" />;
    default:
      return <Zap className="w-4 h-4 text-accent" />;
  }
};

const RecentActivity = ({ activities = [] }) => {
  // Find the last project worked on (most recent activity that has a populated project)
  const lastProjectActivity = activities.find(a => a.project);

  // Time formatter helper
  const formatTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (isNaN(seconds) || seconds < 0) return "just now";
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    return "just now";
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Last Project Worked On Banner */}
      {lastProjectActivity && lastProjectActivity.project && (
        <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-card to-accent/5 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block">
              Last Workspace Visited
            </span>
            <h3 className="text-sm font-semibold text-foreground mt-0.5">
              {lastProjectActivity.project.title}
            </h3>
          </div>
          <span className="text-xs text-accent font-medium bg-accent/10 border border-accent/15 px-2.5 py-0.5 rounded-full shrink-0">
            {formatTimeAgo(lastProjectActivity.createdAt)}
          </span>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h2>
        {activities.length === 0 ? (
          <div className="p-8 border border-border border-dashed rounded-xl bg-card/25 text-center text-sm text-muted-foreground">
            No recent activity logged yet. Upload papers or create notes to populate the timeline.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <p className="text-sm font-medium text-foreground leading-snug break-words">
                      {activity.type === "PROJECT_CREATED" ? "Created workspace" :
                       activity.type === "PAPER_UPLOADED" ? "Uploaded PDF paper" :
                       activity.type === "NOTE_CREATED" ? "Created research note" :
                       activity.type === "AI_SUMMARY_GENERATED" ? "AI summary completed" :
                       activity.message || "Updated workspace"}
                    </p>
                    {activity.project && (
                      <span className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground w-max font-mono shrink-0">
                        {activity.project.title}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
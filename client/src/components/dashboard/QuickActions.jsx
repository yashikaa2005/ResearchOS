const QuickActions = ({ actions = [] }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Quick Actions
      </h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:border-accent hover:bg-secondary/50 transition-all group"
            >
              <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium text-foreground text-left">
                {action.label}
              </span>
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground group-hover:text-accent transition-colors">
                →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
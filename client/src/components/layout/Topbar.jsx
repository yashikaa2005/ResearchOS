const Topbar = ({ title = "Dashboard", user }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
            {user?.initials || "?"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
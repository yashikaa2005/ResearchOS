
const DashboardHeader = ({ user }) => {
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
                ? "Good Afternoon"
                : "Good Evening";
    return (
        <div className="space-y-2 mb-12">
            <h1 className="text-3xl font-semibold text-foreground">
                {greeting}, {user?.name}
            </h1>
            <p className="text-base text-muted-foreground">Continue your research.</p>
        </div>
    );
};

export default DashboardHeader;
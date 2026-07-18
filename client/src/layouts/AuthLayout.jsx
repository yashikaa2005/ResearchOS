const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-[#151922] px-4 py-12 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-accent/25">
            R
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            ResearchOS
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-powered research workspace
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
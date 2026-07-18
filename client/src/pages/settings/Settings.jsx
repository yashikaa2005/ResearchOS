import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { changePassword } from "../../services/auth.service";

const Settings = () => {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword });
      setSuccessMsg(res.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 pt-12 pb-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">User Settings</h1>
        <p className="text-base text-muted-foreground mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 border-b border-border/50 pb-3">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <span className="text-sm text-foreground col-span-2">{user?.name}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-border/50 pb-3">
              <span className="text-sm font-medium text-muted-foreground">Email Address</span>
              <span className="text-sm text-foreground col-span-2">{user?.email}</span>
            </div>
            <div className="grid grid-cols-3 pb-1">
              <span className="text-sm font-medium text-muted-foreground">Account Created</span>
              <span className="text-sm text-foreground col-span-2">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-500 text-xs">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-start pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="bg-accent hover:bg-accent/80 text-accent-foreground font-medium text-sm px-4 py-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Logout Card */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-2">Account Actions</h2>
          <p className="text-xs text-muted-foreground mb-4">Log out of your current session on this device.</p>
          <div className="flex justify-start">
            <Button
              onClick={logout}
              variant="secondary"
              className="border border-border hover:bg-secondary/80 text-red-500 font-medium text-sm px-4 py-2 cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Settings;

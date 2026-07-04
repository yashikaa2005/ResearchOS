// client/src/components/auth/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Create an Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;
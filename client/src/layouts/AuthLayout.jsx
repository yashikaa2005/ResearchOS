const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
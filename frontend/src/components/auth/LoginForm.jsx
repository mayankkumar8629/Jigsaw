export default function LoginForm({ onClose, switchToSignup }) {
  return (
    <div className="w-full max-w-md bg-gray-900 p-10 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm bg-opacity-90">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-1">Log in to your account</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-2xl transform hover:scale-110"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-gray-400">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-gray-400">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="button"
          className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/20 mt-4"
        >
          Continue
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      {/* Switch to Signup */}
      <div className="text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button 
            onClick={switchToSignup}
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
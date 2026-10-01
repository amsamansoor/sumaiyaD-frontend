import React, { useState } from 'react';
import { signupUser, loginUser } from '../../Service/api'; // API functions for signup and login

export default function AuthView({ onAuthSuccess, setCurrentView }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let responseData;

      if (isRegister) {
        // Signup Payload (C# DTO ke mutabiq)
        const signupPayload = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password
        };
        responseData = await signupUser(signupPayload);
      } else {
        // Login Payload
        const loginPayload = {
          email: formData.email,
          password: formData.password
        };
        responseData = await loginUser(loginPayload);
      }

      // Format User Data for LocalStorage / App State (Backend data safely map kiya gaya hai)
      const userData = {
        id: responseData.id || responseData.userId || Date.now().toString(),
        name: responseData.name || `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0],
        email: responseData.email || formData.email,
        role: responseData.role || 'user', // Role ensure karne ke liye taake admin recognize ho sake
        token: responseData.token || null
      };

      // Save to LocalStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }

      // Agar user Admin hai toh Admin panel ya Account page par route karein
      if (typeof setCurrentView === 'function') {
        if (userData.role && userData.role.trim().toLowerCase() === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('account');
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setErrorMessage(isRegister ? 'Registration failed. Try a different email.' : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-[450px] space-y-6">
        
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-light text-center text-gray-900 tracking-wide mb-8">
          {isRegister ? 'Create account' : 'Login'}
        </h1>

        {errorMessage && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 text-sm focus:outline-none focus:border-black rounded-md transition-colors placeholder-gray-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 text-sm focus:outline-none focus:border-black rounded-md transition-colors placeholder-gray-400"
                />
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-200 text-sm focus:outline-none focus:border-black rounded-md transition-colors placeholder-gray-400"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-200 text-sm focus:outline-none focus:border-black rounded-md transition-colors placeholder-gray-400"
            />
          </div>

          {!isRegister && (
            <div className="pt-1">
              <button
                type="button"
                className="text-sm text-gray-900 hover:underline underline-offset-4 font-normal"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Black Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3.5 rounded-md text-sm font-medium tracking-wide hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isRegister ? 'Create' : 'Sign in')}
            </button>
          </div>
        </form>

        {/* Toggle between Login and Create Account */}
        <div className="text-center pt-1">
          {isRegister ? (
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMessage(''); }}
              className="text-sm text-gray-900 hover:underline underline-offset-4"
            >
              Already have an account? Log in
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMessage(''); }}
              className="text-sm text-gray-900 hover:underline underline-offset-4"
            >
              Create account
            </button>
          )}
        </div>

        {/* OR Divider Line */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 tracking-wider">OR</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-800"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            className="w-full bg-[#4267B2] hover:bg-[#365899] text-white rounded-md py-3 px-4 flex items-center justify-center gap-3 transition-colors text-sm font-semibold"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Sign in with Facebook
          </button>
        </div>

      </div>
    </div>
  );
}
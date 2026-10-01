import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import api from '../services/api'; // Yahan apna API service import karein

export default function AdminAuth({ onAuthSuccess, onNavigateToStore }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // Backend API Login Integration
      if (!formData.email || !formData.password) {
        setError('Please provide both email and password.');
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.post('/Auth/login', {
          email: formData.email,
          password: formData.password
        });

        const user = response.data; // { id, name, email, role }
        localStorage.setItem('adminUser', JSON.stringify(user));
        if (onAuthSuccess) onAuthSuccess(user);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid email or password!');
      } finally {
        setLoading(false);
      }

    } else {
      // Backend API Signup Integration
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }

      if (formData.adminKey !== 'SUMAYYA2026') {
        setError('Invalid Admin Passkey!');
        setLoading(false);
        return;
      }

      try {
        const response = await api.post('/Auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Admin'
        });

        const newUser = response.data;
        localStorage.setItem('adminUser', JSON.stringify(newUser));
        if (onAuthSuccess) onAuthSuccess(newUser);
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img 
          src={logoImage} 
          alt="SUMAYYA.D" 
          className="h-16 w-auto mx-auto object-contain cursor-pointer"
          onClick={onNavigateToStore}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/150x50?text=SUMAYYA.D";
          }}
        />
        <h2 className="mt-4 text-2xl font-serif font-bold text-gray-900 tracking-wide uppercase">
          {isLogin ? 'Admin Portal Login' : 'Register Admin Account'}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {isLogin ? 'Access your store dashboard' : 'Create an account to manage inventory & sales'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-lg sm:px-10">
          
          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs uppercase font-semibold text-center border-b-2 ${
                isLogin ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs uppercase font-semibold text-center border-b-2 ${
                !isLogin ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                    placeholder="Admin User"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="admin@sumayyad.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Admin Security Passkey
                </label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.adminKey}
                    onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                    placeholder="SUMAYYA2026"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-black text-white py-2.5 px-4 rounded text-xs uppercase font-semibold tracking-wider hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Please wait...' : (isLogin ? 'Login to Dashboard' : 'Register Account')}</span>
              {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <button onClick={onNavigateToStore} className="text-xs text-gray-500 hover:text-black">
              ← Back to Storefront
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
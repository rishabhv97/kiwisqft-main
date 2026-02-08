import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'User' // Default to User (Buyer)
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CHANGED: Send data to Node.js Backend instead of Supabase
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      toast.success('Account created! Please log in.');
      navigate('/login');

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-lightGreen rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-brand-green" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join Kiwi Sqft to buy, sell, or rent properties</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSignup}>
          
          {/* Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input name="name" type="text" required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
              placeholder="Full Name" onChange={handleChange} />
          </div>

          {/* Email Input */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input name="email" type="email" required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
              placeholder="Email address" onChange={handleChange} />
          </div>

          {/* Phone Input */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input name="phone" type="tel" required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
              placeholder="Phone Number" onChange={handleChange} />
          </div>

          {/* Role Selection */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select name="role"
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none bg-white"
              onChange={handleChange} value={formData.role}>
              <option value="User">I want to Buy/Rent (User)</option>
              <option value="Owner">I want to Sell (Owner)</option>
              <option value="Broker">I am an Agent (Broker)</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input name="password" type="password" required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
              placeholder="Password (min 6 chars)" onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-brand-green hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-70 transition-all shadow-lg hover:shadow-xl">
            {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm">
           <span className="text-gray-500">Already have an account? </span>
           <Link to="/login" className="font-medium text-brand-green hover:text-emerald-800 hover:underline">
             Sign in
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
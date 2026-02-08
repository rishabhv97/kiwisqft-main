import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Mail, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user, login } = useAuth(); // We need 'login' to update the stored user data locally
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: user.id })
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update Local State (AuthContext)
      // We pass the existing token but new user data
      const token = localStorage.getItem('token') || '';
      login(token, { ...user, ...formData });

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-emerald-800 transition flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
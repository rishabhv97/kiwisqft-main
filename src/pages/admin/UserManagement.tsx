import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, Shield, MoreVertical, Loader2, Briefcase, CheckCircle, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      
      if (Array.isArray(data)) {
          setUsers(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Generic Function to Change Role
  const handleRoleUpdate = async (userId: number, userName: string, newRole: string) => {
      const action = newRole === 'Broker' ? 'promote' : 'demote';
      if (!window.confirm(`Are you sure you want to ${action} ${userName} to ${newRole}?`)) return;

      try {
          const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: newRole })
          });

          if (!response.ok) throw new Error("Failed to update role");

          toast.success(`User role updated to ${newRole}`);
          
          // Update local state instantly
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

      } catch (error) {
          console.error(error);
          toast.error("Error updating role");
      }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading Users...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Join Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-lightGreen flex items-center justify-center text-brand-green font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'Broker' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'Admin' && <Shield size={10} />}
                    {user.role === 'Broker' && <Briefcase size={10} />}
                    {user.role === 'User' ? 'Buyer/User' : user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><Mail size={12}/> {user.email}</span>
                    <span className="flex items-center gap-2"><Phone size={12}/> {user.phone || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  
                  {/* Logic for Buttons */}
                  
                  {/* 1. If User/Owner -> Show "Make Agent" */}
                  {(user.role === 'User' || user.role === 'Owner') && (
                      <button 
                        onClick={() => handleRoleUpdate(user.id, user.name, 'Broker')}
                        className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition border border-blue-200 flex items-center gap-1 ml-auto"
                        title="Promote to Agent"
                      >
                        <Briefcase size={14}/> Make Agent
                      </button>
                  )}

                  {/* 2. If Broker (Agent) -> Show "Remove Agent" (Demote to User) */}
                  {user.role === 'Broker' && (
                      <button 
                        onClick={() => handleRoleUpdate(user.id, user.name, 'User')}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition border border-red-200 flex items-center gap-1 ml-auto"
                        title="Demote to User"
                      >
                        <UserMinus size={14}/> Remove Agent
                      </button>
                  )}

                  {/* 3. If Admin -> No Action */}
                  {user.role === 'Admin' && (
                      <span className="text-gray-400 text-xs flex items-center justify-end gap-1">
                          <Shield size={14}/> Admin
                      </span>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
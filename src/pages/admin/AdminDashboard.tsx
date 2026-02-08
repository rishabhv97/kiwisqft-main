import React, { useEffect, useState } from 'react';
import { Users, Building, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC<any> = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, activeProperties: 0 });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            // We can reuse the existing endpoints to get counts
            const [usersRes, propsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users'),
                fetch('http://localhost:5000/api/admin/properties')
            ]);
            
            const users = await usersRes.json();
            const props = await propsRes.json();

            if (Array.isArray(users) && Array.isArray(props)) {
                setStats({
                    users: users.length,
                    properties: props.length,
                    activeProperties: props.filter((p: any) => p.status === 'Approved').length
                });
            }
        } catch (e) {
            console.error("Failed to load stats");
        }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium uppercase">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24}/></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium uppercase">Total Properties</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.properties}</h3>
                </div>
                <div className="p-3 bg-green-50 text-brand-green rounded-lg"><Building size={24}/></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium uppercase">Active Listings</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProperties}</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={24}/></div>
            </div>
        </div>
      </div>
      
      {/* Placeholder for Chart or Recent Activity */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
          <p>Analytics charts will appear here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { Property } from '../../types';
import { Check, X, Search, Filter, Eye, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PropertyManagementProps {
  properties?: Property[]; // Optional, as we fetch internally now
  setProperties?: React.Dispatch<React.SetStateAction<Property[]>>;
}

const PropertyManagement: React.FC<PropertyManagementProps> = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // 1. Fetch Properties from Node.js Backend
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Use the admin endpoint we created in server.js
      const response = await fetch('http://localhost:5000/api/admin/properties');
      const data = await response.json();

      if (Array.isArray(data)) {
        const mapped = data.map((p: any) => ({
            ...p,
            id: p.id,
            // Parse images if they are strings (MySQL JSON)
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
            status: p.status,
            ownerId: p.owner_id,
            datePosted: p.created_at
        }));
        setProperties(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch properties", err);
      toast.error("Could not load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 2. Handle Status Update (Approve/Reject)
  const handleStatusUpdate = async (id: string | number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/properties/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Update failed");

      toast.success(`Property ${newStatus}`);
      fetchProperties(); // Refresh list
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading Properties...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Property Approvals</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Owner ID</th>
              <th className="px-6 py-4">Date Posted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={property.images?.[0] || 'https://via.placeholder.com/50'} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{property.title}</p>
                      <p className="text-gray-500 text-xs">{property.location}</p>
                      <p className="text-brand-green text-xs font-bold mt-0.5">₹ {property.price.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">
                  {String(property.ownerId).substring(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(property.datePosted).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    property.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    property.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Button */}
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" title="View Details">
                        <Eye size={18}/>
                    </button>

                    {property.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(property.id, 'Approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(property.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProperties.length === 0 && (
            <div className="p-8 text-center text-gray-500">No properties found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagement;
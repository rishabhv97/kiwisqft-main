import React, { useEffect, useState } from 'react';
import { Property } from '../../types';
import { Check, X, Search, Filter, Eye, Loader2, Trash2, MapPin, Home, IndianRupee, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // 1. Fetch Properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/properties');
      const data = await response.json();

      if (Array.isArray(data)) {
        const mapped = data.map((p: any) => ({
            ...p,
            id: p.id,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
            amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : [],
            status: p.status,
            ownerId: p.owner_id,
            datePosted: p.created_at
        }));
        setProperties(mapped);
      }
    } catch (err) {
      toast.error("Could not load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 2. Handle Actions
  const handleStatusUpdate = async (id: string | number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/properties/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error("Update failed");
      
      toast.success(`Property ${newStatus}`);
      fetchProperties();
      if(selectedProperty) setSelectedProperty(null); // Close modal if open
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string | number) => {
    if(!window.confirm("Are you sure you want to permanently DELETE this property?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/properties/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Delete failed");

      toast.success("Property deleted");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to delete property");
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      {/* --- PROPERTY DETAILS MODAL --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
                <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><XCircle size={24} className="text-gray-500"/></button>
            </div>
            
            <div className="p-6 space-y-6">
                {/* Images */}
                <div className="grid grid-cols-3 gap-2">
                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                        selectedProperty.images.map((img, idx) => (
                            <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} className="w-full h-32 object-cover rounded-lg border border-gray-100" />
                        ))
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Images</div>
                    )}
                </div>

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h2>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <MapPin size={16} /> {selectedProperty.location}, {selectedProperty.city}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                             <span className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-xs font-bold uppercase">{selectedProperty.type}</span>
                             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{selectedProperty.listingType}</span>
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedProperty.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedProperty.status}</span>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-3xl font-bold text-brand-green flex items-center md:justify-end gap-1">
                             <IndianRupee size={24}/> {selectedProperty.price.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm">₹ {Math.round(selectedProperty.price / (selectedProperty.area || 1)).toLocaleString()} / sq.ft</p>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedProperty.description}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border p-3 rounded-lg text-center">
                        <p className="text-gray-500 text-xs uppercase font-bold">Bedrooms</p>
                        <p className="text-xl font-bold text-gray-800">{selectedProperty.bedrooms}</p>
                    </div>
                    <div className="border p-3 rounded-lg text-center">
                        <p className="text-gray-500 text-xs uppercase font-bold">Bathrooms</p>
                        <p className="text-xl font-bold text-gray-800">{selectedProperty.bathrooms}</p>
                    </div>
                    <div className="border p-3 rounded-lg text-center">
                        <p className="text-gray-500 text-xs uppercase font-bold">Area</p>
                        <p className="text-xl font-bold text-gray-800">{selectedProperty.area} <span className="text-xs">sqft</span></p>
                    </div>
                    <div className="border p-3 rounded-lg text-center">
                         <p className="text-gray-500 text-xs uppercase font-bold">Furnishing</p>
                         <p className="text-sm font-bold text-gray-800 mt-1">{selectedProperty.furnishedStatus}</p>
                    </div>
                </div>

                {/* Amenities */}
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedProperty.amenities.map((am: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{am}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                {selectedProperty.status === 'Pending' && (
                    <>
                        <button onClick={() => handleStatusUpdate(selectedProperty.id, 'Rejected')} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-2">
                            <X size={18}/> Reject
                        </button>
                        <button onClick={() => handleStatusUpdate(selectedProperty.id, 'Approved')} className="px-4 py-2 bg-brand-green text-white hover:bg-emerald-800 rounded-lg font-bold flex items-center gap-2">
                            <Check size={18}/> Approve
                        </button>
                    </>
                )}
                <button onClick={() => setSelectedProperty(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-bold">
                    Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TABLE HEADER --- */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Property Approvals</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none appearance-none bg-white">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
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
                    <img src={property.images?.[0]?.startsWith('http') ? property.images[0] : `http://localhost:5000${property.images?.[0]}` || 'https://via.placeholder.com/50'} 
                      alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{property.title}</p>
                      <p className="text-gray-500 text-xs">{property.location}</p>
                      <p className="text-brand-green text-xs font-bold mt-0.5">₹ {property.price.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">{String(property.ownerId).substring(0, 8)}...</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(property.datePosted).toLocaleDateString()}</td>
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
                    
                    {/* View Details Button */}
                    <button onClick={() => setSelectedProperty(property)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Full Details">
                        <Eye size={18}/>
                    </button>

                    {/* Delete Button */}
                    <button onClick={() => handleDelete(property.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Property">
                        <Trash2 size={18}/>
                    </button>

                    {/* Approval Actions */}
                    {property.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(property.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => handleStatusUpdate(property.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject">
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
        {filteredProperties.length === 0 && <div className="p-8 text-center text-gray-500">No properties found.</div>}
      </div>
    </div>
  );
};

export default PropertyManagement;
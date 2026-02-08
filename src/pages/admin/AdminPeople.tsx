import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Search, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lead {
    id: number;
    buyer_name: string;
    buyer_phone: string;
    message: string;
    property_title: string;
    created_at: string;
}

const AdminPeople: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/leads');
        const data = await response.json();
        if (Array.isArray(data)) setLeads(data);
      } catch (err) {
        toast.error("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    l.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
    l.property_title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline"/> Loading Enquiries...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Property Enquiries</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-green outline-none"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="p-6 hover:bg-gray-50 transition">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{lead.buyer_name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12}/> {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                Property: {lead.property_title || 'Unknown ID: ' + lead.id}
              </span>
            </div>
            
            <div className="ml-14 space-y-2">
              <div className="flex gap-4 text-sm text-gray-600">
                 <span className="flex items-center gap-1"><Phone size={14}/> {lead.buyer_phone}</span>
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                "{lead.message}"
              </p>
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && <div className="p-8 text-center text-gray-500">No enquiries found.</div>}
      </div>
    </div>
  );
};

export default AdminPeople;
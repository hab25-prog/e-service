import { useState } from "react";
import {
  Users,
  Hammer,
  Search,
  MoreVertical,
  ShieldCheck,
  UserPlus,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Mail,
  Calendar,
} from "lucide-react";
import useAuth from "../context/useAuth";
import { useCustomers } from "../hook/useCustomers";
import { useTechnicians } from "../hook/useTechnicians";

function AdminDashboard() {
  const { role } = useAuth();
  const [view, setView] = useState("customers"); // 'customers' or 'technicians'
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: techniciansData,
    isLoading: techniciansLoading,
    error: techniciansError,
  } = useTechnicians();

  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useCustomers();

  // Stats Logic
  const stats = [
    {
      label: "Total Users",
      value:
        (customersData?.data?.length || 0) +
        (techniciansData?.data?.length || 0),
      icon: Users,
      trend: "+12%",
    },
    {
      label: "Active Technicians",
      value: techniciansData?.data?.length || 0,
      icon: Hammer,
      trend: "+5%",
    },
    {
      label: "Pending Verifications",
      value: "8",
      icon: ShieldCheck,
      color: "text-amber-500",
    },
  ];

  const currentData =
    view === "customers" ? customersData?.data : techniciansData?.data;
  const isLoading =
    view === "customers" ? customersLoading : techniciansLoading;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
            Console Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your marketplace ecosystem and users.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all">
          <UserPlus size={18} /> Add New User
        </button>
      </header>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#10B981] transition-all"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-[#0F172A]">
                {stat.value}
              </h3>
              {stat.trend && (
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                  <TrendingUp size={10} /> {stat.trend} from last month
                </span>
              )}
            </div>
            <div
              className={`p-4 rounded-2xl bg-slate-50 ${stat.color || "text-[#10B981]"} group-hover:bg-[#10B981] group-hover:text-white transition-colors`}
            >
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        {/* TABLE CONTROLS */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full lg:w-fit">
            <button
              onClick={() => setView("customers")}
              className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "customers" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Customers
            </button>
            <button
              onClick={() => setView("technicians")}
              className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "technicians" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Technicians
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-fit">
            <div className="relative flex-1 lg:w-80">
              <Search
                className="absolute left-4 top-3 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder={`Search ${view}...`}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none text-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                  User Identity
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                  Account Status
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                  Date Joined
                </th>
                {view === "technicians" && (
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                    Specialty
                  </th>
                )}
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading
                ? [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                : currentData?.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold text-xs">
                            {user.full_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#0F172A] text-sm">
                              {user.full_name}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Mail size={10} />{" "}
                              {user.email || "no-email@test.com"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${view === "technicians" ? "bg-emerald-100 text-[#10B981]" : "bg-blue-100 text-blue-600"}`}
                        >
                          {view === "technicians"
                            ? "Verified Pro"
                            : "Active Client"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 flex items-center gap-1 italic">
                          <Calendar size={12} />{" "}
                          {new Date().toLocaleDateString()}
                        </div>
                      </td>
                      {view === "technicians" && (
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-600">
                            Electrical & HVAC
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-[#0F172A] transition-colors">
                            <ArrowUpRight size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {!isLoading && currentData?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">
              No {view} records found in database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

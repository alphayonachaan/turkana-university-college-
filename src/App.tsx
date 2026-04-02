import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  CreditCard, 
  LayoutDashboard, 
  History, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Coffee,
  Printer,
  Home,
  Users,
  BarChart3,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn, formatCurrency } from './lib/utils';
import { MOCK_STUDENT, MOCK_TRANSACTIONS, MOCK_STUDENTS } from './store/mockData';
import { Student, Transaction } from './types';

// --- Shared Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg font-semibold',
    };
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

// --- Student Components ---

const SmartIDCard = ({ student }: { student: Student }) => {
  return (
    <motion.div 
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      className="relative w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 text-white shadow-2xl overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
      }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
        <CreditCard size={120} />
      </div>
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest opacity-80">University Smart ID</p>
            <h2 className="text-xl font-bold mt-1">Global Tech University</h2>
          </div>
          <div className="w-10 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
            <div className="w-6 h-4 border border-black/20 rounded-sm"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase opacity-70">Student Name</p>
            <p className="text-lg font-medium tracking-wide">{student.name}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase opacity-70">Student ID</p>
              <p className="font-mono tracking-widest">{student.studentId}</p>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded-sm">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.studentId}`} alt="QR Code" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActions = ({ onAction }: { onAction: (type: string) => void }) => {
  const actions = [
    { icon: <Coffee className="w-6 h-6" />, label: 'Meal', color: 'bg-orange-100 text-orange-600', type: 'meal' },
    { icon: <Home className="w-6 h-6" />, label: 'Hostel', color: 'bg-purple-100 text-purple-600', type: 'hostel' },
    { icon: <Printer className="w-6 h-6" />, label: 'Print', color: 'bg-blue-100 text-blue-600', type: 'printing' },
    { icon: <PlusCircle className="w-6 h-6" />, label: 'Top-up', color: 'bg-emerald-100 text-emerald-600', type: 'topup' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onAction(action.type)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className={cn('p-4 rounded-2xl transition-transform group-hover:scale-110', action.color)}>
            {action.icon}
          </div>
          <span className="text-xs font-medium text-slate-600">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

const TransactionItem = ({ tx }: { tx: Transaction }) => {
  const isDebit = tx.type === 'debit';
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          tx.category === 'meal' ? 'bg-orange-100' : 
          tx.category === 'hostel' ? 'bg-purple-100' :
          tx.category === 'printing' ? 'bg-blue-100' :
          'bg-emerald-100'
        )}>
          {tx.category === 'meal' && <Coffee className="w-5 h-5 text-orange-600" />}
          {tx.category === 'hostel' && <Home className="w-5 h-5 text-purple-600" />}
          {tx.category === 'printing' && <Printer className="w-5 h-5 text-blue-600" />}
          {tx.category === 'topup' && <PlusCircle className="w-5 h-5 text-emerald-600" />}
        </div>
        <div>
          <p className="font-medium text-slate-900">{tx.description}</p>
          <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      <p className={cn('font-semibold', isDebit ? 'text-slate-900' : 'text-emerald-600')}>
        {isDebit ? '-' : '+'}{formatCurrency(tx.amount)}
      </p>
    </div>
  );
};

// --- Admin Components ---

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={cn('p-3 rounded-xl', color)}>
        {icon}
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const chartData = [
    { name: 'Mon', amount: 450 },
    { name: 'Tue', amount: 680 },
    { name: 'Wed', amount: 520 },
    { name: 'Thu', amount: 940 },
    { name: 'Fri', amount: 810 },
    { name: 'Sat', amount: 320 },
    { name: 'Sun', amount: 210 },
  ];

  const pieData = [
    { name: 'Hostel', value: 4500 },
    { name: 'Meals', value: 3200 },
    { name: 'Printing', value: 1200 },
    { name: 'Other', value: 800 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$12,450.00" icon={<BarChart3 className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Total Students" value="2,450" icon={<Users className="w-6 h-6 text-purple-600" />} color="bg-purple-50" />
        <StatCard title="Daily Trans." value="142" icon={<History className="w-6 h-6 text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="System Health" value="99.9%" icon={<ShieldCheck className="w-6 h-6 text-orange-600" />} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview (Weekly)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue by Category</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-xs text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student or ID..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS.map((student, i) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">TX-9283{i}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                      Meal
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">$12.50</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">Today, 12:30 PM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<Student>(MOCK_STUDENT);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handlePayment = (type: string) => {
    let amount = 0;
    let description = '';
    
    switch(type) {
      case 'meal': amount = 8.50; description = 'Meal Purchase'; break;
      case 'printing': amount = 1.20; description = 'Printing Service'; break;
      case 'hostel': amount = 50.00; description = 'Hostel Utility Fee'; break;
      case 'topup': 
        const topupAmount = 50;
        setStudent(prev => ({ ...prev, balance: prev.balance + topupAmount }));
        const newTx: Transaction = {
          id: Date.now().toString(),
          type: 'credit',
          amount: topupAmount,
          category: 'topup',
          date: new Date().toISOString(),
          description: 'Balance Top-up'
        };
        setTransactions([newTx, ...transactions]);
        toast.success(`Successfully added ${formatCurrency(topupAmount)} to your account!`);
        return;
    }

    if (student.balance < amount) {
      toast.error('Insufficient balance!');
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      category: type as any,
      date: new Date().toISOString(),
      description
    };

    setStudent(prev => ({ ...prev, balance: prev.balance - amount }));
    setTransactions([newTx, ...transactions]);
    toast.success(`Payment of ${formatCurrency(amount)} successful!`);
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <CreditCard className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Smart ID System</h1>
          <p className="text-center text-slate-500 mb-8">Select your portal to continue</p>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setUserRole('student')}
              className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-slate-900">Student Portal</h3>
                <p className="text-sm text-slate-500">Pay bills, check balance, view ID</p>
              </div>
              <Users className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <button 
              onClick={() => setUserRole('admin')}
              className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-slate-900">Admin Dashboard</h3>
                <p className="text-sm text-slate-500">Manage students and system analytics</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </motion.div>
        <p className="mt-8 text-slate-400 text-sm">© 2024 University Smart ID System. All rights reserved.</p>
      </div>
    );
  }

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSidebarOpen(false);
      }}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
        activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
      )}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-center" richColors />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transition-transform lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900">SmartPay</span>
          </div>

          <nav className="flex-1 space-y-2">
            {userRole === 'student' ? (
              <>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
                <SidebarItem icon={History} label="Transactions" id="transactions" />
                <SidebarItem icon={CreditCard} label="Virtual ID" id="vid" />
                <SidebarItem icon={Settings} label="Settings" id="settings" />
              </>
            ) : (
              <>
                <SidebarItem icon={BarChart3} label="Overview" id="dashboard" />
                <SidebarItem icon={Users} label="Students" id="students" />
                <SidebarItem icon={History} label="All Activity" id="activity" />
                <SidebarItem icon={Settings} label="System Config" id="config" />
              </>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={() => setUserRole(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{userRole === 'student' ? student.name : 'Administrator'}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">{userRole === 'student' ? student.studentId : 'System Admin'}</span>
            </div>
            <img 
              src={userRole === 'student' ? student.avatar : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {userRole === 'student' ? (
            activeTab === 'dashboard' ? (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <SmartIDCard student={student} />
                  </div>
                  <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Available Balance</p>
                      <h2 className="text-5xl font-black text-slate-900 mb-6">{formatCurrency(student.balance)}</h2>
                      <QuickActions onAction={handlePayment} />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <Card>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 5).map(tx => (
                      <TransactionItem key={tx.id} tx={tx} />
                    ))}
                  </div>
                </Card>

                {/* Campus Features Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                    <img 
                      src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5ce9dfa7-7d01-474f-8760-0351ab327b37/campus-cafeteria-6398d159-1775110345298.webp" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      alt="Cafeteria"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h4 className="text-white font-bold text-lg">Main Cafeteria</h4>
                      <p className="text-white/80 text-sm">Grab a quick meal with your Smart ID</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                    <img 
                      src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5ce9dfa7-7d01-474f-8760-0351ab327b37/smart-id-card-656d95ec-1775110345146.webp" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      alt="Services"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h4 className="text-white font-bold text-lg">Library Services</h4>
                      <p className="text-white/80 text-sm">Printing and book rentals simplified</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'transactions' ? (
              <Card>
                 <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <p className="text-sm text-slate-500">View all your campus spending and top-ups</p>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {transactions.map(tx => (
                      <TransactionItem key={tx.id} tx={tx} />
                    ))}
                  </div>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Module Under Development</h3>
                <p className="text-slate-500">This feature will be available in the next update.</p>
              </div>
            )
          ) : (
            <AdminDashboard />
          )}
        </div>
      </main>
    </div>
  );
}
export type Transaction = {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  category: 'meal' | 'hostel' | 'printing' | 'topup' | 'other';
  date: string;
  description: string;
};

export type Student = {
  id: string;
  name: string;
  studentId: string;
  balance: number;
  email: string;
  avatar: string;
  cardStatus: 'active' | 'blocked';
};

export type AdminStats = {
  totalRevenue: number;
  totalStudents: number;
  totalTransactions: number;
  categoryStats: { name: string; value: number }[];
};
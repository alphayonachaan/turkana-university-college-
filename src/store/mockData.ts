import { Student, Transaction } from '../types';

export const MOCK_STUDENT: Student = {
  id: '1',
  name: 'Alex Johnson',
  studentId: 'STU-2024-001',
  balance: 450.50,
  email: 'alex.j@university.edu',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop',
  cardStatus: 'active',
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'debit', amount: 12.50, category: 'meal', date: '2024-05-20T12:30:00Z', description: 'Lunch at Main Cafeteria' },
  { id: '2', type: 'debit', amount: 5.00, category: 'printing', date: '2024-05-19T14:15:00Z', description: 'Library Printing - 50 pages' },
  { id: '3', type: 'credit', amount: 100.00, category: 'topup', date: '2024-05-18T09:00:00Z', description: 'Card Top-up - Mobile Banking' },
  { id: '4', type: 'debit', amount: 250.00, category: 'hostel', date: '2024-05-15T10:00:00Z', description: 'Hostel Maintenance Fee' },
  { id: '5', type: 'debit', amount: 8.75, category: 'meal', date: '2024-05-14T08:30:00Z', description: 'Breakfast - Cafe Blue' },
];

export const MOCK_STUDENTS: Student[] = [
  MOCK_STUDENT,
  { id: '2', name: 'Sarah Smith', studentId: 'STU-2024-002', balance: 120.00, email: 'sarah.s@university.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop', cardStatus: 'active' },
  { id: '3', name: 'James Wilson', studentId: 'STU-2024-003', balance: 15.20, email: 'j.wilson@university.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop', cardStatus: 'blocked' },
];
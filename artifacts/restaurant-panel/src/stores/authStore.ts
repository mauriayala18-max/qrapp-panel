import { create } from 'zustand';
import { Employee } from '../types';
import api from '../services/api';

interface AuthState {
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; employee: Employee }) => void;
  logout: () => void;
  switchBranch: (branchId: string) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  employee: null,
  token: null,
  isAuthenticated: false,
  
  login: ({ token, employee }) => {
    localStorage.setItem('qr_token', token);
    localStorage.setItem('qr_employee', JSON.stringify(employee));
    set({ token, employee, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('qr_token');
    localStorage.removeItem('qr_employee');
    set({ token: null, employee: null, isAuthenticated: false });
    window.location.href = '/login';
  },
  
  switchBranch: (branchId: string) => {
    set((state) => {
      if (!state.employee) return state;
      const updatedEmployee = { ...state.employee, active_branch_id: branchId };
      localStorage.setItem('qr_employee', JSON.stringify(updatedEmployee));
      
      // We would also make an API call to update active branch on the backend if required
      
      return { employee: updatedEmployee };
    });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('qr_token');
    const employeeStr = localStorage.getItem('qr_employee');
    
    if (token && employeeStr) {
      try {
        const employee = JSON.parse(employeeStr);
        set({ token, employee, isAuthenticated: true });
      } catch (e) {
        localStorage.removeItem('qr_token');
        localStorage.removeItem('qr_employee');
      }
    }
  }
}));

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeProfile from './pages/EmployeeProfile';
import DepartmentList from './pages/DepartmentList';
import Attendance from './pages/Attendance';
import LeaveApply from './pages/LeaveApply';
import LeaveApproval from './pages/LeaveApproval';
import LeaveHistory from './pages/LeaveHistory';
import LeaveBalance from './pages/LeaveBalance';
import UserManagement from './pages/UserManagement';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application Routes inside Dashboard Shell */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Employee Management */}
            <Route
              path="/employees"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                  <EmployeeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <EmployeeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <EmployeeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<EmployeeProfile />} />

            {/* Department Management */}
            <Route
              path="/departments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <DepartmentList />
                </ProtectedRoute>
              }
            />

            {/* Attendance Management */}
            <Route path="/attendance" element={<Attendance />} />

            {/* Leave Management */}
            <Route path="/leaves/apply" element={<LeaveApply />} />
            <Route path="/leaves/balance" element={<LeaveBalance />} />
            <Route path="/leaves/history" element={<LeaveHistory />} />
            <Route
              path="/leaves/approval"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                  <LeaveApproval />
                </ProtectedRoute>
              }
            />

            {/* User & Role Security */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Access Denied */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

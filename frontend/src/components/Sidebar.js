import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarPlus,
  Clock,
  CheckSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const Sidebar = () => {
  const { user, hasAnyRole } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: Users,
      roles: ['ADMIN', 'HR', 'MANAGER'],
    },
    {
      label: 'Departments',
      path: '/departments',
      icon: Building2,
      roles: ['ADMIN', 'HR'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: CalendarCheck,
      roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    },
    {
      label: 'Apply Leave',
      path: '/leaves/apply',
      icon: CalendarPlus,
      roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    },
    {
      label: 'Leave Balance',
      path: '/leaves/balance',
      icon: Clock,
      roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    },
    {
      label: 'Leave History',
      path: '/leaves/history',
      icon: UserCheck,
      roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    },
    {
      label: 'Leave Approvals',
      path: '/leaves/approval',
      icon: CheckSquare,
      roles: ['ADMIN', 'HR', 'MANAGER'],
    },
    {
      label: 'User Management',
      path: '/users',
      icon: ShieldCheck,
      roles: ['ADMIN'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => hasAnyRole(item.roles));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logoBadge}>EMS</div>
        <div>
          <h2 style={styles.brandTitle}>Enterprise EMS</h2>
          <span style={styles.brandSubtitle}>Human Capital Suite</span>
        </div>
      </div>

      <nav style={styles.nav}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <Icon size={18} style={styles.icon} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.userName}>{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}</div>
            <div style={styles.userRole}>
              {user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRight: '1px solid #334155',
  },
  brand: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #334155',
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--primary-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#ffffff',
  },
  brandTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-600)',
    color: '#ffffff',
  },
  icon: {
    flexShrink: 0,
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #334155',
    backgroundColor: '#0f172a',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    color: '#f8fafc',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#38bdf8',
    fontWeight: '500',
  },
};

export default Sidebar;

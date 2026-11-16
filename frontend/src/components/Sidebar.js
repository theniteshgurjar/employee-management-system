import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
        },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
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
      ],
    },
    {
      title: 'TIME & ATTENDANCE',
      items: [
        {
          label: 'Attendance Portal',
          path: '/attendance',
          icon: CalendarCheck,
          roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
        },
        {
          label: 'Apply for Leave',
          path: '/leaves/apply',
          icon: CalendarPlus,
          roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
        },
        {
          label: 'Leave Balances',
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
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          label: 'Leave Approvals',
          path: '/leaves/approval',
          icon: CheckSquare,
          roles: ['ADMIN', 'HR', 'MANAGER'],
        },
        {
          label: 'User & Roles',
          path: '/users',
          icon: ShieldCheck,
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <Link to="/" style={styles.brand}>
        <div style={styles.logoMark}>EMS</div>
        <div>
          <h2 style={styles.brandTitle}>Employee Management</h2>
          <span style={styles.brandSubtitle}>Workspace Console</span>
        </div>
      </Link>

      {/* Nav List with Sections */}
      <nav style={styles.nav}>
        {navSections.map((sec, sIdx) => {
          const visibleItems = sec.items.filter((item) => hasAnyRole(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} style={styles.sectionGroup}>
              <span style={styles.sectionHeader}>{sec.title}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {visibleItems.map((item) => {
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
                      <Icon size={17} style={styles.icon} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Identity */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={styles.userName}>
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </div>
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
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRight: '1px solid #1e293b',
  },
  brand: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #1e293b',
    textDecoration: 'none',
  },
  logoMark: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontWeight: 800,
    fontSize: '0.78rem',
    letterSpacing: '0.05em',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  brandTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    display: 'block',
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    padding: '0 10px 8px',
    textTransform: 'uppercase',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '6px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontWeight: 600,
  },
  icon: {
    flexShrink: 0,
  },
  footer: {
    padding: '16px 14px',
    borderTop: '1px solid #1e293b',
    backgroundColor: '#090d16',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#f8fafc',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '0.68rem',
    color: '#94a3b8',
    marginTop: '1px',
    textTransform: 'uppercase',
  },
};

export default Sidebar;

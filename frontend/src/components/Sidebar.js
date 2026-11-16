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
  Sparkles,
} from 'lucide-react';

const Sidebar = () => {
  const { user, hasAnyRole } = useAuth();

  const navSections = [
    {
      title: 'OVERVIEW',
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
      title: 'TIME & LEAVE',
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
      ],
    },
    {
      title: 'GOVERNANCE',
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
      <div style={styles.brand}>
        <div style={styles.logoBadge}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>Enterprise EMS</h2>
          <span style={styles.brandSubtitle}>Workforce Suite 2026</span>
        </div>
      </div>

      {/* Nav List with Sections */}
      <nav style={styles.nav}>
        {navSections.map((sec, sIdx) => {
          const visibleItems = sec.items.filter((item) => hasAnyRole(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} style={styles.sectionGroup}>
              <span style={styles.sectionHeader}>{sec.title}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                      <Icon size={18} style={styles.icon} />
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
    padding: '24px 22px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #1e293b',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--accent-600) 0%, var(--primary-600) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
  },
  brandTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.01em',
  },
  brandSubtitle: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  nav: {
    flex: 1,
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    overflowY: 'auto',
  },
  sectionGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#475569',
    letterSpacing: '0.08em',
    padding: '0 12px 6px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '9px 12px',
    borderRadius: '8px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontWeight: '600',
  },
  icon: {
    flexShrink: 0,
  },
  footer: {
    padding: '16px 18px',
    borderTop: '1px solid #1e293b',
    backgroundColor: '#090d16',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    border: '1.5px solid #64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#f8fafc',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '0.72rem',
    color: '#38bdf8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
};

export default Sidebar;

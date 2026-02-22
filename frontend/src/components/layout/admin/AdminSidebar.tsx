import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';

const NAV_ITEMS = [
  { label: 'Dashboard',     href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: 'Courses',       href: ROUTES.ADMIN.COURSES,   icon: BookOpen        },
  { label: 'Question Bank', href: ROUTES.ADMIN.QUESTIONS, icon: HelpCircle      },
  { label: 'Quizzes',       href: ROUTES.ADMIN.QUIZZES,   icon: ClipboardList   },
  { label: 'Batches',       href: ROUTES.ADMIN.BATCHES,   icon: Users           },
] as const;

export function AdminSidebar() {
  return (
    <aside className="w-60 border-r bg-card flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b">
        <span className="font-semibold text-lg">LMS Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t text-xs text-muted-foreground">
        Phase 1
      </div>
    </aside>
  );
}

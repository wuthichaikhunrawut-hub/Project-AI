import { Link, useLocation } from 'react-router-dom';
import { Mail, Clock, BarChart3 } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'สร้างบทสนทนา', icon: Mail },
    { path: '/history', label: 'ประวัติการใช้งาน', icon: Clock },
    { path: '/dashboard', label: 'แดชบอร์ด', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">
              AI ตอบอีเมล
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                    ${
                      isActive
                        ? 'bg-white/10 text-white shadow-inner border border-white/5'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

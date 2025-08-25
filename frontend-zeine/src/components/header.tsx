import { LogOut, Settings, UserCircle2Icon } from 'lucide-react';
import LogoApp from '../assets/logoApp.svg';
import { getUserFromToken } from '../lib/jwt';
import { LogoutButton } from './logoutButton';
import { NavLink } from './nav-link';
export function Header() {
  const user = getUserFromToken();
  return (
    <header className="flex h-190 flex-col items-center justify-between p-4">
      <div>
        <img alt="Logo do app" src={LogoApp} />
      </div>

      <nav className="flex flex-col items-center justify-center gap-3">
        <NavLink to={'/'}>
          <UserCircle2Icon className="h-6 w-6" />
        </NavLink>
        <NavLink to={'/settings'}>
          <Settings className="h-6 w-6" />
        </NavLink>
        <LogoutButton>
          <LogOut className="h-6 w-6" />
        </LogoutButton>
      </nav>

      <div>
        <p className="font-bold text-brand-content-muted text-xs">
          Logado como:
        </p>
        <span className="text-brand-content-body text-xs">
          {user?.email || 'E-mail não encontrado'}
        </span>
      </div>
    </header>
  );
}

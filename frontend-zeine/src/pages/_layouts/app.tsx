import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header';

export function AppLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-6 p-9">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid-cols-2">
      <div className="flex h-full flex-col border-foreground bg-white p-10">
        <h1 className="text-black text-lg">Logo</h1>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

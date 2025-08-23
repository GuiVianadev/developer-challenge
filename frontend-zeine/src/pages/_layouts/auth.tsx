import { Outlet } from 'react-router-dom';
import LogoSvg from '../../assets/logo.svg';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen grid-cols-2">
      <div className="flex h-full min-h-screen flex-2 flex-col border-foreground bg-[url(/src/assets/bg.png)] bg-cover bg-no-repeat p-10">
        <img alt="Logo Guard" className="h-8 w-32" src={LogoSvg} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export type LogoutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function LogoutButton(props: LogoutButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    queryClient.clear();

    localStorage.removeItem('authToken');
    navigate('/sign-in', { replace: true });
  }

  return (
    <button
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-brand-background-secondary text-brand-content-muted hover:bg-brand-background-tertiary"
      onClick={handleLogout}
      type="button"
      {...props}
    />
  );
}

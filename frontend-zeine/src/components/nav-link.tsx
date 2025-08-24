import { Link, type LinkProps, useLocation } from 'react-router';

export type NavLinkProps = LinkProps;

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation();
  return (
    <Link
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-background-secondary text-brand-content-muted hover:bg-brand-background-tertiary data-[current=true]:bg-brand-background-tertiary data-[current=true]:text-brand-accent-brand"
      data-current={pathname === props.to}
      {...props}
    />
  );
}

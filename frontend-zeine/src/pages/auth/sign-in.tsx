import { Link } from 'react-router-dom';

export function SignIn() {
  return (
    <div>
      <div className="text-white">SignIn</div>
      <Link to={'/auth/sign-up'}>Fazer Registro</Link>
    </div>
  );
}

import { Link } from 'react-router-dom';

export function SignUp() {
  return (
    <div>
      <div className="text-white">SignUp</div>
      <Link to={'/auth/sign-in'}>Fazer Login</Link>
    </div>
  );
}

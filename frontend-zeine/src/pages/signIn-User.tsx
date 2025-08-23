import { Link } from 'react-router-dom';

export function SignIn() {
  return (
    <div>
      <div>SignIn</div>
      <Link to={'/register'}>Fazer Registro</Link>
    </div>
  );
}

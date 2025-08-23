import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterUser } from './pages/register-user';
import { SignIn } from './pages/signIn-User';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SignIn />} index />
        <Route element={<RegisterUser />} path={'/register'} />
      </Routes>
    </BrowserRouter>
  );
}

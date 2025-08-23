import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterUser } from './pages/register-user';
import { SignIn } from './pages/signIn-User';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<SignIn />} index />
          <Route element={<RegisterUser />} path={'/register'} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

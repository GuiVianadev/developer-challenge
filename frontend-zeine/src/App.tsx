import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { SignIn } from './pages/auth/sign-in';
import { SignUp } from './pages/auth/sign-up';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />} index />
          <Route element={<AuthLayout />} path={'/auth'}>
            <Route element={<SignIn />} path="sign-in" />
            <Route element={<SignUp />} path="sign-up" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

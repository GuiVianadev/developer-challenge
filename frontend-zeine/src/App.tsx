import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { NotFound } from './pages/404';
import { Contacts } from './pages/app/contacts/contacts';
import { Settings } from './pages/app/settings';
import { SignIn } from './pages/auth/sign-in';
import { SignUp } from './pages/auth/sign-up';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />} path="/">
            <Route element={<Contacts />} index />
            <Route element={<Settings />} path="/settings" />
          </Route>

          <Route element={<AuthLayout />}>
            <Route element={<SignIn />} path="/sign-in" />
            <Route element={<SignUp />} path="/sign-up" />
          </Route>
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

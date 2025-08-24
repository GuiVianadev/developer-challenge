// @/lib/jwt.ts
const MILLISECONDS_IN_SECOND = 1000;

export const getUserFromToken = () => {
  const token = localStorage.getItem('authToken'); // ← Mudança aqui

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const isExpired = payload.exp * MILLISECONDS_IN_SECOND < Date.now();

    if (isExpired) {
      localStorage.removeItem('authToken'); // ← E aqui
      return null;
    }

    return { email: payload.sub };
  } catch {
    return null;
  }
};

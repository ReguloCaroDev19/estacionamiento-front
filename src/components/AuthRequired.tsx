import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AuthRequired = () => {
  const userLogged = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLogged) {
      navigate('/');
    }
  }, [navigate, userLogged]);

  return <Outlet />;
};

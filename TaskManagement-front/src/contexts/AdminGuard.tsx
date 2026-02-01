import useAuth from '../hooks/useAuth';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  //if (user?.role.is_admin !== false ) return null; // O no devuelve nada
  if (!user?.is_leader && user?.role?.is_admin) return null; // O no devuelve nada
  
  return <>{children}</>;
};

export default AdminGuard;
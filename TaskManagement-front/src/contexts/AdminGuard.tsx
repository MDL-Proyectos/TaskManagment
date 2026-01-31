import useAuth from '../hooks/useAuth';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  //console.log('AdminGuard - User Role:', user?.role.is_admin);
  if (user?.role.is_admin !== false) return null; // O no devuelve nada
  
  return <>{children}</>;
};

export default AdminGuard;
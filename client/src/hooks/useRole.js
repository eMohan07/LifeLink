import { useAuth } from './useAuth';

export const useRole = () => {
  const { user, role } = useAuth();
  return {
    role,
    isDonor: role === 'donor',
    isRecipient: role === 'recipient',
    isHospital: role === 'hospital',
    isAdmin: role === 'admin',
  };
};

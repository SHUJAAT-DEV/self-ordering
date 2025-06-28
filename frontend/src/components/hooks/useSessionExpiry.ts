
import { useEffect, useState } from 'react';
import authUser from '../../utils/authUser';

function useSessionExpiry() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const jwtToken = authUser.getJWTToken();
  useEffect(() => {
    if (!jwtToken) {
      setIsAuthenticated(false);
    }
  }, [jwtToken]);

  return isAuthenticated;
}

export default useSessionExpiry;

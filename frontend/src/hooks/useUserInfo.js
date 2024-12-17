import { useState, useEffect } from 'react';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({ role: '', id: '', asignatura_id: null });

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, []);

  return userInfo;
};

export default useUserInfo; 
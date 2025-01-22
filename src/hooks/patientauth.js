// src/hooks/patientauth.js 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const patientData = localStorage.getItem('patientData');
    console.log(patientData,'daa');
    
    
    if (!token || !patientData) {
      router.push('/patientlogin'); // Redirect to login page if token or patient data is missing
    }
  }, [router]);
};

export default useAuth;

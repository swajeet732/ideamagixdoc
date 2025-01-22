import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const doctorAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const doctorId = localStorage.getItem('doctorId'); // Get the doctorId from localStorage

    // Log to verify
    console.log(doctorId, 'doctor ID');

    if (!token || !doctorId) {
      router.push('/doctorlogin'); // Redirect to login if token or doctorId is missing
    }
  }, [router]);
};

export default doctorAuth;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';


// Import Pages
import Navbar from '../components/common/Navbar';
import Hero from '../components/LandingPage/Hero'
import { HowItWorks, Features, ImpactSection, CtaSection, ProofSection } from '../components/LandingPage/LandingSections';
import Footer from '../components/Footer/Footer';


const LandingPage = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Landing Page");
    if(user){
      navigate(`/user/${user.role}`);
    }
  }, [navigate, user]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      document.documentElement.classList.add('scroll-smooth');
    }

    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="site"><Navbar className="siteNav" /><main><Hero /><ProofSection /><HowItWorks /><Features /><ImpactSection /><CtaSection /></main><Footer /></div>
  );
};

export default LandingPage;

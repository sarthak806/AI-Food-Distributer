import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Define props type
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, isLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const dashboardUrl = `/user/${user?.role || 'Donar'}`;

  return (
    <header className={cn('sticky top-0 z-20 border-b border-[#dce5dd] bg-[#f7faf5]/95 backdrop-blur', className)}>
      <div className='mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 md:px-12'>
      <Link className='flex items-center gap-2 font-bold text-[#14231d]' to='/'><span className='grid h-8 w-8 place-items-center rounded-full bg-[#17633b] text-white'>♥</span><span>Share<span className='text-[#17633b]'>Bite</span></span></Link>
      <nav className='hidden gap-8 text-sm text-[#718078] md:flex'>
        <a className='transition hover:text-[#17633b]' href='#home'>Home</a><a className='transition hover:text-[#17633b]' href='#how-it-works'>How it works</a><a className='transition hover:text-[#17633b]' href='#features'>Features</a><a className='transition hover:text-[#17633b]' href='#impact'>Impact</a>
      </nav>
      <div className='hidden items-center gap-5 md:flex'>
        {!isLogin ? <><Link className='font-bold text-[#124c2d] transition hover:text-[#17633b]' to='/user/login'>Log in</Link><Link className='inline-flex items-center gap-2 rounded-full bg-[#17633b] px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-1 hover:bg-[#22784a]' to='/user/login'>Get started <span>→</span></Link></> : <Link to={dashboardUrl} className='font-bold text-[#124c2d]'>Dashboard</Link>}
      </div>
      <div className='md:hidden'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' aria-label='Open menu'>☰</Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-6'>
              <ul className='flex flex-col gap-4 text-lg font-medium text-gray-700'>
                <Link to='/' onClick={() => setIsOpen(false)} className='hover:text-primary transition'><li>Home</li></Link>
                <Link to='/why-us' onClick={() => setIsOpen(false)} className='hover:text-primary transition'><li>Why Us</li></Link>
                <Link to='/features' onClick={() => setIsOpen(false)} className='hover:text-primary transition'><li>Feature</li></Link>
                <Link to='/faq' onClick={() => setIsOpen(false)} className='hover:text-primary transition'><li>FAQ</li></Link>
              </ul>
              {!isLogin ? (
                <Link to='/user/login' onClick={() => setIsOpen(false)}>
                  <Button variant='default' className='mt-4 w-full'>
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Link to={dashboardUrl} onClick={() => setIsOpen(false)}>
                  <div className='mt-4 flex items-center gap-2'>
                    <img 
                      src={user?.profileImage || `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`} 
                      alt='user' 
                      className='w-[40px] h-[40px] rounded-full border-2 border-gray-300 object-cover' 
                    />
                    <span className="font-medium text-gray-800">{user?.name || 'My Dashboard'}</span>
                  </div>
                </Link>
              )}
            </SheetContent>
          </Sheet>
      </div></div>
    </header>
  );
};

export default Navbar;

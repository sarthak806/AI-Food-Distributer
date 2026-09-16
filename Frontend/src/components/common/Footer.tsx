import React from 'react';
import { Leaf } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#ddd6c6] bg-white py-7 text-[#10261b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
        {/* Grid Layout */}
        <div className="flex items-start gap-2">
          {/* About Section */}
          <div>
            <h3 className="font-serif text-lg font-bold"><Leaf className="mr-1 inline h-5 w-5 rounded-full bg-[#00602d] p-1 text-white" />SharePlate</h3>
            <p className="mt-2 max-w-[240px] text-sm leading-5 text-[#536258]">
              A student-built idea for a more thoughtful food system.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="ml-auto flex items-center gap-5 text-sm text-[#536258]">
            <a href="#how-it-works">How it works</a><a href="#features">Our impact</a><a href="#faq">FAQ</a><a href="/user/login" className="font-bold text-[#00602d]">Join us</a>
          </div>
          
          {/* Social Media */}
        </div>
        
        {/* Copyright */}
        <div className="border-t border-[#ddd6c6] pt-4 text-center text-xs text-[#536258]">
          Made with care for communities and the planet.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
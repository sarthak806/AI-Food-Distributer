import { landingIcons } from "../LandingPage/landingIcons";

const Footer = () => <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#123d2c] bg-[#123d2c] px-5 py-8 text-xs text-[#d9e8dc] md:px-20"><a className="flex items-center gap-2 font-bold" href="#home"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#d9e8dc] text-[#123d2c]">{landingIcons.heart}</span><span>Share<span className="text-[#a9d69c]">Bite</span></span></a><p>Smart redistribution for a less wasteful world.</p><span>© 2026 ShareBite</span></footer>;

export default Footer;
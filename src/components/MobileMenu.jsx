import React from "react";

const MobileMenu = ({ isOpen, navLinks, activeLink, onLinkClick }) => {
  if (!isOpen) return null;

  return (
    <nav
      id="mobile-menu"
      className="flex flex-col items-center py-[20px] bg-white border-b-[1px] border-[#E8E9ED] max-lg:block lg:hidden"
      aria-label="Mobile navigation"
    >
      {navLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => onLinkClick(link.id)}
          className={`w-full py-[12px] text-[16px] font-bold text-center ${
            activeLink === link.id ? "text-[#EB5148]" : "text-[#383A47]"
          }`}
          aria-current={activeLink === link.id ? "page" : undefined}
        >
          {link.label}
        </button>
      ))}

      <div className="flex flex-col gap-[12px] w-full px-[20px] mt-[12px]">
        <button
          className="w-full py-[14px] text-[16px] font-bold text-[#EB5148] border-[1.5px] border-[#E8E9ED] rounded-[12px]"
          aria-label="Log in"
        >
          Log In
        </button>
        <button
          className="w-full py-[14px] text-[16px] font-bold text-white bg-[#EB5148] rounded-[12px]"
          aria-label="Sign up"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default MobileMenu;

"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SignedIn, SignedOut, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { TicketPlus } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export function NavbarDemo2() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "movies",
      link: "/movies",
    },
    {
      name: "Theater",
      link: "/theater",
    },
    {
      name: "Releases",
      link: "/",
    },
    {
      name: "Favorites",
      link: "/favorite",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {user}=useUser();
  const {openSignIn}= useClerk();
  const clerk = useClerk();
  const navigate=useNavigate();
  
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />

          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">search</NavbarButton>
            {/* {
              !user ? (
                <NavbarButton onClick={openSignIn} variant="primary">Login</NavbarButton>
              ) 
              : (
                <UserButton />
              )
            } */}
            <SignedOut> 
              <NavbarButton onClick={() => clerk.openSignIn({})} variant="primary">Login</NavbarButton>
            </SignedOut>

            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                   <UserButton.Action  label="My Bookings" labelIcon={<TicketPlus width={15} />} onClick={()=> navigate('/my-bookings')} />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full">
                search
              </NavbarButton>
              <SignedOut>
                <NavbarButton onClick={() => { clerk.openSignIn({}); setIsMobileMenuOpen(false); }} variant="primary" className="w-full">Login</NavbarButton>
              </SignedOut>
              <SignedIn>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15} />} onClick={() => { navigate('/my-bookings'); setIsMobileMenuOpen(false); }} />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <DummyContent />
      {/* Navbar */}
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
    
    </>
  );
};

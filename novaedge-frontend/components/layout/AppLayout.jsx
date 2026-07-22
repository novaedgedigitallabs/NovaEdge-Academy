"use client";

export default function AppLayout({ children, className }) {
    // Persistent ShellLayout in RootLayout (app/layout.tsx) already maintains 
    // LeftSidebar, RightSidebar, and MobileNav across all SPA page navigations!
    // AppLayout passes children through cleanly to prevent unmounting/remounting sidebars.
    return (
        <div className={className}>
            {children}
        </div>
    );
}

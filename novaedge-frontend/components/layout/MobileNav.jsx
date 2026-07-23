"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, PenSquare, UserPlus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreatePost from "@/components/post/CreatePost";

const navLinks = [
  { icon: Home, route: "/", label: "Home" },
  { icon: BookOpen, route: "/courses", label: "Courses" },
  { icon: PenSquare, route: "post_action", label: "Post", isAction: true },
  { icon: UserPlus, route: "/network", label: "Network" },
  { icon: User, route: "/profile", label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isPostOpen, setIsPostOpen] = useState(false);

  return (
    <>
      <section className="fixed bottom-0 z-40 w-full border-t border-border bg-background/90 backdrop-blur-md md:hidden shadow-lg">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navLinks.map((link) => {
            if (link.isAction) {
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => setIsPostOpen(true)}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-background transition-transform active:scale-95">
                    <PenSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-primary mt-0.5">{link.label}</span>
                </button>
              );
            }

            const isActive =
              link.route === "/"
                ? pathname === "/"
                : pathname.startsWith(link.route);

            const Icon = link.icon;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-1.5 transition-colors rounded-xl min-w-[54px]",
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
                <span className="text-[10px] leading-tight font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mobile Create Post Modal */}
      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent className="sm:max-w-lg p-0 bg-background border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <span className="text-sm font-bold flex items-center gap-2">
              <PenSquare className="w-4 h-4 text-primary" /> Create a Post
            </span>
          </div>
          <div className="p-2">
            <CreatePost onPostCreated={() => setIsPostOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

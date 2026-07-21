import Link from "next/link";
import Image from "next/image";
import { Clock, Star, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/services/wishlist";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function CourseCard({ course }) {
  const courseId = course._id || course.id;
  const { user } = useAuth();
  // Ideally we check if it's in user.wishlist but for now we just toggle locally or fetch initial state
  // Since we don't pass full user object here or wishlist state, we might need a context or just optimistic UI
  // For simplicity, we won't show "filled" heart initially unless we have that data. 
  // But let's assume we want to show it. 
  // A better approach is to pass `isWishlisted` prop.
  // For now, I'll just implement the toggle action.
  const [isWishlisted, setIsWishlisted] = useState(false); // Placeholder state

  if (!courseId) return null;

  const handleWishlist = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save courses");
      return;
    }

    try {
      setIsWishlisted(!isWishlisted); // Optimistic
      const res = await toggleWishlist(courseId);
      toast.success(res.message);
      setIsWishlisted(res.isAdded);
    } catch (err) {
      setIsWishlisted(!isWishlisted); // Revert
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <Link href={`/courses/${courseId}`} className="group h-full relative block">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur transition-colors"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={
              (course.poster?.url && (course.poster.url.startsWith('/') || course.poster.url.startsWith('http')))
                ? course.poster.url
                : (course.image && (course.image.startsWith('/') || course.image.startsWith('http')))
                  ? course.image
                  : "/placeholder.svg"
            }
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground hover:bg-background backdrop-blur">
            {course.category}
          </Badge>
        </div>
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Users className="h-3.5 w-3.5" />
              <span>{course.students}</span>
            </div>
          </div>
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
        </CardHeader>
        <CardContent className="p-5 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            By <span className="text-foreground">{course.instructor}</span>
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 bg-muted/20 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-3">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="text-lg font-bold text-primary">${course.price}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}

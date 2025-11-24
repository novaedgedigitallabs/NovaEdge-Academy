import Link from "next/link";
import Image from "next/image";
import { Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function CourseCard({ course }) {
  const courseId = course._id || course.id;
  return (
    <Link href={`/courses/${courseId}`} className="group h-full">
      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={course.image || "/placeholder.svg"}
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

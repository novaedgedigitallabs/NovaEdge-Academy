import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function BadgeCard({ badge, earned = false, awardedAt }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className={`w-24 h-32 flex flex-col items-center justify-center p-2 text-center transition-all ${earned ? "border-primary bg-primary/10" : "opacity-50 grayscale"}`}>
                        <div className="w-12 h-12 mb-2 relative">
                            <img src={badge.iconUrl || "/placeholder-badge.svg"} alt={badge.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="text-xs font-bold line-clamp-2">{badge.name}</div>
                        {earned && awardedAt && (
                            <div className="text-[10px] text-muted-foreground mt-1">
                                {new Date(awardedAt).toLocaleDateString()}
                            </div>
                        )}
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-sm font-bold">{badge.name}</div>
                    <div className="text-xs">{badge.description}</div>
                    <div className="text-xs mt-1 text-muted-foreground">Tier: {badge.tier}</div>
                    {!earned && <div className="text-xs mt-1 italic">Not earned yet</div>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

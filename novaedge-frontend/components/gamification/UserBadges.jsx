"use client";

import { useState, useEffect } from "react";
import { getMyBadges, getBadges } from "@/services/badges";
import BadgeCard from "./BadgeCard";
import { Loader2 } from "lucide-react";

export default function UserBadges() {
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [allBadges, setAllBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [earnedRes, allRes] = await Promise.all([
                    getMyBadges(),
                    getBadges()
                ]);
                setEarnedBadges(earnedRes.data);
                setAllBadges(allRes.data);
            } catch (error) {
                console.error("Failed to fetch badges", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;

    // Create a map of earned badge IDs for quick lookup
    const earnedMap = new Map(earnedBadges.map(ub => [ub.badge._id, ub]));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <div className="flex flex-wrap gap-4">
                {allBadges.map(badge => {
                    const userBadge = earnedMap.get(badge._id);
                    return (
                        <BadgeCard
                            key={badge._id}
                            badge={badge}
                            earned={!!userBadge}
                            awardedAt={userBadge?.awardedAt}
                        />
                    );
                })}
            </div>
        </div>
    );
}

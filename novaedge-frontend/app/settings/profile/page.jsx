"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { apiPut } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Mail, Phone, AtSign, FileText, CheckCircle, Upload, Camera, Github, Linkedin, Globe, Twitter, Link as LinkIcon, LogOut, MapPin } from "lucide-react";
import CityPicker from "@/components/ui/CityPicker";
import { toast } from "sonner";

export default function EditProfilePage() {
    const { user, setUser, logout } = useAuth();
    const fileInputRef = useRef(null);
    const coverFileInputRef = useRef(null);
    
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    
    // Social & Profile links
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [twitter, setTwitter] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setUsername(user.username || "");
            setEmail(user.email || "");
            setPhoneNumber(user.phoneNumber || "");
            setBio(user.bio || "");
            setLocation(user.location || null);
            setAvatarUrl(user.avatar?.url || "");
            setCoverUrl(user.coverImage?.url || "");

            if (user.socialLinks) {
                setGithub(user.socialLinks.github || "");
                setLinkedin(user.socialLinks.linkedin || "");
                setPortfolio(user.socialLinks.portfolio || "");
                setTwitter(user.socialLinks.twitter || "");
            }
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Avatar image size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
                toast.success("Avatar preview loaded! Click 'Save Changes' to update.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 8 * 1024 * 1024) {
                toast.error("Cover image size should be less than 8MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverUrl(reader.result);
                toast.success("Cover banner preview loaded! Click 'Save Changes' to update.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Name and Email are required");
            return;
        }

        setSaving(true);
        try {
            const updatePayload = {
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                bio: bio.trim(),
                location: location || null,
                socialLinks: {
                    github: github.trim(),
                    linkedin: linkedin.trim(),
                    portfolio: portfolio.trim(),
                    twitter: twitter.trim(),
                },
            };

            // If user provided a new base64 or URL for avatar
            if (avatarUrl && avatarUrl !== user?.avatar?.url) {
                updatePayload.avatar = avatarUrl;
            }

            // If user provided a new base64 or URL for cover
            if (coverUrl && coverUrl !== user?.coverImage?.url) {
                updatePayload.coverImage = coverUrl;
            }

            const res = await apiPut("/api/v1/me/update", updatePayload);

            if (res.success) {
                toast.success("Profile updated successfully!");
                if (setUser && res.user) {
                    setUser(res.user);
                }
            } else {
                toast.error(res.message || "Failed to update profile");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl shadow-xl">
            <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5 text-primary" />
                    Edit Profile
                </CardTitle>
                <CardDescription className="text-xs">
                    Update your public profile details, social links, and personal information.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload / URL Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-border/40 pb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar className="w-24 h-24 border-2 border-primary/30 shadow-md">
                                <AvatarImage src={avatarUrl || user.avatar?.url} alt={name} />
                                <AvatarFallback className="text-3xl font-bold bg-primary/15 text-primary">
                                    {name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded-full text-xs font-semibold flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Image File
                                </Button>
                                <span className="text-xs text-muted-foreground">or paste URL below</span>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="avatarUrl" className="text-xs font-semibold text-foreground">
                                    Avatar Image URL
                                </Label>
                                <Input
                                    id="avatarUrl"
                                    type="text"
                                    placeholder="https://example.com/my-photo.jpg"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="text-xs bg-secondary/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover Banner Image Section */}
                    <div className="space-y-4 border-b border-border/40 pb-6">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-primary" /> Profile Cover Banner Image
                        </Label>

                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/60 bg-muted group cursor-pointer" onClick={() => coverFileInputRef.current?.click()}>
                            {coverUrl ? (
                                <img src={coverUrl} alt="Cover Banner Preview" className="w-full h-full object-cover object-center" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground font-medium">Click to select cover banner image</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button type="button" variant="secondary" size="sm" className="rounded-full text-xs font-semibold gap-2">
                                    <Camera className="w-4 h-4" /> Change Cover Banner
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input
                                type="file"
                                ref={coverFileInputRef}
                                onChange={handleCoverFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => coverFileInputRef.current?.click()}
                                className="rounded-full text-xs font-semibold flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Upload Cover File
                            </Button>

                            <Input
                                id="coverUrl"
                                type="text"
                                placeholder="Or paste cover image URL: https://example.com/banner.jpg"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                className="text-xs bg-secondary/30 flex-1"
                            />
                        </div>
                    </div>

                    {/* Name & Username */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-primary" /> Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-secondary/30 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="username" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <AtSign className="w-3.5 h-3.5 text-primary" /> Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-secondary/30 text-sm"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-secondary/30 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="bg-secondary/30 text-sm"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                        <Label htmlFor="bio" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-primary" /> Bio / About You
                        </Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            placeholder="Tell the community about yourself, your learning goals, and background..."
                            className="bg-secondary/30 text-sm resize-none"
                        />
                    </div>

                    {/* Location / City Selection powered by @novaedgedigitallabs/citykit */}
                    <div className="space-y-2 border-t border-border/40 pt-5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="city" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary" /> Location / City (Powered by CityKit)
                            </Label>
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                @novaedgedigitallabs/citykit
                            </span>
                        </div>
                        
                        <CityPicker
                            selectedValue={location}
                            onSelectCity={(cityData) => setLocation(cityData)}
                            placeholder="Type to search 49,900+ verified global cities (e.g. Bhopal, New Delhi)..."
                        />

                        {location && (location.city || location.formatted) && (
                            <div className="mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">📍</span>
                                    <div>
                                        <p className="font-bold text-foreground">{location.formatted || `${location.city}, ${location.country}`}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {location.state ? `${location.state} • ` : ""}{location.countryCode ? `${location.countryCode} • ` : ""}{location.timezone || "Global"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setLocation(null)}
                                    className="h-7 text-[10px] text-destructive hover:text-destructive"
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Social & Web Links */}
                    <div className="space-y-4 border-t border-border/40 pt-6">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-primary" /> Social & Portfolio Links
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Add links to your public profiles and portfolio so others can connect with you.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* GitHub */}
                            <div className="space-y-1.5">
                                <Label htmlFor="github" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Github className="w-3.5 h-3.5 text-primary" /> GitHub Profile URL
                                </Label>
                                <Input
                                    id="github"
                                    type="url"
                                    placeholder="https://github.com/yourname"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className="bg-secondary/30 text-xs"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="space-y-1.5">
                                <Label htmlFor="linkedin" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Linkedin className="w-3.5 h-3.5 text-primary" /> LinkedIn Profile URL
                                </Label>
                                <Input
                                    id="linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourname"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    className="bg-secondary/30 text-xs"
                                />
                            </div>

                            {/* Portfolio Website */}
                            <div className="space-y-1.5">
                                <Label htmlFor="portfolio" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-primary" /> Portfolio / Personal Website
                                </Label>
                                <Input
                                    id="portfolio"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={portfolio}
                                    onChange={(e) => setPortfolio(e.target.value)}
                                    className="bg-secondary/30 text-xs"
                                />
                            </div>

                            {/* Twitter / X */}
                            <div className="space-y-1.5">
                                <Label htmlFor="twitter" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Twitter className="w-3.5 h-3.5 text-primary" /> Twitter / X Profile URL
                                </Label>
                                <Input
                                    id="twitter"
                                    type="url"
                                    placeholder="https://x.com/yourhandle"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    className="bg-secondary/30 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Logout Account Section */}
                <div className="border-t border-border/40 pt-6 mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                        <div>
                            <h4 className="text-sm font-bold text-destructive flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Log Out of Account
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Sign out of your current session on this browser.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={logout}
                            className="rounded-full text-xs font-semibold px-5 shadow-sm cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 mr-1.5" />
                            Log Out Now
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

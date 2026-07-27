"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, ShieldCheck } from "lucide-react";

export default function CertificateTemplate({
    recipientName = "Your Name Here",
    courseTitle = "ADVANCED FULL STACK WEB DEVELOPMENT",
    issueDate = "May 20, 2025",
    certificateId = "NEA-2025-05-0001",
    signatoryName = "Amit Kumar Raikwar",
    signatorySignatureText = "Amit Raikwar",
    signatoryRole = "FOUNDER & CEO",
    organization = "NovaEdge Digital Labs",
    verificationUrl = "",
    className = ""
}) {
    // Format issue date nicely if passed as JS Date or ISO string
    const formattedDate = React.useMemo(() => {
        if (!issueDate) return "May 20, 2025";
        try {
            const d = new Date(issueDate);
            if (isNaN(d.getTime())) return issueDate;
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        } catch (e) {
            return issueDate;
        }
    }, [issueDate]);

    // Fallback QR code verification URL
    const qrUrl = verificationUrl || (typeof window !== "undefined" ? `${window.location.origin}/verify/${certificateId}` : `https://novaedge.in/verify/${certificateId}`);

    return (
        <div
            id="certificate-print-area"
            className={`relative w-full aspect-[1.414/1] bg-[#FAF8F5] text-[#221042] rounded-sm overflow-hidden select-none shadow-2xl flex flex-col justify-between p-7 sm:p-10 md:p-14 lg:p-16 border border-[#EBE3D5] ${className}`}
            style={{
                fontFamily: "'Montserrat', sans-serif"
            }}
        >
            {/* SVG Ornamental Frame Overlay */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 707"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Intricate Purple Guilloche Pattern */}
                    <pattern
                        id="guilloche-pattern"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 0 15 C 7.5 0, 22.5 30, 30 15"
                            fill="none"
                            stroke="#3A1E66"
                            strokeWidth="1.2"
                            opacity="0.85"
                        />
                        <path
                            d="M 0 15 C 7.5 30, 22.5 0, 30 15"
                            fill="none"
                            stroke="#3A1E66"
                            strokeWidth="1.2"
                            opacity="0.85"
                        />
                        <path
                            d="M 0 7.5 C 7.5 22.5, 22.5 -7.5, 30 7.5"
                            fill="none"
                            stroke="#54338A"
                            strokeWidth="0.8"
                            opacity="0.6"
                        />
                        <path
                            d="M 0 22.5 C 7.5 37.5, 22.5 7.5, 30 22.5"
                            fill="none"
                            stroke="#54338A"
                            strokeWidth="0.8"
                            opacity="0.6"
                        />
                        <path
                            d="M 0 0 L 30 30 M 0 30 L 30 0"
                            fill="none"
                            stroke="#261047"
                            strokeWidth="0.4"
                            opacity="0.3"
                        />
                    </pattern>

                    {/* Gradient for Flourishes */}
                    <linearGradient id="purple-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2A144E" />
                        <stop offset="50%" stopColor="#5A398E" />
                        <stop offset="100%" stopColor="#2A144E" />
                    </linearGradient>
                </defs>

                {/* 1. Outer Guilloche Border Frame Band */}
                <rect
                    x="14"
                    y="14"
                    width="972"
                    height="679"
                    fill="url(#guilloche-pattern)"
                    stroke="#261148"
                    strokeWidth="2.5"
                />
                {/* Inner border line of guilloche band */}
                <rect
                    x="38"
                    y="38"
                    width="924"
                    height="631"
                    fill="none"
                    stroke="#261148"
                    strokeWidth="2"
                />

                {/* 2. Double Inner Fine Border Lines */}
                <rect
                    x="48"
                    y="48"
                    width="904"
                    height="611"
                    fill="none"
                    stroke="#381D63"
                    strokeWidth="1.5"
                />
                <rect
                    x="52"
                    y="52"
                    width="896"
                    height="603"
                    fill="none"
                    stroke="#381D63"
                    strokeWidth="1"
                />

                {/* 3. Scalloped Corner Accents with Diamond Nodes */}
                {/* Top-Left Corner Accent */}
                <g stroke="#381D63" fill="none">
                    <path d="M 52 86 C 70 86, 86 70, 86 52" strokeWidth="1.8" />
                    <path d="M 52 76 C 65 76, 76 65, 76 52" strokeWidth="1.2" />
                    <circle cx="86" cy="52" r="2.5" fill="#381D63" />
                    <circle cx="52" cy="86" r="2.5" fill="#381D63" />
                    <polygon points="70,70 74,70 72,68 72,72" fill="#381D63" />
                </g>

                {/* Top-Right Corner Accent */}
                <g stroke="#381D63" fill="none">
                    <path d="M 948 86 C 930 86, 914 70, 914 52" strokeWidth="1.8" />
                    <path d="M 948 76 C 935 76, 924 65, 924 52" strokeWidth="1.2" />
                    <circle cx="914" cy="52" r="2.5" fill="#381D63" />
                    <circle cx="948" cy="86" r="2.5" fill="#381D63" />
                </g>

                {/* Bottom-Left Corner Accent */}
                <g stroke="#381D63" fill="none">
                    <path d="M 52 621 C 70 621, 86 637, 86 655" strokeWidth="1.8" />
                    <path d="M 52 631 C 65 631, 76 642, 76 655" strokeWidth="1.2" />
                    <circle cx="86" cy="655" r="2.5" fill="#381D63" />
                    <circle cx="52" cy="621" r="2.5" fill="#381D63" />
                </g>

                {/* Bottom-Right Corner Accent */}
                <g stroke="#381D63" fill="none">
                    <path d="M 948 621 C 930 621, 914 637, 914 655" strokeWidth="1.8" />
                    <path d="M 948 631 C 935 631, 924 642, 924 655" strokeWidth="1.2" />
                    <circle cx="914" cy="655" r="2.5" fill="#381D63" />
                    <circle cx="948" cy="621" r="2.5" fill="#381D63" />
                </g>
            </svg>

            {/* Certificate Content Stack */}
            <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-[920px] mx-auto px-4 py-2">
                {/* Header Logo & Branding */}
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                    <div className="flex items-center gap-3">
                        {/* NovaEdge Hexagonal Circuit Logo */}
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[#2A134E]">
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                                <polygon
                                    points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                />
                                <path
                                    d="M 50 18 L 75 32 L 75 62 L 50 76 L 25 62 L 25 32 Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <circle cx="50" cy="50" r="8" />
                                <line x1="50" y1="18" x2="50" y2="42" stroke="currentColor" strokeWidth="4" />
                                <line x1="25" y1="32" x2="42" y2="42" stroke="currentColor" strokeWidth="4" />
                                <line x1="75" y1="32" x2="58" y2="42" stroke="currentColor" strokeWidth="4" />
                                <line x1="25" y1="62" x2="42" y2="58" stroke="currentColor" strokeWidth="4" />
                                <line x1="75" y1="62" x2="58" y2="58" stroke="currentColor" strokeWidth="4" />
                                <circle cx="50" cy="18" r="4" />
                                <circle cx="25" cy="32" r="4" />
                                <circle cx="75" cy="32" r="4" />
                                <circle cx="25" cy="62" r="4" />
                                <circle cx="75" cy="62" r="4" />
                            </svg>
                        </div>
                        <div className="text-left leading-none">
                            <span className="block font-black text-lg md:text-2xl text-[#241045] tracking-[0.22em]">
                                NOVAEDGE
                            </span>
                            <span className="block font-semibold text-[10px] md:text-xs text-[#584577] tracking-[0.38em] mt-0.5">
                                DIGITAL LABS
                            </span>
                        </div>
                    </div>

                    {/* Fine Separator Line with Diamond */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-[280px] pt-1">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#8E7AA8] to-[#8E7AA8]" />
                        <span className="text-[10px] text-[#8E7AA8]">◆</span>
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-[#8E7AA8] to-[#8E7AA8]" />
                    </div>
                </div>

                {/* Main Title Section */}
                <div className="text-center my-1 md:my-2 space-y-1">
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1D0C38] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif" }}
                    >
                        Certificate of Completion
                    </h1>

                    {/* Scroll Flourish Ornament */}
                    <div className="flex items-center justify-center gap-3 py-0.5">
                        <div className="h-[1px] w-20 md:w-32 bg-[#A393BD]" />
                        <svg className="w-5 h-5 text-[#4E3773] fill-current" viewBox="0 0 24 24">
                            <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
                        </svg>
                        <div className="h-[1px] w-20 md:w-32 bg-[#A393BD]" />
                    </div>
                </div>

                {/* Ribbon Banner Course Badge */}
                <div className="relative flex items-center justify-center my-1">
                    <span className="text-[#2B1450] text-xs md:text-sm mr-3">◆</span>

                    <div
                        className="relative bg-[#1F0E3D] text-white px-6 md:px-12 py-2 md:py-2.5 shadow-md flex items-center justify-center"
                        style={{
                            clipPath: "polygon(0% 0%, 100% 0%, 96.5% 50%, 100% 100%, 0% 100%, 3.5% 50%)"
                        }}
                    >
                        <span className="font-extrabold text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.16em] uppercase text-center drop-shadow-sm">
                            {courseTitle}
                        </span>
                    </div>

                    <span className="text-[#2B1450] text-xs md:text-sm ml-3">◆</span>
                </div>

                {/* Recipient Presentation Block */}
                <div className="text-center my-1 md:my-2 space-y-1">
                    <p className="font-bold text-[10px] md:text-xs tracking-[0.28em] text-[#6E5D87] uppercase">
                        PRESENTED TO
                    </p>

                    {/* Calligraphic Script Name */}
                    <div className="py-1">
                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#231046] font-normal leading-tight capitalize drop-shadow-sm"
                            style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                        >
                            {recipientName}
                        </h2>
                    </div>

                    {/* Elegant Underline with Diamond Node */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-xs md:max-w-md mx-auto">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#7E6C9E] to-[#7E6C9E]" />
                        <span className="text-[9px] text-[#7E6C9E]">◆</span>
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-[#7E6C9E] to-[#7E6C9E]" />
                    </div>

                    {/* Citation text */}
                    <p
                        className="text-xs md:text-sm lg:text-base text-[#3E334D] italic max-w-xl mx-auto pt-1 font-medium"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        for successfully completing the course and demonstrating dedication, knowledge, and excellence in the subject matter.
                    </p>
                </div>

                {/* Footer Metadata & Signatures (3 Columns) */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 items-center pt-2 md:pt-4 border-t border-transparent">
                    {/* Left Column: Metadata (Issue Date & Certificate ID) */}
                    <div className="flex flex-col justify-center space-y-2 md:space-y-3 pr-2 border-r border-dashed border-[#CBBEE0] text-left">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#381F66] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <div>
                                <span className="block font-extrabold text-[9px] md:text-[10px] tracking-[0.15em] text-[#6B5A86] uppercase">
                                    ISSUE DATE
                                </span>
                                <span className="block font-semibold text-xs md:text-sm text-[#231046]">
                                    {formattedDate}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-[#E5DDEE]" />

                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#381F66] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <div>
                                <span className="block font-extrabold text-[9px] md:text-[10px] tracking-[0.15em] text-[#6B5A86] uppercase">
                                    CERTIFICATE ID
                                </span>
                                <span className="block font-mono font-bold text-[11px] md:text-xs text-[#231046] tracking-tight">
                                    {certificateId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Verification QR Code */}
                    <div className="flex flex-col items-center justify-center text-center px-1 md:px-2 border-r border-dashed border-[#CBBEE0]">
                        <div className="p-1.5 bg-white border-2 border-[#381F66] rounded-xl shadow-md">
                            <QRCodeSVG
                                value={qrUrl}
                                size={68}
                                level="H"
                                fgColor="#200C3C"
                                bgColor="#FFFFFF"
                                className="w-14 h-14 md:w-20 md:h-20"
                            />
                        </div>
                        <span className="block font-black text-[9px] md:text-[10px] text-[#231046] tracking-[0.14em] uppercase mt-1.5">
                            SCAN TO VERIFY
                        </span>
                        <span className="block text-[8px] md:text-[9px] text-[#6E6184] font-medium leading-none">
                            Authenticity of this certificate
                        </span>
                    </div>

                    {/* Right Column: Authorized Signatory */}
                    <div className="flex flex-col items-center justify-end text-center pl-2">
                        {/* Calligraphic Signature */}
                        <div className="h-10 md:h-12 flex items-end justify-center">
                            <span
                                className="text-2xl md:text-3xl lg:text-4xl text-[#1F0E3D] font-normal leading-none transform -rotate-1 select-none"
                                style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                            >
                                {signatorySignatureText}
                            </span>
                        </div>

                        {/* Underline for Signature */}
                        <div className="h-[2px] w-full max-w-[140px] md:max-w-[180px] bg-[#2C164D] my-1" />

                        {/* Signatory Name & Role */}
                        <span className="block font-black text-[10px] md:text-xs text-[#1F0E3D] tracking-[0.12em] uppercase">
                            {signatoryName}
                        </span>
                        <span className="block font-bold text-[8px] md:text-[10px] text-[#64537E] tracking-[0.14em] uppercase mt-0.5">
                            {signatoryRole}
                        </span>
                        <span className="block text-[8px] md:text-[10px] text-[#64537E] font-medium">
                            {organization}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

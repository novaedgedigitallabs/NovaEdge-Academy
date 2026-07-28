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
    bgImagePath = "/certificate_background.png",
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
            className={`relative w-full aspect-[1.414/1] text-[#1E0D3B] rounded-sm overflow-hidden select-none shadow-2xl flex flex-col justify-between p-4 sm:p-6 md:p-10 lg:p-12 bg-white border border-purple-200/40 ${className}`}
            style={{
                fontFamily: "'Montserrat', sans-serif"
            }}
        >
            {/* High-Resolution Background Image provided by user */}
            <img
                src={bgImagePath}
                alt="Certificate Background"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
                crossOrigin="anonymous"
            />

            {/* Certificate Content Overlay - Offset below header logo in background image */}
            <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-[88%] mx-auto pt-[17%] pb-[2%]">
                
                {/* Main Title Section */}
                <div className="text-center space-y-1">
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1D0C3C] tracking-tight uppercase"
                        style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                    >
                        Certificate of Completion
                    </h1>

                    {/* Elegant Ornamental Line */}
                    <div className="flex items-center justify-center gap-3 py-0.5">
                        <div className="h-[1px] w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-[#52338B] to-[#52338B]" />
                        <span className="text-xs text-[#52338B]">✦</span>
                        <div className="h-[1px] w-16 sm:w-24 md:w-32 bg-gradient-to-l from-transparent via-[#52338B] to-[#52338B]" />
                    </div>

                    <p className="font-extrabold text-[9px] sm:text-xs tracking-[0.25em] text-[#634991] uppercase pt-0.5">
                        THIS IS PROUDLY PRESENTED TO
                    </p>
                </div>

                {/* Recipient Name Block */}
                <div className="text-center my-0.5 sm:my-1 space-y-0.5">
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C0938] font-normal capitalize drop-shadow-xs leading-tight py-0.5"
                        style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                    >
                        {recipientName}
                    </h2>

                    {/* Underline Accent */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-xs sm:max-w-md mx-auto">
                        <div className="h-[1.5px] flex-grow bg-gradient-to-r from-transparent via-[#4A2D82] to-[#4A2D82]" />
                        <span className="text-[10px] text-[#4A2D82]">◆</span>
                        <div className="h-[1.5px] flex-grow bg-gradient-to-l from-transparent via-[#4A2D82] to-[#4A2D82]" />
                    </div>
                </div>

                {/* Citation & Course Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <p
                        className="text-xs sm:text-sm md:text-base text-[#3B285E] italic font-medium leading-relaxed"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        for successfully completing the course requirements and demonstrating dedication, knowledge, and skill in
                    </p>

                    {/* Course Ribbon Badge */}
                    <div className="relative inline-flex items-center justify-center mx-auto my-0.5">
                        <div
                            className="bg-gradient-to-r from-[#1D0C3C] via-[#331766] to-[#1D0C3C] text-white px-6 sm:px-10 py-1.5 sm:py-2 rounded-sm shadow-md border border-[#52338B]/40"
                            style={{
                                clipPath: "polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%, 3% 50%)"
                            }}
                        >
                            <span className="font-black text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.14em] uppercase drop-shadow-sm">
                                {courseTitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Section: Date/ID, QR Verification Code & Signatory */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-2 sm:pt-4 border-t border-transparent">
                    {/* Left Column: Metadata */}
                    <div className="flex flex-col justify-end space-y-2 text-left pr-2 border-r border-dashed border-[#8E75B8]/40">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#2D1459] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <span className="block font-black text-[8px] sm:text-[9px] tracking-[0.15em] text-[#634991] uppercase">
                                    ISSUE DATE
                                </span>
                                <span className="block font-bold text-xs sm:text-sm text-[#1C0938]">
                                    {formattedDate}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-[#DBCFEA]" />

                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#2D1459] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <span className="block font-black text-[8px] sm:text-[9px] tracking-[0.15em] text-[#634991] uppercase">
                                    CERTIFICATE ID
                                </span>
                                <span className="block font-mono font-bold text-[10px] sm:text-xs text-[#1C0938] tracking-tight">
                                    {certificateId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Verification QR Code */}
                    <div className="flex flex-col items-center justify-center text-center px-1 border-r border-dashed border-[#8E75B8]/40">
                        <div className="p-1 bg-white border-2 border-[#331766] rounded-lg shadow-sm">
                            <QRCodeSVG
                                value={qrUrl}
                                size={65}
                                level="H"
                                fgColor="#1D0C3C"
                                bgColor="#FFFFFF"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18"
                            />
                        </div>
                        <span className="block font-black text-[8px] sm:text-[9px] text-[#1D0C3C] tracking-[0.12em] uppercase mt-1">
                            SCAN TO VERIFY
                        </span>
                        <span className="block text-[7px] sm:text-[8px] text-[#634991] font-medium leading-none">
                            Authenticity Verified
                        </span>
                    </div>

                    {/* Right Column: Signature Block */}
                    <div className="flex flex-col items-center justify-end text-center pl-2">
                        {/* Calligraphic Signature */}
                        <div className="h-8 sm:h-10 flex items-end justify-center">
                            <span
                                className="text-2xl sm:text-3xl md:text-4xl text-[#1C0938] font-normal leading-none transform -rotate-2 select-none drop-shadow-xs"
                                style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                            >
                                {signatorySignatureText}
                            </span>
                        </div>

                        {/* Signature Line */}
                        <div className="h-[1.5px] w-full max-w-[130px] sm:max-w-[160px] bg-[#2D1459] my-1" />

                        {/* Signatory Text */}
                        <span className="block font-black text-[9px] sm:text-xs text-[#1C0938] tracking-[0.12em] uppercase">
                            {signatoryName}
                        </span>
                        <span className="block font-bold text-[8px] sm:text-[9px] text-[#634991] tracking-[0.14em] uppercase">
                            {signatoryRole}
                        </span>
                        <span className="block text-[7.5px] sm:text-[8.5px] text-[#634991] font-medium">
                            {organization}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}


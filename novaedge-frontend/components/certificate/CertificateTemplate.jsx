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
    signatureImagePath = "/founder_sign.png",
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
            className={`relative w-full aspect-[1.414/1] text-[#1E0D3B] rounded-sm overflow-hidden select-none shadow-2xl flex flex-col justify-between bg-white border border-purple-200/40 ${className}`}
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

            {/* Certificate Content Overlay - Starts below NovaEdge Header Logo at 26% top padding */}
            <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-[85%] mx-auto pt-[26%] sm:pt-[27%] pb-[5%] px-2">
                
                {/* Main Title Section */}
                <div className="text-center space-y-0.5 sm:space-y-1">
                    <h1
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#1D0C3C] tracking-tight uppercase"
                        style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                    >
                        Certificate of Completion
                    </h1>

                    {/* Elegant Ornamental Line */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                        <div className="h-[1px] w-12 sm:w-20 md:w-28 bg-gradient-to-r from-transparent via-[#52338B] to-[#52338B]" />
                        <span className="text-[10px] text-[#52338B]">✦</span>
                        <div className="h-[1px] w-12 sm:w-20 md:w-28 bg-gradient-to-l from-transparent via-[#52338B] to-[#52338B]" />
                    </div>

                    <p className="font-extrabold text-[8px] sm:text-[10px] tracking-[0.22em] text-[#634991] uppercase">
                        THIS IS PROUDLY PRESENTED TO
                    </p>
                </div>

                {/* Recipient Name Block */}
                <div className="text-center my-0.5 space-y-0.5">
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1C0938] font-normal capitalize drop-shadow-xs leading-tight py-0.5"
                        style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                    >
                        {recipientName}
                    </h2>

                    {/* Underline Accent */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-xs sm:max-w-sm mx-auto">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#4A2D82] to-[#4A2D82]" />
                        <span className="text-[8px] text-[#4A2D82]">◆</span>
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-[#4A2D82] to-[#4A2D82]" />
                    </div>
                </div>

                {/* Citation & Course Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-1 px-2">
                    <p
                        className="text-[9.5px] sm:text-[11px] md:text-xs text-[#3B285E] italic font-medium leading-relaxed"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        For successfully completing all comprehensive course modules, practical assessments, and hands-on project builds, while demonstrating solid technical skills, dedication, and a strong commitment to continuous learning throughout the {courseTitle || "program"}. This certificate acknowledges the recipient&apos;s proficiency and readiness to apply these skills in real-world development environments.
                    </p>

                    {/* Course Ribbon Badge */}
                    <div className="relative inline-flex items-center justify-center mx-auto my-0.5">
                        <div
                            className="bg-gradient-to-r from-[#1D0C3C] via-[#331766] to-[#1D0C3C] text-white px-5 sm:px-8 py-1 sm:py-1.5 rounded-sm shadow-md border border-[#52338B]/40"
                            style={{
                                clipPath: "polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%, 3% 50%)"
                            }}
                        >
                            <span className="font-black text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.12em] uppercase drop-shadow-sm">
                                {courseTitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Section: Date/ID, QR Verification Code & Signatory (Harmoniously Aligned 3 Columns) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center pt-1 sm:pt-2 border-t border-transparent">
                    {/* Left Column: Metadata */}
                    <div className="flex flex-col justify-center space-y-1.5 text-left pr-2 border-r border-dashed border-[#8E75B8]/40 h-full">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#2D1459] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                <Calendar className="w-3 h-3" />
                            </div>
                            <div>
                                <span className="block font-black text-[7px] sm:text-[8px] tracking-[0.14em] text-[#634991] uppercase">
                                    ISSUE DATE
                                </span>
                                <span className="block font-bold text-[10px] sm:text-xs text-[#1C0938]">
                                    {formattedDate}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-[#DBCFEA]" />

                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#2D1459] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                            <div>
                                <span className="block font-black text-[7px] sm:text-[8px] tracking-[0.14em] text-[#634991] uppercase">
                                    CERTIFICATE ID
                                </span>
                                <span className="block font-mono font-bold text-[9px] sm:text-[10px] text-[#1C0938] tracking-tight">
                                    {certificateId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Verification QR Code */}
                    <div className="flex flex-col items-center justify-center text-center px-1 border-r border-dashed border-[#8E75B8]/40 w-full h-full">
                        <div className="p-1 bg-white border border-[#331766] rounded-md shadow-xs mx-auto">
                            <QRCodeSVG
                                value={qrUrl}
                                size={50}
                                level="H"
                                fgColor="#1D0C3C"
                                bgColor="#FFFFFF"
                                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 block"
                            />
                        </div>
                        <span className="block font-black text-[7px] sm:text-[8px] text-[#1D0C3C] tracking-[0.1em] uppercase mt-1 mb-0.5 text-center w-full">
                            SCAN TO VERIFY
                        </span>
                        <span className="block text-[6.5px] sm:text-[7.5px] text-[#634991] font-medium leading-normal text-center w-full">
                            Authenticity of this certificate
                        </span>
                    </div>

                    {/* Right Column: Signature Block */}
                    <div className="flex flex-col items-center justify-center text-center pl-2 h-full">
                        {/* Founder Signature Image */}
                        <div className="relative flex items-end justify-center w-full h-7 sm:h-9 md:h-10 -mb-0.5">
                            <img
                                src={signatureImagePath}
                                alt="Founder Signature"
                                className="h-full max-h-10 w-auto object-contain pointer-events-none select-none mix-blend-multiply"
                                crossOrigin="anonymous"
                            />
                        </div>

                        {/* Signature Line */}
                        <div className="h-[1.5px] w-full max-w-[130px] sm:max-w-[160px] bg-[#2D1459] my-0.5 z-10" />

                        {/* Signatory Text */}
                        <span className="block font-black text-[8px] sm:text-[10px] text-[#1C0938] tracking-[0.1em] uppercase mt-0.5">
                            {signatoryName}
                        </span>
                        <span className="block font-bold text-[7px] sm:text-[8px] text-[#634991] tracking-[0.12em] uppercase">
                            {signatoryRole}
                        </span>
                        <span className="block text-[6.5px] sm:text-[7.5px] text-[#634991] font-medium">
                            {organization}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

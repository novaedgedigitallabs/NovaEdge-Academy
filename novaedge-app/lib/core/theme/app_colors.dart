import 'package:flutter/material.dart';

class AppColors {
  // Background Scale — Dark Academic Premium
  static const Color bgBase = Color(0xFF08080E);
  static const Color bgSurface = Color(0xFF0E0E18);
  static const Color bgElevated = Color(0xFF141420);
  static const Color bgOverlay = Color(0xFF1C1C2E);
  static const Color bgHover = Color(0xFF1F1F32);

  // Primary — Electric Purple
  static const Color primary200 = Color(0xFFDDD6FE);
  static const Color primary300 = Color(0xFFC084FC);
  static const Color primary400 = Color(0xFFA855F7);
  static const Color primary500 = Color(0xFF9333EA); // Main CTA
  static const Color primary600 = Color(0xFF7C3AED);
  static const Color primaryGlow = Color(0x339333EA);

  // Secondary — Cyan (Learning & Progress)
  static const Color cyan300 = Color(0xFF67E8F9);
  static const Color cyan400 = Color(0xFF22D3EE);
  static const Color cyan500 = Color(0xFF06B6D4); // Main Progress
  static const Color cyan600 = Color(0xFF0891B2);

  // Accent — Gold (Gamification & Certificates)
  static const Color gold300 = Color(0xFFFCD34D);
  static const Color gold400 = Color(0xFFFBBF24);
  static const Color gold500 = Color(0xFFF59E0B);
  static const Color gold600 = Color(0xFFD97706);

  // Text Scale
  static const Color text1 = Color(0xFFF2F2FF); // Headings & body
  static const Color text2 = Color(0xFF9494AF); // Secondary text
  static const Color text3 = Color(0xFF5A5A74); // Muted captions
  static const Color text4 = Color(0xFF35354A); // Disabled

  // Semantic
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFF43F5E);
  static const Color info = Color(0xFF06B6D4);

  // Borders
  static const Color borderSubtle = Color(0x0DFFFFFF);
  static const Color borderDefault = Color(0x17FFFFFF);
  static const Color borderStrong = Color(0x29FFFFFF);
  static const Color borderActive = Color(0x809333EA);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary500, Color(0xFF4F46E5)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cyanGradient = LinearGradient(
    colors: [cyan500, primary600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold500, Color(0xFFEF4444)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [bgElevated, bgSurface],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

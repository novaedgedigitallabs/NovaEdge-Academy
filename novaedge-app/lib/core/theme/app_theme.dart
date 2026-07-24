import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    final baseTextTheme = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);
    final headingTextTheme = GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme);

    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: AppColors.bgBase,
      primaryColor: AppColors.primary500,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary500,
        secondary: AppColors.cyan500,
        surface: AppColors.bgSurface,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSurface: AppColors.text1,
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderDefault),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.bgBase,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: AppColors.text1),
        titleTextStyle: headingTextTheme.titleLarge?.copyWith(
          color: AppColors.text1,
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.bgSurface,
        selectedItemColor: AppColors.primary400,
        unselectedItemColor: AppColors.text3,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.bgElevated,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: baseTextTheme.bodyMedium?.copyWith(color: AppColors.text3),
        labelStyle: baseTextTheme.bodyMedium?.copyWith(color: AppColors.text2),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderDefault),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderDefault),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary500, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary500,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: headingTextTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
      textTheme: baseTextTheme.copyWith(
        displayLarge: headingTextTheme.displayLarge?.copyWith(color: AppColors.text1, fontWeight: FontWeight.bold),
        headlineLarge: headingTextTheme.headlineLarge?.copyWith(color: AppColors.text1, fontWeight: FontWeight.bold),
        headlineMedium: headingTextTheme.headlineMedium?.copyWith(color: AppColors.text1, fontWeight: FontWeight.w600),
        titleLarge: headingTextTheme.titleLarge?.copyWith(color: AppColors.text1, fontWeight: FontWeight.w600),
        titleMedium: headingTextTheme.titleMedium?.copyWith(color: AppColors.text1, fontWeight: FontWeight.w600),
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(color: AppColors.text1),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(color: AppColors.text2),
        bodySmall: baseTextTheme.bodySmall?.copyWith(color: AppColors.text3),
      ),
    );
  }
}

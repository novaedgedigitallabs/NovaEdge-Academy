# NovaEdge Academy — Flutter App Requirements Questionnaire

Already confirmed:
- Videos: YouTube (unlisted/embed)
- Payment gateway: Razorpay

Answer inline, jitna pata hai utna likho. "Pata nahi" bhi likh sakte ho, main us case mein assumption bata dunga.

---

## 1. Auth & Backend

1. Backend auth kaise kaam karta hai — NextAuth (cookie/session), custom JWT (Bearer token), ya Firebase Auth?
2. Login kis se hota hai — email/password, phone OTP, Google sign-in, ya multiple?
3. Backend repo access mil sakta hai (GitHub) taaki main actual API routes dekh sakoon?
4. API base URL kya hai (prod aur agar staging bhi hai to wo)?
5. Existing API mein mobile clients ke liye already CORS/token support hai, ya ye add karna padega?

## 2. Users & Roles

6. App sirf students ke liye hai, ya instructor/admin bhi app se access karenge?
7. Free courses bhi hain ya sab paid hain?
8. Guest browsing allowed hai (bina login courses dekh sakte ho) ya login mandatory hai entry pe?

## 3. Courses & Content

9. Course structure kaisa hai — sirf videos, ya modules/lessons/quizzes/assignments bhi hain?
10. Video progress tracking chahiye (kahan tak dekha, resume from there)?
11. Downloadable/offline video access chahiye ya sirf streaming?
12. Certificates milte hain course complete karne pe? Agar haan, app se generate/download hona chahiye?
13. Course search aur filter (category, level, price) chahiye?

## 4. Payments (Razorpay)

14. Website pe Razorpay integration kaise hai — Razorpay Checkout (web) ya custom order flow with backend verification?
15. One-time course purchase, ya subscription plans bhi hain?
16. Coupons/discount codes support chahiye?
17. Payment success ke baad backend webhook hai jo enrollment update karta hai, ya frontend hi confirm karta hai?

## 5. Notifications

18. Push notifications ke liye Firebase already kahin use ho raha hai (web push wagera)?
19. Notification types kya honge — new course launch, payment confirmation, course reminders, admin announcements?

## 6. Design & Branding

20. App icon, splash screen, aur logo assets ready hain?
21. DESIGN.md ka purple/cyan/gold theme hi mobile pe follow karna hai, ya mobile-specific adjustments chahiye?

## 7. Platforms & Distribution

22. Android only pehle, ya Android + iOS dono saath mein?
23. Play Store/App Store developer accounts ready hain?
24. App ka target release timeline kya hai (rough estimate)?

## 8. Misc

25. Multi-language support chahiye (Hindi/English) ya English only?
26. Dark mode chahiye?
27. Koi existing Flutter/mobile codebase already hai jisse start karna hai, ya bilkul scratch se?
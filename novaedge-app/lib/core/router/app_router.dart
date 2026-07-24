import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/blogs/presentation/screens/blogs_screen.dart';
import '../../features/careers/presentation/screens/careers_screen.dart';
import '../../features/certificates/presentation/screens/certificates_screen.dart';
import '../../features/community/presentation/screens/community_screen.dart';
import '../../features/courses/presentation/screens/course_detail_screen.dart';
import '../../features/courses/presentation/screens/player_screen.dart';
import '../../features/main_layout/presentation/screens/main_screen.dart';
import '../../features/mentors/presentation/screens/mentors_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/payment/presentation/screens/checkout_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/profile/presentation/screens/my_courses_screen.dart';
import '../../features/wishlist/presentation/screens/wishlist_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const MainScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/course/:id',
      builder: (context, state) {
        final courseId = state.pathParameters['id']!;
        return CourseDetailScreen(courseId: courseId);
      },
    ),
    GoRoute(
      path: '/player/:courseId/:lectureIndex',
      builder: (context, state) {
        final courseId = state.pathParameters['courseId']!;
        final lectureIndexStr = state.pathParameters['lectureIndex'] ?? '0';
        final lectureIndex = int.tryParse(lectureIndexStr) ?? 0;
        return PlayerScreen(courseId: courseId, initialLectureIndex: lectureIndex);
      },
    ),
    GoRoute(
      path: '/checkout/:courseId',
      builder: (context, state) {
        final courseId = state.pathParameters['courseId']!;
        return CheckoutScreen(courseId: courseId);
      },
    ),
    GoRoute(
      path: '/my-courses',
      builder: (context, state) => const MyCoursesScreen(),
    ),
    GoRoute(
      path: '/certificates',
      builder: (context, state) => const CertificatesScreen(),
    ),
    GoRoute(
      path: '/notifications',
      builder: (context, state) => const NotificationsScreen(),
    ),
    GoRoute(
      path: '/wishlist',
      builder: (context, state) => const WishlistScreen(),
    ),
    GoRoute(
      path: '/edit-profile',
      builder: (context, state) => const EditProfileScreen(),
    ),
    GoRoute(
      path: '/blogs',
      builder: (context, state) => const BlogsScreen(),
    ),
    GoRoute(
      path: '/mentors',
      builder: (context, state) => const MentorsScreen(),
    ),
    GoRoute(
      path: '/careers',
      builder: (context, state) => const CareersScreen(),
    ),
    GoRoute(
      path: '/community',
      builder: (context, state) => const CommunityScreen(),
    ),
  ],
);

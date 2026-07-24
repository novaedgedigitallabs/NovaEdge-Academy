import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../payment/presentation/controllers/payment_controller.dart';
import '../../../reviews/presentation/controllers/review_controller.dart';
import '../../../wishlist/presentation/controllers/wishlist_controller.dart';
import '../controllers/course_controller.dart';

class CourseDetailScreen extends ConsumerWidget {
  final String courseId;

  const CourseDetailScreen({super.key, required this.courseId});

  void _handleEnrollment(BuildContext context, WidgetRef ref, bool isFree) async {
    final authState = ref.read(authControllerProvider);
    if (!authState.isAuthenticated) {
      context.push('/login');
      return;
    }

    final paymentNotifier = ref.read(paymentControllerProvider.notifier);
    final result = await paymentNotifier.checkout(courseId: courseId);

    if (context.mounted && result != null) {
      if (result.isFreeEnrollment) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully enrolled in course!'),
            backgroundColor: AppColors.success,
          ),
        );
        ref.invalidate(courseDetailProvider(courseId));
        ref.invalidate(myEnrollmentsProvider);
      } else {
        context.push('/checkout/$courseId');
      }
    }
  }

  void _showAddReviewDialog(BuildContext context, WidgetRef ref) {
    final commentController = TextEditingController();
    double selectedRating = 5.0;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: AppColors.bgSurface,
              title: const Text('Write a Review', style: TextStyle(color: AppColors.text1)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      final starRating = index + 1.0;
                      return IconButton(
                        icon: Icon(
                          starRating <= selectedRating ? Icons.star_rounded : Icons.star_outline_rounded,
                          color: AppColors.gold400,
                          size: 32,
                        ),
                        onPressed: () {
                          setState(() => selectedRating = starRating);
                        },
                      );
                    }),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: commentController,
                    maxLines: 3,
                    style: const TextStyle(color: AppColors.text1),
                    decoration: const InputDecoration(
                      hintText: 'Share your learning experience...',
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel', style: TextStyle(color: AppColors.text3)),
                ),
                ElevatedButton(
                  onPressed: () async {
                    if (commentController.text.trim().isEmpty) return;
                    final repository = ref.read(reviewRepositoryProvider);
                    final success = await repository.createReview(
                      courseId: courseId,
                      rating: selectedRating,
                      comment: commentController.text.trim(),
                    );
                    if (context.mounted) {
                      Navigator.pop(context);
                      if (success) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Review submitted!'), backgroundColor: AppColors.success),
                        );
                        ref.invalidate(courseReviewsProvider(courseId));
                      }
                    }
                  },
                  child: const Text('Submit'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final courseAsync = ref.watch(courseDetailProvider(courseId));
    final wishlistedIds = ref.watch(wishlistNotifierProvider);
    final isWishlisted = wishlistedIds.contains(courseId);
    final reviewsAsync = ref.watch(courseReviewsProvider(courseId));

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.text1),
          onPressed: () => context.pop(),
        ),
        title: const Text('Course Details'),
        actions: [
          IconButton(
            icon: Icon(
              isWishlisted ? Icons.favorite : Icons.favorite_border,
              color: isWishlisted ? AppColors.error : AppColors.text1,
            ),
            onPressed: () {
              ref.read(wishlistNotifierProvider.notifier).toggle(courseId);
            },
          ),
        ],
      ),
      body: courseAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
        error: (err, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: AppColors.error, size: 48),
              const SizedBox(height: 12),
              Text(err.toString(), style: const TextStyle(color: AppColors.text2)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(courseDetailProvider(courseId)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (course) {
          final isFree = course.price == 0;

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Poster with Play Overlay
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: SizedBox(
                              height: 200,
                              width: double.infinity,
                              child: course.posterUrl.isNotEmpty
                                  ? CachedNetworkImage(
                                      imageUrl: course.posterUrl,
                                      fit: BoxFit.cover,
                                    )
                                  : Container(color: AppColors.bgElevated),
                            ),
                          ),
                          if (course.isEnrolled && course.lectures.isNotEmpty)
                            IconButton(
                              iconSize: 64,
                              icon: const Icon(Icons.play_circle_fill, color: AppColors.primary400),
                              onPressed: () {
                                context.push('/player/$courseId/0');
                              },
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Category & Level Chips
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.cyan500.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.cyan500.withValues(alpha: 0.3)),
                            ),
                            child: Text(
                              course.category,
                              style: const TextStyle(color: AppColors.cyan300, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.bgElevated,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              course.level,
                              style: const TextStyle(color: AppColors.text2, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Title
                      Text(
                        course.title,
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: AppColors.text1,
                            ),
                      ),
                      const SizedBox(height: 8),

                      // Creator & Stats
                      Row(
                        children: [
                          const Icon(Icons.person_outline, color: AppColors.text3, size: 18),
                          const SizedBox(width: 4),
                          Text('By ${course.createdBy}', style: const TextStyle(color: AppColors.text2, fontSize: 13)),
                          const Spacer(),
                          const Icon(Icons.star_rounded, color: AppColors.gold400, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            course.rating > 0 ? course.rating.toStringAsFixed(1) : 'New',
                            style: const TextStyle(color: AppColors.text1, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Description
                      const Text(
                        'About This Course',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        course.description,
                        style: const TextStyle(color: AppColors.text2, fontSize: 14, height: 1.5),
                      ),
                      const SizedBox(height: 24),

                      // Tech Stack
                      if (course.techStack.isNotEmpty) ...[
                        const Text(
                          'Tech Stack Covered',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.text1),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: course.techStack.map((tech) {
                            return Chip(
                              backgroundColor: AppColors.bgElevated,
                              side: const BorderSide(color: AppColors.borderDefault),
                              label: Text(tech, style: const TextStyle(color: AppColors.text2, fontSize: 12)),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Curriculum Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Course Content',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                          ),
                          Text(
                            '${course.lectures.length} Lectures',
                            style: const TextStyle(color: AppColors.text3, fontSize: 13),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: course.lectures.length,
                        itemBuilder: (context, index) {
                          final lecture = course.lectures[index];
                          final bool isLocked = !course.isEnrolled && index > 0;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                              color: AppColors.bgSurface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.borderDefault),
                            ),
                            child: ExpansionTile(
                              leading: CircleAvatar(
                                radius: 14,
                                backgroundColor: isLocked ? AppColors.bgElevated : AppColors.primary500.withValues(alpha: 0.2),
                                child: Icon(
                                  isLocked ? Icons.lock : Icons.play_arrow,
                                  size: 16,
                                  color: isLocked ? AppColors.text3 : AppColors.primary400,
                                ),
                              ),
                              title: Text(
                                '${index + 1}. ${lecture.title}',
                                style: TextStyle(
                                  color: isLocked ? AppColors.text3 : AppColors.text1,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                              subtitle: Text(
                                '${lecture.duration} mins',
                                style: const TextStyle(color: AppColors.text3, fontSize: 12),
                              ),
                              trailing: isLocked
                                  ? const Icon(Icons.lock_outline, color: AppColors.text4, size: 18)
                                  : IconButton(
                                      icon: const Icon(Icons.play_circle_fill, color: AppColors.cyan400),
                                      onPressed: () {
                                        context.push('/player/$courseId/$index');
                                      },
                                    ),
                              children: [
                                if (lecture.description.isNotEmpty)
                                  Padding(
                                    padding: const EdgeInsets.all(12),
                                    child: Text(
                                      lecture.description,
                                      style: const TextStyle(color: AppColors.text2, fontSize: 13),
                                    ),
                                  ),
                                if (lecture.aiSummary != null && lecture.aiSummary!.isNotEmpty) ...[
                                  Container(
                                    margin: const EdgeInsets.all(12),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: AppColors.primary500.withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: AppColors.primary500.withValues(alpha: 0.2)),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Row(
                                          children: [
                                            Icon(Icons.auto_awesome, color: AppColors.primary300, size: 16),
                                            SizedBox(width: 6),
                                            Text('AI Summary', style: TextStyle(color: AppColors.primary300, fontWeight: FontWeight.bold, fontSize: 12)),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        Text(lecture.aiSummary!, style: const TextStyle(color: AppColors.text2, fontSize: 12)),
                                      ],
                                    ),
                                  ),
                                ],
                                if (lecture.pdfNotesUrl != null) ...[
                                  TextButton.icon(
                                    onPressed: () async {
                                      final uri = Uri.parse(lecture.pdfNotesUrl!);
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                    icon: const Icon(Icons.picture_as_pdf, color: AppColors.gold400, size: 18),
                                    label: const Text('Download PDF Notes', style: TextStyle(color: AppColors.gold400, fontSize: 13)),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 24),

                      // Student Reviews Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Student Reviews',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                          ),
                          if (course.isEnrolled)
                            TextButton.icon(
                              onPressed: () => _showAddReviewDialog(context, ref),
                              icon: const Icon(Icons.rate_review, color: AppColors.primary400, size: 16),
                              label: const Text('Write Review', style: TextStyle(color: AppColors.primary400, fontSize: 13, fontWeight: FontWeight.bold)),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      reviewsAsync.when(
                        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
                        error: (err, _) => const Text('No reviews available yet.', style: TextStyle(color: AppColors.text3)),
                        data: (reviews) {
                          if (reviews.isEmpty) {
                            return const Padding(
                              padding: EdgeInsets.symmetric(vertical: 8),
                              child: Text('No reviews yet. Be the first to review!', style: TextStyle(color: AppColors.text3, fontSize: 13)),
                            );
                          }

                          return ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: reviews.length,
                            itemBuilder: (context, index) {
                              final rev = reviews[index];
                              final formattedDate = DateFormat('MMM dd, yyyy').format(rev.createdAt);

                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppColors.bgSurface,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppColors.borderDefault),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 14,
                                          backgroundColor: AppColors.primary500,
                                          backgroundImage: rev.userAvatar != null ? NetworkImage(rev.userAvatar!) : null,
                                          child: rev.userAvatar == null
                                              ? Text(rev.userName.isNotEmpty ? rev.userName[0].toUpperCase() : 'S', style: const TextStyle(color: Colors.white, fontSize: 12))
                                              : null,
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(rev.userName, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.text1, fontSize: 14)),
                                        ),
                                        Row(
                                          children: List.generate(5, (starIdx) {
                                            return Icon(
                                              starIdx < rev.rating ? Icons.star_rounded : Icons.star_outline_rounded,
                                              color: AppColors.gold400,
                                              size: 16,
                                            );
                                          }),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(rev.comment, style: const TextStyle(color: AppColors.text2, fontSize: 13)),
                                    const SizedBox(height: 4),
                                    Text(formattedDate, style: const TextStyle(color: AppColors.text3, fontSize: 11)),
                                  ],
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom CTA Bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: AppColors.bgSurface,
                  border: Border(top: BorderSide(color: AppColors.borderDefault)),
                ),
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('Total Price', style: TextStyle(color: AppColors.text3, fontSize: 12)),
                        Text(
                          isFree ? 'FREE' : '₹${course.price.toInt()}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: isFree ? AppColors.success : AppColors.text1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: SizedBox(
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () {
                            if (course.isEnrolled) {
                              context.push('/player/$courseId/0');
                            } else {
                              _handleEnrollment(context, ref, isFree);
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: course.isEnrolled
                                ? AppColors.cyan500
                                : isFree
                                    ? AppColors.success
                                    : AppColors.primary500,
                          ),
                          child: Text(
                            course.isEnrolled
                                ? 'Continue Learning'
                                : isFree
                                    ? 'Enroll for FREE'
                                    : 'Enroll Now',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../courses/presentation/controllers/course_controller.dart';

class MyCoursesScreen extends ConsumerWidget {
  const MyCoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrollmentsAsync = ref.watch(myEnrollmentsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('My Learning'),
        backgroundColor: AppColors.bgBase,
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(myEnrollmentsProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: enrollmentsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Login required or failed to load courses.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (courses) {
            if (courses.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.school_outlined, size: 64, color: AppColors.text3),
                    const SizedBox(height: 16),
                    const Text(
                      'No Enrolled Courses Yet',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                    ),
                    const SizedBox(height: 8),
                    const Text('Explore our catalog and start learning today!', style: TextStyle(color: AppColors.text3)),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () => context.go('/'),
                      child: const Text('Browse Catalog'),
                    ),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: courses.length,
              itemBuilder: (context, index) {
                final course = courses[index];
                final progress = course.percentComplete;

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: AppColors.bgSurface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: AppColors.borderDefault),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: InkWell(
                    onTap: () => context.push('/course/${course.id}'),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: SizedBox(
                              width: 100,
                              height: 80,
                              child: course.posterUrl.isNotEmpty
                                  ? CachedNetworkImage(imageUrl: course.posterUrl, fit: BoxFit.cover)
                                  : Container(color: AppColors.bgElevated),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  course.title,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.text1),
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    Expanded(
                                      child: LinearProgressIndicator(
                                        value: progress > 0 ? progress / 100 : 0,
                                        backgroundColor: AppColors.bgElevated,
                                        color: AppColors.cyan500,
                                        minHeight: 6,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '${progress.toInt()}%',
                                      style: const TextStyle(fontSize: 12, color: AppColors.cyan400, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton.icon(
                                    onPressed: () => context.push('/player/${course.id}/0'),
                                    style: TextButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    ),
                                    icon: const Icon(Icons.play_circle_fill, size: 16, color: AppColors.primary400),
                                    label: const Text('Continue', style: TextStyle(color: AppColors.primary400, fontSize: 13, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

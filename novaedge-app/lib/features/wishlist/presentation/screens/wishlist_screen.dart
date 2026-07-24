import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/wishlist_controller.dart';

class WishlistScreen extends ConsumerWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wishlistAsync = ref.watch(wishlistProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('My Wishlist'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(wishlistProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: wishlistAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Login required or failed to load wishlist.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (courses) {
            if (courses.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.error.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.favorite_outline, size: 64, color: AppColors.error),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Your Wishlist is Empty',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                      ),
                      const SizedBox(height: 8),
                      const Text('Save interesting courses here to purchase or enroll later.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.text2)),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () => context.go('/'),
                        child: const Text('Browse Catalog'),
                      ),
                    ],
                  ),
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: courses.length,
              itemBuilder: (context, index) {
                final course = courses[index];
                final isFree = course.price == 0;

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
                                Text(
                                  isFree ? 'FREE' : '₹${course.price.toInt()}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: isFree ? AppColors.success : AppColors.primary400,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.favorite, color: AppColors.error),
                            onPressed: () async {
                              await ref.read(wishlistNotifierProvider.notifier).toggle(course.id);
                              ref.invalidate(wishlistProvider);
                            },
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

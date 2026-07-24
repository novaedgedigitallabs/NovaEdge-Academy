import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/blog_controller.dart';

class BlogsScreen extends ConsumerWidget {
  const BlogsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final blogsAsync = ref.watch(blogsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Blogs & Articles'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(blogsProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: blogsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load articles.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (blogs) {
            if (blogs.isEmpty) {
              return const Center(
                child: Text('No articles published yet.', style: TextStyle(color: AppColors.text3)),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: blogs.length,
              itemBuilder: (context, index) {
                final blog = blogs[index];
                final formattedDate = DateFormat('MMM dd, yyyy').format(blog.createdAt);

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: AppColors.bgSurface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: AppColors.borderDefault),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (blog.posterUrl != null && blog.posterUrl!.isNotEmpty)
                        SizedBox(
                          height: 160,
                          width: double.infinity,
                          child: CachedNetworkImage(
                            imageUrl: blog.posterUrl!,
                            fit: BoxFit.cover,
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.cyan500.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                blog.category,
                                style: const TextStyle(color: AppColors.cyan300, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              blog.title,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.text1),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              blog.content,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(color: AppColors.text2, fontSize: 13, height: 1.4),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              formattedDate,
                              style: const TextStyle(color: AppColors.text3, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
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

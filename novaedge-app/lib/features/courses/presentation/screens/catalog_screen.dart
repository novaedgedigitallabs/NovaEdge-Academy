import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../wishlist/presentation/controllers/wishlist_controller.dart';
import '../controllers/course_controller.dart';
import '../../data/models/course_model.dart';

class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final _searchController = TextEditingController();

  final List<String> _categories = [
    'All',
    'App Development',
    'Full Stack Development',
    'Data Structures & Algorithms',
    'UI/UX Design',
    'Backend Development',
    'Frontend Development',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(courseListControllerProvider);
    final notifier = ref.read(courseListControllerProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        backgroundColor: AppColors.bgBase,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary500.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.school, color: AppColors.primary300, size: 20),
            ),
            const SizedBox(width: 10),
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(
                    text: 'NovaEdge ',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  TextSpan(
                    text: 'Academy',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.cyan400),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: AppColors.text1),
            onPressed: () => context.push('/notifications'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => notifier.loadCourses(),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: Column(
          children: [
            // Search Input
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: TextField(
                controller: _searchController,
                style: const TextStyle(color: AppColors.text1),
                onSubmitted: (value) => notifier.setSearchQuery(value.trim()),
                decoration: InputDecoration(
                  hintText: 'Search courses, tech stack, topics...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.text3),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: AppColors.text3),
                          onPressed: () {
                            _searchController.clear();
                            notifier.setSearchQuery('');
                          },
                        )
                      : null,
                ),
              ),
            ),

            // Category Chips horizontal scroll
            SizedBox(
              height: 48,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSelected = state.selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      onSelected: (_) => notifier.setCategory(cat),
                      selectedColor: AppColors.primary500,
                      backgroundColor: AppColors.bgSurface,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppColors.text2,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 13,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? AppColors.primary400 : AppColors.borderDefault,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Course Grid / List
            Expanded(
              child: state.isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppColors.primary500))
                  : state.error != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline, color: AppColors.error, size: 48),
                              const SizedBox(height: 12),
                              Text(state.error!, style: const TextStyle(color: AppColors.text2)),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () => notifier.loadCourses(),
                                child: const Text('Try Again'),
                              ),
                            ],
                          ),
                        )
                      : state.courses.isEmpty
                          ? const Center(
                              child: Text(
                                'No courses found matching your criteria.',
                                style: TextStyle(color: AppColors.text3),
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: state.courses.length,
                              itemBuilder: (context, index) {
                                final course = state.courses[index];
                                return _CourseCard(course: course);
                              },
                            ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CourseCard extends ConsumerWidget {
  final CourseModel course;

  const _CourseCard({required this.course});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bool isFree = course.price == 0;
    final wishlistedIds = ref.watch(wishlistNotifierProvider);
    final isWishlisted = wishlistedIds.contains(course.id);

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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Poster Image
            Stack(
              children: [
                SizedBox(
                  height: 180,
                  width: double.infinity,
                  child: course.posterUrl.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: course.posterUrl,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(color: AppColors.bgElevated),
                          errorWidget: (context, url, error) => Container(
                            color: AppColors.bgElevated,
                            child: const Icon(Icons.movie_outlined, color: AppColors.text3, size: 48),
                          ),
                        )
                      : Container(
                          color: AppColors.bgElevated,
                          child: const Icon(Icons.movie_outlined, color: AppColors.text3, size: 48),
                        ),
                ),

                // Category Badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.bgBase.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.borderStrong),
                    ),
                    child: Text(
                      course.category,
                      style: const TextStyle(color: AppColors.cyan300, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),

                // Wishlist Toggle Heart
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: () {
                      ref.read(wishlistNotifierProvider.notifier).toggle(course.id);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.bgBase.withValues(alpha: 0.8),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isWishlisted ? Icons.favorite : Icons.favorite_border,
                        color: isWishlisted ? AppColors.error : Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ),

                // Price Badge
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isFree ? AppColors.success : AppColors.primary500,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: (isFree ? AppColors.success : AppColors.primary500).withValues(alpha: 0.4),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: Text(
                      isFree ? 'FREE' : '₹${course.price.toInt()}',
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),

            // Content Info
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.bgElevated,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          course.level,
                          style: const TextStyle(color: AppColors.text2, fontSize: 11),
                        ),
                      ),
                      const Spacer(),
                      const Icon(Icons.star_rounded, color: AppColors.gold400, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        course.rating > 0 ? course.rating.toStringAsFixed(1) : 'New',
                        style: const TextStyle(color: AppColors.text1, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    course.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.text1,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    course.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, color: AppColors.text2),
                  ),
                  const SizedBox(height: 12),

                  // Meta Row (Lectures & Creator)
                  Row(
                    children: [
                      const Icon(Icons.play_circle_outline, color: AppColors.text3, size: 16),
                      const SizedBox(width: 4),
                      Text('${course.numOfVideos} lectures', style: const TextStyle(color: AppColors.text3, fontSize: 12)),
                      const SizedBox(width: 16),
                      const Icon(Icons.person_outline, color: AppColors.text3, size: 16),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          course.createdBy,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: AppColors.text3, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

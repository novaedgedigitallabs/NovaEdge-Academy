import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/mentor_controller.dart';

class MentorsScreen extends ConsumerWidget {
  const MentorsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mentorsAsync = ref.watch(mentorsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Industry Mentors'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(mentorsProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: mentorsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load mentors.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (mentors) {
            if (mentors.isEmpty) {
              return const Center(
                child: Text('No mentors listed yet.', style: TextStyle(color: AppColors.text3)),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: mentors.length,
              itemBuilder: (context, index) {
                final mentor = mentors[index];

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: AppColors.bgSurface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: AppColors.borderDefault),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: AppColors.primary500,
                              backgroundImage: mentor.avatarUrl != null ? NetworkImage(mentor.avatarUrl!) : null,
                              child: mentor.avatarUrl == null
                                  ? Text(
                                      mentor.name.isNotEmpty ? mentor.name[0].toUpperCase() : 'M',
                                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    mentor.name,
                                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.text1),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${mentor.title} at ${mentor.company}',
                                    style: const TextStyle(color: AppColors.cyan300, fontSize: 13, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                const Icon(Icons.star_rounded, color: AppColors.gold400, size: 18),
                                const SizedBox(width: 4),
                                Text(
                                  mentor.rating.toStringAsFixed(1),
                                  style: const TextStyle(color: AppColors.text1, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ],
                        ),
                        if (mentor.bio.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Text(
                            mentor.bio,
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: AppColors.text2, fontSize: 13, height: 1.4),
                          ),
                        ],
                        if (mentor.expertise.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: mentor.expertise.map((exp) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.bgElevated,
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.borderDefault),
                                ),
                                child: Text(exp, style: const TextStyle(color: AppColors.text3, fontSize: 11)),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
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

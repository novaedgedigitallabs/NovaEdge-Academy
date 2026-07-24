import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/career_controller.dart';

class CareersScreen extends ConsumerWidget {
  const CareersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final careersAsync = ref.watch(careersProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Careers & Jobs'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(careersProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: careersAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load career listings.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (careers) {
            if (careers.isEmpty) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.work_outline, size: 64, color: AppColors.text3),
                      SizedBox(height: 16),
                      Text('No Open Positions Currently', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1)),
                      SizedBox(height: 8),
                      Text('Check back soon for new hiring opportunities!', style: TextStyle(color: AppColors.text2)),
                    ],
                  ),
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: careers.length,
              itemBuilder: (context, index) {
                final job = careers[index];

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
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                job.title,
                                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.text1),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.cyan500.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                job.type,
                                style: const TextStyle(color: AppColors.cyan300, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${job.company} • ${job.location}',
                          style: const TextStyle(color: AppColors.text3, fontSize: 13),
                        ),
                        if (job.description.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Text(
                            job.description,
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: AppColors.text2, fontSize: 13, height: 1.4),
                          ),
                        ],
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Application form link opened!'), backgroundColor: AppColors.success),
                              );
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary500),
                            child: const Text('Apply Now'),
                          ),
                        ),
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

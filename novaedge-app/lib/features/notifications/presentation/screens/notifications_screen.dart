import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/notification_controller.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all, color: AppColors.primary400),
            tooltip: 'Mark All Read',
            onPressed: () async {
              await ref.read(notificationRepositoryProvider).markAllRead();
              ref.invalidate(notificationsProvider);
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(notificationsProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: notificationsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load notifications or login required.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (notifications) {
            if (notifications.isEmpty) {
              return const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.notifications_none, size: 64, color: AppColors.text3),
                    SizedBox(height: 16),
                    Text('No Notifications', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1)),
                    SizedBox(height: 8),
                    Text('You are all caught up!', style: TextStyle(color: AppColors.text3)),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notif = notifications[index];
                final formattedTime = DateFormat('MMM dd, hh:mm a').format(notif.createdAt);

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: notif.isRead ? AppColors.bgSurface : AppColors.bgElevated,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: notif.isRead ? AppColors.borderDefault : AppColors.primary500.withValues(alpha: 0.4),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.primary500.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.notifications, color: AppColors.primary400, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    notif.title,
                                    style: TextStyle(
                                      fontWeight: notif.isRead ? FontWeight.w600 : FontWeight.bold,
                                      fontSize: 15,
                                      color: AppColors.text1,
                                    ),
                                  ),
                                ),
                                Text(formattedTime, style: const TextStyle(color: AppColors.text3, fontSize: 11)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              notif.message,
                              style: const TextStyle(color: AppColors.text2, fontSize: 13, height: 1.4),
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

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: AppColors.bgBase,
      ),
      body: user == null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.primary500.withOpacity(0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.person_outline, size: 64, color: AppColors.primary300),
                    ),
                    const SizedBox(height: 20),
                    const Text('Not Logged In', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.text1)),
                    const SizedBox(height: 8),
                    const Text('Sign in to track course progress & access enrolled content.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.text2)),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () => context.push('/login'),
                        child: const Text('Sign In'),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // User Avatar & Name
                  Center(
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 46,
                          backgroundColor: AppColors.primary500,
                          backgroundImage: (user.avatarUrl != null && user.avatarUrl!.isNotEmpty)
                              ? NetworkImage(user.avatarUrl!)
                              : null,
                          child: (user.avatarUrl == null || user.avatarUrl!.isEmpty)
                              ? Text(
                                  user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                                )
                              : null,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          user.name,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.text1),
                        ),
                        const SizedBox(height: 4),
                        Text(user.email, style: const TextStyle(color: AppColors.text3, fontSize: 14)),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary500.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.primary400.withOpacity(0.4)),
                          ),
                          child: Text(
                            user.role.toUpperCase(),
                            style: const TextStyle(color: AppColors.primary300, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(height: 8),
                        OutlinedButton.icon(
                          onPressed: () => context.push('/edit-profile'),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.borderStrong),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          ),
                          icon: const Icon(Icons.edit, size: 14, color: AppColors.primary300),
                          label: const Text('Edit Profile', style: TextStyle(color: AppColors.primary300, fontSize: 12)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Menu Options Card
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.bgSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderDefault),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.school, color: AppColors.cyan400),
                          title: const Text('My Courses', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/my-courses'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.verified, color: AppColors.gold400),
                          title: const Text('My Certificates', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/certificates'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.favorite, color: AppColors.error),
                          title: const Text('My Wishlist', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/wishlist'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.notifications, color: AppColors.primary400),
                          title: const Text('Notifications', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/notifications'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.article, color: AppColors.gold400),
                          title: const Text('Blogs & Articles', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/blogs'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.people_outline, color: AppColors.cyan400),
                          title: const Text('Industry Mentors', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/mentors'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.work_outline, color: AppColors.gold400),
                          title: const Text('Careers & Jobs', style: TextStyle(color: AppColors.text1, fontWeight: FontWeight.w600)),
                          trailing: const Icon(Icons.chevron_right, color: AppColors.text3),
                          onTap: () => context.push('/careers'),
                        ),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        ListTile(
                          leading: const Icon(Icons.logout, color: AppColors.error),
                          title: const Text('Sign Out', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w600)),
                          onTap: () async {
                            await ref.read(authControllerProvider.notifier).logout();
                            if (context.mounted) {
                              context.go('/login');
                            }
                          },
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

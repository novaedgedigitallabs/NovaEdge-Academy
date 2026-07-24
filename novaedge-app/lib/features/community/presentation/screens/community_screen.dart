import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../controllers/community_controller.dart';

class CommunityScreen extends ConsumerWidget {
  const CommunityScreen({super.key});

  void _showCreatePostDialog(BuildContext context, WidgetRef ref) {
    final textController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppColors.bgSurface,
          title: const Text('Create Community Post', style: TextStyle(color: AppColors.text1)),
          content: TextField(
            controller: textController,
            maxLines: 4,
            style: const TextStyle(color: AppColors.text1),
            decoration: const InputDecoration(
              hintText: 'Share a code snippet, question, or thought...',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: AppColors.text3)),
            ),
            ElevatedButton(
              onPressed: () async {
                if (textController.text.trim().isEmpty) return;
                final repo = ref.read(communityRepositoryProvider);
                final success = await repo.createPost(textController.text.trim());
                if (context.mounted) {
                  Navigator.pop(context);
                  if (success) {
                    ref.invalidate(communityPostsProvider);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Post published to community!'), backgroundColor: AppColors.success),
                    );
                  }
                }
              },
              child: const Text('Post'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(communityPostsProvider);
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Community Feed'),
        backgroundColor: AppColors.bgBase,
        actions: [
          if (authState.isAuthenticated)
            IconButton(
              icon: const Icon(Icons.add_comment, color: AppColors.primary400),
              onPressed: () => _showCreatePostDialog(context, ref),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(communityPostsProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: postsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load community feed.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (posts) {
            if (posts.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.forum_outlined, size: 64, color: AppColors.text3),
                    const SizedBox(height: 16),
                    const Text('No Posts Yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1)),
                    const SizedBox(height: 8),
                    const Text('Be the first student to start a discussion!', style: TextStyle(color: AppColors.text2)),
                    const SizedBox(height: 20),
                    if (authState.isAuthenticated)
                      ElevatedButton.icon(
                        onPressed: () => _showCreatePostDialog(context, ref),
                        icon: const Icon(Icons.edit_note),
                        label: const Text('Create First Post'),
                      ),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: posts.length,
              itemBuilder: (context, index) {
                final post = posts[index];
                final formattedDate = DateFormat('MMM dd, hh:mm a').format(post.createdAt);

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
                              radius: 18,
                              backgroundColor: AppColors.primary500,
                              backgroundImage: post.userAvatar != null ? NetworkImage(post.userAvatar!) : null,
                              child: post.userAvatar == null
                                  ? Text(
                                      post.userName.isNotEmpty ? post.userName[0].toUpperCase() : 'S',
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(post.userName, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.text1, fontSize: 14)),
                                Text(formattedDate, style: const TextStyle(color: AppColors.text3, fontSize: 11)),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          post.content,
                          style: const TextStyle(color: AppColors.text1, fontSize: 14, height: 1.4),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.favorite_border, color: AppColors.text3, size: 20),
                              onPressed: () async {
                                final repo = ref.read(communityRepositoryProvider);
                                await repo.likePost(post.id);
                                ref.invalidate(communityPostsProvider);
                              },
                            ),
                            Text('${post.likesCount}', style: const TextStyle(color: AppColors.text3, fontSize: 12)),
                          ],
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
      floatingActionButton: authState.isAuthenticated
          ? FloatingActionButton(
              backgroundColor: AppColors.primary500,
              onPressed: () => _showCreatePostDialog(context, ref),
              child: const Icon(Icons.edit, color: Colors.white),
            )
          : null,
    );
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/post_model.dart';
import '../../data/repositories/community_repository.dart';

final communityRepositoryProvider = Provider<CommunityRepository>((ref) {
  return CommunityRepository(ref.watch(apiClientProvider));
});

final communityPostsProvider = FutureProvider<List<PostModel>>((ref) async {
  final repository = ref.watch(communityRepositoryProvider);
  return await repository.getPosts();
});

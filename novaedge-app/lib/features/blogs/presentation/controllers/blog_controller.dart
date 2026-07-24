import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/blog_model.dart';
import '../../data/repositories/blog_repository.dart';

final blogRepositoryProvider = Provider<BlogRepository>((ref) {
  return BlogRepository(ref.watch(apiClientProvider));
});

final blogsProvider = FutureProvider<List<BlogModel>>((ref) async {
  final repository = ref.watch(blogRepositoryProvider);
  return await repository.getBlogs();
});

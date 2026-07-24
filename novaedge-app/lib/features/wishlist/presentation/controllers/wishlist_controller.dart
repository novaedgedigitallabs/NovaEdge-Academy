import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../courses/data/models/course_model.dart';
import '../../data/repositories/wishlist_repository.dart';

final wishlistRepositoryProvider = Provider<WishlistRepository>((ref) {
  return WishlistRepository(ref.watch(apiClientProvider));
});

final wishlistProvider = FutureProvider<List<CourseModel>>((ref) async {
  final repository = ref.watch(wishlistRepositoryProvider);
  return await repository.getWishlist();
});

class WishlistNotifier extends StateNotifier<Set<String>> {
  final WishlistRepository _repository;

  WishlistNotifier(this._repository) : super({});

  Future<void> loadWishlistIds() async {
    final courses = await _repository.getWishlist();
    state = courses.map((c) => c.id).toSet();
  }

  Future<void> toggle(String courseId) async {
    final success = await _repository.toggleWishlist(courseId);
    if (success) {
      if (state.contains(courseId)) {
        state = {...state}..remove(courseId);
      } else {
        state = {...state, courseId};
      }
    }
  }

  bool isWishlisted(String courseId) => state.contains(courseId);
}

final wishlistNotifierProvider = StateNotifierProvider<WishlistNotifier, Set<String>>((ref) {
  final repository = ref.watch(wishlistRepositoryProvider);
  final notifier = WishlistNotifier(repository);
  notifier.loadWishlistIds();
  return notifier;
});

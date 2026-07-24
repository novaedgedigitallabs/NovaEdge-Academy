import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/review_model.dart';
import '../../data/repositories/review_repository.dart';

final reviewRepositoryProvider = Provider<ReviewRepository>((ref) {
  return ReviewRepository(ref.watch(apiClientProvider));
});

final courseReviewsProvider = FutureProvider.family<List<ReviewModel>, String>((ref, courseId) async {
  final repository = ref.watch(reviewRepositoryProvider);
  return await repository.getCourseReviews(courseId);
});

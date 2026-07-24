import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/review_model.dart';

class ReviewRepository {
  final ApiClient _apiClient;

  ReviewRepository(this._apiClient);

  Future<List<ReviewModel>> getCourseReviews(String courseId) async {
    try {
      final response = await _apiClient.get('${ApiEndpoints.courseReviews}/$courseId/reviews');
      if (response.data['success'] == true) {
        final List list = response.data['reviews'] ?? [];
        return list.map((e) => ReviewModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<bool> createReview({
    required String courseId,
    required double rating,
    required String comment,
  }) async {
    try {
      final response = await _apiClient.post(
        '${ApiEndpoints.courseReviews}/$courseId/review',
        data: {'rating': rating, 'comment': comment},
      );
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }
}

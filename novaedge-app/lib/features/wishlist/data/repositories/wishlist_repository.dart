import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../../../courses/data/models/course_model.dart';

class WishlistRepository {
  final ApiClient _apiClient;

  WishlistRepository(this._apiClient);

  Future<List<CourseModel>> getWishlist() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.wishlist);
      if (response.data['success'] == true) {
        final List list = response.data['wishlist'] ?? response.data['courses'] ?? [];
        return list.map((e) {
          final courseJson = e['course'] ?? e;
          return CourseModel.fromJson(courseJson);
        }).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<bool> toggleWishlist(String courseId) async {
    try {
      final response = await _apiClient.post('${ApiEndpoints.wishlist}/$courseId/toggle');
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }
}

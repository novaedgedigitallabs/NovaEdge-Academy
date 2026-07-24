import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/blog_model.dart';

class BlogRepository {
  final ApiClient _apiClient;

  BlogRepository(this._apiClient);

  Future<List<BlogModel>> getBlogs() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.blogs);
      if (response.data['success'] == true) {
        final List list = response.data['posts'] ?? response.data['blogs'] ?? [];
        return list.map((e) => BlogModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}

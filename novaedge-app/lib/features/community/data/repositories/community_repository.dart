import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/post_model.dart';

class CommunityRepository {
  final ApiClient _apiClient;

  CommunityRepository(this._apiClient);

  Future<List<PostModel>> getPosts() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.postsAll);
      if (response.data['success'] == true) {
        final List list = response.data['posts'] ?? [];
        return list.map((e) => PostModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<bool> createPost(String content) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.createPost,
        data: {'content': content},
      );
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> likePost(String postId) async {
    try {
      final response = await _apiClient.put('${ApiEndpoints.posts}/$postId/like');
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }
}

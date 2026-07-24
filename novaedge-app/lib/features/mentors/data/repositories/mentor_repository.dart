import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/mentor_model.dart';

class MentorRepository {
  final ApiClient _apiClient;

  MentorRepository(this._apiClient);

  Future<List<MentorModel>> getMentors() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.mentors);
      if (response.data['success'] == true) {
        final List list = response.data['mentors'] ?? [];
        return list.map((e) => MentorModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/career_model.dart';

class CareerRepository {
  final ApiClient _apiClient;

  CareerRepository(this._apiClient);

  Future<List<CareerModel>> getCareers() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.careers);
      if (response.data['success'] == true) {
        final List list = response.data['positions'] ?? response.data['careers'] ?? [];
        return list.map((e) => CareerModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}

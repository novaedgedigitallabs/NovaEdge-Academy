import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/certificate_model.dart';

class CertificateRepository {
  final ApiClient _apiClient;

  CertificateRepository(this._apiClient);

  Future<List<CertificateModel>> getMyCertificates() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.myCertificates);
      if (response.data['success'] == true) {
        final List list = response.data['certificates'] ?? [];
        return list.map((e) => CertificateModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<CertificateModel?> generateCertificate(String courseId) async {
    try {
      final response = await _apiClient.post('${ApiEndpoints.generateCertificate}/$courseId');
      if (response.data['success'] == true) {
        return CertificateModel.fromJson(response.data['certificate']);
      }
      return null;
    } catch (_) {
      return null;
    }
  }
}

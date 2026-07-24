import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/notification_model.dart';

class NotificationRepository {
  final ApiClient _apiClient;

  NotificationRepository(this._apiClient);

  Future<List<NotificationModel>> getNotifications() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.notifications);
      if (response.data['success'] == true) {
        final List list = response.data['notifications'] ?? [];
        return list.map((e) => NotificationModel.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<void> markAllRead() async {
    try {
      await _apiClient.put(ApiEndpoints.readAllNotifications);
    } catch (_) {}
  }
}

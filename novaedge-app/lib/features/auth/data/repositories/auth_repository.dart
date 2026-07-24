import 'package:dio/dio.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/storage/token_storage.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiClient _apiClient;

  AuthRepository(this._apiClient);

  Future<UserModel> login({required String email, required String password}) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password},
      );

      if (response.data['success'] == true) {
        final token = response.data['token'];
        if (token != null) {
          await TokenStorage.saveToken(token);
        }
        return UserModel.fromJson(response.data['user']);
      } else {
        throw Exception(response.data['message'] ?? 'Login failed');
      }
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message ?? 'Login failed';
      throw Exception(msg);
    }
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
    String? username,
    String? phoneNumber,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
          if (username != null && username.isNotEmpty) 'username': username,
          if (phoneNumber != null && phoneNumber.isNotEmpty) 'phoneNumber': phoneNumber,
        },
      );

      if (response.data['success'] == true) {
        final token = response.data['token'];
        if (token != null) {
          await TokenStorage.saveToken(token);
        }
        return UserModel.fromJson(response.data['user']);
      } else {
        throw Exception(response.data['message'] ?? 'Registration failed');
      }
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message ?? 'Registration failed';
      throw Exception(msg);
    }
  }

  Future<UserModel?> getProfile() async {
    try {
      final token = await TokenStorage.getToken();
      if (token == null || token.isEmpty) return null;

      final response = await _apiClient.get(ApiEndpoints.me);
      if (response.data['success'] == true) {
        return UserModel.fromJson(response.data['user']);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await _apiClient.get(ApiEndpoints.logout);
    } catch (_) {}
    await TokenStorage.deleteToken();
  }
}

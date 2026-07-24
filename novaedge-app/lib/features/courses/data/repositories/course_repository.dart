import 'package:dio/dio.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/course_model.dart';
import '../models/progress_model.dart';

class CourseRepository {
  final ApiClient _apiClient;

  CourseRepository(this._apiClient);

  Future<List<CourseModel>> getCourses({
    String? category,
    String? level,
    String? search,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (category != null && category.isNotEmpty && category != 'All') {
        queryParams['category'] = category;
      }
      if (level != null && level.isNotEmpty && level != 'All') {
        queryParams['level'] = level;
      }
      if (search != null && search.isNotEmpty) {
        queryParams['keyword'] = search;
      }

      final response = await _apiClient.get(
        ApiEndpoints.courses,
        queryParameters: queryParams,
      );

      if (response.data['success'] == true) {
        final List coursesJson = response.data['courses'] ?? [];
        return coursesJson.map((e) => CourseModel.fromJson(e)).toList();
      }
      return [];
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message ?? 'Failed to load courses';
      throw Exception(msg);
    }
  }

  Future<CourseModel> getCourseDetails(String courseId) async {
    try {
      final response = await _apiClient.get('${ApiEndpoints.courseDetail}/$courseId');
      if (response.data['success'] == true) {
        final courseJson = response.data['course'];
        final isEnrolled = response.data['isEnrolled'] ?? false;
        final course = CourseModel.fromJson(courseJson);
        return course.copyWith(isEnrolled: isEnrolled);
      }
      throw Exception(response.data['message'] ?? 'Course not found');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message ?? 'Failed to load course details';
      throw Exception(msg);
    }
  }

  Future<ProgressModel?> getCourseProgress(String courseId) async {
    try {
      final response = await _apiClient.get('${ApiEndpoints.progress}/$courseId');
      if (response.data['success'] == true) {
        return ProgressModel.fromJson(response.data['progress']);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<void> updateProgress({
    required String courseId,
    required String lectureId,
    required int lastPositionSec,
    required int watchedDurationSec,
    bool completed = false,
  }) async {
    try {
      await _apiClient.post(
        '${ApiEndpoints.progress}/$courseId',
        data: {
          'lectureId': lectureId,
          'lastPositionSec': lastPositionSec,
          'watchedDurationSec': watchedDurationSec,
          'completed': completed,
        },
      );
    } catch (_) {}
  }

  Future<List<CourseModel>> getMyEnrollments() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.myEnrollments);
      if (response.data['success'] == true) {
        final List list = response.data['enrollments'] ?? response.data['courses'] ?? [];
        return list.map((e) {
          final courseData = e['course'] ?? e;
          return CourseModel.fromJson(courseData).copyWith(isEnrolled: true);
        }).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}

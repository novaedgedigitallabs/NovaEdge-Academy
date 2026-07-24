import 'package:flutter_test/flutter_test.dart';
import 'package:novaedge_app/features/auth/data/models/user_model.dart';
import 'package:novaedge_app/features/courses/data/models/course_model.dart';

void main() {
  group('UserModel Tests', () {
    test('UserModel.fromJson parses user correctly', () {
      final json = {
        '_id': 'user_123',
        'name': 'Test Student',
        'email': 'student@novaedge.in',
        'role': 'user',
        'avatar': {'url': 'https://example.com/avatar.jpg'},
      };

      final user = UserModel.fromJson(json);

      expect(user.id, 'user_123');
      expect(user.name, 'Test Student');
      expect(user.email, 'student@novaedge.in');
      expect(user.role, 'user');
      expect(user.avatarUrl, 'https://example.com/avatar.jpg');
    });
  });

  group('CourseModel Tests', () {
    test('CourseModel.fromJson parses free course correctly', () {
      final json = {
        '_id': 'course_999',
        'title': 'Flutter Development Masterclass',
        'description': 'Learn cross platform app development with Flutter & Riverpod.',
        'createdBy': 'NovaEdge Team',
        'category': 'App Development',
        'level': 'Beginner',
        'price': 0,
        'poster': {'url': 'https://example.com/poster.jpg'},
        'techStack': ['Flutter', 'Dart', 'Riverpod'],
        'lectures': [
          {
            '_id': 'lec_1',
            'title': 'Introduction to Flutter',
            'description': 'Setting up Flutter SDK',
            'video': {'url': 'https://youtube.com/watch?v=123'},
            'duration': 15,
          }
        ],
      };

      final course = CourseModel.fromJson(json);

      expect(course.id, 'course_999');
      expect(course.title, 'Flutter Development Masterclass');
      expect(course.price, 0.0);
      expect(course.techStack.length, 3);
      expect(course.lectures.length, 1);
      expect(course.lectures.first.title, 'Introduction to Flutter');
    });
  });
}

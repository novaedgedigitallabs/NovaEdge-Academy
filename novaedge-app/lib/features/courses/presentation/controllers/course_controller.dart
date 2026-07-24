import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/course_model.dart';
import '../../data/models/progress_model.dart';
import '../../data/repositories/course_repository.dart';

final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  return CourseRepository(ref.watch(apiClientProvider));
});

class CourseListState {
  final bool isLoading;
  final List<CourseModel> courses;
  final String selectedCategory;
  final String selectedLevel;
  final String searchQuery;
  final String? error;

  CourseListState({
    this.isLoading = false,
    this.courses = const [],
    this.selectedCategory = 'All',
    this.selectedLevel = 'All',
    this.searchQuery = '',
    this.error,
  });

  CourseListState copyWith({
    bool? isLoading,
    List<CourseModel>? courses,
    String? selectedCategory,
    String? selectedLevel,
    String? searchQuery,
    String? error,
  }) {
    return CourseListState(
      isLoading: isLoading ?? this.isLoading,
      courses: courses ?? this.courses,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      selectedLevel: selectedLevel ?? this.selectedLevel,
      searchQuery: searchQuery ?? this.searchQuery,
      error: error,
    );
  }
}

class CourseListController extends StateNotifier<CourseListState> {
  final CourseRepository _repository;

  CourseListController(this._repository) : super(CourseListState(isLoading: true)) {
    loadCourses();
  }

  Future<void> loadCourses() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final courses = await _repository.getCourses(
        category: state.selectedCategory,
        level: state.selectedLevel,
        search: state.searchQuery,
      );
      state = state.copyWith(isLoading: false, courses: courses);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString().replaceAll('Exception: ', ''));
    }
  }

  void setCategory(String category) {
    state = state.copyWith(selectedCategory: category);
    loadCourses();
  }

  void setLevel(String level) {
    state = state.copyWith(selectedLevel: level);
    loadCourses();
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    loadCourses();
  }
}

final courseListControllerProvider = StateNotifierProvider<CourseListController, CourseListState>((ref) {
  return CourseListController(ref.watch(courseRepositoryProvider));
});

final courseDetailProvider = FutureProvider.family<CourseModel, String>((ref, courseId) async {
  final repository = ref.watch(courseRepositoryProvider);
  return await repository.getCourseDetails(courseId);
});

final courseProgressProvider = FutureProvider.family<ProgressModel?, String>((ref, courseId) async {
  final repository = ref.watch(courseRepositoryProvider);
  return await repository.getCourseProgress(courseId);
});

final myEnrollmentsProvider = FutureProvider<List<CourseModel>>((ref) async {
  final repository = ref.watch(courseRepositoryProvider);
  return await repository.getMyEnrollments();
});

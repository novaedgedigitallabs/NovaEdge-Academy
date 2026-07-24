import 'lecture_model.dart';

class CourseModel {
  final String id;
  final String title;
  final String description;
  final String createdBy;
  final String category;
  final String level;
  final double price;
  final String posterUrl;
  final List<String> techStack;
  final String prerequisites;
  final List<LectureModel> lectures;
  final int views;
  final int numOfVideos;
  final double rating;
  final int numOfReviews;
  final String duration;
  final bool isEnrolled;
  final double percentComplete;

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.createdBy,
    required this.category,
    required this.level,
    required this.price,
    required this.posterUrl,
    required this.techStack,
    required this.prerequisites,
    required this.lectures,
    required this.views,
    required this.numOfVideos,
    required this.rating,
    required this.numOfReviews,
    required this.duration,
    this.isEnrolled = false,
    this.percentComplete = 0.0,
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    String poster = '';
    if (json['poster'] != null && json['poster'] is Map) {
      poster = json['poster']['url'] ?? '';
    } else if (json['poster'] is String) {
      poster = json['poster'];
    }

    List<LectureModel> lecList = [];
    if (json['lectures'] != null && json['lectures'] is List) {
      lecList = (json['lectures'] as List)
          .map((item) => LectureModel.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    List<String> stack = [];
    if (json['techStack'] != null && json['techStack'] is List) {
      stack = List<String>.from(json['techStack']);
    }

    return CourseModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      createdBy: json['createdBy'] ?? 'NovaEdge Instructor',
      category: json['category'] ?? 'Software Development',
      level: json['level'] ?? 'Beginner',
      price: (json['price'] ?? 0).toDouble(),
      posterUrl: poster,
      techStack: stack,
      prerequisites: json['prerequisites'] ?? '',
      lectures: lecList,
      views: json['views'] ?? 0,
      numOfVideos: json['numOfVideos'] ?? lecList.length,
      rating: (json['rating'] ?? 0).toDouble(),
      numOfReviews: json['numOfReviews'] ?? 0,
      duration: json['duration'] ?? '0 min',
      isEnrolled: json['isEnrolled'] ?? false,
      percentComplete: (json['percentComplete'] ?? 0).toDouble(),
    );
  }

  CourseModel copyWith({
    bool? isEnrolled,
    double? percentComplete,
  }) {
    return CourseModel(
      id: id,
      title: title,
      description: description,
      createdBy: createdBy,
      category: category,
      level: level,
      price: price,
      posterUrl: posterUrl,
      techStack: techStack,
      prerequisites: prerequisites,
      lectures: lectures,
      views: views,
      numOfVideos: numOfVideos,
      rating: rating,
      numOfReviews: numOfReviews,
      duration: duration,
      isEnrolled: isEnrolled ?? this.isEnrolled,
      percentComplete: percentComplete ?? this.percentComplete,
    );
  }
}

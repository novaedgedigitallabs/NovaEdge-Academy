class LectureProgress {
  final String lectureId;
  final bool completed;
  final int lastPositionSec;
  final int watchedDurationSec;

  LectureProgress({
    required this.lectureId,
    required this.completed,
    required this.lastPositionSec,
    required this.watchedDurationSec,
  });

  factory LectureProgress.fromJson(Map<String, dynamic> json) {
    return LectureProgress(
      lectureId: json['lectureId'] ?? '',
      completed: json['completed'] ?? false,
      lastPositionSec: json['lastPositionSec'] ?? 0,
      watchedDurationSec: json['watchedDurationSec'] ?? 0,
    );
  }
}

class ProgressModel {
  final String courseId;
  final List<LectureProgress> lectureProgress;
  final double percentComplete;
  final bool isCompleted;

  ProgressModel({
    required this.courseId,
    required this.lectureProgress,
    required this.percentComplete,
    required this.isCompleted,
  });

  factory ProgressModel.fromJson(Map<String, dynamic> json) {
    List<LectureProgress> list = [];
    if (json['lectureProgress'] != null && json['lectureProgress'] is List) {
      list = (json['lectureProgress'] as List)
          .map((e) => LectureProgress.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    return ProgressModel(
      courseId: json['course'] ?? '',
      lectureProgress: list,
      percentComplete: (json['percentComplete'] ?? 0).toDouble(),
      isCompleted: json['isCompleted'] ?? false,
    );
  }
}

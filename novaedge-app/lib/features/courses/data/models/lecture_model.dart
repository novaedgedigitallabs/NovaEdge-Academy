class LectureModel {
  final String id;
  final String title;
  final String description;
  final String videoUrl;
  final int duration; // in minutes
  final String? pdfNotesUrl;
  final String? aiSummary;

  LectureModel({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.duration,
    this.pdfNotesUrl,
    this.aiSummary,
  });

  factory LectureModel.fromJson(Map<String, dynamic> json) {
    String vUrl = '';
    if (json['video'] != null && json['video'] is Map) {
      vUrl = json['video']['url'] ?? '';
    } else if (json['video'] != null && json['video'] is String) {
      vUrl = json['video'];
    }

    String? pdfUrl;
    if (json['notes'] != null && json['notes'] is Map) {
      pdfUrl = json['notes']['url'];
    }

    return LectureModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      videoUrl: vUrl,
      duration: json['duration'] is int ? json['duration'] : int.tryParse(json['duration'].toString()) ?? 0,
      pdfNotesUrl: pdfUrl,
      aiSummary: json['aiSummary'],
    );
  }
}

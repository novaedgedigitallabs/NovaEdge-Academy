class CertificateModel {
  final String id;
  final String certificateId;
  final String courseId;
  final String courseTitle;
  final String? coursePoster;
  final String pdfUrl;
  final DateTime issueDate;

  CertificateModel({
    required this.id,
    required this.certificateId,
    required this.courseId,
    required this.courseTitle,
    this.coursePoster,
    required this.pdfUrl,
    required this.issueDate,
  });

  factory CertificateModel.fromJson(Map<String, dynamic> json) {
    String title = 'Course Certificate';
    String? poster;
    String cId = '';

    if (json['course'] != null && json['course'] is Map) {
      title = json['course']['title'] ?? title;
      cId = json['course']['_id'] ?? '';
      if (json['course']['poster'] != null && json['course']['poster'] is Map) {
        poster = json['course']['poster']['url'];
      }
    } else if (json['course'] is String) {
      cId = json['course'];
    }

    return CertificateModel(
      id: json['_id'] ?? json['id'] ?? '',
      certificateId: json['certificateId'] ?? '',
      courseId: cId,
      courseTitle: title,
      coursePoster: poster,
      pdfUrl: json['pdfUrl'] ?? '',
      issueDate: json['issueDate'] != null
          ? DateTime.tryParse(json['issueDate'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

class BlogModel {
  final String id;
  final String title;
  final String content;
  final String category;
  final String? posterUrl;
  final DateTime createdAt;

  BlogModel({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    this.posterUrl,
    required this.createdAt,
  });

  factory BlogModel.fromJson(Map<String, dynamic> json) {
    String? poster;
    if (json['poster'] != null && json['poster'] is Map) {
      poster = json['poster']['url'];
    } else if (json['poster'] is String) {
      poster = json['poster'];
    }

    return BlogModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? 'Tech',
      posterUrl: poster,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

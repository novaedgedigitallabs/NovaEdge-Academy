class ReviewModel {
  final String id;
  final String userName;
  final String? userAvatar;
  final double rating;
  final String comment;
  final DateTime createdAt;

  ReviewModel({
    required this.id,
    required this.userName,
    this.userAvatar,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    String name = 'Student';
    String? avatar;

    if (json['user'] != null && json['user'] is Map) {
      name = json['user']['name'] ?? name;
      if (json['user']['avatar'] != null && json['user']['avatar'] is Map) {
        avatar = json['user']['avatar']['url'];
      }
    }

    return ReviewModel(
      id: json['_id'] ?? json['id'] ?? '',
      userName: name,
      userAvatar: avatar,
      rating: (json['rating'] ?? 5).toDouble(),
      comment: json['comment'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

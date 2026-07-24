class PostModel {
  final String id;
  final String content;
  final String userName;
  final String? userAvatar;
  final int likesCount;
  final bool isLiked;
  final DateTime createdAt;

  PostModel({
    required this.id,
    required this.content,
    required this.userName,
    this.userAvatar,
    required this.likesCount,
    required this.isLiked,
    required this.createdAt,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    String name = 'Student';
    String? avatar;
    if (json['user'] != null && json['user'] is Map) {
      name = json['user']['name'] ?? 'Student';
      if (json['user']['avatar'] != null && json['user']['avatar'] is Map) {
        avatar = json['user']['avatar']['url'];
      }
    } else if (json['userName'] != null) {
      name = json['userName'];
    }

    final List likes = json['likes'] is List ? json['likes'] : [];

    return PostModel(
      id: json['_id'] ?? json['id'] ?? '',
      content: json['content'] ?? json['text'] ?? '',
      userName: name,
      userAvatar: avatar,
      likesCount: likes.length,
      isLiked: false,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

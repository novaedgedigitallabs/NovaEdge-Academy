class MentorModel {
  final String id;
  final String name;
  final String title;
  final String company;
  final String bio;
  final List<String> expertise;
  final String? avatarUrl;
  final double rating;

  MentorModel({
    required this.id,
    required this.name,
    required this.title,
    required this.company,
    required this.bio,
    required this.expertise,
    this.avatarUrl,
    required this.rating,
  });

  factory MentorModel.fromJson(Map<String, dynamic> json) {
    String? avatar;
    if (json['avatar'] != null && json['avatar'] is Map) {
      avatar = json['avatar']['url'];
    } else if (json['avatar'] is String) {
      avatar = json['avatar'];
    } else if (json['photo'] != null && json['photo'] is Map) {
      avatar = json['photo']['url'];
    }

    List<String> exp = [];
    if (json['expertise'] != null && json['expertise'] is List) {
      exp = List<String>.from(json['expertise']);
    } else if (json['skills'] != null && json['skills'] is List) {
      exp = List<String>.from(json['skills']);
    }

    return MentorModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? json['user']?['name'] ?? 'Industry Expert',
      title: json['title'] ?? json['role'] ?? 'Senior Engineer',
      company: json['company'] ?? 'Tech Corp',
      bio: json['bio'] ?? '',
      expertise: exp,
      avatarUrl: avatar,
      rating: (json['rating'] ?? 4.9).toDouble(),
    );
  }
}

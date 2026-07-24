class UserModel {
  final String id;
  final String name;
  final String email;
  final String? username;
  final String? phoneNumber;
  final String role;
  final String? avatarUrl;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.username,
    this.phoneNumber,
    required this.role,
    this.avatarUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    String? avatar;
    if (json['avatar'] != null) {
      if (json['avatar'] is Map) {
        avatar = json['avatar']['url'];
      } else if (json['avatar'] is String) {
        avatar = json['avatar'];
      }
    }

    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      username: json['username'],
      phoneNumber: json['phoneNumber'],
      role: json['role'] ?? 'user',
      avatarUrl: avatar,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'username': username,
      'phoneNumber': phoneNumber,
      'role': role,
      'avatar': {'url': avatarUrl},
    };
  }
}

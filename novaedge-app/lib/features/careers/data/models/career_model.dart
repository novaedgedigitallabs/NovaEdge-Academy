class CareerModel {
  final String id;
  final String title;
  final String company;
  final String location;
  final String type; // Full-time, Internship, Remote
  final String description;

  CareerModel({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.type,
    required this.description,
  });

  factory CareerModel.fromJson(Map<String, dynamic> json) {
    return CareerModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? json['role'] ?? 'Software Role',
      company: json['company'] ?? 'NovaEdge Partner',
      location: json['location'] ?? 'Remote',
      type: json['type'] ?? json['employmentType'] ?? 'Full-time',
      description: json['description'] ?? '',
    );
  }
}

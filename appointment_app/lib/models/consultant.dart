class Consultant {
  final String id;
  final String name;
  final String specialization;

  Consultant({
    required this.id,
    required this.name,
    required this.specialization,
  });

  factory Consultant.fromJson(Map<String, dynamic> json) {
    return Consultant(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      specialization: json['specialization'] ?? '',
    );
  }
}
class Appointment {
  final String id;
  final String date;
  final String startTime;
  final String endTime;
  final String status;
  final Map<String, dynamic>? consultant;

  Appointment({
    required this.id,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.consultant,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['_id'] ?? '',
      date: json['date'] ?? '',
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
      status: json['status'] ?? '',
      consultant: json['consultant'],
    );
  }
}
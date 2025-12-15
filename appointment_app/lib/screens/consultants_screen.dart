import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/consultant.dart';
import 'book_appointment_screen.dart';

class ConsultantsScreen extends StatefulWidget {
  const ConsultantsScreen({super.key});

  @override
  State<ConsultantsScreen> createState() => _ConsultantsScreenState();
}

class _ConsultantsScreenState extends State<ConsultantsScreen> {
  List<Consultant> _consultants = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadConsultants();
  }

  Future<void> _loadConsultants() async {
    final data = await ApiService.getConsultants();
    setState(() {
      _consultants = data.map((json) => Consultant.fromJson(json)).toList();
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Consultants'), centerTitle: true),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _consultants.length,
              itemBuilder: (context, index) {
                final consultant = _consultants[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Text(consultant.name[0]),
                    ),
                    title: Text(consultant.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(consultant.specialization),
                    trailing: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => BookAppointmentScreen(consultant: consultant),
                          ),
                        );
                      },
                      child: const Text('Book'),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
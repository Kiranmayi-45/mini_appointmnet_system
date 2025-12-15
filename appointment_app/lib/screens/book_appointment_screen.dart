import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../api/api_service.dart';
import '../models/consultant.dart';

class BookAppointmentScreen extends StatefulWidget {
  final Consultant consultant;
  const BookAppointmentScreen({super.key, required this.consultant});

  @override
  State<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends State<BookAppointmentScreen> {
  DateTime? _selectedDate;
  String? _selectedSlot;
  bool _isLoading = false;

  String? _appointmentId;
  final _otpController = TextEditingController();

  final List<String> _timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // ================= DATE =================
  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      selectableDayPredicate: (d) => d.weekday < 6,
    );
    if (date != null) {
      setState(() => _selectedDate = date);
    }
  }

  String _getEndTime(String start) {
    final parts = start.split(':');
    final h = int.parse(parts[0]);
    final m = int.parse(parts[1]) + 30;
    if (m >= 60) return '${h + 1}:${(m - 60).toString().padLeft(2, '0')}';
    return '$h:${m.toString().padLeft(2, '0')}';
  }

  // ================= BOOK =================
  Future<void> _bookAppointment() async {
    if (_selectedDate == null || _selectedSlot == null) {
      _showMessage('Please select date & time');
      return;
    }

    setState(() => _isLoading = true);

    final result = await ApiService.createAppointment(
      consultantId: widget.consultant.id,
      date: DateFormat('yyyy-MM-dd').format(_selectedDate!),
      startTime: _selectedSlot!,
      endTime: _getEndTime(_selectedSlot!),
    );

    setState(() => _isLoading = false);

    if (result['appointmentId'] != null) {
      _appointmentId = result['appointmentId'];
      _showOtpDialog();
    } else {
      _showMessage(result['message'] ?? 'Booking failed');
    }
  }

  // ================= OTP DIALOG =================
  void _showOtpDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Verify OTP'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('OTP sent to your email'),
              const SizedBox(height: 12),
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                decoration: const InputDecoration(
                  labelText: 'Enter OTP',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () => _verifyOtp(dialogContext),
              child: const Text('Verify'),
            ),
          ],
        );
      },
    );
  }

  // ================= VERIFY OTP =================
  Future<void> _verifyOtp(BuildContext dialogContext) async {
    if (_otpController.text.isEmpty) {
      _showMessage('Enter OTP');
      return;
    }

    setState(() => _isLoading = true);

    final result = await ApiService.verifyOtp(
      appointmentId: _appointmentId!,
      otp: _otpController.text,
    );

    setState(() => _isLoading = false);

    if (result['message'] != null &&
        result['message'].toString().toLowerCase().contains('confirmed')) {

      // ✅ CLOSE DIALOG
      Navigator.of(dialogContext).pop();

      // ✅ SHOW SUCCESS
      _showMessage('Appointment Confirmed ✅');

      // ✅ GO BACK TO PREVIOUS SCREEN
      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) Navigator.pop(context);
      });

    } else {
      _showMessage(result['message'] ?? 'Invalid OTP');
    }
  }

  void _showMessage(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  // ================= UI =================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Book with ${widget.consultant.name}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: _selectDate,
              icon: const Icon(Icons.calendar_today),
              label: Text(
                _selectedDate == null
                    ? 'Select Date'
                    : DateFormat('EEE, MMM d').format(_selectedDate!),
              ),
            ),
            const SizedBox(height: 12),
            if (_selectedDate != null)
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 2,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: _timeSlots.length,
                  itemBuilder: (_, i) {
                    final slot = _timeSlots[i];
                    final selected = _selectedSlot == slot;
                    return InkWell(
                      onTap: () => setState(() => _selectedSlot = slot),
                      child: Container(
                        decoration: BoxDecoration(
                          color: selected ? Colors.blue : Colors.grey[300],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            slot,
                            style: TextStyle(
                              color: selected ? Colors.white : Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ElevatedButton(
              onPressed: _isLoading ? null : _bookAppointment,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Confirm Booking'),
            ),
          ],
        ),
      ),
    );
  }
}

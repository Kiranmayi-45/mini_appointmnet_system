import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Change this URL based on your setup:
  // For Web: 'http://localhost:4000/api'
  // For Android Emulator: 'http://10.0.2.2:4000/api'
  // For Physical Device: 'http://YOUR_COMPUTER_IP:4000/api'
  // static const String baseUrl = '';
  static const String baseUrl = 'http://localhost:4000/api';
  // static const String baseUrl = 'http://127.0.0.1:4000/api';



  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _getHeaders({bool auth = false}) async {
    final headers = {'Content-Type': 'application/json'};
    if (auth) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // Auth APIs
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      print('🔵 Attempting login...');
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: await _getHeaders(),
        body: jsonEncode({'email': email, 'password': password}),
      );
      
      print('🔵 Response status: ${response.statusCode}');
      final data = jsonDecode(response.body);
      print('🔵 Response data: $data');
      
      if (response.statusCode == 200) {
        // Backend returns: { token, role, name }
        // Transform to include user object for consistency
        return {
          'token': data['token'],
          'user': {
            'name': data['name'],
            'email': email,
            'role': data['role']
          }
        };
      }
      
      return data;
    } catch (e) {
      print('❌ Login error: $e');
      return {'error': 'Connection failed: $e'};
    }
  }

 static Future<Map<String, dynamic>> register(
  String name,
  String email,
  String password,
) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return {
        'token': data['token'],
        'user': {
          'name': data['name'],
          'email': data['email'],
          'role': data['role'],
        }
      };
    }

    return data;
  } catch (e) {
    return {'error': 'Connection failed'};
  }
}

  // Consultants
  static Future<List<dynamic>> getConsultants() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/consultants'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('❌ Error fetching consultants: $e');
      return [];
    }
  }

  // Appointments
  static Future<Map<String, dynamic>> createAppointment({
    required String consultantId,
    required String date,
    required String startTime,
    required String endTime,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/appointments'),
        headers: await _getHeaders(auth: true),
        body: jsonEncode({
          'consultantId': consultantId,
          'date': date,
          'startTime': startTime,
          'endTime': endTime,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      print('❌ Error creating appointment: $e');
      return {'error': 'Connection failed: $e'};
    }
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String appointmentId,
    required String otp,
  }) async {
    try {
      print('🔵 Verifying OTP for appointment: $appointmentId');
      final response = await http.post(
        Uri.parse('$baseUrl/appointments/verify-otp'),
        headers: await _getHeaders(auth: true),
        body: jsonEncode({
          'appointmentId': appointmentId,
          'otp': otp,
        }),
      );
      
      print('🔵 OTP verification response: ${response.statusCode}');
      final data = jsonDecode(response.body);
      print('🔵 Response data: $data');
      
      return data;
    } catch (e) {
      print('❌ Error verifying OTP: $e');
      return {'error': 'Connection failed: $e'};
    }
  }

  static Future<List<dynamic>> getMyAppointments() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/appointments/me'),
        headers: await _getHeaders(auth: true),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('❌ Error fetching appointments: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>> cancelAppointment(String id) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/appointments/$id/cancel'),
        headers: await _getHeaders(auth: true),
      );
      return jsonDecode(response.body);
    } catch (e) {
      print('❌ Error cancelling appointment: $e');
      return {'error': 'Connection failed: $e'};
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }
}
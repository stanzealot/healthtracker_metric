import 'package:chart_app/models/metric.dart';
import 'package:chart_app/providers/user_provider.dart';
import 'package:chart_app/services/auth_services.dart';
import 'package:chart_app/utils/constants.dart';
import 'package:chart_app/widgets/chart/chart.dart';
import 'package:chart_app/widgets/metrics_list/metrics_list.dart';
import 'package:chart_app/widgets/new_metric.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() {
    return _HomeScreenState();
  }
}

class _HomeScreenState extends State<HomeScreen> {
  Category? getCategoryFromString(String categoryString) {
    switch (categoryString) {
      case 'steps':
        return Category.steps;
      case 'waterIntake':
        return Category.waterIntake;
      case 'calorieConsumption':
        return Category.calorieConsumption;
      default:
        return null; // Handle unknown category strings
    }
  }

  List<Metric> _registeredMetrics = [];

  void _openAddExpenseOverlay() {
    showModalBottomSheet(
      isScrollControlled: true,
      useSafeArea: true,
      context: context,
      builder: (ctx) => NewMetric(
        onAddMetric: _addMetric,
      ),
    );
  }

  void _addMetric(Metric metric) {
    setState(() {
      _registeredMetrics.add(metric);
    });
  }

  void _removeMetric(Metric metric) async {
    final metricIndex = _registeredMetrics.indexOf(metric);

    setState(() {
      _registeredMetrics.remove(metric);
    });

    try {
      var userProvider = Provider.of<UserProvider>(context, listen: false);
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('x-auth-token');

      if (token == null) {
        prefs.setString('x-auth-token', '');
      }
      final Uri uri = Uri.parse('${Constants.uri}/api/delete/${metric.id}');
      final response = await http.delete(
        uri,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': token!,
        },
      );

      // Check if the request was successful (status code 200)
      if (response.statusCode == 200) {
        // clear info message first before adding another
        ScaffoldMessenger.of(context).clearSnackBars();
        // adding an info message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            duration: const Duration(seconds: 3),
            content: const Text('Metric Deleted'),
            action: SnackBarAction(
              label: 'Undo',
              onPressed: () {
                setState(
                  () {
                    _registeredMetrics.insert(metricIndex, metric);
                  },
                );
              },
            ),
          ),
        );
      } else {
        // Show error message if the request was not successful
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to delete metric. Please try again later.'),
          ),
        );
      }

      print(response.body);
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      print('Error: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('An error occurred while deleting the metric.'),
        ),
      );
    }

    // clear info message first before adding another
    ScaffoldMessenger.of(context).clearSnackBars();
    // adding an info messages
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        duration: const Duration(seconds: 3),
        content: const Text('Metric Deleted'),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () {
            setState(
              () {
                _registeredMetrics.insert(metricIndex, metric);
              },
            );
          },
        ),
      ),
    );
  }

  void signOutUser(BuildContext context) {
    AuthService().signOut(context);
  }

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  void _loadItems() async {
    var userProvider = Provider.of<UserProvider>(context, listen: false);
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('x-auth-token');

    if (token == null) {
      prefs.setString('x-auth-token', '');
    }
    var response = await http.get(
      Uri.parse('${Constants.uri}/api'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'x-auth-token': token!
      },
    );

    final List<dynamic> responseData = json.decode(response.body);

    // final List<Metric> _loadedItems = [];
    // // Create a list of Metric objects from ListData
    // List<Metric> metrics = ListData.map((data) {
    //   Category? category = getCategoryFromString(data['category']);
    //   return Metric(
    //     title: data['category'],
    //     amount: double.parse(data['quantity']),
    //     date: DateTime.parse(data['date']),
    //     category: category ??
    //         Category.steps, // Default to Category.steps if category is unknown
    //   );
    // }).toList();

    // setState(() {
    //   _registeredMetrics = metrics;
    // });
    setState(() {
      _registeredMetrics = responseData.map((data) {
        return Metric(
          id: data['id'],
          amount: double.parse(data['quantity']),
          date: DateTime.parse(data['date']),
          category: getCategoryFromString(data['category']) ?? Category.steps,
        );
      }).toList();
    });
  }

  Widget build(BuildContext context) {
    var user = Provider.of<UserProvider>(context).user;
    Widget mainContent = const Center(
      child: Text('No Metric Found. Start adding some Metrics!'),
    );

    if (_registeredMetrics.isNotEmpty) {
      mainContent = MetricsList(
        metrics: _registeredMetrics,
        onRemoveMetric: _removeMetric,
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome ${user.name}'),
        actions: [
          IconButton(
            onPressed: _openAddExpenseOverlay,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Column(
        children: [
          Chart(metrics: _registeredMetrics),
          Expanded(child: mainContent),
        ],
      ),
    );
  }
}

import 'dart:io';
import 'package:chart_app/models/metric.dart';
import 'package:chart_app/providers/user_provider.dart';
import 'package:chart_app/utils/constants.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

final DateFormat dateFormat = DateFormat("yyyy-MM-dd");

class NewMetric extends StatefulWidget {
  const NewMetric({required this.onAddMetric, super.key});
  final void Function(Metric metric) onAddMetric;

  @override
  State<NewMetric> createState() {
    return _NewMetricState();
  }
}

class _NewMetricState extends State<NewMetric> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  DateTime? _selectedDate;
  Category _selectedCategory = Category.steps;

  void _presentDatePick() async {
    final now = DateTime.now();
    final firstDate = DateTime(now.year - 1, now.month, now.day);
    final pickedDate = await showDatePicker(
      context: context,
      firstDate: firstDate,
      lastDate: now,
    );
    setState(() {
      _selectedDate = pickedDate;
    });
  }

  void _showDialog() {
    if (Platform.isIOS) {
      showCupertinoDialog(
        context: context,
        builder: (ctx) => CupertinoAlertDialog(
          title: const Text('Invalid Input'),
          content: const Text(
              'Make sure a valid amount,date and Category was entered.'),
          actions: [
            TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                },
                child: const Text('Okay')),
          ],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Invalid Input'),
          content: const Text(
              'Make sure a valid steps,date and Category was entered.'),
          actions: [
            TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                },
                child: const Text('Okay')),
          ],
        ),
      );
    }
  }

  void _submitExpenseData() async {
    final enteredAmount = double.tryParse(_amountController
        .text); //tryParse('hello')=> null, tryParse('1.12') => 1.12
    final amountIsInvalid = enteredAmount == null || enteredAmount <= 0;
    if (amountIsInvalid || _selectedDate == null) {
      _showDialog();
      return;
    }

    try {
      var userProvider = Provider.of<UserProvider>(context, listen: false);
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('x-auth-token');

      if (token == null) {
        prefs.setString('x-auth-token', '');
      }

      print(token);
      print(_selectedCategory.name);

      var tokenRes = await http.post(
        Uri.parse('${Constants.uri}/api/create'),
        body: json.encode({
          'quantity': _amountController.text,
          'date':
              _selectedDate != null ? dateFormat.format(_selectedDate!) : '',
          'category': _selectedCategory.name,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': token!,
        },
      );

      print(tokenRes.body);
    } catch (err) {
      print(err);
    }

    widget.onAddMetric(
      Metric(
          id: _titleController.text,
          amount: enteredAmount,
          date: _selectedDate!,
          category: _selectedCategory),
    );
    Navigator.pop(context);
  }

  void _cancel() {
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    final keyboardSpace = MediaQuery.of(context).viewInsets.bottom;

    return LayoutBuilder(builder: (ctx, constraints) {
      final width = constraints.maxWidth;
      return SizedBox(
        height: double.infinity,
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, keyboardSpace + 16),
            child: Column(
              children: [
                const SizedBox(
                  height: 50,
                ),
                DropdownButton(
                  value: _selectedCategory,
                  items: Category.values
                      .map(
                        (category) => DropdownMenuItem(
                          value: category,
                          child: Text(
                            category.name.toUpperCase(),
                          ),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    if (value == null) {
                      return;
                    }
                    setState(() {
                      _selectedCategory = value;
                    });
                  },
                ),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _amountController,
                        maxLength: 50,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: _selectedCategory == Category.steps
                              ? ''
                              : _selectedCategory == Category.waterIntake
                                  ? '(ml)  '
                                  : _selectedCategory ==
                                          Category.calorieConsumption
                                      ? '(kcal)  '
                                      : '',
                          label: Text("Quantity"),
                        ),
                      ),
                    ),
                    const SizedBox(
                      width: 16,
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(_selectedDate == null
                              ? 'no date selected'
                              : formatter.format(_selectedDate!)),
                          IconButton(
                            onPressed: _presentDatePick,
                            icon: const Icon(Icons.calendar_month),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 16,
                ),
                Row(
                  children: [
                    // const Spacer(),
                    TextButton(onPressed: _cancel, child: const Text('Cancel')),
                    const SizedBox(
                      width: 20,
                    ),
                    ElevatedButton(
                      onPressed: _submitExpenseData,
                      child: const Text("save Matrics"),
                    )
                  ],
                )
              ],
            ),
          ),
        ),
      );
    });
  }
}

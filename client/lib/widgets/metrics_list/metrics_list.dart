import 'package:chart_app/models/metric.dart';
import 'package:chart_app/widgets/metrics_list/metric_item.dart';

import 'package:flutter/material.dart';

class MetricsList extends StatelessWidget {
  const MetricsList(
      {super.key, required this.metrics, required this.onRemoveMetric});

  final List<Metric> metrics;
  final void Function(Metric metric) onRemoveMetric;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: metrics.length,
      itemBuilder: (ctx, index) => Dismissible(
        key: ValueKey(metrics[index]),
        background: Container(
          color: Theme.of(context).colorScheme.error,
          margin: EdgeInsets.symmetric(
            horizontal: Theme.of(context).cardTheme.margin!.horizontal,
          ),
        ),
        onDismissed: (direction) {
          onRemoveMetric(metrics[index]);
        },
        child: MetricItem(
          metric: metrics[index],
        ),
      ),
    );
  }
}

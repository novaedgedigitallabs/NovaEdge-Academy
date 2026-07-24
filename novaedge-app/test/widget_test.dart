import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:novaedge_app/main.dart';

void main() {
  testWidgets('NovaEdgeApp instantiates cleanly', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: NovaEdgeApp(),
      ),
    );
    expect(find.byType(NovaEdgeApp), findsOneWidget);
  });
}

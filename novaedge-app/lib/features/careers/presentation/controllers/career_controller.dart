import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/career_model.dart';
import '../../data/repositories/career_repository.dart';

final careerRepositoryProvider = Provider<CareerRepository>((ref) {
  return CareerRepository(ref.watch(apiClientProvider));
});

final careersProvider = FutureProvider<List<CareerModel>>((ref) async {
  final repository = ref.watch(careerRepositoryProvider);
  return await repository.getCareers();
});

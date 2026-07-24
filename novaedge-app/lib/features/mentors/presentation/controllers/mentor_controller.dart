import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/mentor_model.dart';
import '../../data/repositories/mentor_repository.dart';

final mentorRepositoryProvider = Provider<MentorRepository>((ref) {
  return MentorRepository(ref.watch(apiClientProvider));
});

final mentorsProvider = FutureProvider<List<MentorModel>>((ref) async {
  final repository = ref.watch(mentorRepositoryProvider);
  return await repository.getMentors();
});

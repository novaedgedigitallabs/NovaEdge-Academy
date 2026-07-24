import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/models/certificate_model.dart';
import '../../data/repositories/certificate_repository.dart';

final certificateRepositoryProvider = Provider<CertificateRepository>((ref) {
  return CertificateRepository(ref.watch(apiClientProvider));
});

final myCertificatesProvider = FutureProvider<List<CertificateModel>>((ref) async {
  final repository = ref.watch(certificateRepositoryProvider);
  return await repository.getMyCertificates();
});

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/certificate_controller.dart';

class CertificatesScreen extends ConsumerWidget {
  const CertificatesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final certificatesAsync = ref.watch(myCertificatesProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('My Certificates'),
        backgroundColor: AppColors.bgBase,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(myCertificatesProvider),
        color: AppColors.primary500,
        backgroundColor: AppColors.bgSurface,
        child: certificatesAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
          error: (err, _) => Center(
            child: Text('Failed to load certificates or login required.', style: const TextStyle(color: AppColors.text3)),
          ),
          data: (certificates) {
            if (certificates.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.gold500.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.workspace_premium, size: 64, color: AppColors.gold400),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'No Certificates Earned Yet',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Complete 100% of a course to automatically generate your official certificate.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.text2),
                      ),
                    ],
                  ),
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: certificates.length,
              itemBuilder: (context, index) {
                final cert = certificates[index];
                final formattedDate = DateFormat('MMM dd, yyyy').format(cert.issueDate);

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.gold500.withValues(alpha: 0.3)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.gold500.withValues(alpha: 0.05),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.gold500.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.workspace_premium, color: AppColors.gold400, size: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cert.courseTitle,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.text1),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Issued on $formattedDate',
                                  style: const TextStyle(color: AppColors.text3, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Credential ID: ${cert.certificateId}',
                        style: const TextStyle(color: AppColors.cyan300, fontSize: 12, fontFamily: 'monospace'),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                final uri = Uri.parse(cert.pdfUrl);
                                if (await canLaunchUrl(uri)) {
                                  await launchUrl(uri);
                                }
                              },
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppColors.gold500),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              icon: const Icon(Icons.picture_as_pdf, color: AppColors.gold400, size: 18),
                              label: const Text('View PDF', style: TextStyle(color: AppColors.gold400, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../courses/presentation/controllers/course_controller.dart';
import '../controllers/payment_controller.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  final String courseId;

  const CheckoutScreen({super.key, required this.courseId});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _couponController = TextEditingController();
  late Razorpay _razorpay;
  String? _currentOrderId;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _couponController.dispose();
    _razorpay.clear();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    final notifier = ref.read(paymentControllerProvider.notifier);
    final verified = await notifier.verifyPayment(
      razorpayOrderId: response.orderId ?? _currentOrderId ?? '',
      razorpayPaymentId: response.paymentId ?? '',
      razorpaySignature: response.signature ?? '',
      courseId: widget.courseId,
      couponCode: _couponController.text.trim().isNotEmpty ? _couponController.text.trim() : null,
    );

    if (mounted) {
      if (verified) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Payment Verified! Course Enrolled Successfully.'),
            backgroundColor: AppColors.success,
          ),
        );
        ref.invalidate(courseDetailProvider(widget.courseId));
        ref.invalidate(myEnrollmentsProvider);
        context.go('/my-courses');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Payment Verification Failed! Contact support.'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Payment Failed: ${response.message}'),
        backgroundColor: AppColors.error,
      ),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {}

  void _startPaymentProcess() async {
    final user = ref.read(authControllerProvider).user;
    if (user == null) return;

    final paymentNotifier = ref.read(paymentControllerProvider.notifier);
    final result = await paymentNotifier.checkout(
      courseId: widget.courseId,
      couponCode: _couponController.text.trim().isNotEmpty ? _couponController.text.trim() : null,
    );

    if (result == null || !mounted) return;

    if (result.isFreeEnrollment) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enrolled in free course!'), backgroundColor: AppColors.success),
      );
      ref.invalidate(courseDetailProvider(widget.courseId));
      ref.invalidate(myEnrollmentsProvider);
      context.go('/my-courses');
      return;
    }

    _currentOrderId = result.orderId;

    final options = {
      'key': result.razorpayKey ?? 'rzp_test_default',
      'amount': (result.finalAmount * 100).toInt(),
      'name': 'NovaEdge Academy',
      'order_id': result.orderId,
      'description': 'Course Enrollment Payment',
      'prefill': {
        'contact': user.phoneNumber ?? '',
        'email': user.email,
        'name': user.name,
      },
      'theme': {
        'color': '#9333EA',
      }
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      debugPrint('Razorpay error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final courseAsync = ref.watch(courseDetailProvider(widget.courseId));
    final paymentState = ref.watch(paymentControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        title: const Text('Checkout'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: courseAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
        error: (err, _) => Center(child: Text(err.toString(), style: const TextStyle(color: AppColors.error))),
        data: (course) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Order Summary Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderDefault),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Order Summary', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.text1)),
                      const SizedBox(height: 12),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(course.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.text1)),
                          ),
                          const SizedBox(width: 12),
                          Text('₹${course.price.toInt()}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary400)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Category: ${course.category}', style: const TextStyle(color: AppColors.text3, fontSize: 13)),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Coupon Code Section
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderDefault),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Apply Coupon Code', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.text1)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _couponController,
                              style: const TextStyle(color: AppColors.text1),
                              textCapitalization: TextCapitalization.characters,
                              decoration: const InputDecoration(
                                hintText: 'PROMO50',
                                contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            onPressed: () => setState(() {}),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.cyan500,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            ),
                            child: const Text('Apply', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Pay Now Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: paymentState.isLoading ? null : _startPaymentProcess,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary500,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: paymentState.isLoading
                        ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                        : Text(
                            'Proceed to Pay ₹${course.price.toInt()}',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

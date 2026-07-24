import 'package:dio/dio.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';

class CheckoutResult {
  final bool isFreeEnrollment;
  final String? orderId;
  final double finalAmount;
  final double discountAmount;
  final String? razorpayKey;

  CheckoutResult({
    required this.isFreeEnrollment,
    this.orderId,
    required this.finalAmount,
    required this.discountAmount,
    this.razorpayKey,
  });
}

class PaymentRepository {
  final ApiClient _apiClient;

  PaymentRepository(this._apiClient);

  Future<CheckoutResult> processCheckout({
    required String courseId,
    String? couponCode,
    bool useWallet = false,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.checkout,
        data: {
          'courseId': courseId,
          if (couponCode != null && couponCode.isNotEmpty) 'couponCode': couponCode,
          'useWallet': useWallet,
        },
      );

      if (response.data['success'] == true) {
        final bool free = response.data['freeEnrollment'] ?? false;
        if (free) {
          return CheckoutResult(
            isFreeEnrollment: true,
            finalAmount: 0.0,
            discountAmount: (response.data['discountAmount'] ?? 0).toDouble(),
          );
        }

        final order = response.data['order'];
        final orderId = order != null ? order['id'] : null;
        final double finalAmt = (response.data['finalAmount'] ?? 0).toDouble();
        final double discAmt = (response.data['discountAmount'] ?? 0).toDouble();

        // Get Razorpay Key
        String? key;
        try {
          final keyRes = await _apiClient.get(ApiEndpoints.razorpayKey);
          if (keyRes.data['success'] == true) {
            key = keyRes.data['key'];
          }
        } catch (_) {}

        return CheckoutResult(
          isFreeEnrollment: false,
          orderId: orderId,
          finalAmount: finalAmt,
          discountAmount: discAmt,
          razorpayKey: key,
        );
      }
      throw Exception(response.data['message'] ?? 'Checkout failed');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? e.message ?? 'Checkout error';
      throw Exception(msg);
    }
  }

  Future<bool> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String courseId,
    String? couponCode,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.paymentVerification,
        data: {
          'razorpay_order_id': razorpayOrderId,
          'razorpay_payment_id': razorpayPaymentId,
          'razorpay_signature': razorpaySignature,
          'courseId': courseId,
          if (couponCode != null) 'couponCode': couponCode,
        },
      );
      return response.data['success'] == true;
    } catch (_) {
      return false;
    }
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/repositories/payment_repository.dart';

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepository(ref.watch(apiClientProvider));
});

class PaymentState {
  final bool isLoading;
  final String? error;
  final bool isSuccess;

  PaymentState({
    this.isLoading = false,
    this.error,
    this.isSuccess = false,
  });

  PaymentState copyWith({
    bool? isLoading,
    String? error,
    bool? isSuccess,
  }) {
    return PaymentState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isSuccess: isSuccess ?? this.isSuccess,
    );
  }
}

class PaymentController extends StateNotifier<PaymentState> {
  final PaymentRepository _repository;

  PaymentController(this._repository) : super(PaymentState());

  Future<CheckoutResult?> checkout({
    required String courseId,
    String? couponCode,
    bool useWallet = false,
  }) async {
    state = state.copyWith(isLoading: true, error: null, isSuccess: false);
    try {
      final result = await _repository.processCheckout(
        courseId: courseId,
        couponCode: couponCode,
        useWallet: useWallet,
      );
      state = state.copyWith(isLoading: false, isSuccess: result.isFreeEnrollment);
      return result;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString().replaceAll('Exception: ', ''));
      return null;
    }
  }

  Future<bool> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String courseId,
    String? couponCode,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final success = await _repository.verifyPayment(
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        courseId: courseId,
        couponCode: couponCode,
      );
      state = state.copyWith(isLoading: false, isSuccess: success);
      return success;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString().replaceAll('Exception: ', ''));
      return false;
    }
  }
}

final paymentControllerProvider = StateNotifierProvider<PaymentController, PaymentState>((ref) {
  return PaymentController(ref.watch(paymentRepositoryProvider));
});

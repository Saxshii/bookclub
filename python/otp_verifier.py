def verify_otp(generated_otp, entered_otp):
    """Verify whether the entered OTP matches the generated OTP."""
    return generated_otp.strip() == entered_otp.strip()
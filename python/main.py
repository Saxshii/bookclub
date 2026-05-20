from otp_generator import generate_otp
from otp_verifier import verify_otp

MAX_ATTEMPTS = 3
def run_otp_verification():
    print("   OTP VERIFICATION SYSTEM")

    otp = generate_otp(length=6)
    print(f"\n[SYSTEM] Your OTP has been generated.")
    print(f"[DEMO]   OTP (visible for testing): {otp}\n")

    attempts = 0
    verified = False
    while attempts < MAX_ATTEMPTS:
        remaining = MAX_ATTEMPTS - attempts
        entered = input(f"Enter OTP ({remaining} attempt(s) left): ").strip()

        if not entered.isdigit():
            print("  Invalid input. Please enter digits only.\n")
            continue
        attempts += 1

        if verify_otp(otp, entered):
            print("\n  Access Granted! OTP verified successfully.")
            verified = True
            break
        else:
            if attempts < MAX_ATTEMPTS:
                print("  Incorrect OTP. Please try again.\n")
            else:
                print("\n  Too many failed attempts. Access Denied.")

    if not verified and attempts >= MAX_ATTEMPTS:
        print("\n[SYSTEM] Your account has been temporarily locked.")

    print("\n" + "=" * 40)

if __name__ == "__main__":
    run_otp_verification()
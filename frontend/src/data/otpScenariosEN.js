export const otpScenariosEN = [
  // --- TAX SCAMS (5 Scenarios) ---
  {
    id: 1,
    category: 'tax',
    sender: 'IT-REFUND',
    content: "Dear Citizen, your tax refund of Rs 12,400 is approved. Claim immediately: http://incometax-india-gov.org.in",
    sandbox: {
      title: "Income Tax Portal",
      fakeUrl: "http://incometax-india-gov.org.in",
      inputLabel: "Enter PAN & OTP sent to mobile:",
      btnText: "Claim ₹12,400 Refund"
    },
    consequenceWrong: "By typing your OTP on this fake site, scammers bypass your bank's security and drain your savings instantly.",
    explanationRight: "Great observation!\n\n❌ FAKE LINK: http://incometax-india-gov.org.in\n✅ TRUE LINK: https://www.incometax.gov.in\n\nThe real IT department NEVER sends insecure 'http' links or asks for banking OTPs to process refunds.",
    redFlags: ["Urgency", "Fake '.org.in' URL", "Promises immediate money"]
  },
  {
    id: 2,
    category: 'tax',
    sender: 'TAX-DEPT',
    content: "URGENT: Your ITR filing has errors. Pay Rs 150 penalty by clicking here or face legal action: http://itr-penalty-pay.com",
    sandbox: {
      title: "e-Filing Penalty Payment",
      fakeUrl: "http://itr-penalty-pay.com",
      inputLabel: "Enter Card Number & OTP:",
      btnText: "Pay ₹150 Penalty"
    },
    consequenceWrong: "You just handed your credit card details and OTP to criminals. They will steal thousands, not just ₹150.",
    explanationRight: "Smart move!\n\n❌ FAKE ALERT: Threats of legal action over SMS.\n✅ TRUE PROCESS: Genuine notices are sent via physical mail or verifiable emails through the official portal. They never demand sudden payments via random shortened links.",
    redFlags: ["Threat of legal action", "Demand for urgent payment", "Suspicious domain"]
  },
  {
    id: 3,
    category: 'tax',
    sender: 'GOV-TAX',
    content: "Good News! You are selected for a special Covid Tax Relief of ₹25,000. Verify Aadhaar OTP: http://tax-relief-funds.in",
    sandbox: {
      title: "Govt Relief Fund",
      fakeUrl: "http://tax-relief-funds.in",
      inputLabel: "Enter Aadhaar Number & Aadhaar OTP:",
      btnText: "Verify Aadhaar"
    },
    consequenceWrong: "Entering your Aadhaar OTP gives hackers access to your digital identity. They can take loans in your name.",
    explanationRight: "Perfect!\n\n❌ FAKE RELIEF: Unsolicited offers of free government funds.\n✅ TRUE FACT: The government does not distribute random relief funds via SMS. Never share your Aadhaar OTP on unverified links.",
    redFlags: ["Free money offer", "Asking for Aadhaar OTP", "Unofficial '.in' link"]
  },
  {
    id: 4,
    category: 'tax',
    sender: 'IT-HELPDESK',
    content: "Dear Taxpayer, your PAN card is expiring. To prevent account freeze, complete e-verification: bit.ly/pan-verify-now",
    sandbox: {
      title: "PAN e-Verification",
      fakeUrl: "bit.ly/pan-verify-now",
      inputLabel: "Enter PAN & Bank OTP:",
      btnText: "Verify PAN"
    },
    consequenceWrong: "A PAN card never expires! This was a trick to steal your Bank OTP and empty your account.",
    explanationRight: "Very safe!\n\n❌ FAKE EXPIRY: PAN cards have lifetime validity.\n✅ TRUE FACT: Scammers create fake emergencies ('account freeze') to panic you into sharing sensitive OTPs.",
    redFlags: ["Impossible PAN expiry", "Shortened Bit.ly link", "Panic-inducing freeze threat"]
  },
  {
    id: 5,
    category: 'tax',
    sender: 'CA-SERVICES',
    content: "Get your max IT refund within 24 hours guaranteed! Click here to share your NetBanking credentials to start: http://fast-ca-refund.com",
    sandbox: {
      title: "Fast CA Refund Desk",
      fakeUrl: "http://fast-ca-refund.com",
      inputLabel: "Enter NetBanking User ID & Password:",
      btnText: "Generate Refund"
    },
    consequenceWrong: "Giving your NetBanking credentials is the ultimate mistake. Scammers will completely hijack your core banking account.",
    explanationRight: "Excellent!\n\n❌ FAKE PROMISE: Guaranteed 24-hour max refunds.\n✅ TRUE RULE: NEVER share your NetBanking password with ANYONE, not even a real Chartered Accountant. Refunds are processed securely by the government only.",
    redFlags: ["Guaranteed abnormal speed", "Asking for core passwords", "Third-party mediator"]
  },
  {
    id: 901,
    category: 'tax',
    isLegitimate: true,
    sender: 'INCOMETAX',
    content: "Dear Taxpayer, your Income Tax Return for AY 2024-25 has been processed. Log in to your e-Filing account to view details: https://www.incometax.gov.in",
    sandbox: {
      title: "Income Tax e-Filing",
      fakeUrl: "https://www.incometax.gov.in",
      inputLabel: "Enter PAN & Password:",
      btnText: "Secure Login"
    },
    consequenceWrong: "You just deleted an important notification from the Income Tax department! Legitimate messages will always use official '.gov.in' links. It was safe to open.",
    explanationRight: "Perfect!\n\n✅ SECURE LINK: https://www.incometax.gov.in\n\nThis is the authentic government portal. The domain ends in '.gov.in' and uses 'https'. It is completely safe to log in here.",
    redFlags: []
  },

  // --- KYC SCAMS (5 Scenarios) ---
  {
    id: 6,
    category: 'kyc',
    sender: 'HDFC-ALERT',
    content: "Dear Customer, your NetBanking is BLOCKED. Update KYC immediately to unblock: http://update-kyc-hdfc.net/verify",
    sandbox: {
      title: "Bank KYC Portal",
      fakeUrl: "http://update-kyc-hdfc.net/verify",
      inputLabel: "Enter Account No. & Mobile OTP:",
      btnText: "Verify KYC Now"
    },
    consequenceWrong: "By typing your OTP on this fake site, you just gave criminals the key to authorize a massive withdrawal from your account.",
    explanationRight: "Awesome!\n\n❌ FAKE LINK: http://update-kyc-hdfc.net\n✅ TRUE LINK: https://www.hdfcbank.com\n\nBanks never send URLs via SMS for KYC. If your KYC is truly due, log in to the official App securely.",
    redFlags: ["Extreme panic (BLOCKED)", "Fake bank URL"]
  },
  {
    id: 7,
    category: 'kyc',
    sender: 'SBI-SUPPORT',
    content: "Your SBI YONO app will be deactivated in 10 mins due to Aadhar unlinked. Link now: http://sbi-yono-kyc-update.com",
    sandbox: {
      title: "YONO SBI Update",
      fakeUrl: "http://sbi-yono-kyc-update.com",
      inputLabel: "Enter Username, Password & Profile Password:",
      btnText: "Link Aadhaar"
    },
    consequenceWrong: "Sharing your Profile Password gives hackers the power to add new payee accounts and steal all your money permanently without daily limits.",
    explanationRight: "Smart choice!\n\n❌ FAKE URGENCY: 'Deactivated in 10 mins'.\n✅ TRUE PROTOCOL: Banks provide weeks of formal notice for KYC, never 10-minute ultimatums. Always use the official YONO app directly.",
    redFlags: ["10-minute ultimatum", "Asking for Profile Password"]
  },
  {
    id: 8,
    category: 'kyc',
    sender: 'Paytm-KYC',
    content: "Your Paytm Wallet is suspended. To reactivate, complete video KYC by providing the OTP sent to you: http://paytm-kyc-desk.org",
    sandbox: {
      title: "Wallet Reactivation",
      fakeUrl: "http://paytm-kyc-desk.org",
      inputLabel: "Enter 6-digit OTP:",
      btnText: "Start Video KYC"
    },
    consequenceWrong: "The OTP was actually for a password reset request initiated by the scammer. They just took control of your digital wallet.",
    explanationRight: "Great catch!\n\n❌ FAKE DESK: Random portals claiming to do Video KYC.\n✅ TRUE KYC: Legitimate Video KYC processes happen strictly within the verified, secure environment of the official application.",
    redFlags: ["Wallet suspension threat", "Demanding OTP for video"]
  },
  {
    id: 9,
    category: 'kyc',
    sender: 'VODAFONE-VI',
    content: "Dear User, your SIM will be blocked within 24 hours. Submit e-KYC documents and share the verification PIN: http://vi-sim-kyc.com",
    sandbox: {
      title: "Telecom e-KYC",
      fakeUrl: "http://vi-sim-kyc.com",
      inputLabel: "Enter Mobile No. & Verification PIN:",
      btnText: "Submit KYC"
    },
    consequenceWrong: "This is a SIM-Swap scam. By sharing the PIN, you allowed the scammer to deactivate your physical SIM and activate an eSIM on their phone. They now receive all your banking SMS.",
    explanationRight: "Very secure!\n\n❌ FAKE THREAT: Telecom providers threatening instant SIM blocks.\n✅ TRUE THREAT: Telecom operators do not use third-party web links for KYC. Sharing a SIM-activation PIN is catastrophic.",
    redFlags: ["SIM Block threat", "Asking for verification PIN"]
  },
  {
    id: 10,
    category: 'kyc',
    sender: 'EPFO-INDIA',
    content: "PF account KYC is pending. Claim your PF balance before year-end. Verify OTP: http://epf-india-claim.org",
    sandbox: {
      title: "EPFO Member Portal",
      fakeUrl: "http://epf-india-claim.org",
      inputLabel: "Enter UAN Number & Login OTP:",
      btnText: "Claim PF"
    },
    consequenceWrong: "Scammers hijacked your UAN account. They will change your bank account details and illegally withdraw your hard-earned pension funds.",
    explanationRight: "Excellent!\n\n❌ FAKE UAN PORTAL: Fraudulent '.org' impersonating EPFO.\n✅ TRUE UAN PORTAL: Only use unifiedportal-mem.epfindia.gov.in. Never share your EPFO login OTPs.",
    redFlags: ["FOMO (Fear Of Missing Out) on PF", "Unverified '.org' domain"]
  },
  {
    id: 902,
    category: 'kyc',
    isLegitimate: true,
    sender: 'HDFC-BANK',
    content: "Dear Customer, your KYC is due for periodic update within 30 days. Please update it using your HDFC Mobile Banking App or visit the official portal: https://www.hdfcbank.com",
    sandbox: {
      title: "HDFC NetBanking",
      fakeUrl: "https://www.hdfcbank.com",
      inputLabel: "Enter Customer ID & Password:",
      btnText: "Login to Update"
    },
    consequenceWrong: "You ignored a legitimate bank notice! Real banks give you advance notice (like 30 days) and direct you to their official '.com' domains instead of threatening immediate blocks.",
    explanationRight: "Excellent! You validated that the link was 'https://www.hdfcbank.com', the official bank portal, and safely logged in to update your KYC securely.",
    redFlags: []
  },

  // --- UPI SCAMS (5 Scenarios) ---
  {
    id: 11,
    category: 'upi',
    sender: 'Stranger (SMS)',
    content: "Hello sir, I mistakenly sent you ₹50,000. My mother is in the hospital, please click here to return the money: pay-refund-upi@ybl",
    sandbox: {
      title: "UPI App Payment Request",
      fakeUrl: "GPay / PhonePe Screen",
      inputLabel: "Enter UPI PIN to process refund:",
      btnText: "Pay ₹50,000"
    },
    consequenceWrong: "A UPI PIN is ONLY used to send money, NEVER to receive. You just paid the scammer ₹50,000 from your own pocket.",
    explanationRight: "Right on!\n\n❌ FAKE LOGIC: Scammer says \"Enter your PIN to reverse my transfer.\"\n✅ TRUE LOGIC: UPI PIN is exactly like an ATM PIN. It is ONLY used to DEDUCT money from your account. Tell them to contact their bank.",
    redFlags: ["Emotional manipulation", "Asking to enter PIN to 'reverse' a payment"]
  },
  {
    id: 12,
    category: 'upi',
    sender: 'OLX Buyer',
    content: "I want to buy your furniture on OLX. I am sending a payment request link. Enter your UPI PIN to receive the money in your account.",
    sandbox: {
      title: "UPI Collect Request",
      fakeUrl: "GPay Collect Screen",
      inputLabel: "Enter UPI PIN to receive ₹5000:",
      btnText: "Receive ₹5000"
    },
    consequenceWrong: "You fell for the 'Collect Request' scam. By entering your PIN, the money left your account and went securely to the scammer.",
    explanationRight: "Perfect!\n\n❌ FAKE LOGIC: Buyers asking you to enter PIN to \"Collect\" funds.\n✅ TRUE LOGIC: Receiving money requires ZERO action on your part. You never need to enter a PIN to receive a payment on any UPI app.",
    redFlags: ["Entering PIN to receive cash", "Collect Request feature abused"]
  },
  {
    id: 13,
    category: 'upi',
    sender: 'JIO-RECHARGE',
    content: "Congratulations! You won a FREE ₹599 Jio recharge. Claim it by authorizing a ₹1 verification fee via UPI: bit.ly/free-jio-offer",
    sandbox: {
      title: "Jio Verification",
      fakeUrl: "bit.ly/free-jio-offer",
      inputLabel: "Enter UPI PIN for ₹1 Re-verification:",
      btnText: "Pay ₹1"
    },
    consequenceWrong: "The ₹1 was a trick. The scammer linked your underlying bank account through UPI mandates, and will now drain your daily limits.",
    explanationRight: "Smart!\n\n❌ FAKE TRAP: The 'One Rupee' verification scam.\n✅ TRUE FACTS: Authorizing even a ₹1 transaction safely authenticates your UPI PIN, which scammers can abuse using automated mandates.",
    redFlags: ["Free recharge offer", "Asking for ₹1 verification", "Bit.ly link"]
  },
  {
    id: 14,
    category: 'upi',
    sender: 'WhatsApp Friend (Hacked)',
    content: "Bro I am stuck at a petrol pump and my wallet is lost. Please send me ₹2000 instantly on my new UPI ID: friend.emergency@okicici",
    sandbox: {
      title: "UPI Transfer",
      fakeUrl: "PhonePe Send Money",
      inputLabel: "Enter UPI PIN:",
      btnText: "Pay ₹2000"
    },
    consequenceWrong: "Your friend's WhatsApp was hacked. You blindly trusted a text message and sent money to a scammer's bank account.",
    explanationRight: "Very wise!\n\n❌ FAKE EMERGENCY: Sudden WhatsApp messages demanding money to a 'new' ID.\n✅ TRUE SAFETY: Always make a direct voice call to the friend's old, known number to verify ANY emergency financial request.",
    redFlags: ["Sudden emergency", "Using a totally new UPI ID", "Refusing to pick up calls"]
  },
  {
    id: 15,
    category: 'upi',
    sender: 'CASHBACK-HUB',
    content: "You earned ₹999 Scratch Card on PhonePe! Scratch here and enter your UPI PIN to claim the cash directly in your bank account.",
    sandbox: {
      title: "PhonePe Reward Area",
      fakeUrl: "Fake Scratch Card Page",
      inputLabel: "Enter UPI PIN to deposit CashBack:",
      btnText: "Claim ₹999 CashBack"
    },
    consequenceWrong: "There is no such thing as entering a PIN for cashback. You just authorized a ₹999 deduction from your own account.",
    explanationRight: "Excellent!\n\n❌ FAKE REWARD: Rewards that require a PIN to 'deposit' money.\n✅ TRUE REWARD: Genuine cashbacks are deposited automatically into your bank account without requiring your UPI PIN.",
    redFlags: ["Entering PIN for cashback", "Links sent outside the official app"]
  },
  {
    id: 903,
    category: 'upi',
    isLegitimate: true,
    sender: 'NPCI-UPI',
    content: "Auto-Pay mandate of ₹499 for 'Netflix' is scheduled for tomorrow. To modify or cancel, open your official UPI App (GPay/PhonePe).",
    sandbox: {
      title: "Google Pay App",
      fakeUrl: "Native UPI App",
      inputLabel: "Enter Phone PIN to open App:",
      btnText: "Open Secure App"
    },
    consequenceWrong: "You dismissed a genuine Auto-Pay alert! This was an official reminder from NPCI. Notice how it didn't ask you to click a shady link? It told you to safely open your native app.",
    explanationRight: "Great job! You ignored external text links and chose to access your secure, official UPI app directly to manage your mandates.",
    redFlags: []
  }
];

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Language = "en" | "hi" | "bn" | "ta"

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Comprehensive translations for auth pages
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.messages": "Messages",
    "nav.profile": "Profile",
    
    // Auth Common
    "app.name": "HealthScope AI",
    "app.tagline": "Intelligent Healthcare for Everyone",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.forgot": "Forgot Password?",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.welcome": "Welcome back to HealthScope AI",
    "auth.createAccount": "Create your account",
    
    // Sign In Page
    "signin.title": "Sign In",
    "signin.welcome": "Welcome back to HealthScope AI",
    "signin.button": "Sign In",
    
    // Sign Up Page
    "signup.title": "Sign Up",
    "signup.welcome": "Create your account",
    "signup.fullName": "Full Name",
    "signup.confirmPassword": "Confirm Password",
    "signup.role": "I am a",
    "signup.button": "Sign Up",
    
    // Roles
    "role.patient": "Patient",
    "role.doctor": "Doctor",
    "role.ngo": "NGO",
    "role.hospital": "Hospital",
    "role.admin": "Admin",
    
    // Patient specific
    "patient.myReports": "My Reports",
    "patient.symptomChecker": "Symptom Checker",
    
    // Doctor specific
    "doctor.aiAnalysis": "AI Analysis",
    "doctor.myPatients": "My Patients",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.messages": "संदेश",
    "nav.profile": "प्रोफ़ाइल",
    
    // Auth Common
    "app.name": "हेल्थस्कोप AI",
    "app.tagline": "सबके लिए बुद्धिमान स्वास्थ्य सेवा",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.signin": "साइन इन",
    "auth.signup": "साइन अप",
    "auth.forgot": "पासवर्ड भूल गए?",
    "auth.noAccount": "खाता नहीं है?",
    "auth.haveAccount": "पहले से खाता है?",
    "auth.welcome": "हेल्थस्कोप AI में वापस स्वागत है",
    "auth.createAccount": "अपना खाता बनाएं",
    
    // Sign In Page
    "signin.title": "साइन इन",
    "signin.welcome": "हेल्थस्कोप AI में वापस स्वागत है",
    "signin.button": "साइन इन",
    
    // Sign Up Page
    "signup.title": "साइन अप",
    "signup.welcome": "अपना खाता बनाएं",
    "signup.fullName": "पूरा नाम",
    "signup.confirmPassword": "पासवर्ड की पुष्टि करें",
    "signup.role": "मैं हूं",
    "signup.button": "साइन अप",
    
    // Roles
    "role.patient": "मरीज़",
    "role.doctor": "डॉक्टर",
    "role.ngo": "NGO",
    "role.hospital": "अस्पताल",
    "role.admin": "व्यवस्थापक",
    
    // Patient specific
    "patient.myReports": "मेरी रिपोर्ट",
    "patient.symptomChecker": "लक्षण जांचकर्ता",
    
    // Doctor specific
    "doctor.aiAnalysis": "AI विश्लेषण",
    "doctor.myPatients": "मेरे मरीज़",
  },
  bn: {
    // Navigation
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.messages": "বার্তা",
    "nav.profile": "প্রোফাইল",
    
    // Auth Common
    "app.name": "হেলথস্কোপ AI",
    "app.tagline": "সবার জন্য বুদ্ধিমান স্বাস্থ্যসেবা",
    "auth.email": "ইমেইল",
    "auth.password": "পাসওয়ার্ড",
    "auth.signin": "সাইন ইন",
    "auth.signup": "সাইন আপ",
    "auth.forgot": "পাসওয়ার্ড ভুলে গেছেন?",
    "auth.noAccount": "অ্যাকাউন্ট নেই?",
    "auth.haveAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    "auth.welcome": "হেলথস্কোপ AI তে ফিরে আসুন",
    "auth.createAccount": "আপনার অ্যাকাউন্ট তৈরি করুন",
    
    // Sign In Page
    "signin.title": "সাইন ইন",
    "signin.welcome": "হেলথস্কোপ AI তে ফিরে আসুন",
    "signin.button": "সাইন ইন",
    
    // Sign Up Page
    "signup.title": "সাইন আপ",
    "signup.welcome": "আপনার অ্যাকাউন্ট তৈরি করুন",
    "signup.fullName": "পূর্ণ নাম",
    "signup.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
    "signup.role": "আমি একজন",
    "signup.button": "সাইন আপ",
    
    // Roles
    "role.patient": "রোগী",
    "role.doctor": "ডাক্তার",
    "role.ngo": "NGO",
    "role.hospital": "হাসপাতাল",
    "role.admin": "প্রশাসক",
    
    // Patient specific
    "patient.myReports": "আমার রিপোর্ট",
    "patient.symptomChecker": "উপসর্গ পরীক্ষক",
    
    // Doctor specific
    "doctor.aiAnalysis": "AI বিশ্লেষণ",
    "doctor.myPatients": "আমার রোগীরা",
  },
  ta: {
    // Navigation
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.messages": "செய்திகள்",
    "nav.profile": "சுயவிவரம்",
    
    // Auth Common
    "app.name": "ஹெல்த்ஸ்கோப் AI",
    "app.tagline": "அனைவருக்கும் அறிவார்ந்த சுகாதாரம்",
    "auth.email": "மின்னஞ்சல்",
    "auth.password": "கடவுச்சொல்",
    "auth.signin": "உள்நுழைய",
    "auth.signup": "பதிவு செய்ய",
    "auth.forgot": "கடவுச்சொல் மறந்துவிட்டதா?",
    "auth.noAccount": "கணக்கு இல்லையா?",
    "auth.haveAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "auth.welcome": "ஹெல்த்ஸ்கோப் AI யில் மீண்டும் வரவேற்கிறோம்",
    "auth.createAccount": "உங்கள் கணக்கை உருவாக்கவும்",
    
    // Sign In Page
    "signin.title": "உள்நுழைய",
    "signin.welcome": "ஹெல்த்ஸ்கோப் AI யில் மீண்டும் வரவேற்கிறோம்",
    "signin.button": "உள்நுழைய",
    
    // Sign Up Page
    "signup.title": "பதிவு செய்ய",
    "signup.welcome": "உங்கள் கணக்கை உருவாக்கவும்",
    "signup.fullName": "முழு பெயர்",
    "signup.confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    "signup.role": "நான் ஒரு",
    "signup.button": "பதிவு செய்ய",
    
    // Roles
    "role.patient": "நோயாளி",
    "role.doctor": "மருத்துவர்",
    "role.ngo": "NGO",
    "role.hospital": "மருத்துவமனை",
    "role.admin": "நிர்வாகி",
    
    // Patient specific
    "patient.myReports": "எனது அறிக்கைகள்",
    "patient.symptomChecker": "அறிகுறி சரிபார்ப்பான்",
    
    // Doctor specific
    "doctor.aiAnalysis": "AI பகுப்பாய்வு",
    "doctor.myPatients": "எனது நோயாளிகள்",
  },
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("healthscope_language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("healthscope_language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
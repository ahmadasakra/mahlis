'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'de' | 'ar';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Navigation
    'nav.home': 'HOME',
    'nav.courses': 'KURSE',
    'nav.articles': 'ARTIKEL',
    'nav.reviews': 'BEWERTUNGEN',
    'nav.about': 'ÜBER MICH',
    'nav.contact': 'KONTAKT',
    
    // Home
    'home.tagline': 'Journalismus & Online-Unterricht',
    'home.cta': 'Mehr erfahren',
    'home.scroll': 'Scrollen',
    
    // Articles
    'articles.title': 'Artikel & Texte',
    'articles.noArticles': 'Noch keine Artikel verfügbar.',
    'articles.latest': 'Neueste Artikel',
    'articles.readMore': 'Weiterlesen',
    'articles.readMoreArrow': 'Weiterlesen →',
    'articles.backToArticles': '← Zurück zu den Artikeln',
    'articles.viewAll': 'Alle Artikel anzeigen',
    'articles.share': 'Artikel teilen',
    'articles.comments': 'Kommentare',
    'articles.writeComment': 'Kommentar schreiben',
    'articles.noComments': 'Noch keine Kommentare.',
    'articles.commentName': 'Name',
    'articles.commentEmail': 'E-Mail (optional)',
    'articles.commentContent': 'Kommentar',
    'articles.commentSubmit': 'Kommentar absenden',
    'articles.commentSending': 'Wird gesendet...',
    'articles.commentSuccess': 'Vielen Dank! Ihr Kommentar wurde gesendet und wartet auf Freigabe.',
    'articles.commentModerated': 'Kommentare werden vor der Veröffentlichung moderiert.',
    'articles.commentError': 'Fehler beim Speichern des Kommentars',
    
    // Courses
    'courses.title': 'Meine Kurse',
    'courses.noCourses': 'Noch keine Kurse verfügbar.',
    'courses.new': 'Neu',
    'courses.price': '€',
    'courses.backToCourses': '← Zurück zu den Kursen',
    'courses.enroll': 'Anmelden',
    'courses.description': 'Beschreibung',
    'courses.details': 'Kursdetails',
    
    // Reviews
    'reviews.title': 'Bewertungen',
    'reviews.subtitle': 'Was Besucher über die Dienstleistungen sagen',
    'reviews.addReview': 'Ihre Bewertung hinzufügen',
    'reviews.submitReview': 'Bewertung abgeben',
    'reviews.shareExperience': 'Teile deine Erfahrungen mit {name} und ihren Dienstleistungen',
    'reviews.name': 'Name',
    'reviews.email': 'E-Mail (optional)',
    'reviews.rating': 'Bewertung',
    'reviews.ratingRequired': 'Bitte wähle eine Bewertung aus.',
    'reviews.comment': 'Kommentar',
    'reviews.commentOptional': 'Kommentar (optional)',
    'reviews.commentPlaceholder': 'Teile deine Erfahrungen...',
    'reviews.nameOptional': 'Name (optional)',
    'reviews.namePlaceholder': 'Dein Name',
    'reviews.anonymous': 'Anonym bewerten',
    'reviews.submit': 'Bewertung absenden',
    'reviews.submitting': 'Wird gesendet...',
    'reviews.saving': 'Wird gespeichert...',
    'reviews.success': 'Vielen Dank für Ihre Bewertung!',
    'reviews.error': 'Fehler beim Senden der Bewertung',
    'reviews.errorGeneric': 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.getInTouch': 'Get in Touch',
    'contact.description': 'Hast du Fragen zu meinen Kursen oder möchtest du mit mir zusammenarbeiten? Ich freue mich auf deine Nachricht!',
    'contact.email': 'E-Mail',
    'contact.location': 'Standort',
    'contact.locationValue': 'Deutschland',
    'contact.formName': 'Name',
    'contact.formEmail': 'E-Mail',
    'contact.formSubject': 'Betreff',
    'contact.formMessage': 'Nachricht',
    'contact.formPlaceholderName': 'Dein Name',
    'contact.formPlaceholderEmail': 'deine@email.com',
    'contact.formPlaceholderSubject': 'Worum geht es?',
    'contact.formPlaceholderMessage': 'Deine Nachricht...',
    'contact.formSubmit': 'Nachricht senden',
    'contact.formSubmitting': 'Wird gesendet...',
    'contact.formSuccess': 'Vielen Dank für deine Nachricht! Ich werde mich bald bei dir melden.',
    
    // Author/Name
    'author.name': 'Rita Mahlis',
    'author.nameShort': 'Rita Mahlis',
    'author.bio': 'Journalistin und Forscherin in Medien und Kommunikation, spezialisiert auf visuelle Journalismus und politische Kommunikation.',
    
    // Footer
    'footer.copyright': '© {year} Rita Mahlis',
    
    // Social Media
    'social.share': 'Teilen',
    'social.facebook': 'Facebook',
    'social.twitter': 'Twitter',
    'social.linkedin': 'LinkedIn',
    'social.email': 'E-Mail',
    'social.copyLink': 'Link kopieren',
    'social.copied': 'Kopiert!',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.required': 'Erforderlich',
    'common.optional': 'Optional',
    
    // About
    'about.name': 'Rita Mahlis',
    'about.subtitle': 'Journalistin & Forscherin',
    'about.intro': 'Spezialistin für visuellen Journalismus und politische Kommunikation mit internationaler Erfahrung',
    'about.education.title': 'Ausbildung',
    'about.education.description': 'Rita Mahlis erwarb 2023 an der Freien Universität Berlin ihren Bachelorabschluss in Journalismus, Kommunikationswissenschaft und Politikwissenschaft. 2025 schloss sie an derselben Universität ihren Master in Medien- und politischer Kommunikation ab.',
    'about.experience.title': 'Berufserfahrung',
    'about.experience.description': 'Sie arbeitete in der Medien- und Übersetzungsabteilung der Botschaft Palästinas in Berlin und war als freie Journalistin und Lokalredakteurin bei der Hannoverschen Allgemeinen Zeitung tätig.',
    'about.training.title': 'Internationale Erfahrung',
    'about.training.description': 'Rita nahm an Trainingsprogrammen mit UNICEF teil und sammelte vertiefte Erfahrung in der Moderation von Fernsehsendungen durch ihre praktische Ausbildung beim Fernsehen Palästina und beim Sender Al Jazeera.',
    'about.focus.title': 'Forschungsschwerpunkt',
    'about.focus.description': 'Als Forscherin im Bereich Medien und Kommunikation konzentriert sie sich auf visuellen Journalismus und politische Kommunikation.',
    'about.fullTitle': 'Über Rita Mahlis',
    'about.fullDescription1': 'Rita Mahlis ist Journalistin sowie Forscherin im Bereich Medien und Kommunikation, mit Schwerpunkt auf visuellem Journalismus und politischer Kommunikation. Sie erwarb 2023 an der Freien Universität Berlin ihren Bachelorabschluss in Journalismus, Kommunikationswissenschaft und Politikwissenschaft und schloss 2025 an derselben Universität ihren Master in Medien- und politischer Kommunikation ab.',
    'about.fullDescription2': 'Sie verfügt über berufliche Erfahrung im Medien- und Übersetzungsbereich: So arbeitete sie in der Medien- und Übersetzungsabteilung der Botschaft Palästinas in Berlin, zusätzlich zu ihrer Tätigkeit als freie Journalistin und Lokalredakteurin bei der deutschen Zeitung Hannoversche Allgemeine Zeitung.',
    'about.fullDescription3': 'Rita nahm an Trainingsprogrammen mit internationalen Organisationen wie UNICEF teil und sammelte vertiefte Erfahrung in der Moderation von Fernsehsendungen durch ihre praktische Ausbildung beim Fernsehen Palästina und beim Sender Al Jazeera, der sie zudem einlud, am Forum der Journalismusfakultäten in der arabischen Welt in Doha teilzunehmen.',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.courses': 'الدورات',
    'nav.articles': 'المقالات',
    'nav.reviews': 'التقييمات',
    'nav.about': 'عني',
    'nav.contact': 'اتصل بنا',
    
    // Home
    'home.tagline': 'الصحافة والتعليم عبر الإنترنت',
    'home.cta': 'اعرف المزيد',
    'home.scroll': 'انتقل',
    
    // Articles
    'articles.title': 'المقالات والنصوص',
    'articles.noArticles': 'لا توجد مقالات متاحة بعد.',
    'articles.latest': 'أحدث المقالات',
    'articles.readMore': 'اقرأ المزيد',
    'articles.readMoreArrow': 'اقرأ المزيد ←',
    'articles.backToArticles': '← العودة إلى المقالات',
    'articles.viewAll': 'عرض جميع المقالات',
    'articles.share': 'مشاركة المقال',
    'articles.comments': 'التعليقات',
    'articles.writeComment': 'اكتب تعليقاً',
    'articles.noComments': 'لا توجد تعليقات بعد.',
    'articles.commentName': 'الاسم',
    'articles.commentEmail': 'البريد الإلكتروني (اختياري)',
    'articles.commentContent': 'التعليق',
    'articles.commentSubmit': 'إرسال التعليق',
    'articles.commentSending': 'جاري الإرسال...',
    'articles.commentSuccess': 'شكراً لك! تم إرسال تعليقك وهو في انتظار الموافقة.',
    'articles.commentModerated': 'يتم مراجعة التعليقات قبل النشر.',
    'articles.commentError': 'خطأ في حفظ التعليق',
    
    // Courses
    'courses.title': 'دوراتي',
    'courses.noCourses': 'لا توجد دورات متاحة بعد.',
    'courses.new': 'جديد',
    'courses.price': 'يورو',
    'courses.backToCourses': '← العودة إلى الدورات',
    'courses.enroll': 'التسجيل',
    'courses.description': 'الوصف',
    'courses.details': 'تفاصيل الدورة',
    
    // Reviews
    'reviews.title': 'التقييمات',
    'reviews.subtitle': 'ماذا يقول الزوار عن الخدمات',
    'reviews.addReview': 'أضف تقييمك',
    'reviews.submitReview': 'تقديم التقييم',
    'reviews.shareExperience': 'شارك تجربتك مع {name} وخدماتها',
    'reviews.name': 'الاسم',
    'reviews.email': 'البريد الإلكتروني (اختياري)',
    'reviews.rating': 'التقييم',
    'reviews.ratingRequired': 'يرجى اختيار تقييم.',
    'reviews.comment': 'التعليق',
    'reviews.commentOptional': 'التعليق (اختياري)',
    'reviews.commentPlaceholder': 'شارك تجربتك...',
    'reviews.nameOptional': 'الاسم (اختياري)',
    'reviews.namePlaceholder': 'اسمك',
    'reviews.anonymous': 'تقييم مجهول',
    'reviews.submit': 'إرسال التقييم',
    'reviews.submitting': 'جاري الإرسال...',
    'reviews.saving': 'جاري الحفظ...',
    'reviews.success': 'شكراً لك على تقييمك!',
    'reviews.error': 'خطأ في إرسال التقييم',
    'reviews.errorGeneric': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.getInTouch': 'تواصل معنا',
    'contact.description': 'هل لديك أسئلة حول دوراتي أو تريد التعاون معي؟ يسعدني أن أسمع منك!',
    'contact.email': 'البريد الإلكتروني',
    'contact.location': 'الموقع',
    'contact.locationValue': 'ألمانيا',
    'contact.formName': 'الاسم',
    'contact.formEmail': 'البريد الإلكتروني',
    'contact.formSubject': 'الموضوع',
    'contact.formMessage': 'الرسالة',
    'contact.formPlaceholderName': 'اسمك',
    'contact.formPlaceholderEmail': 'بريدك@الإلكتروني.com',
    'contact.formPlaceholderSubject': 'ما الموضوع؟',
    'contact.formPlaceholderMessage': 'رسالتك...',
    'contact.formSubmit': 'إرسال الرسالة',
    'contact.formSubmitting': 'جاري الإرسال...',
    'contact.formSuccess': 'شكراً لك على رسالتك! سأتواصل معك قريباً.',
    
    // Author/Name
    'author.name': 'ريتا محليس',
    'author.nameShort': 'ريتا محليس',
    'author.bio': 'ريتا محليس صحفية وباحثة في الإعلام والاتصال، متخصصة في الصحافة المرئية والاتصال السياسي. حصلت على درجة البكالوريوس في الصحافة وعلوم الاتصال والعلوم السياسية من جامعة برلين الحرة عام ٢٠٢٣، وأنهت درجة الماجستير في الإعلام والاتصال السياسي عام ٢٠٢٥ في الجامعة نفسها. تمتلك خبرة مهنية في الإعلام والترجمة، حيث عملت في قسم الإعلام والترجمة في سفارة فلسطين في برلين، إلى جانب عملها كصحفية مستقلة ومحررة محلية في صحيفة Hannoversche Allgemeine Zeitung الألمانية. شاركت ريتا في برامج تدريبية مع مؤسسات دولية مثل اليونيسف، واكتسبت خبرة متقدمة في تقديم البرامج التلفزيونية عبر تدريبها في تلفزيون فلسطين وقناة الجزيرة، التي دعتها أيضًا للمشاركة في منتدى كليات الصحافة في العالم العربي في الدوحة.',
    
    // Footer
    'footer.copyright': '© {year} ريتا محليس',
    
    // Social Media
    'social.share': 'مشاركة',
    'social.facebook': 'فيسبوك',
    'social.twitter': 'تويتر',
    'social.linkedin': 'لينكد إن',
    'social.email': 'البريد الإلكتروني',
    'social.copyLink': 'نسخ الرابط',
    'social.copied': 'تم النسخ!',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.required': 'مطلوب',
    'common.optional': 'اختياري',
    
    // About
    'about.name': 'ريتا محليس',
    'about.subtitle': 'صحفية وباحثة',
    'about.intro': 'متخصصة في الصحافة المرئية والاتصال السياسي مع خبرة دولية',
    'about.education.title': 'التعليم',
    'about.education.description': 'حصلت ريتا محليس على درجة البكالوريوس في الصحافة وعلوم الاتصال والعلوم السياسية من جامعة برلين الحرة عام 2023. وأنهت درجة الماجستير في الإعلام والاتصال السياسي عام 2025 في الجامعة نفسها.',
    'about.experience.title': 'الخبرة المهنية',
    'about.experience.description': 'عملت في قسم الإعلام والترجمة في سفارة فلسطين في برلين، وعملت كصحفية مستقلة ومحررة محلية في صحيفة Hannoversche Allgemeine Zeitung الألمانية.',
    'about.training.title': 'الخبرة الدولية',
    'about.training.description': 'شاركت ريتا في برامج تدريبية مع اليونيسف واكتسبت خبرة متقدمة في تقديم البرامج التلفزيونية من خلال تدريبها في تلفزيون فلسطين وقناة الجزيرة.',
    'about.focus.title': 'مجال البحث',
    'about.focus.description': 'كباحثة في مجال الإعلام والاتصال، تركز على الصحافة المرئية والاتصال السياسي.',
    'about.fullTitle': 'عن ريتا محليس',
    'about.fullDescription1': 'ريتا محليس صحفية وباحثة في الإعلام والاتصال، متخصصة في الصحافة المرئية والاتصال السياسي. حصلت على درجة البكالوريوس في الصحافة وعلوم الاتصال والعلوم السياسية من جامعة برلين الحرة عام 2023، وأنهت درجة الماجستير في الإعلام والاتصال السياسي عام 2025 في الجامعة نفسها.',
    'about.fullDescription2': 'تمتلك خبرة مهنية في الإعلام والترجمة، حيث عملت في قسم الإعلام والترجمة في سفارة فلسطين في برلين، إلى جانب عملها كصحفية مستقلة ومحررة محلية في صحيفة Hannoversche Allgemeine Zeitung الألمانية.',
    'about.fullDescription3': 'شاركت ريتا في برامج تدريبية مع مؤسسات دولية مثل اليونيسف، واكتسبت خبرة متقدمة في تقديم البرامج التلفزيونية عبر تدريبها في تلفزيون فلسطين وقناة الجزيرة، التي دعتها أيضًا للمشاركة في منتدى كليات الصحافة في العالم العربي في الدوحة.',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && (saved === 'de' || saved === 'ar')) {
        setLocaleState(saved);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[locale][key] || key;
    // Replace placeholders like {year} with actual values
    if (params) {
      Object.keys(params).forEach((param) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }
    return text;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}


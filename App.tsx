
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Language, Attraction, SiteData, Booking, BookingStatus, AboutPHContent, AIItinerary, HeroSlide } from './types';
import { DEFAULT_SITE_DATA, VISA_DATA, ICONS } from './constants';
import { db } from './firebase';
import { generateAIItinerary } from './geminiService';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  deleteDoc, 
  query,
  orderBy
} from "firebase/firestore";

// --- Components ---

const PHLogo = ({ light = false }) => (
  <div className="flex items-center gap-2 cursor-pointer group">
    <div className={`w-10 h-10 md:w-12 md:h-12 ${light ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white shadow-lg border-gray-100'} rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform`}>
      <div className="relative w-6 h-6 md:w-8 md:h-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke={light ? "#fff" : "#0038A8"} strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="#FCD116" />
        </svg>
      </div>
    </div>
    <div className="flex flex-col">
      <span className={`text-lg md:text-xl font-black ${light ? 'text-white' : 'text-blue-900'} leading-none uppercase tracking-tighter`}>MABUHAY</span>
      <span className={`text-[8px] md:text-[10px] font-bold ${light ? 'text-red-400' : 'text-red-600'} tracking-[0.2em] uppercase`}>Philippines</span>
    </div>
  </div>
);

const SectionBanner: React.FC<{ image: string; title: string; subtitle: string; lang: Language }> = ({ image, title, subtitle, lang }) => (
  <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden mb-12">
    <img src={image} className="absolute inset-0 w-full h-full object-cover scale-105" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent"></div>
    <div className="relative z-10 text-center container mx-auto px-4">
      <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">{title}</h1>
      <p className="text-white/90 text-sm md:text-xl max-w-2xl mx-auto font-bold">{subtitle}</p>
    </div>
  </div>
);

const HeroSlider: React.FC<{ slides: HeroSlide[]; lang: Language; onAction: () => void }> = ({ slides, lang, onAction }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timeoutRef.current = window.setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current); };
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="h-[80vh] relative overflow-hidden bg-blue-950">
      {slides.map((slide, idx) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={slide.image} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${idx === current ? 'scale-110' : 'scale-100'}`} alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-transparent to-blue-950/80"></div>
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className={`max-w-4xl transition-all duration-1000 delay-300 ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title[lang]}
              </h1>
              <p className="text-white/90 text-lg md:text-2xl font-bold mb-10 max-w-3xl mx-auto drop-shadow-lg">
                {slide.subtitle[lang]}
              </p>
              <button onClick={onAction} className="bg-red-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">ابدأ التخطيط الآن 🏝️</button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-10' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
};

const AboutPHView: React.FC<{ data: AboutPHContent | undefined; lang: Language }> = ({ data, lang }) => {
  if (!data) return <div className="py-20 text-center font-bold">جاري تحميل البيانات...</div>;

  const sections = [
    { key: 'geography', icon: '🏝️', title: lang === 'AR' ? 'الجغرافيا والطبيعة' : 'Geography & Nature' },
    { key: 'people', icon: '💖', title: lang === 'AR' ? 'الشعب والضيافة' : 'People & Hospitality' },
    { key: 'culture', icon: '🎭', title: lang === 'AR' ? 'الثقافة والتراث' : 'Culture & Heritage' },
    { key: 'modernity', icon: '🏙️', title: lang === 'AR' ? 'الحداثة والتطور' : 'Modernity & Growth' },
    { key: 'climate', icon: '☀️', title: lang === 'AR' ? 'المناخ والطقس' : 'Climate & Weather' },
    { key: 'cuisine', icon: '🍲', title: lang === 'AR' ? 'المطبخ الفلبيني' : 'Philippine Cuisine' },
    { key: 'tips', icon: '💡', title: lang === 'AR' ? 'نصائح للمسافرين' : 'Travel Tips' },
    { key: 'bestTime', icon: '📅', title: lang === 'AR' ? 'أفضل وقت للزيارة' : 'Best Time to Visit' },
  ];

  return (
    <div className="animate-in fade-in duration-1000">
      <SectionBanner image={data.image} title={data.title[lang]} subtitle={data.description[lang]} lang={lang} />
      
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec) => (
            <div key={sec.key} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col gap-4 transform hover:-translate-y-1 transition-all">
               <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                 {sec.icon}
               </div>
               <h3 className="text-2xl font-black text-blue-900">{sec.title}</h3>
               <p className="text-gray-500 leading-relaxed font-bold text-sm">
                 {(data.sections as any)[sec.key][lang]}
               </p>
            </div>
          ))}
        </div>

        {data.extraImages && data.extraImages.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl font-black text-blue-900 text-center mb-12">{lang === 'AR' ? 'لقطات من الفلبين' : 'Snapshots of PH'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.extraImages.map((img, idx) => (
                <div key={idx} className="h-80 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                   <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Main ---

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [lang, setLang] = useState<Language>('AR');
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [userRole, setUserRole] = useState<'VISITOR' | 'ADMIN'>('VISITOR');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Admin Specific UI State
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'islands' | 'manila' | 'restaurants' | 'activities' | 'shopping' | 'slides' | 'aboutPH'>('bookings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<'REGISTER' | 'PREFERENCES' | 'AI_PLANNING' | 'REVIEW'>('REGISTER');
  const [userData, setUserData] = useState({ name: '', phone: '', email: '' });
  const [userPrefs, setUserPrefs] = useState({ 
    vibe: 'استرخاء', 
    budget: 'متوسطة', 
    travelers: '1', 
    interests: [] as string[],
    customRequest: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState<AIItinerary | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Real-time Sync
  useEffect(() => {
    const categories = ['islands', 'manilaDistricts', 'shopping', 'restaurants', 'activities', 'heroSlides'];
    const unsubscribes = categories.map(cat => {
      return onSnapshot(collection(db, cat), (snap) => {
        const items = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        const targetKey = cat === 'manilaDistricts' ? 'manilaDistricts' : cat === 'heroSlides' ? 'heroSlides' : cat;
        if (items.length > 0) {
          setSiteData(prev => ({ ...prev, [targetKey]: items }));
        }
      });
    });
    
    // Sync About PH
    const aboutUnsub = onSnapshot(doc(db, 'aboutPH', 'main'), (snap) => {
      if (snap.exists()) {
        setSiteData(prev => ({ ...prev, aboutPH: snap.data() as AboutPHContent }));
      }
    });

    const bookingsUnsub = onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), (snap) => {
      setBookings(snap.docs.map(d => ({ ...d.data(), id: d.id } as Booking)));
    });

    return () => { unsubscribes.forEach(u => u()); aboutUnsub(); bookingsUnsub(); };
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setBookingSuccess(false);
    window.scrollTo(0, 0);
  };

  const toggleInterest = (interest: string) => {
    setUserPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleStartPlanning = async () => {
    setIsLoadingAI(true);
    setBookingStep('AI_PLANNING');
    const plan = await generateAIItinerary({ ...userData, ...userPrefs });
    setGeneratedPlan(plan);
    setIsLoadingAI(false);
    if (plan) setBookingStep('REVIEW');
  };

  const finalizeBooking = async () => {
    const bookingId = `BK-${Date.now()}`;
    const finalBooking: Booking = {
      id: bookingId,
      ...userData,
      travelDate: new Date().toISOString().split('T')[0],
      travelersCount: parseInt(userPrefs.travelers),
      specialRequests: userPrefs.customRequest,
      packageType: generatedPlan?.destination || "Custom AI VIP",
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString(),
      aiItinerary: generatedPlan!,
      userPreferences: {
        vibe: userPrefs.vibe,
        budget: userPrefs.budget,
        interests: userPrefs.interests
      }
    };
    
    try {
      await setDoc(doc(db, 'bookings', bookingId), finalBooking);
      setBookingSuccess(true);
    } catch (e) {
      alert("خطأ في الحفظ");
    }
  };

  // Admin Actions
  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (e) {
      alert("فشل تحديث الحالة");
    }
  };

  const deleteBooking = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الحجز نهائياً؟")) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch (e) {
        alert("فشل الحذف");
      }
    }
  };

  const updateAboutPH = async (newData: AboutPHContent) => {
    try {
      await setDoc(doc(db, 'aboutPH', 'main'), newData);
      alert("تم تحديث البيانات بنجاح");
    } catch (e) {
      alert("فشل التحديث");
    }
  };

  const saveSlide = async (slide: HeroSlide) => {
    try {
      await setDoc(doc(db, 'heroSlides', slide.id), slide);
      setEditingSlide(null);
      alert("تم حفظ الشريحة");
    } catch (e) {
      alert("فشل حفظ الشريحة");
    }
  };

  const deleteSlide = async (id: string) => {
    if (confirm("حذف هذه الشريحة؟")) {
      try {
        await deleteDoc(doc(db, 'heroSlides', id));
      } catch (e) {
        alert("فشل الحذف");
      }
    }
  };

  const adminTabs = [
    { id: 'bookings', label: 'الحجوزات', icon: '📋' },
    { id: 'aboutPH', label: 'عن الفلبين', icon: '🇵🇭' },
    { id: 'slides', label: 'شرائح العرض', icon: '🖼️' },
    { id: 'islands', label: 'الجزر', icon: '🏝️' },
    { id: 'manila', label: 'مانيلا', icon: '🏙️' },
    { id: 'restaurants', label: 'المطاعم', icon: '🍲' },
    { id: 'activities', label: 'الأنشطة', icon: '🎉' },
    { id: 'shopping', label: 'التسوق', icon: '🛍️' },
  ];

  return (
    <div className={`min-h-screen ${lang === 'AR' ? "font-['Cairo'] text-right" : "font-sans text-left"}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      
      {/* Navigation (Visitors Only) */}
      {view !== 'ADMIN_DASHBOARD' && (
        <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div onClick={() => navigateTo('HOME')}><PHLogo /></div>
            <div className="flex items-center gap-4">
              <button onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')} className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl text-xs font-black uppercase">{lang === 'AR' ? 'English' : 'عربي'}</button>
              <button onClick={() => navigateTo('HOME')} className="text-xs font-black text-gray-400 hover:text-blue-900 transition px-2">الرئيسية</button>
              <button onClick={() => navigateTo('ABOUT_PH')} className="text-xs font-black text-gray-400 hover:text-blue-900 transition px-2">عن الفلبين</button>
              <button onClick={() => navigateTo('BOOKING')} className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-red-200">خطط لرحلتك</button>
              <button onClick={() => navigateTo('ADMIN_LOGIN')} className="text-[10px] text-gray-300 font-bold">لوحة التحكم</button>
            </div>
          </div>
        </nav>
      )}

      <main>
        {view === 'HOME' && (
          <div className="animate-in fade-in duration-1000">
            <HeroSlider 
              slides={siteData.heroSlides} 
              lang={lang} 
              onAction={() => navigateTo('BOOKING')} 
            />

            {/* Quick Links */}
            <div className="container mx-auto px-4 -mt-12 relative z-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'الجزر', icon: '🏝️', view: 'ISLANDS' },
                { label: 'مانيلا', icon: '🏙️', view: 'MANILA' },
                { label: 'مطاعم', icon: '🍲', view: 'RESTAURANTS' },
                { label: 'تسوق', icon: '🛍️', view: 'SHOPPING' },
                { label: 'أنشطة', icon: '🎉', view: 'ACTIVITIES' },
                { label: 'عن الفلبين', icon: '🇵🇭', view: 'ABOUT_PH' }
              ].map(link => (
                <button key={link.label} onClick={() => navigateTo(link.view as any)} className="bg-white p-6 rounded-3xl shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center gap-3">
                  <span className="text-3xl">{link.icon}</span>
                  <span className="font-black text-blue-900 text-sm">{link.label}</span>
                </button>
              ))}
            </div>
            
            {/* Promo Section */}
            <section className="container mx-auto px-4 py-24">
              <div className="bg-blue-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 md:flex-1 text-center md:text-right">
                   <h2 className="text-3xl md:text-5xl font-black mb-6">جاهز لاكتشاف الجنة؟</h2>
                   <p className="text-white/70 text-lg md:text-xl font-bold mb-10 leading-relaxed">دع مساعدنا الذكي يصمم لك برنامجاً سياحياً مخصصاً يلبي كافة تطلعاتك وميزانيتك في أقل من دقيقة.</p>
                   <button onClick={() => navigateTo('BOOKING')} className="bg-yellow-400 text-blue-950 px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">ابدأ الآن مجاناً ✨</button>
                </div>
                <div className="md:flex-1 relative h-64 md:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'ABOUT_PH' && <AboutPHView data={siteData.aboutPH} lang={lang} />}

        {view === 'BOOKING' && (
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {bookingSuccess ? (
              <div className="text-center py-20 animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">✅</div>
                <h2 className="text-3xl font-black text-blue-900 mb-4">مابوهاي! تم حفظ برنامجك بنجاح</h2>
                <p className="text-gray-500 mb-10">سيتواصل معك فريقنا قريباً عبر الواتساب لتأكيد التفاصيل النهائية وحجز الرحلة.</p>
                <button onClick={() => navigateTo('HOME')} className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-black">العودة للرئيسية</button>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Steps Header */}
                <div className="bg-blue-950 p-8 text-white text-center">
                  <h2 className="text-2xl font-black mb-2">مخطط الرحلة الذكي VIP</h2>
                  <div className="flex justify-center gap-4 mt-4 opacity-60 text-xs font-bold">
                    <span className={bookingStep === 'REGISTER' ? 'text-yellow-400 font-black' : ''}>1. البيانات</span>
                    <span>•</span>
                    <span className={bookingStep === 'PREFERENCES' ? 'text-yellow-400 font-black' : ''}>2. الاهتمامات</span>
                    <span>•</span>
                    <span className={bookingStep === 'REVIEW' ? 'text-yellow-400 font-black' : ''}>3. برنامجك المخصص</span>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  {bookingStep === 'REGISTER' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-black text-blue-950">نصمم لك رحلة العمر..</h3>
                        <p className="text-gray-400 text-sm font-bold">أدخل بياناتك لنتواصل معك بمجرد اعتماد البرنامج</p>
                      </div>
                      <input 
                        placeholder="الاسم الكامل" 
                        className="w-full p-5 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 outline-none font-bold" 
                        value={userData.name}
                        onChange={e => setUserData({...userData, name: e.target.value})}
                      />
                      <input 
                        placeholder="رقم الواتساب (للتواصل السريع)" 
                        className="w-full p-5 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 outline-none font-bold" 
                        value={userData.phone}
                        onChange={e => setUserData({...userData, phone: e.target.value})}
                      />
                      <input 
                        placeholder="البريد الإلكتروني" 
                        className="w-full p-5 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 outline-none font-bold" 
                        value={userData.email}
                        onChange={e => setUserData({...userData, email: e.target.value})}
                      />
                      <button 
                        disabled={!userData.name || !userData.phone}
                        onClick={() => setBookingStep('PREFERENCES')}
                        className="w-full bg-blue-950 text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.01] transition-all disabled:opacity-50 shadow-xl"
                      >
                        الخطوة التالية: حدد اهتماماتك
                      </button>
                    </div>
                  )}

                  {bookingStep === 'PREFERENCES' && (
                    <div className="space-y-8 animate-in slide-in-from-left">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">ما هي اهتماماتك؟ (اختر ما شئت)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['غوص', 'طبيعة', 'تسوق', 'تاريخ', 'حياة ليلية', 'رومانسية', 'عائلية', 'مغامرة', 'أكل'].map(v => (
                            <button 
                              key={v}
                              onClick={() => toggleInterest(v)}
                              className={`p-4 rounded-2xl font-bold text-sm border-2 transition-all ${userPrefs.interests.includes(v) ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-100 text-gray-400'}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">جو الرحلة</label>
                          <select 
                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold"
                            value={userPrefs.vibe}
                            onChange={e => setUserPrefs({...userPrefs, vibe: e.target.value})}
                          >
                            <option>استرخاء تام</option>
                            <option>مغامرة وتشويق</option>
                            <option>عائلية بامتياز</option>
                            <option>رومانسية هادئة</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">الميزانية</label>
                          <select 
                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold"
                            value={userPrefs.budget}
                            onChange={e => setUserPrefs({...userPrefs, budget: e.target.value})}
                          >
                            <option>اقتصادية (ذكية)</option>
                            <option>متوسطة (توازن)</option>
                            <option>فاخرة (دلال)</option>
                            <option>نخبة (Luxury VIP)</option>
                          </select>
                        </div>
                      </div>

                      {/* New Deep Detail Custom Field */}
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">خيارات إضافية تود إضافتها؟ (أي شيء ترغب به)</label>
                        <textarea 
                          placeholder="مثلاً: أريد زيارة مزارع الأناناس، أو أريد فندقاً يطل على بركان، أو رحلة بحرية ليلية..."
                          className="w-full p-5 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 outline-none font-bold h-32"
                          value={userPrefs.customRequest}
                          onChange={e => setUserPrefs({...userPrefs, customRequest: e.target.value})}
                        />
                      </div>

                      <button 
                        onClick={handleStartPlanning}
                        className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        توليد البرنامج التفصيلي بالذكاء الاصطناعي 🧠⚡
                      </button>
                    </div>
                  )}

                  {bookingStep === 'AI_PLANNING' && (
                    <div className="text-center py-20 space-y-6">
                      <div className="w-20 h-20 border-8 border-blue-50 border-t-blue-950 rounded-full animate-spin mx-auto"></div>
                      <h3 className="text-2xl font-black text-blue-950">جاري معالجة بياناتك...</h3>
                      <p className="text-gray-400 font-bold max-w-sm mx-auto">نقوم الآن بحساب التكاليف بالريال السعودي واختيار أفضل الأنشطة بناءً على ذوقك الشخصي.</p>
                    </div>
                  )}

                  {bookingStep === 'REVIEW' && generatedPlan && (
                    <div className="space-y-10 animate-in fade-in duration-1000 pb-10">
                      
                      {/* Destination Header */}
                      <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <span className="bg-yellow-400 text-blue-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">عرض حصري مخصص</span>
                            <span className="text-2xl">🇵🇭</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black mb-2">{generatedPlan.destination}</h3>
                          <div className="flex flex-wrap gap-6 mt-6 text-sm font-bold text-white/80">
                            <span className="bg-white/10 px-4 py-2 rounded-xl">📅 {generatedPlan.duration}</span>
                            <span className="bg-white/10 px-4 py-2 rounded-xl">🏨 {generatedPlan.hotelName} ({generatedPlan.hotelStars} نجوم)</span>
                          </div>
                        </div>
                      </div>

                      {/* Deep Insights Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-4">
                          <h4 className="font-black text-blue-900 flex items-center gap-2">🌤️ حالة الطقس المتوقعة</h4>
                          <p className="text-sm font-bold text-blue-800/80 leading-relaxed">
                            يتوقع طقس استوائي مشمس مع نسمات باردة مساءً. ننصح بملابس قطنية خفيفة.
                          </p>
                        </div>
                        <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 space-y-4">
                          <h4 className="font-black text-red-900 flex items-center gap-2">🎒 ماذا تحزم في حقيبتك؟</h4>
                          <ul className="text-xs font-bold text-red-800/80 space-y-2">
                             <li>• ملابس سباحة سريعة الجفاف</li>
                             <li>• حذاء مريح للمشي الطويل</li>
                             <li>• واقي شمس استوائي (SPF 50+)</li>
                             <li>• طارد للبعوض طبيعي</li>
                          </ul>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                            <h4 className="font-black text-blue-950 flex items-center gap-2">
                               <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                               توزيع الميزانية (ريال سعودي)
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                               {[
                                 { label: 'السكن', val: generatedPlan.priceBreakdown.accommodation },
                                 { label: 'الوجبات', val: generatedPlan.priceBreakdown.meals },
                                 { label: 'التنقل', val: generatedPlan.priceBreakdown.transport },
                                 { label: 'الأنشطة', val: generatedPlan.priceBreakdown.activities }
                               ].map(p => (
                                 <div key={p.label} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center transition-transform hover:scale-105">
                                    <span className="text-xs font-bold text-gray-400">{p.label}</span>
                                    <span className="text-sm font-black text-blue-900">{p.val} SAR</span>
                                 </div>
                               ))}
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                               <span className="font-black text-gray-400">الإجمالي التقريبي الصافي</span>
                               <span className="text-3xl font-black text-green-600">{generatedPlan.totalEstimatedPriceSAR} ريال</span>
                            </div>
                         </div>
                         <div className="bg-yellow-50 p-8 rounded-[2.5rem] border border-yellow-100">
                            <h4 className="font-black text-yellow-700 text-sm mb-4 uppercase tracking-widest">توجيهات مابوهاي 💎</h4>
                            <ul className="space-y-4">
                               {generatedPlan.essentialTips.map((tip, i) => (
                                 <li key={i} className="text-[11px] font-bold text-yellow-900 leading-relaxed flex gap-2">
                                    <span className="text-yellow-400 shrink-0">✨</span>
                                    {tip}
                                 </li>
                               ))}
                            </ul>
                         </div>
                      </div>

                      {/* Deep Daily Plan */}
                      <div>
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="font-black text-blue-950 text-xl flex items-center gap-2">
                             <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                             البرنامج الزمني الدقيق
                           </h4>
                           {userPrefs.customRequest && (
                             <span className="text-[10px] bg-blue-900 text-white px-3 py-1 rounded-full font-black animate-pulse">تم دمج طلباتك الخاصة ✅</span>
                           )}
                        </div>
                        <div className="space-y-12 relative before:absolute before:inset-y-0 before:right-5 before:w-0.5 before:bg-blue-100">
                          {generatedPlan.dailyPlan.map(day => (
                            <div key={day.day} className="relative pr-12 group">
                              <div className="absolute top-0 right-0 w-10 h-10 bg-blue-950 text-white rounded-full flex items-center justify-center font-black z-10 border-4 border-white shadow-xl transition-transform group-hover:scale-110">
                                 {day.day}
                              </div>
                              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden transition-all hover:shadow-2xl">
                                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
                                   <span className="font-black text-blue-900 text-lg">{day.location}</span>
                                   <span className="text-[10px] font-black text-gray-300 uppercase">اليوم {day.day}</span>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                   <div className="space-y-3 p-4 bg-blue-50/30 rounded-2xl">
                                      <div className="flex items-center gap-2">
                                         <span className="text-xl">🌅</span>
                                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">الصباح</span>
                                      </div>
                                      <p className="text-xs font-bold text-gray-700 leading-relaxed">{day.timeSlots.morning}</p>
                                   </div>
                                   <div className="space-y-3 p-4 bg-red-50/30 rounded-2xl">
                                      <div className="flex items-center gap-2">
                                         <span className="text-xl">☀️</span>
                                         <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">الظهيرة</span>
                                      </div>
                                      <p className="text-xs font-bold text-gray-700 leading-relaxed">{day.timeSlots.afternoon}</p>
                                   </div>
                                   <div className="space-y-3 p-4 bg-indigo-50/30 rounded-2xl">
                                      <div className="flex items-center gap-2">
                                         <span className="text-xl">🌙</span>
                                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">المساء</span>
                                      </div>
                                      <p className="text-xs font-bold text-gray-700 leading-relaxed">{day.timeSlots.evening}</p>
                                   </div>
                                </div>
                                {day.localTip && (
                                  <div className="px-8 pb-6 text-[11px] text-green-700 font-black bg-green-50/50 py-4 flex items-center gap-3">
                                     <span className="text-lg">💡</span>
                                     <span className="italic">سر من أهالي المنطقة: {day.localTip}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 pt-10">
                        <button 
                          onClick={() => setBookingStep('PREFERENCES')}
                          className="flex-1 py-5 rounded-2xl font-black text-gray-400 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          تعديل التفضيلات
                        </button>
                        <button 
                          onClick={finalizeBooking}
                          className="flex-[2] bg-blue-950 text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                          تأكيد وحجز البرنامج الماسي الآن ✅
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {(['ISLANDS', 'MANILA', 'SHOPPING', 'RESTAURANTS', 'ACTIVITIES'] as ViewState[]).includes(view) && (
          <div className="container mx-auto px-4 py-12">
             <SectionBanner 
                image="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2000"
                title={view === 'ISLANDS' ? "أجمل جزر الفلبين" : "استكشف الفلبين"}
                subtitle="أماكن مختارة بعناية لتجربة لا تُنسى"
                lang={lang}
             />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(siteData as any)[view === 'ISLANDS' ? 'islands' : view === 'MANILA' ? 'manilaDistricts' : view.toLowerCase()]?.map((item: Attraction) => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition group border border-gray-100 h-full flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                      <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                      {item.halal && <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">HALAL</span>}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-blue-900 mb-3">{item.name[lang]}</h3>
                      <p className="text-gray-500 text-sm font-bold line-clamp-3 mb-6 flex-grow">{item.description[lang]}</p>
                      <button onClick={() => navigateTo('BOOKING')} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors">إضافة لبرنامجي الذكي</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'VISA_INFO' && (
          <div className="container mx-auto px-4 py-12">
            <SectionBanner image="https://images.unsplash.com/photo-1555620146-512038753177?q=80&w=1920" title="دليل فيزا الفلبين" subtitle="كل ما تحتاج معرفته عن متطلبات الدخول" lang={lang} />
            <div className="max-w-4xl mx-auto space-y-8">
              {VISA_DATA.map((sec, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-xl">
                  <h2 className="text-2xl font-black text-blue-900 mb-6 border-b border-gray-100 pb-4">{sec.category[lang]}</h2>
                  <div className="grid gap-6">
                    {sec.items.map((item, iIdx) => (
                      <div key={iIdx} className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-900">
                        <h4 className="font-black text-blue-900 mb-2">{item.title[lang]}</h4>
                        <p className="text-gray-600 text-sm font-bold">{item.details[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'ADMIN_LOGIN' && (
          <div className="max-w-md mx-auto py-32 px-4">
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-black text-blue-900 mb-8 text-center uppercase tracking-widest">دخول الإدارة</h2>
                <form onSubmit={e => { e.preventDefault(); setUserRole('ADMIN'); navigateTo('ADMIN_DASHBOARD'); }} className="space-y-4">
                  <input placeholder="البريد الإلكتروني" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-blue-900" required />
                  <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-blue-900" required />
                  <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-950 transition-all">دخول</button>
                </form>
             </div>
          </div>
        )}

        {view === 'ADMIN_DASHBOARD' && userRole === 'ADMIN' && (
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar (Admin content stays as is) */}
            <aside className={`bg-blue-950 text-white transition-all duration-300 flex flex-col h-full shadow-2xl z-[200] ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                {isSidebarOpen && <PHLogo light />}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">{isSidebarOpen ? '❮' : '❯'}</button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {adminTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeAdminTab === tab.id ? 'bg-white text-blue-900 shadow-xl font-black' : 'hover:bg-white/5 text-white/60'}`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    {isSidebarOpen && <span className="text-sm tracking-wide">{tab.label}</span>}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button onClick={() => { setUserRole('VISITOR'); navigateTo('HOME'); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-600/10 text-red-400 font-bold hover:bg-red-600 hover:text-white transition-all">🚪 {isSidebarOpen && 'خروج'}</button>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
              <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-[150]">
                <h2 className="text-2xl font-black text-blue-900">{adminTabs.find(t => t.id === activeAdminTab)?.label}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-900 px-3 py-1 rounded-full uppercase tracking-widest">Master Console</span>
                  <div className="w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center font-black text-white">M</div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                {activeAdminTab === 'bookings' && (
                  <div className="space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'إجمالي الحجوزات', val: bookings.length, icon: '📋' },
                        { label: 'بانتظار التأكيد', val: bookings.filter(b => b.status === BookingStatus.PENDING).length, icon: '⏳' },
                        { label: 'حجوزات مؤكدة', val: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length, icon: '✅' },
                        { label: 'حجوزات ملغية', val: bookings.filter(b => b.status === BookingStatus.CANCELLED).length, icon: '❌' }
                      ].map(stat => (
                        <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-2">
                           <div className="w-12 h-12 bg-gray-50 text-blue-900 rounded-2xl flex items-center justify-center text-xl">{stat.icon}</div>
                           <span className="text-3xl font-black text-blue-900">{stat.val}</span>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                       <div className="overflow-x-auto">
                          <table className="w-full text-right">
                             <thead className="bg-gray-50">
                                <tr>
                                   <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">العميل</th>
                                   <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">البرنامج السياحي</th>
                                   <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">تاريخ الطلب</th>
                                   <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                                   <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">الإجراءات</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50">
                                {bookings.map(book => (
                                   <tr key={book.id} className="hover:bg-gray-50/50 transition-all">
                                      <td className="p-6">
                                         <div className="flex flex-col">
                                            <span className="font-black text-blue-900">{book.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">{book.phone}</span>
                                         </div>
                                      </td>
                                      <td className="p-6">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{book.aiItinerary?.destination || "برنامج مخصص"}</span>
                                            <span className="text-[9px] text-blue-600 font-black">{book.aiItinerary?.duration}</span>
                                         </div>
                                      </td>
                                      <td className="p-6 text-xs text-gray-400 font-bold">{new Date(book.createdAt).toLocaleDateString('ar-EG')}</td>
                                      <td className="p-6">
                                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                                            book.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 
                                            book.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                         }`}>{book.status}</span>
                                      </td>
                                      <td className="p-6">
                                         <div className="flex gap-2">
                                            <button onClick={() => updateBookingStatus(book.id, BookingStatus.CONFIRMED)} className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600">✅</button>
                                            <button onClick={() => deleteBooking(book.id)} className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600">🗑️</button>
                                         </div>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  </div>
                )}
                {/* ... (rest of admin tabs) ... */}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer (Visitors Only) */}
      {view !== 'ADMIN_DASHBOARD' && (
        <footer className="bg-blue-950 text-white py-20 mt-20">
          <div className="container mx-auto px-4 text-center">
            <PHLogo light />
            <p className="mt-8 text-white/50 font-bold max-w-xl mx-auto leading-relaxed">وجهتك الأولى والأذكى لاستكشاف الفلبين. نحن نوظف أحدث تقنيات الذكاء الاصطناعي لضمان أفضل تجربة سفر لك.</p>
            <div className="mt-12 pt-8 border-t border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Mabuhay AI Travel Platform. All Rights Reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

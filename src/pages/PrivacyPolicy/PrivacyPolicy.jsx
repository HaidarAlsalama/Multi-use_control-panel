import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className=" flex items-center justify-center p-4 md:p-10 font-sans dark:text-white text-gray-900 leading-relaxed">
      {/* Container - Glassmorphism */}
      <div className="relative max-w-5xl w-full bg-white bg-opacity-[0.03] backdrop-blur-xl border border-white border-opacity-10 rounded-[2rem] shadow-2xl p-6 md:p-16 overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500 rounded-full blur-[120px] opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-600 rounded-full blur-[120px] opacity-10"></div>

        <div className="relative z-10 text-right" dir="rtl">
          {/* Header */}
          <header className="mb-12 border-b border-white border-opacity-10 pb-8 text-center md:text-right">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-l from-green-400 to-white bg-clip-text print:text-gray-600 print:bg-none text-transparent">
              سياسة الاستخدام والخصوصية
            </h1>
            <p className="text-green-400 font-medium tracking-wide uppercase text-sm">
              موقع المحترف - الإحترافية في الخدمة
            </p>
          </header>

          {/* Main Content Scrollable Area */}
          <div className="space-y-10  pr-4 ">
            {/* Section 1 & 2 */}
            <section className="bg-white bg-opacity-[0.02] p-6 rounded-2xl border border-white border-opacity-5">
              <h2 className="text-2xl font-bold text-green-400 mb-4 italic">
                أولاً و ثانياً
              </h2>
              <p className="text-gray-900 dark:text-gray-200">
                الموقع خاص بنقاط البيع وموزعين الوحدات الخليوية وغير مخصص أو
                مسموح لاستعماله من قبل الأفراد. إن موقع{" "}
                <span className="text-green-400 font-bold">المحترف</span> هو
                موقع إلكتروني لتنظيم عملية بيع الوحدات الخليوية ويعتمد على
                الوساطة بين شركات الخليوي لتوفير خدمة سريعة ودقيقة عملياً
                وحسابياً.
              </p>
            </section>

            {/* Section 3 */}
            <section className="p-2">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                ثالثاً: الملكية والإدارة
              </h2>
              <p className="text-gray-900 dark:text-gray-200 mb-4">
                تعود حقوق ملكية موقع{" "}
                <span className="text-green-400 font-bold">المحترف</span> لشركة
                تضامنية ومقرها حمص - بابا عمر.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-500 dark:text-green-200">
                <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-green-500 border-opacity-20 text-center">
                  هاتف: 0994153498
                </div>
                <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-green-500 border-opacity-20 text-center">
                  هاتف: 0991929133
                </div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-300 text-sm italic">
                نحن مسؤولون بشكل كامل عن إدارة الموقع ومتابعة الحلول على مدار 24
                ساعة.
              </p>
            </section>

            {/* Section 4 */}
            <section className="p-2">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                رابعاً: إنشاء الحساب والبيانات
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-[10px] h-[10px] bg-green-500 rounded-full mt-2"></div>
                  <p>
                    الاسم الثلاثي باللغة العربية حصراً مع عنوان المحافظة
                    والمنطقة.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-[10px] h-[10px] bg-green-500 rounded-full mt-2"></div>
                  <p>
                    يجب أن يكون الرقم الخليوي المفعل باسم صاحب الهوية حصراً.
                  </p>
                </div>
                <p className="text-gray-400 text-[15px] bg-green-200 dark:bg-black bg-opacity-30 p-4 rounded-xl border-r-4 border-green-500">
                  يتم منح صلاحية الوصول وإنشاء الحسابات بشكل حصري من قبل إدارة
                  موقع المحترف، وذلك بعد استيفاء الأوراق المطلوبة والتحقق من
                  بيانات نقطة البيع.
                </p>
              </div>
            </section>

            {/* Section 5 & 6 Highlights */}
            <section className="p-2">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                خامساً وسادساً: الشروط والالتزامات
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-gray-200">
                <li className="bg-white bg-opacity-[0.03] p-4 rounded-xl">
                  ✓ توفير وثيقة غير محكوم وصورة الهوية الشخصية.
                </li>
                <li className="bg-white bg-opacity-[0.03] p-4 rounded-xl">
                  ✓ تعبئة الرصيد بعد الإيداع البنكي خلال 30 دقيقة كحد أقصى.
                </li>
                <li className="bg-white bg-opacity-[0.03] p-4 rounded-xl">
                  ✓ الحفاظ على سرية العمليات لمدة سنة ميلادية كاملة داخل الموقع.
                </li>
                <li className="bg-white bg-opacity-[0.03] p-4 rounded-xl">
                  ✓ الموقع يوزع مجاناً ولا يتقاضى أي مبالغ لإنشاء الحساب.
                </li>
              </ul>
            </section>

            {/* Important Notice */}
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 p-6 rounded-2xl">
              <h3 className="text-red-400 font-bold mb-2">تنبيه هام:</h3>
              <p className="text-sm">
                موقع المحترف غير متوفر على أي متجر إلكتروني. نحن مسؤولون فقط عن
                نسخة الويب المرسلة من قبلنا مباشرة. كلمة المرور يجب تغيرها من
                قبلكم ولا يمكننا الاطلاع عليها.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="mt-12 pt-8 border-t border-white border-opacity-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <p className="text-gray-500 text-xs text-center md:text-left">
                جميع الحقوق محفوظة © 2025 لشركة المحترف
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

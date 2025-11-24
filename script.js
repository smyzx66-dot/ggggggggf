<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة حميد التعليمية - النسخة المطورة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --secondary: #10b981;
        }
        body { 
            font-family: 'Tajawal', sans-serif; 
            background-color: #f8fafc; 
            -webkit-tap-highlight-color: transparent;
        }
        
        /* تأثيرات الحركة */
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-enter { animation: fade-in-up 0.5s ease-out forwards; }
        
        /* تخصيص شريط التمرير */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        /* تأثيرات Checkbox */
        .check-box-wrapper input:checked + div {
            background-color: var(--secondary);
            border-color: var(--secondary);
        }
        .check-box-wrapper input:checked + div svg { stroke-dashoffset: 0; }
        
        /* Confetti Canvas */
        #confetti-canvas {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            pointer-events: none; z-index: 100;
        }
    </style>
</head>
<body class="text-slate-800 bg-slate-50 h-screen overflow-hidden selection:bg-blue-200">

    <canvas id="confetti-canvas"></canvas>

    <!-- ================= شاشة تسجيل الدخول ================= -->
    <div id="loginScreen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[url('https://img.freepik.com/free-vector/gradient-geometric-shapes-dark-background_23-2148433767.jpg')] bg-cover bg-center transition-all duration-700">
        <div class="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
        
        <div class="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-white/20 animate-enter">
            <div class="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg ring-4 ring-white/20">
                👨‍🎓
            </div>
            <h1 class="text-3xl font-extrabold text-white mb-2 tracking-wide">منصة حميد</h1>
            <p class="text-blue-200 mb-8 font-medium text-sm">بوابتك للتميز الأكاديمي</p>
            
            <div class="space-y-4">
                <div class="relative group">
                    <input type="password" id="passwordInput" placeholder="كلمة المرور (123)" 
                        class="w-full p-4 pl-12 bg-white/90 rounded-2xl border-2 border-transparent focus:border-cyan-400 focus:bg-white outline-none transition text-center text-lg placeholder-slate-400 text-slate-800 shadow-inner">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                </div>
                
                <button onclick="checkLogin()" 
                    class="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition transform active:scale-95 text-lg flex items-center justify-center gap-2 group">
                    <span>تسجيل الدخول</span>
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path></svg>
                </button>
            </div>
            <p id="errorMsg" class="text-rose-400 mt-4 text-sm font-bold hidden transition-opacity bg-white/10 py-2 rounded-lg">⚠️ كلمة المرور غير صحيحة</p>
        </div>
        <p class="relative text-white/40 text-xs mt-8 font-light">الإصدار 3.0</p>
    </div>

    <!-- ================= تطبيق المنصة ================= -->
    <div id="appScreen" class="hidden h-full flex flex-col relative">
        
        <!-- الهيدر -->
        <header class="bg-blue-900 text-white p-6 pb-12 rounded-b-[3rem] shadow-2xl z-10 relative overflow-hidden shrink-0">
            <!-- خلفية جمالية للهيدر -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div class="relative flex justify-between items-start mb-6">
                <div>
                    <p class="text-cyan-300 text-sm font-bold mb-1" id="dateDisplay">--/--/----</p>
                    <h1 class="text-3xl font-black mb-1" id="greetingMsg">أهلاً، حميد</h1>
                    <p class="text-blue-200 text-xs opacity-80">جاهز لتحقيق أهدافك اليوم؟ 🚀</p>
                </div>
                <button onclick="logout()" class="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white transition border border-white/10 shadow-lg group">
                    <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>

            <!-- بطاقة الإحصائيات العائمة -->
            <div class="absolute left-6 right-6 -bottom-10">
                <div class="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex justify-between items-center">
                    <div class="flex-1 border-l border-slate-100 pl-4 ml-4">
                        <span class="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">نسبة الإنجاز</span>
                        <div class="flex items-end gap-2">
                            <span class="text-4xl font-black text-slate-800" id="percentage">0%</span>
                            <span class="text-xs text-green-500 font-bold mb-2 bg-green-50 px-2 py-0.5 rounded-full" id="statusBadge">جيد 👍</span>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <div class="text-xs text-slate-400 font-bold mb-1">المهام المكتملة</div>
                        <div class="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl inline-block">
                            <span id="statsCount">0</span>
                            <span class="text-slate-300 mx-1">/</span>
                            <span id="statsTotal" class="text-slate-400 text-sm">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- المحتوى الرئيسي -->
        <main class="flex-1 overflow-y-auto px-4 pt-16 pb-24 space-y-5 scroll-smooth" id="teachersContainer">
            <!-- سيتم توليد المحتوى هنا -->
            <div class="text-center py-10 text-gray-400 animate-pulse">جاري تحميل البيانات...</div>
        </main>
    </div>

    <script>
        // ================= المتغيرات العامة =================
        const PASSWORD = "123";
        let allData = [];
        // قراءة المصفوفة التي تحتوي فقط على أرقام المحاضرات المكتملة
        let completedLectures = JSON.parse(localStorage.getItem('hameed_completed')) || [];

        // ================= 1. التحقق من تسجيل الدخول =================
        function checkLogin() {
            const input = document.getElementById('passwordInput').value;
            const error = document.getElementById('errorMsg');
            
            if (input === PASSWORD) {
                // حفظ حالة الدخول
                localStorage.setItem('hameedApp_isLoggedIn', 'true');
                
                // أنيميشن خروج
                const loginScreen = document.getElementById('loginScreen');
                loginScreen.classList.add('opacity-0', 'pointer-events-none');
                
                setTimeout(() => {
                    loginScreen.classList.add('hidden');
                    document.getElementById('appScreen').classList.remove('hidden');
                    loadData(); // بدء تحميل البيانات
                }, 500);
            } else {
                error.classList.remove('hidden');
                document.getElementById('passwordInput').classList.add('animate-pulse', 'border-rose-400', 'bg-rose-50');
                setTimeout(() => {
                    document.getElementById('passwordInput').classList.remove('animate-pulse', 'border-rose-400', 'bg-rose-50');
                }, 1000);
            }
        }

        function logout() {
            localStorage.removeItem('hameedApp_isLoggedIn');
            location.reload();
        }

        // ================= 2. جلب البيانات وعرضها =================
        async function loadData() {
            try {
                // جلب البيانات من ملف JSON خارجي
                const response = await fetch('data.json');
                
                if (!response.ok) {
                    throw new Error('فشل الاتصال بالملف');
                }

                allData = await response.json();
                
                renderApp();
                updateStats();
                setGreeting();
            } catch (error) {
                console.error("Error loading data:", error);
                document.getElementById('teachersContainer').innerHTML = 
                    `<div class="text-center p-6 bg-red-50 rounded-3xl mx-4">
                        <div class="text-4xl mb-2">⚠️</div>
                        <h3 class="font-bold text-red-600 mb-2">فشل تحميل البيانات</h3>
                        <p class="text-sm text-red-500 mb-4">تأكد من وجود ملف <b>data.json</b> بجانب ملف HTML، وتشغيل الموقع عبر خادم محلي (Localhost).</p>
                    </div>`;
            }
        }

        // ================= 3. رسم الواجهة =================
        function renderApp() {
            const container = document.getElementById('teachersContainer');
            container.innerHTML = '';
            
            // حساب المجموع الكلي للمحاضرات
            let totalLectures = 0;
            allData.forEach(t => totalLectures += t.lectures.length);
            
            if (totalLectures === 0 && allData.length > 0) {
                container.innerHTML = '<p class="text-center text-gray-500 py-10">لا توجد محاضرات في ملف البيانات حالياً.</p>';
                return;
            }

            allData.forEach((teacher, index) => {
                // إنشاء كارت المدرس بستايل حديث
                const teacherCard = document.createElement('div');
                teacherCard.className = 'bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-enter mb-5';
                teacherCard.style.animationDelay = `${index * 100}ms`;

                let lecturesHtml = '';
                
                teacher.lectures.forEach(lecture => {
                    const isDone = completedLectures.includes(lecture.id);
                    
                    lecturesHtml += `
                        <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group mb-2 last:mb-0">
                            <!-- الجزء الأيمن: Checkbox والعنوان -->
                            <div class="flex items-center gap-3 flex-1 cursor-pointer select-none" onclick="toggleComplete(${lecture.id})">
                                <div class="check-box-wrapper relative">
                                    <input type="checkbox" class="sr-only" ${isDone ? 'checked' : ''}>
                                    <div class="w-6 h-6 border-2 border-slate-300 rounded-lg flex items-center justify-center transition-all duration-300 bg-white shadow-sm group-hover:border-blue-400">
                                        <svg class="w-3.5 h-3.5 text-white stroke-[3] transition-all duration-300 stroke-dasharray-10 stroke-dashoffset-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                                <span class="font-bold text-slate-700 text-sm md:text-base transition-all ${isDone ? 'line-through text-slate-400 opacity-60' : ''}">
                                    ${lecture.title}
                                </span>
                            </div>

                            <!-- زر المشاهدة -->
                            <a href="${lecture.url}" target="_blank" class="mr-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1 shrink-0">
                                <span class="hidden md:inline">شاهد</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                        </div>
                    `;
                });

                teacherCard.innerHTML = `
                    <div class="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4 border-dashed">
                        <img src="${teacher.image}" onerror="this.src='https://ui-avatars.com/api/?name=${teacher.name}'" class="w-14 h-14 rounded-2xl bg-slate-100 shadow-sm object-cover ring-2 ring-white">
                        <div>
                            <h2 class="font-black text-lg text-slate-800">${teacher.name}</h2>
                            <span class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg inline-block mt-1">${teacher.subject}</span>
                        </div>
                    </div>
                    <div class="space-y-1">${lecturesHtml}</div>
                `;

                container.appendChild(teacherCard);
            });
        }

        // ================= 4. وظيفة تبديل حالة الإكمال =================
        function toggleComplete(id) {
            if (completedLectures.includes(id)) {
                completedLectures = completedLectures.filter(item => item !== id);
            } else {
                completedLectures.push(id);
                triggerConfetti(0.2); // احتفال صغير
            }
            
            // حفظ في المتصفح
            localStorage.setItem('hameed_completed', JSON.stringify(completedLectures));
            
            renderApp(); // إعادة رسم الواجهة
            updateStats(); // تحديث الأرقام
        }

        // ================= 5. تحديث الإحصائيات =================
        function updateStats() {
            let totalLectures = 0;
            allData.forEach(t => totalLectures += t.lectures.length);
            
            const completedCount = completedLectures.length;
            const percent = totalLectures === 0 ? 0 : Math.round((completedCount / totalLectures) * 100);

            // Animate Numbers
            animateValue("statsCount", parseInt(document.getElementById("statsCount").innerText), completedCount, 500);
            document.getElementById('statsTotal').innerText = totalLectures;
            
            animateValue("percentage", parseInt(document.getElementById("percentage").innerText), percent, 500, "%");

            // تحديث حالة الشارة
            const statusBadge = document.getElementById('statusBadge');
            if (percent === 100) {
                statusBadge.innerText = "أسطورة! 🏆";
                statusBadge.className = "text-xs text-green-700 font-bold mb-2 bg-green-100 px-2 py-0.5 rounded-full";
                triggerConfetti(1); // احتفال كبير
            } else if (percent > 50) {
                statusBadge.innerText = "رائع 🔥";
                statusBadge.className = "text-xs text-orange-700 font-bold mb-2 bg-orange-100 px-2 py-0.5 rounded-full";
            } else {
                statusBadge.innerText = "بداية موفقة 💪";
                statusBadge.className = "text-xs text-blue-700 font-bold mb-2 bg-blue-100 px-2 py-0.5 rounded-full";
            }
        }

        // ================= وظائف مساعدة =================
        function setGreeting() {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "صباح الخير، حميد ☀️" : "مساء الخير، حميد 🌙";
            document.getElementById('greetingMsg').innerText = greeting;
            
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('ar-EG', options);
        }

        function animateValue(id, start, end, duration, suffix = "") {
            if (start === end) return;
            const range = end - start;
            let current = start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / range));
            const obj = document.getElementById(id);
            const timer = setInterval(function() {
                current += increment;
                obj.innerHTML = current + suffix;
                if (current == end) clearInterval(timer);
            }, stepTime > 10 ? stepTime : 10);
        }

        // Confetti Effect
        function triggerConfetti(intensity = 1) {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const particles = [];
            const particleCount = 100 * intensity;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    vx: (Math.random() - 0.5) * 20,
                    vy: (Math.random() - 0.5) * 20 - 5,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    size: Math.random() * 8 + 4,
                    life: 100
                });
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let activeParticles = false;
                particles.forEach(p => {
                    if (p.life > 0) {
                        activeParticles = true;
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.5;
                        p.life--;
                        p.size *= 0.96;
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, p.size, p.size);
                    }
                });
                if (activeParticles) requestAnimationFrame(animate);
                else ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            animate();
        }

        // ================= التهيئة =================
        document.addEventListener('DOMContentLoaded', () => {
            // التحقق التلقائي عند التحميل
            if (localStorage.getItem('hameedApp_isLoggedIn') === 'true') {
                document.getElementById('loginScreen').classList.add('hidden');
                document.getElementById('appScreen').classList.remove('hidden');
                loadData();
            }
        });

        // دعم زر Enter
        document.getElementById('passwordInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkLogin();
        });

    </script>
</body>
</html>

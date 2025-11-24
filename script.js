// المتغيرات العامة
const PASSWORD = "123";
let allData = [];
// التحقق من أن completedLectures يتم قراءته بشكل صحيح
let completedLectures = JSON.parse(localStorage.getItem('hameed_completed')) || [];

// 1. التحقق من تسجيل الدخول
// تم تعريف هذه الدالة هنا!
function checkLogin() { 
    const input = document.getElementById('passwordInput').value;
    if (input === PASSWORD) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        loadData();
    } else {
        const error = document.getElementById('errorMsg');
        error.classList.remove('hidden');
        document.getElementById('passwordInput').classList.add('animate-pulse');
        setTimeout(() => document.getElementById('passwordInput').classList.remove('animate-pulse'), 500);
    }
}

function logout() {
    // استخدم location.reload() لإعادة تحميل الصفحة والعودة إلى شاشة الدخول
    location.reload(); 
}

// 2. جلب البيانات وعرضها
async function loadData() {
    try {
        const response = await fetch('data.json');
        allData = await response.json();
        renderApp();
        updateStats();
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('teachersContainer').innerHTML = 
            '<p class="text-center text-red-500">فشل تحميل البيانات. تأكد من وجود ملف data.json</p>';
    }
}

// 3. رسم الواجهة
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


    allData.forEach(teacher => {
        // إنشاء كارت المدرس
        const teacherCard = document.createElement('div');
        teacherCard.className = 'bg-white rounded-2xl shadow-sm mb-6 overflow-hidden border border-gray-100';
        
        let lecturesHtml = '';
        teacher.lectures.forEach(lecture => {
            // للتأكد من فرادة المعرف، نستخدم معرف المحاضرة فقط
            const isDone = completedLectures.includes(lecture.id); 
            
            lecturesHtml += `
                <div class="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <div class="flex items-center gap-3 flex-1">
                        <div onclick="toggleComplete(${lecture.id})" 
                             class="check-box w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center ${isDone ? 'completed' : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 text-sm md:text-base ${isDone ? 'line-through text-gray-400' : ''}">${lecture.title}</h3>
                        </div>
                    </div>

                    <a href="${lecture.url}" target="_blank" class="mr-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition flex items-center gap-1">
                        شاهد
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </a>
                </div>
            `;
        });

        teacherCard.innerHTML = `
            <div class="bg-gray-50 p-4 flex items-center gap-4 border-b border-gray-200">
                <img src="${teacher.image}" class="w-12 h-12 rounded-full bg-white p-1 shadow-sm object-cover">
                <div>
                    <h2 class="font-bold text-lg text-gray-800">${teacher.name}</h2>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">${teacher.subject}</span>
                </div>
            </div>
            <div>${lecturesHtml}</div>
        `;

        container.appendChild(teacherCard);
    });
}

// 4. وظيفة تبديل حالة الإكمال
function toggleComplete(id) {
    if (completedLectures.includes(id)) {
        completedLectures = completedLectures.filter(item => item !== id);
    } else {
        completedLectures.push(id);
    }
    
    // حفظ في المتصفح
    localStorage.setItem('hameed_completed', JSON.stringify(completedLectures));
    
    renderApp(); // إعادة رسم الواجهة
    updateStats(); // تحديث الأرقام
}

// 5. تحديث الإحصائيات
function updateStats() {
    let totalLectures = 0;
    allData.forEach(t => totalLectures += t.lectures.length);
    
    const completedCount = completedLectures.length;
    const percent = totalLectures === 0 ? 0 : Math.round((completedCount / totalLectures) * 100);

    document.getElementById('statsCount').innerText = completedCount;
    document.getElementById('statsTotal').innerText = "/ " + totalLectures;
    
    const percentageElement = document.getElementById('percentage');
    percentageElement.innerText = percent + "%";
    
    // تغيير لون الدائرة بناءً على التقدم
    let className = "h-12 w-12 rounded-full border-4 flex items-center justify-center font-bold shadow-lg";

    if(percent === 100) {
        // حالة الاكتمال الكامل (لون أخضر)
        className += " border-green-500 bg-green-500 text-white";
    } else {
        // حالة التقدم (لون أزرق وأبيض)
        className += " border-blue-400 bg-white text-blue-600";
    }

    percentageElement.className = className;
}

// دعم الضغط على Enter لتسجيل الدخول
document.getElementById('passwordInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkLogin();
    }
});

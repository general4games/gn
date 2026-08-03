// ============================================
// الجنرال للالعاب الالكترونيه - تصميم طه بن فايد
// ============================================

let timerId = null;
const label = document.getElementById('autoJbLabel');
const checkbox = document.getElementById('autoJbInput');
const btn = document.getElementById('jeilbrek');
const ua = document.getElementById('UA');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');

// ===== SETTINGS =====
const storedAuto = localStorage.getItem("autoJb");
let autoValue = storedAuto !== null ? storedAuto === "true" : false;

let exploitChain = localStorage.getItem("exploitChain") || "lapse";
const netctrl = document.getElementById("netctrl-exploit");
const lapse = document.getElementById("lapse-exploit");
const form = document.getElementById('kernel-options');

// ===== DEVICE INFO =====
if (ua) ua.textContent = 'الجهاز: ' + navigator.userAgent;

// ===== STATUS =====
function setStatus(text, type) {
    type = type || 'waiting';
    if (statusText) statusText.textContent = text;
    if (statusDot) statusDot.className = 'dot ' + type;
}

// ===== KERNEL SELECT =====
if (form) {
    form.addEventListener("change", function(e) {
        localStorage.setItem("exploitChain", e.target.value);
        exploitChain = e.target.value;
        setStatus('تغيير: ' + e.target.value, 'waiting');
    });
}

// ===== JAILBREAK BUTTON =====
if (btn) {
    btn.addEventListener("click", function() {
        btn.disabled = true;
        setStatus('جاري التشغيل...', 'waiting');
        stopTimer();
        if (typeof doJb === 'function') {
            doJb();
        } else {
            setStatus('خطأ في التحميل', 'error');
            btn.disabled = false;
        }
    });
}

// ===== AUTO TOGGLE =====
if (checkbox) {
    checkbox.addEventListener('change', function() {
        localStorage.setItem("autoJb", checkbox.checked);
        if (checkbox.checked && !btn.disabled) {
            setStatus('تلقائي...', 'waiting');
            startCountdown();
        } else {
            stopTimer();
            setStatus('جاهز', 'waiting');
        }
    });
}

// ===== TIMER =====
function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (label) label.textContent = 'تلقائي';
}

function startCountdown() {
    stopTimer();
    let count = 5;
    if (label) label.textContent = 'عد: ' + count;
    timerId = setInterval(function() {
        count--;
        if (label) label.textContent = 'عد: ' + count;
        if (count < 0) {
            clearInterval(timerId);
            timerId = null;
            if (btn) {
                btn.disabled = true;
                setStatus('جاري التشغيل...', 'waiting');
                if (label) label.textContent = 'تنفيذ';
                if (typeof doJb === 'function') {
                    doJb();
                }
            }
        }
    }, 1000);
}

// ===== CACHE =====
function cacheProgress(e) {
    var p = Math.round(e.loaded / e.total * 100);
    document.title = 'Mustafa ' + p + '%';
}
function cacheDone() {
    document.title = 'Mustafa';
}

// ===== ON LOAD =====
document.addEventListener("DOMContentLoaded", function() {

    // Cache
    if (window.applicationCache) {
        window.applicationCache.addEventListener("progress", cacheProgress, false);
        window.applicationCache.oncached = cacheDone;
        window.applicationCache.onupdateready = cacheDone;
    }

    // Select kernel
    if (exploitChain === "netctrl") {
        if (netctrl) netctrl.checked = true;
    } else {
        if (lapse) lapse.checked = true;
    }

    // Auto
    if (checkbox) {
        checkbox.checked = autoValue;
        if (autoValue) {
            setStatus('تلقائي...', 'waiting');
            startCountdown();
        } else {
            setStatus('جاهز', 'waiting');
        }
    }

    // Exploit complete listener
    window.addEventListener('exploitComplete', function(e) {
        if (e.detail && e.detail.success) {
            setStatus('تم الاختراق بنجاح!', 'success');
            document.title = 'نجاح';
            if (btn) btn.disabled = true;
        } else if (e.detail && !e.detail.success) {
            setStatus('فشل، حاول مجدداً', 'error');
            if (btn) btn.disabled = false;
        }
    });

});

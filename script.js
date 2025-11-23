const AppState = {
    sets: new Map(),
    nextSetId: 1,
    universalSets: {
        'ℕ': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        '𝕎': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'ℤ': [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
        'ℚ': [0.5, 1.5, 2.5, 3.5, 1/2, 2/3, 3/4],
        'ℝ': [1, 1.5, 2, 2.5, 3, Math.PI, Math.E],
        'ℚ′': [Math.PI, Math.E, Math.sqrt(2), Math.sqrt(3), Math.sqrt(5)]
    }
};

// مدیریت کیبورد
function toggleKB() {
    const kb = document.getElementById("keyboard");
    kb.classList.toggle("show");
}

function insertSymbol(symbol) {
    let activeElement = document.activeElement;
    
    if (!activeElement || (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA")) {
        const inputs = document.querySelectorAll('input, textarea');
        if (inputs.length > 0) {
            activeElement = inputs[0];
            activeElement.focus();
        } else {
            return;
        }
    }
    
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;
    
    activeElement.value = value.substring(0, start) + symbol + value.substring(end);
    
    const newPosition = start + symbol.length;
    activeElement.setSelectionRange(newPosition, newPosition);
    activeElement.focus();
}

// تابع جدید برای بک‌اسپیس
function backspace() {
    let activeElement = document.activeElement;
    
    if (!activeElement || (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA")) {
        const inputs = document.querySelectorAll('input, textarea');
        if (inputs.length > 0) {
            activeElement = inputs[0];
            activeElement.focus();
        } else {
            return;
        }
    }
    
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;
    
    if (start === end && start > 0) {
        // حذف یک کاراکتر قبل از کرسر
        activeElement.value = value.substring(0, start - 1) + value.substring(end);
        activeElement.setSelectionRange(start - 1, start - 1);
    } else if (start !== end) {
        // حذف متن انتخاب شده
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.setSelectionRange(start, start);
    }
    
    activeElement.focus();
}

// راه‌اندازی برنامه و اضافه کردن event listeners
document.addEventListener('DOMContentLoaded', function() {
    // اضافه کردن event listeners برای دکمه‌های اصلی
    document.getElementById('startBtn').addEventListener('click', start);
    document.getElementById('showSetsBtn').addEventListener('click', showAllSets);
    document.getElementById('addSetBtn').addEventListener('click', addNewSet);
    
    // شروع برنامه
    start();
});

// شروع برنامه
function start() {
    AppState.sets.clear();
    AppState.nextSetId = 1;
    showMainMenu();
}

function showMainMenu() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>منوی اصلی آزمایشگاه مجموعه‌ها</h3>
            <p>لطفاً عملیات مورد نظر را انتخاب کنید:</p>
            <div class="operations-grid">
                <button onclick="addNewSet()" class="btn-operation">➕ ایجاد مجموعه جدید</button>
                <button onclick="showAllSets()" class="btn-operation">📋 نمایش همه مجموعه‌ها</button>
                <button onclick="showSetOperations()" class="btn-operation">🧮 عملیات روی مجموعه‌ها</button>
                <button onclick="checkMembership()" class="btn-operation">🔍 بررسی عضویت</button>
                <button onclick="checkSubsets()" class="btn-operation">📊 بررسی زیرمجموعه‌ها</button>
                <button onclick="showUniversalSets()" class="btn-operation">🌍 مجموعه‌های جهانی</button>
                <button onclick="showVisualizations()" class="btn-operation">📈 نمایش گرافیکی</button>
            </div>
        </div>
    `;
}

function addNewSet() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>ایجاد مجموعه جدید</h3>
            <p>لطفاً نوع ورودی مجموعه را انتخاب کنید:</p>
            
            <div class="input-type-selector">
                <button onclick="showSymbolicInput()" class="btn-type">
                    <strong>روش نمادین</strong><br>
                    <small>مثال: { x | x ∈ ℕ , 3 ≤ x ≤ 8 }</small>
                </button>
                
                <button onclick="showVerbalInput()" class="btn-type">
                    <strong>حالت کلامی</strong><br>
                    <small>مثال: اعداد فرد بین ۱ تا ۱۰</small>
                </button>
                
                <button onclick="showNormalInput()" class="btn-type">
                    <strong>حالت عادی</strong><br>
                    <small>مثال: 1,2,3,4,5</small>
                </button>
            </div>
            
            <div class="button-group">
                <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
        </div>
    `;
}

function showSymbolicInput() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>📐 ایجاد مجموعه با روش نمادین</h3>
            <p>مجموعه را به صورت نمادین ریاضی وارد کنید:</p>
            
            <div class="form-group">
                <label class="form-label">نام مجموعه:</label>
                <input type="text" id="setName" class="form-input" placeholder="مثال: A, B, C, ...">
            </div>
            
            <div class="form-group">
                <label class="form-label">مجموعه نمادین:</label>
                <input type="text" id="setExpression" class="form-input" placeholder="مثال: { x | x ∈ ℕ , 3 ≤ x ≤ 8 }">
                <small>از کیبورد ریاضی برای نمادها استفاده کنید</small>
            </div>
            
            <div class="examples">
                <strong>نمونه‌های روش نمادین:</strong>
                <ul>
                    <li>{ x | x ∈ ℕ , 3 ≤ x ≤ 8 }</li>
                    <li>{ x | x ∈ ℤ , x > 0 , x < 6 }</li>
                    <li>{ x | x = 2k , k ∈ ℕ , k ≤ 5 }</li>
                    <li>{ x | x ∈ ℕ , x فرد }</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button onclick="saveSymbolicSet()" class="btn btn-success">💾 ذخیره مجموعه</button>
                <button onclick="addNewSet()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
        </div>
    `;
}

function showVerbalInput() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>🗣️ ایجاد مجموعه با حالت کلامی</h3>
            <p>مجموعه را با توصیف کلامی وارد کنید:</p>
            
            <div class="form-group">
                <label class="form-label">نام مجموعه:</label>
                <input type="text" id="setName" class="form-input" placeholder="مثال: اعداد_فرد, اعداد_اول, ...">
            </div>
            
            <div class="form-group">
                <label class="form-label">توصیف مجموعه:</label>
                <textarea id="setDescription" class="form-input" rows="3" placeholder="مثال: اعداد طبیعی فرد بین ۱ تا ۱۰"></textarea>
            </div>
            
            <div class="examples">
                <strong>نمونه‌های حالت کلامی:</strong>
                <ul>
                    <li>اعداد طبیعی فرد بین ۱ تا ۱۰</li>
                    <li>اعداد اول کوچکتر از ۲۰</li>
                    <li>مضرب‌های ۳ بین ۱ تا ۳۰</li>
                    <li>اعداد زوج بین ۲ تا ۱۵</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button onclick="saveVerbalSet()" class="btn btn-success">💾 ذخیره مجموعه</button>
                <button onclick="addNewSet()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
        </div>
    `;
}

function showNormalInput() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>🔢 ایجاد مجموعه با حالت عادی</h3>
            <p>اعضای مجموعه را با کاما جدا کنید:</p>
            
            <div class="form-group">
                <label class="form-label">نام مجموعه:</label>
                <input type="text" id="setName" class="form-input" placeholder="مثال: A, B, C, ...">
            </div>
            
            <div class="form-group">
                <label class="form-label">اعضای مجموعه (با کاما جدا کنید):</label>
                <input type="text" id="setElements" class="form-input" placeholder="مثال: 1, 2, 3, 4, 5">
            </div>
            
            <div class="button-group">
                <button onclick="saveNormalSet()" class="btn btn-success">💾 ذخیره مجموعه</button>
                <button onclick="addNewSet()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
        </div>
    `;
}

function saveSymbolicSet() {
    const nameInput = document.getElementById("setName");
    const expressionInput = document.getElementById("setExpression");
    
    const name = nameInput.value.trim();
    const expression = expressionInput.value.trim();
    
    if (!name) {
        showMessage('لطفاً نام مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (!expression) {
        showMessage('لطفاً عبارت نمادین مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (AppState.sets.has(name)) {
        showMessage(`مجموعه با نام "${name}" از قبل وجود دارد`, 'error');
        return;
    }
    
    // ذخیره مجموعه نمادین
    AppState.sets.set(name, {
        type: 'symbolic',
        expression: expression,
        elements: parseSymbolicExpression(expression)
    });
    
    showMessage(`مجموعه نمادین "${name}" ذخیره شد`, 'success');
    showMainMenu();
}

function saveVerbalSet() {
    const nameInput = document.getElementById("setName");
    const descriptionInput = document.getElementById("setDescription");
    
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!name) {
        showMessage('لطفاً نام مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (!description) {
        showMessage('لطفاً توصیف مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (AppState.sets.has(name)) {
        showMessage(`مجموعه با نام "${name}" از قبل وجود دارد`, 'error');
        return;
    }
    
    // ذخیره مجموعه کلامی
    AppState.sets.set(name, {
        type: 'verbal',
        description: description,
        elements: parseVerbalDescription(description)
    });
    
    showMessage(`مجموعه کلامی "${name}" ذخیره شد`, 'success');
    showMainMenu();
}

function saveNormalSet() {
    const nameInput = document.getElementById("setName");
    const elementsInput = document.getElementById("setElements");
    
    const name = nameInput.value.trim();
    const elementsText = elementsInput.value.trim();
    
    if (!name) {
        showMessage('لطفاً نام مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (!elementsText) {
        showMessage('لطفاً اعضای مجموعه را وارد کنید', 'error');
        return;
    }
    
    if (AppState.sets.has(name)) {
        showMessage(`مجموعه با نام "${name}" از قبل وجود دارد`, 'error');
        return;
    }
    
    const elements = parseSet(elementsText);
    AppState.sets.set(name, {
        type: 'normal',
        elements: elements
    });
    
    showMessage(`مجموعه "${name}" با ${elements.length} عضو ذخیره شد`, 'success');
    showMainMenu();
}

function parseSymbolicExpression(expression) {
    // تجزیه عبارت نمادین مانند { x | x ∈ ℕ , 3 ≤ x ≤ 8 }
    try {
        // حذف فاصله‌های اضافی
        expression = expression.replace(/\s/g, '');
        
        // بررسی ساختار { x | condition }
        if (expression.startsWith('{') && expression.includes('|') && expression.endsWith('}')) {
            const parts = expression.slice(1, -1).split('|');
            if (parts.length === 2) {
                const variable = parts[0].trim(); // معمولاً 'x'
                const conditions = parts[1].split(','); // شرط‌ها با کاما جدا می‌شوند
                
                // پردازش شرط‌ها و تولید مجموعه
                return generateSetFromConditions(conditions);
            }
        }
        
        // اگر ساختار استاندارد نبود، سعی می‌کنیم به صورت معمولی تجزیه کنیم
        return parseSet(expression);
        
    } catch (error) {
        console.error('Error parsing symbolic expression:', error);
        return [];
    }
}

function parseVerbalDescription(description) {
    // تجزیه توصیف کلامی
    description = description.toLowerCase();
    
    let result = [];
    
    // تشخیص اعداد فرد
    if (description.includes('فرد') && description.includes('طبیعی')) {
        if (description.includes('۱ تا ۱۰') || description.includes('1 تا 10')) {
            result = [1, 3, 5, 7, 9];
        } else if (description.includes('۱ تا ۲۰') || description.includes('1 تا 20')) {
            result = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        } else {
            result = [1, 3, 5, 7, 9]; // پیش‌فرض
        }
    }
    // تشخیص اعداد زوج
    else if (description.includes('زوج')) {
        if (description.includes('۲ تا ۱۵') || description.includes('2 تا 15')) {
            result = [2, 4, 6, 8, 10, 12, 14];
        } else if (description.includes('۱ تا ۱۰') || description.includes('1 تا 10')) {
            result = [2, 4, 6, 8, 10];
        } else {
            result = [2, 4, 6, 8, 10]; // پیش‌فرض
        }
    }
    // تشخیص اعداد اول
    else if (description.includes('اول')) {
        if (description.includes('کوچکتر از ۲۰') || description.includes('کمتر از 20')) {
            result = [2, 3, 5, 7, 11, 13, 17, 19];
        } else {
            result = [2, 3, 5, 7, 11]; // پیش‌فرض
        }
    }
    // تشخیص مضرب‌ها
    else if (description.includes('مضرب')) {
        if (description.includes('۳') && description.includes('۱ تا ۳۰')) {
            result = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
        } else if (description.includes('۵') && description.includes('۱ تا ۵۰')) {
            result = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
        } else {
            result = [3, 6, 9, 12, 15]; // پیش‌فرض
        }
    }
    // تشخیص بازه عددی
    else if (description.includes('بین') && description.includes('تا')) {
        const numbers = description.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const start = parseInt(numbers[0]);
            const end = parseInt(numbers[1]);
            result = Array.from({length: end - start + 1}, (_, i) => start + i);
        }
    }
    // پیش‌فرض
    else {
        result = [1, 2, 3, 4, 5]; // مقدار پیش‌فرض
    }
    
    return result;
}

function generateSetFromConditions(conditions) {
    let result = [];
    
    for (const condition of conditions) {
        const trimmedCondition = condition.trim();
        
        // پردازش شرط‌های مختلف
        if (trimmedCondition.includes('∈')) {
            // شرط عضویت مانند x ∈ ℕ
            const [varPart, setPart] = trimmedCondition.split('∈');
            const universalSet = setPart.trim();
            
            if (AppState.universalSets[universalSet]) {
                result = [...AppState.universalSets[universalSet]];
            }
        }
        else if (trimmedCondition.includes('≤') || trimmedCondition.includes('≥') || 
                 trimmedCondition.includes('<') || trimmedCondition.includes('>')) {
            // شرط‌های عددی
            result = applyNumericCondition(result, trimmedCondition);
        }
        else if (trimmedCondition.includes('فرد')) {
            // اعداد فرد
            result = result.filter(x => x % 2 === 1);
        }
        else if (trimmedCondition.includes('زوج')) {
            // اعداد زوج
            result = result.filter(x => x % 2 === 0);
        }
    }
    
    return result.length > 0 ? result : [3, 4, 5, 6, 7, 8]; // مقدار پیش‌فرض برای نمونه
}

function applyNumericCondition(set, condition) {
    if (set.length === 0) {
        // اگر مجموعه خالی است، یک بازه مناسب ایجاد کن
        set = Array.from({length: 20}, (_, i) => i - 5); // اعداد از -5 تا 14
    }
    
    if (condition.includes('≤')) {
        const parts = condition.split('≤');
        if (parts.length === 2) {
            const value = parseFloat(parts[1]);
            return set.filter(x => x <= value);
        }
    }
    else if (condition.includes('≥')) {
        const parts = condition.split('≥');
        if (parts.length === 2) {
            const value = parseFloat(parts[1]);
            return set.filter(x => x >= value);
        }
    }
    else if (condition.includes('<')) {
        const parts = condition.split('<');
        if (parts.length === 2) {
            const value = parseFloat(parts[1]);
            return set.filter(x => x < value);
        }
    }
    else if (condition.includes('>')) {
        const parts = condition.split('>');
        if (parts.length === 2) {
            const value = parseFloat(parts[1]);
            return set.filter(x => x > value);
        }
    }
    
    return set;
}

function showAllSets() {
    if (AppState.sets.size === 0) {
        document.getElementById("step").innerHTML = `
            <div class="step-container">
                <h3>مجموعه‌های موجود</h3>
                <p>هنوز هیچ مجموعه‌ای ایجاد نشده است.</p>
                <button onclick="addNewSet()" class="btn btn-primary">➕ ایجاد مجموعه جدید</button>
                <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
        `;
        return;
    }
    
    let setsHTML = '<div class="step-container"><h3>مجموعه‌های موجود</h3>';
    
    AppState.sets.forEach((setData, name) => {
        let content = '';
        
        if (setData.type === 'symbolic') {
            content = `
                <div class="set-expression">${setData.expression}</div>
                <div class="set-content">مقادیر: ${formatSet(setData.elements)}</div>
            `;
        } else if (setData.type === 'verbal') {
            content = `
                <div class="set-description">${setData.description}</div>
                <div class="set-content">مقادیر: ${formatSet(setData.elements)}</div>
            `;
        } else {
            content = `<div class="set-content">${formatSet(setData.elements)}</div>`;
        }
        
        setsHTML += `
            <div class="set-item">
                <div class="set-name">${name} <small>(${getTypeName(setData.type)})</small></div>
                ${content}
                <div class="set-actions">
                    <button onclick="editSet('${name}')" class="btn btn-info">✏️ ویرایش</button>
                    <button onclick="deleteSet('${name}')" class="btn btn-danger">🗑️ حذف</button>
                </div>
            </div>
        `;
    });
    
    setsHTML += `
        <div class="button-group">
            <button onclick="addNewSet()" class="btn btn-success">➕ مجموعه جدید</button>
            <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
        </div>
    </div>`;
    
    document.getElementById("step").innerHTML = setsHTML;
}

function getTypeName(type) {
    const typeNames = {
        'symbolic': 'نمادین',
        'verbal': 'کلامی',
        'normal': 'عادی'
    };
    return typeNames[type] || type;
}

function editSet(name) {
    const setData = AppState.sets.get(name);
    
    if (setData.type === 'symbolic') {
        document.getElementById("step").innerHTML = `
            <div class="step-container">
                <h3>ویرایش مجموعه ${name}</h3>
                <div class="form-group">
                    <label class="form-label">عبارت نمادین:</label>
                    <input type="text" id="editSetExpression" class="form-input" value="${setData.expression}">
                </div>
                <div class="button-group">
                    <button onclick="updateSymbolicSet('${name}')" class="btn btn-success">💾 به‌روزرسانی</button>
                    <button onclick="showAllSets()" class="btn btn-secondary">🔙 بازگشت</button>
                </div>
            </div>
        `;
    } else if (setData.type === 'verbal') {
        document.getElementById("step").innerHTML = `
            <div class="step-container">
                <h3>ویرایش مجموعه ${name}</h3>
                <div class="form-group">
                    <label class="form-label">توصیف مجموعه:</label>
                    <textarea id="editSetDescription" class="form-input" rows="3">${setData.description}</textarea>
                </div>
                <div class="button-group">
                    <button onclick="updateVerbalSet('${name}')" class="btn btn-success">💾 به‌روزرسانی</button>
                    <button onclick="showAllSets()" class="btn btn-secondary">🔙 بازگشت</button>
                </div>
            </div>
        `;
    } else {
        document.getElementById("step").innerHTML = `
            <div class="step-container">
                <h3>ویرایش مجموعه ${name}</h3>
                <div class="form-group">
                    <label class="form-label">اعضای مجموعه:</label>
                    <input type="text" id="editSetElements" class="form-input" value="${setData.elements.join(', ')}">
                </div>
                <div class="button-group">
                    <button onclick="updateNormalSet('${name}')" class="btn btn-success">💾 به‌روزرسانی</button>
                    <button onclick="showAllSets()" class="btn btn-secondary">🔙 بازگشت</button>
                </div>
            </div>
        `;
    }
}

function updateSymbolicSet(name) {
    const expressionInput = document.getElementById("editSetExpression");
    const expression = expressionInput.value.trim();
    
    AppState.sets.set(name, {
        type: 'symbolic',
        expression: expression,
        elements: parseSymbolicExpression(expression)
    });
    showMessage(`مجموعه "${name}" به‌روزرسانی شد`, 'success');
    showAllSets();
}

function updateVerbalSet(name) {
    const descriptionInput = document.getElementById("editSetDescription");
    const description = descriptionInput.value.trim();
    
    AppState.sets.set(name, {
        type: 'verbal',
        description: description,
        elements: parseVerbalDescription(description)
    });
    showMessage(`مجموعه "${name}" به‌روزرسانی شد`, 'success');
    showAllSets();
}

function updateNormalSet(name) {
    const elementsInput = document.getElementById("editSetElements");
    const elements = parseSet(elementsInput.value);
    
    AppState.sets.set(name, {
        type: 'normal',
        elements: elements
    });
    showMessage(`مجموعه "${name}" به‌روزرسانی شد`, 'success');
    showAllSets();
}

function deleteSet(name) {
    if (confirm(`آیا از حذف مجموعه "${name}" مطمئن هستید؟`)) {
        AppState.sets.delete(name);
        showMessage(`مجموعه "${name}" حذف شد`, 'success');
        showAllSets();
    }
}

function showSetOperations() {
    if (AppState.sets.size < 2) {
        showMessage('برای انجام عملیات حداقل به ۲ مجموعه نیاز دارید', 'warning');
        return;
    }
    
    let setsHTML = '';
    AppState.sets.forEach((_, name) => {
        setsHTML += `<option value="${name}">${name}</option>`;
    });
    
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>عملیات روی مجموعه‌ها</h3>
            <div class="form-group">
                <label class="form-label">مجموعه اول:</label>
                <select id="setA" class="form-input">${setsHTML}</select>
            </div>
            <div class="form-group">
                <label class="form-label">عملیات:</label>
                <select id="operation" class="form-input">
                    <option value="union">اتحاد (A ∪ B)</option>
                    <option value="intersection">اشتراک (A ∩ B)</option>
                    <option value="difference">تفاضل (A - B)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">مجموعه دوم:</label>
                <select id="setB" class="form-input">${setsHTML}</select>
            </div>
            <div class="button-group">
                <button onclick="performSetOperation()" class="btn btn-primary">🧮 انجام عملیات</button>
                <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
            </div>
            <div id="operationResult"></div>
        </div>
    `;
}

function performSetOperation() {
    const setA = document.getElementById("setA").value;
    const setB = document.getElementById("setB").value;
    const operation = document.getElementById("operation").value;
    
    const setDataA = AppState.sets.get(setA);
    const setDataB = AppState.sets.get(setB);
    
    const elementsA = setDataA.elements || [];
    const elementsB = setDataB.elements || [];
    
    let result = [];
    
    switch(operation) {
        case 'union':
            result = [...new Set([...elementsA, ...elementsB])];
            break;
        case 'intersection':
            result = elementsA.filter(x => elementsB.includes(x));
            break;
        case 'difference':
            result = elementsA.filter(x => !elementsB.includes(x));
            break;
    }
    
    const resultDiv = document.getElementById("operationResult");
    resultDiv.innerHTML = `
        <div class="success-message">
            <strong>نتیجه ${setA} ${getOperationSymbol(operation)} ${setB}:</strong><br>
            ${formatSet(result)}
        </div>
    `;
}

function getOperationSymbol(operation) {
    switch(operation) {
        case 'union': return '∪';
        case 'intersection': return '∩';
        case 'difference': return '−';
        default: return '';
    }
}

function checkMembership() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>بررسی عضویت</h3>
            <p>این بخش به زودی تکمیل خواهد شد...</p>
            <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
        </div>
    `;
}

function checkSubsets() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>بررسی زیرمجموعه‌ها</h3>
            <p>این بخش به زودی تکمیل خواهد شد...</p>
            <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
        </div>
    `;
}

function showUniversalSets() {
    let setsHTML = '';
    for (const [name, elements] of Object.entries(AppState.universalSets)) {
        setsHTML += `
            <div class="set-item">
                <div class="set-name">${name}</div>
                <div class="set-content">${formatSet(elements)}</div>
            </div>
        `;
    }
    
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>مجموعه‌های جهانی</h3>
            ${setsHTML}
            <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
        </div>
    `;
}

function showVisualizations() {
    document.getElementById("step").innerHTML = `
        <div class="step-container">
            <h3>نمایش گرافیکی</h3>
            <p>این بخش به زودی تکمیل خواهد شد...</p>
            <button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت</button>
        </div>
    `;
}

// توابع کمکی
function showMessage(message, type = 'info') {
    const stepSection = document.getElementById("step");
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    stepSection.insertBefore(messageDiv, stepSection.firstChild);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function parseSet(input) {
    try {
        input = input.replace(/\s/g, '');
        
        if (input.startsWith('{') && input.endsWith('}')) {
            const content = input.slice(1, -1);
            if (content === '') return [];
            
            const elements = content.split(',').filter(item => item !== '');
            return elements.map(item => {
                const num = Number(item);
                return isNaN(num) ? item : num;
            });
        }
        
        return [];
    } catch (error) {
        return [];
    }
}

function formatSet(elements) {
    if (elements.length === 0) return '∅';
    return `{${elements.join(', ')}}`;
}
// ---------- 1) العناصر اللي هنتعامل معاها ----------

const exprDisplay = document.querySelector(".expr");     // السطر الصغير فوق
const resultDisplay = document.querySelector(".result"); // السطر الكبير (الرقم اللي بيتكتب)
const allButtons = document.querySelectorAll(".key");     // كل أزرار الآلة الحاسبة
const themeToggle = document.getElementById("themeToggle");// زر تغيير الـ Mode

// ---------- 2) المتغيرات اللي بتحفظ حالة الحاسبة ----------

let firstNumber = null;   // أول رقم في العملية
let operator = null;      // العملية (+ − × ÷)
let display = "0";        // الرقم اللي شكله ظاهر دلوقتي في الشاشة الكبيرة
let startNewNumber = false; // هل نبدأ رقم جديد لما ندوس رقم؟


// ---------- 3) دالة بسيطة تحدّث الشاشة ----------

function updateScreen() {

  resultDisplay.textContent = display;

  // ---------- تصغير الخط لو الرقم طويل ----------

  resultDisplay.classList.remove("small-result");

  resultDisplay.classList.remove("tiny-result");

  if(display.length > 10){

      resultDisplay.classList.add("small-result");

  }

  if(display.length > 16){

      resultDisplay.classList.add("tiny-result");

  }

}


// ---------- 4) لما ندوس على رقم (0-9) ----------

function pressNumber(num) {
  if (display === "0" || startNewNumber) {
    display = num;
    startNewNumber = false;
  } else {
    display = display + num;
  }
  updateScreen();
}


// ---------- 5) لما ندوس على النقطة العشرية (.) ----------

function pressDot() {
  if (startNewNumber) {
    display = "0.";
    startNewNumber = false;
  } else if (display.indexOf(".") === -1) {
    display = display + ".";
  }
  updateScreen();
}


// ---------- 6) لما ندوس على عملية حسابية (+ − × ÷) ----------

function pressOperator(op) {
  // لو فيه عملية شغالة قبل كده، نحسبها الأول (زي الآلة الحاسبة العادية)
  if (operator !== null) {
    pressEquals();
  }

  firstNumber = parseFloat(display);
  operator = op;
  exprDisplay.textContent = display + " " + op;
  startNewNumber = true;
}


// ---------- 7) دالة الحساب الفعلي (مجموعة if عادية وبسيطة) ----------

function calculate(num1, op, num2) {
  if (op === "+") {
    return num1 + num2;
  }
  if (op === "−") {
    return num1 - num2;
  }
  if (op === "×") {
    return num1 * num2;
  }
  if (op === "÷") {
    if (num2 === 0) {
      return "error";
    }
    return num1 / num2;
  }
}


// ---------- 8) لما ندوس على "=" ----------

function pressEquals() {
  if (operator === null) return;

  let secondNumber = parseFloat(display);
  let result = calculate(firstNumber, operator, secondNumber);

  exprDisplay.textContent = firstNumber + " " + operator + " " + secondNumber + " =";

  // ---------- تنسيق النتيجة ----------

if(typeof result === "number"){

    if(Number.isInteger(result)){

        display = result.toString();

    }

    else{

        display = parseFloat(result.toFixed(8)).toString();

    }

}

else{

    display = result.toString();

}
  updateScreen();

  // نصفّر عشان نبدأ عملية جديدة من غير ما نمسح الرقم اللي طلع
  operator = null;
  firstNumber = null;
  startNewNumber = true;
}


// ---------- 9) "AC" مسح كل حاجة ----------

function pressClearAll() {
  display = "0";
  firstNumber = null;
  operator = null;
  startNewNumber = false;
  exprDisplay.textContent = "";
  updateScreen();
}


// ---------- 10) "CE" مسح الرقم الحالي بس ----------

function pressClearEntry() {
  display = "0";
  updateScreen();
}


// ---------- 11) "⌫" حذف آخر رقم اتكتب ----------

function pressBackspace() {
  display = display.slice(0, -1);
  if (display === "") {
    display = "0";
  }
  updateScreen();
}


// ---------- 12) "%" النسبة المئوية ----------

function pressPercent() {
  let number = parseFloat(display);
  display = (number / 100).toString();
  updateScreen();
}


// ---------- 13) نربط كل زرار بالوظيفة بتاعته ----------

allButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.textContent.trim();

    if (value >= "0" && value <= "9") {
      pressNumber(value);
    } else if (value === ".") {
      pressDot();
    } else if (button.classList.contains("op")) {
      pressOperator(value);
    } else if (button.classList.contains("equals")) {
      pressEquals();
    } else if (value === "AC") {
      pressClearAll();
    } else if (value === "CE") {
      pressClearEntry();
    } else if (value === "⌫") {
      pressBackspace();
    } else if (button.classList.contains("percent")) {
      pressPercent();
    }
  });
});
// ---------- تغيير الـ Theme ----------

themeToggle.addEventListener("click",function(e){

    e.preventDefault();

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        themeToggle.innerHTML='🌙 <span class="label">Dark Mode</span>';

        localStorage.setItem("theme","light");

    }

    else{

        themeToggle.innerHTML='☀️ <span class="label">Light Mode</span>';

        localStorage.setItem("theme","dark");

    }

});
// ---------- دعم الكيبورد ----------

document.addEventListener("keydown",function(e){

const key=e.key;

if(key>="0"&&key<="9"){

pressNumber(key);

}

else if(key==="."){

pressDot();

}

else if(key==="+"||key==="-"||key==="*"||key==="/"){

let op=key;

if(op==="*") op="×";

if(op==="/") op="÷";

if(op==="-") op="−";

pressOperator(op);

}

else if(key==="Enter"){

pressEquals();

}

else if(key==="Backspace"){

pressBackspace();

}

else if(key==="Delete"){

pressClearAll();

}

else if(key==="%"){

pressPercent();

}

});
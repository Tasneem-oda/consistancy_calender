document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const calendarBody = document.getElementById("calendarBody");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const noteModal = document.getElementById("noteModal");
  const notificationModal = document.getElementById("notificationModal");
  const imageModal = document.getElementById("imageModal");
  const guide = document.getElementById("guide");
  const overlay = document.querySelector(".overlay");

  // --- State ---
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // --- Local Storage Keys ---
  const MARKED_DAYS_PREFIX = "markedDays_";
  const HABIT_TEXT_KEY = "habitText";
  const VISITED_KEY = "hasVisited";
  const NOTE_KEY = "userNote";
  const COLOR_KEY = "selectedColor";
  const IMAGE_PREFIX = "selectedImage_";

  // --- Functions ---

  /**
   * Renders the calendar for the current month and year.
   */
  const renderCalendar = () => {
    calendarBody.innerHTML = "";
    monthYear.textContent = new Date(
      currentYear,
      currentMonth
    ).toLocaleDateString("ar-EG", {
      month: "long",
      year: "numeric",
    });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    const markedDays = getMarkedDaysForMonth(currentYear, currentMonth);

    // Add empty cells for days of the previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarBody.insertAdjacentHTML("beforeend", '<div class="day"></div>');
    }

    // Add days of the current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      const today = new Date();
      if (
        i === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {
        dayElement.classList.add("today");
      }

      if (markedDays.includes(i)) {
        dayElement.classList.add("marked");
        dayElement.textContent = ""; // Clear number and show checkmark via CSS
      }

      dayElement.addEventListener("click", () => handleDayClick(dayElement, i));
      calendarBody.appendChild(dayElement);
    }
    updateProgressBar();
  };

  /**
   * Handles click events on a calendar day.
   * @param {HTMLElement} dayElement - The clicked day element.
   * @param {number} day - The day number.
   */
  const handleDayClick = (dayElement, day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (selectedDate > new Date()) {
      alert("لا يمكنك تحديد يوم في المستقبل!");
      return;
    }

    dayElement.classList.toggle("marked");
    const markedDays = getMarkedDaysForMonth(currentYear, currentMonth);
    const dayIndex = markedDays.indexOf(day);

    if (dayElement.classList.contains("marked")) {
      if (dayIndex === -1) markedDays.push(day);
      dayElement.textContent = "";
    } else {
      if (dayIndex > -1) markedDays.splice(dayIndex, 1);
      dayElement.textContent = day;
    }

    saveMarkedDaysForMonth(currentYear, currentMonth, markedDays);
    updateProgressBar();
  };

  /**
   * Updates the calendar to a new month.
   * @param {number} increment - -1 for previous, 1 for next.
   */
  const updateMonth = (increment) => {
    currentMonth += increment;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  };

  /**
   * Updates the progress bar based on marked days.
   */
  const updateProgressBar = () => {
    const progressFill = document.getElementById("progressFill");
    const progressText = progressFill.querySelector("span");

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const markedDays = getMarkedDaysForMonth(currentYear, currentMonth);
    const percentage =
      daysInMonth > 0 ? (markedDays.length / daysInMonth) * 100 : 0;

    progressFill.style.width = `${percentage.toFixed(2)}%`;
    progressText.textContent = `${percentage.toFixed(0)}%`;
  };

  // --- LocalStorage Helper Functions ---
  const getMarkedDaysForMonth = (year, month) =>
    JSON.parse(localStorage.getItem(`${MARKED_DAYS_PREFIX}${year}_${month}`)) ||
    [];
  const saveMarkedDaysForMonth = (year, month, days) =>
    localStorage.setItem(
      `${MARKED_DAYS_PREFIX}${year}_${month}`,
      JSON.stringify(days)
    );
  const getStorageItem = (key, defaultValue = "") =>
    localStorage.getItem(key) || defaultValue;
  const setStorageItem = (key, value) => localStorage.setItem(key, value);
  const removeStorageItem = (key) => localStorage.removeItem(key);

  // --- Component Initializers ---

  const initCalendar = () => {
    renderCalendar();
    prevBtn.addEventListener("click", () => updateMonth(-1));
    nextBtn.addEventListener("click", () => updateMonth(1));
  };

  const initHabitTracker = () => {
    const editableText = document.getElementById("editableText");
    const editControls = document.getElementById("editControls");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let originalText = getStorageItem(
      HABIT_TEXT_KEY,
      "سألتزم بهذه العادة هذا العام"
    );
    editableText.textContent = originalText;

    editableText.addEventListener("dblclick", () => {
      editableText.innerHTML = `<input type="text" id="habitInput" value="${originalText}">`;
      document.getElementById("habitInput").focus();
      editControls.style.display = "flex";
    });

    saveBtn.addEventListener("click", () => {
      const input = document.getElementById("habitInput");
      originalText = input.value;
      editableText.textContent = originalText;
      setStorageItem(HABIT_TEXT_KEY, originalText);
      editControls.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
      editableText.textContent = originalText;
      editControls.style.display = "none";
    });
  };

  const initModals = () => {
    // General Modal Logic
    document.querySelectorAll(".modal .close-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        btn.closest(".modal").classList.add("hidden")
      );
    });
    window.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        event.target.classList.add("hidden");
      }
    });

    // Note Modal
    const noteIcon = document.getElementById("noteIcon");
    const noteText = document.getElementById("noteText");
    const saveNote = document.getElementById("saveNote");
    const deleteNote = document.getElementById("deleteNote");
    noteText.value = getStorageItem(NOTE_KEY);
    noteIcon.addEventListener("click", () =>
      noteModal.classList.remove("hidden")
    );
    saveNote.addEventListener("click", () => {
      setStorageItem(NOTE_KEY, noteText.value);
      noteModal.classList.add("hidden");
    });
    deleteNote.addEventListener("click", () => {
      removeStorageItem(NOTE_KEY);
      noteText.value = "";
      noteModal.classList.add("hidden");
    });

    // Notification Modal
    const notificationIcon = document.getElementById("notificationIcon");
    const notificationMessage = document.getElementById("notificationMessage");
    notificationIcon.addEventListener("click", () => {
      let report = "";
      for (let i = 0; i < 12; i++) {
        const days = getMarkedDaysForMonth(currentYear, i);
        if (days.length > 0) {
          const monthName = new Date(currentYear, i).toLocaleString("ar-EG", {
            month: "long",
          });
          const totalDays = new Date(currentYear, i + 1, 0).getDate();
          const percentage = ((days.length / totalDays) * 100).toFixed(1);
          report += `<li><b>${monthName}:</b> أنجزت ${days.length} يوم (${percentage}%)</li>`;
        }
      }
      notificationMessage.innerHTML = report
        ? `<ul>${report}</ul>`
        : "لم يتم تسجيل أي تقدم بعد. ابدأ اليوم!";
      notificationModal.classList.remove("hidden");
    });
  };

  const initVisionBoard = () => {
    const plusSigns = document.querySelectorAll(".monthly-vision-board .image");
    let currentImageIndex = null;

    plusSigns.forEach((plus, index) => {
      const imageKey = `${IMAGE_PREFIX}${index}`;
      const savedImage = getStorageItem(imageKey);
      if (savedImage) {
        plus.style.backgroundImage = `url(${savedImage})`;
        plus.querySelector("i")?.remove();
      }

      plus.addEventListener("click", () => {
        currentImageIndex = index;
        if (getStorageItem(imageKey)) {
          imageModal.classList.remove("hidden");
        } else {
          selectNewImage(plus, imageKey);
        }
      });
    });

    document.getElementById("deleteImage").addEventListener("click", () => {
      if (currentImageIndex === null) return;
      const imageKey = `${IMAGE_PREFIX}${currentImageIndex}`;
      const plus = plusSigns[currentImageIndex];

      plus.style.backgroundImage = "";
      if (!plus.querySelector("i")) {
        plus.innerHTML = '<i class="fas fa-plus"></i>';
      }
      removeStorageItem(imageKey);
      imageModal.classList.add("hidden");
    });

    document.getElementById("changeImage").addEventListener("click", () => {
      if (currentImageIndex === null) return;
      const imageKey = `${IMAGE_PREFIX}${currentImageIndex}`;
      const plus = plusSigns[currentImageIndex];
      selectNewImage(plus, imageKey);
      imageModal.classList.add("hidden");
    });

    const selectNewImage = (plus, imageKey) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target.result;
            plus.style.backgroundImage = `url(${imageUrl})`;
            plus.querySelector("i")?.remove();
            setStorageItem(imageKey, imageUrl);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };
  };

  const initColorPicker = () => {
    const colorPicker = document.getElementById("colorPicker");
    const savedColor = getStorageItem(COLOR_KEY);

    const applyColor = (color) => {
      document.documentElement.style.setProperty("--primary-color", color);
      document.documentElement.style.setProperty(
        "--secondary-color",
        color + "aa"
      ); // semi-transparent
    };

    if (savedColor) {
      applyColor(savedColor);
      colorPicker.value = savedColor;
    }

    colorPicker.addEventListener("input", (event) => {
      const newColor = event.target.value;
      applyColor(newColor);
      setStorageItem(COLOR_KEY, newColor);
    });
  };

  const initFirstVisitGuide = () => {
    if (getStorageItem(VISITED_KEY)) return;

    guide.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const steps = [
      {
        element: ".habit-tracker",
        message: "هنا يمكنك تعديل عادتك السنوية بالنقر المزدوج.",
      },
      {
        element: ".calendar-container",
        message: "هذا هو التقويم. انقر على الأيام لتسجيل إنجازك.",
      },
      {
        element: ".monthly-vision-board",
        message: "أضف صورًا ملهمة لكل شهر لتكون لوحة رؤيتك.",
      },
      {
        element: ".controls",
        message:
          "استخدم هذه الأزرار للوصول السريع للملاحظات والإشعارات والإعدادات.",
      },
    ];
    let currentStep = 0;

    const showStep = () => {
      steps.forEach((s) =>
        document.querySelector(s.element)?.classList.remove("highlight")
      );
      if (currentStep >= steps.length) {
        endGuide();
        return;
      }

      const { element, message } = steps[currentStep];
      document.querySelector(element)?.classList.add("highlight");
      document.getElementById("message").textContent = message;
    };

    const endGuide = () => {
      guide.classList.add("hidden");
      overlay.classList.add("hidden");
      steps.forEach((s) =>
        document.querySelector(s.element)?.classList.remove("highlight")
      );
      setStorageItem(VISITED_KEY, "true");
    };

    document.getElementById("next").addEventListener("click", () => {
      currentStep++;
      showStep();
    });
    document.getElementById("stop").addEventListener("click", endGuide);

    showStep();
  };

  // --- App Initialization ---
  initCalendar();
  initHabitTracker();
  initModals();
  initVisionBoard();
  initColorPicker();
  initFirstVisitGuide();
});

// --- Service Worker Registration ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) =>
        console.log("Service Worker registered.", registration)
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  });
}

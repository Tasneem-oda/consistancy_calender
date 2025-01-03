document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendarBody");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDay = null;

  function renderCalendar() {
    calendarBody.innerHTML = "";

    // Set month and year in header
    monthYear.textContent = new Date(
      currentYear,
      currentMonth
    ).toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });

    // Get the first day of the month and the total days in the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    // Fill in the previous month's days if necessary
    for (let i = 0; i < firstDayOfMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      calendarBody.appendChild(dayElement);
    }

    // Fill in the current month's days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      // Highlight today's date
      if (
        i === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear()
      ) {
        dayElement.classList.add("today");
      }

      dayElement.addEventListener("click", function () {
        selectDay(this, i);
      });
      calendarBody.appendChild(dayElement);
    }
  }

  function selectDay(dayElement, day) {
    if (selectedDay) {
      selectedDay.classList.remove("selected");
    }
    selectedDay = dayElement;
    selectedDay.classList.add("selected");
  }

  renderCalendar();

  // Event listeners for previous and next month buttons
  prevBtn.addEventListener("click", function () {
    const today = new Date();
    if (
      currentYear > today.getFullYear() ||
      (currentYear === today.getFullYear() && currentMonth > today.getMonth())
    ) {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    }
  });

  nextBtn.addEventListener("click", function () {
    const today = new Date();
    if (
      currentYear < today.getFullYear() + 1 ||
      (currentYear === today.getFullYear() + 1 &&
        currentMonth < today.getMonth())
    ) {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    }
  });

  const calendarIcon = document.getElementById("calendarIcon");
  const noteIcon = document.getElementById("noteIcon");
  const notificationIcon = document.getElementById("notificationIcon");
  const noteModal = document.getElementById("noteModal");
  const notificationModal = document.getElementById("notificationModal");
  const noteText = document.getElementById("noteText");
  const saveNote = document.getElementById("saveNote");
  const deleteNote = document.getElementById("deleteNote");
  const notificationMessage = document.getElementById("notificationMessage");
  const closeNoteModal = document.getElementById("closeNoteModal");
  const closeNotification = document.getElementById("closeNotification");
  const calendar = document.querySelector(".calendar");
  // Toggle calendar visibility
  calendarIcon.addEventListener("click", function () {
    if (calendar.classList.contains("hidden")) {
      calendar.classList.remove("hidden");
    } else {
      calendar.classList.add("hidden");
    }
  });

  // Show note modal
  noteIcon.addEventListener("click", function () {
    noteModal.style.display = "block";
  });

  // Save note
  saveNote.addEventListener("click", function () {
    localStorage.setItem("userNote", noteText.value);
    noteModal.style.display = "none";
  });

  // Delete note
  deleteNote.addEventListener("click", function () {
    localStorage.removeItem("userNote");
    noteText.value = "";
    noteModal.style.display = "none";
  });

  // Show notification modal
  notificationIcon.addEventListener("click", function () {
    const newNotification = false; // Replace with actual logic to check for new notifications
    if (newNotification) {
      notificationMessage.textContent = "You have a new notification!";
    } else {
      notificationMessage.textContent = "No new notifications. ";
    }
    notificationModal.style.display = "block";
  });

  // Close modals
  closeNoteModal.addEventListener("click", function () {
    noteModal.style.display = "none";
  });

  closeNotification.addEventListener("click", function () {
    notificationModal.style.display = "none";
  });

  // Load saved note on page load
  if (localStorage.getItem("userNote")) {
    noteText.value = localStorage.getItem("userNote");
  }
});
// the habit sentence
const editableText = document.getElementById("editableText");
const editControls = document.getElementById("editControls");
let originalText =
  localStorage.getItem("habitText") || editableText.textContent;

// Load saved text on page load
editableText.textContent = originalText;

editableText.addEventListener("dblclick", function () {
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.id = "textInput";
  editableText.textContent = "";
  editableText.appendChild(input);
  editControls.style.display = "block";
});

document.getElementById("saveBtn").addEventListener("click", function () {
  const input = document.getElementById("textInput");
  originalText = input.value;
  editableText.textContent = originalText;
  localStorage.setItem("habitText", originalText);
  editControls.style.display = "none";
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  editableText.textContent = originalText;
  editControls.style.display = "none";
});
//  image popup
document.addEventListener("DOMContentLoaded", function () {
  const plusSigns = document.querySelectorAll(".image");
  const modal = document.getElementById("imageModal");
  const closeModal = document.getElementById("closeImageModal");
  let currentImageIndex = null;

  plusSigns.forEach((plus, index) => {
    const imageKey = `selectedImage_${index}`;
    const savedImage = localStorage.getItem(imageKey);

    if (savedImage) {
      plus.style.backgroundImage = `url(${savedImage})`;
      plus.style.backgroundSize = "cover";
      const plusIcon = plus.querySelector(".fa-plus");
      if (plusIcon) {
        plusIcon.remove();
      }
    }

    plus.addEventListener("click", function () {
      currentImageIndex = index;
      const currentSavedImage = localStorage.getItem(imageKey);

      if (currentSavedImage) {
        modal.style.display = "block";
      } else {
        selectNewImage(plus, imageKey);
      }
    });
  });

  document.getElementById("deleteImage").addEventListener("click", function () {
    if (currentImageIndex !== null) {
      const imageKey = `selectedImage_${currentImageIndex}`;
      const plus = plusSigns[currentImageIndex];

      plus.style.backgroundImage = "";
      const plusIcon = document.createElement("i");
      plusIcon.classList.add("fa", "fa-plus");
      plus.appendChild(plusIcon);

      localStorage.removeItem(imageKey);
      modal.style.display = "none";

      // Update body background if the deleted image was for the current month
      if (currentImageIndex === new Date().getMonth()) {
        document.body.style.backgroundImage = "";
      }
    }
  });

  document.getElementById("changeImage").addEventListener("click", function () {
    if (currentImageIndex !== null) {
      const imageKey = `selectedImage_${currentImageIndex}`;
      const plus = plusSigns[currentImageIndex];
      selectNewImage(plus, imageKey);
    }
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const currentMonth = new Date().getMonth();
  const monthImageKey = `selectedImage_${currentMonth}`;
  const monthImage = localStorage.getItem(monthImageKey);

  if (monthImage) {
    document.body.style.backgroundImage = `url(${monthImage})`;
    document.body.style.backgroundSize = "cover";
  }

  function selectNewImage(plus, imageKey) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", function () {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageUrl = e.target.result;
          plus.style.backgroundImage = `url(${imageUrl})`;
          plus.style.backgroundSize = "cover";
          localStorage.setItem(imageKey, imageUrl);
          const plusIcon = plus.querySelector(".fa-plus");
          if (plusIcon) {
            plusIcon.remove();
          }

          // Update body background if the changed image is for the current month
          if (currentImageIndex === new Date().getMonth()) {
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = "cover";
          }
        };
        reader.readAsDataURL(file);
      }
      document.body.removeChild(input);
    });

    input.click();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const colorPaletteIcon = document.getElementById("colorPaletteIcon");
  const colorPicker = document.getElementById("colorPicker");
  const elementsToColor = document.querySelectorAll(
    ".calendar, .progress-bar, h1"
  );

  colorPaletteIcon.addEventListener("click", function (event) {
    // Show the color picker
    colorPicker.style.display = "block";
    colorPicker.focus(); // Focus on the color picker to open it immediately
    event.stopPropagation(); // Prevent the click from propagating to the document
  });

  colorPicker.addEventListener("input", function () {
    const selectedColor = colorPicker.value;
    elementsToColor.forEach((element) => {
      element.style.backgroundColor = selectedColor;
    });
  });

  // Hide the color picker when clicking anywhere else on the document
  document.addEventListener("click", function (event) {
    if (event.target !== colorPicker && event.target !== colorPaletteIcon) {
      colorPicker.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const days = document.querySelectorAll(".calendar-body .day");
  const currentDate = new Date();
  const markedDaysKey = "markedDays";
  const progressFill = document.getElementById("progressFill");
  const progressPercentage = document.querySelector(".progress-bar span");
  const motivationText = document.querySelector(".progress-bar p");

  // Load marked days from localStorage
  const markedDays = JSON.parse(localStorage.getItem(markedDaysKey)) || [];

  // Function to update the progress bar based on the percentage of marked days relative to days passed
  function updateProgressBar() {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const daysPassed =
      Math.floor((currentDate - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1; // Include today
    const percentageMarked = ((markedDays.length / daysPassed) * 100).toFixed(
      2
    );

    // Update the width of the progress bar
    progressFill.style.width = `${percentageMarked}%`;

    // Update the percentage text in the span
    progressPercentage.textContent = `${percentageMarked}%`;

    // Update the motivation text based on the percentage
    if (percentageMarked > 80) {
      motivationText.textContent = "جامد جدًا. كمل كده";
    } else if (percentageMarked > 50) {
      motivationText.textContent = "شغل حلو. شد حيلك شوية";
    } else if (percentageMarked > 30) {
      motivationText.textContent = "مش بطال، شد حيلك وهتوصل";
    } else {
      motivationText.textContent = "مفيش مشكلة، البداية دايمًا صعبة. جرب تاني";
    }
  }

  // Function to update the marked days counter
  function updateMarkedDaysCounter() {
    console.log(`Marked Days: ${markedDays.length}`);
    // If you have an HTML element to display the count, update it here
    // Example: document.getElementById("markedDaysCounter").textContent = `Marked Days: ${markedDays.length}`;
  }

  // Update the progress bar and marked days counter on page load
  updateProgressBar();
  updateMarkedDaysCounter();

  // Mark the days that were previously saved
  days.forEach((day) => {
    const dayNumber = parseInt(day.textContent, 10);
    if (markedDays.includes(dayNumber)) {
      day.classList.add("marked");
    }
  });

  days.forEach((day) => {
    day.addEventListener("click", function () {
      const dayNumber = parseInt(this.textContent, 10);
      const selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );

      if (selectedDate > currentDate) {
        alert("This day is in the future.");
      } else {
        this.classList.toggle("marked");

        // Update marked days in localStorage
        if (this.classList.contains("marked")) {
          markedDays.push(dayNumber);
        } else {
          const index = markedDays.indexOf(dayNumber);
          if (index > -1) {
            markedDays.splice(index, 1);
          }
        }
        localStorage.setItem(markedDaysKey, JSON.stringify(markedDays));

        // Update the marked days counter and progress bar whenever a day is marked/unmarked
        updateMarkedDaysCounter();
        updateProgressBar();
      }
    });
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

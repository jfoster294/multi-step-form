const multiStepForm = document.getElementById("multiStepForm");
const formSteps = document.querySelectorAll(".form-step");
const stepIndicators = document.querySelectorAll(".step-indicator");
const progressFill = document.getElementById("progressFill");

const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const clearFormButton = document.getElementById("clearFormButton");
const startOverButton = document.getElementById("startOverButton");

const saveMessage = document.getElementById("saveMessage");
const confirmationMessage = document.getElementById("confirmationMessage");
const reviewBox = document.getElementById("reviewBox");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const locationInput = document.getElementById("locationInput");
const roleInput = document.getElementById("roleInput");
const experienceInput = document.getElementById("experienceInput");
const goalInput = document.getElementById("goalInput");
const projectTypeInput = document.getElementById("projectTypeInput");
const timelineInput = document.getElementById("timelineInput");

const stepOneError = document.getElementById("stepOneError");
const stepTwoError = document.getElementById("stepTwoError");
const stepThreeError = document.getElementById("stepThreeError");

let currentStep = Number(localStorage.getItem("multiStepCurrentStep")) || 1;
const totalSteps = 4;

const textInputs = [
  nameInput,
  emailInput,
  locationInput,
  roleInput,
  experienceInput,
  goalInput,
  projectTypeInput,
  timelineInput
];

textInputs.forEach(function (input) {
  input.addEventListener("input", saveFormData);
  input.addEventListener("change", saveFormData);
});

document.querySelectorAll('input[name="features"]').forEach(function (checkbox) {
  checkbox.addEventListener("change", saveFormData);
});

backButton.addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;
    saveCurrentStep();
    updateStepDisplay();
  }
});

nextButton.addEventListener("click", function () {
  if (!validateStep(currentStep)) {
    return;
  }

  if (currentStep < totalSteps) {
    currentStep++;
    saveCurrentStep();
    updateStepDisplay();
  }
});

multiStepForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateStep(currentStep)) {
    return;
  }

  saveFormData();

  multiStepForm.classList.add("hidden");
  confirmationMessage.classList.remove("hidden");
  saveMessage.textContent = "Form submitted successfully.";
});

clearFormButton.addEventListener("click", function () {
  const confirmClear = confirm("Clear this saved form?");

  if (confirmClear) {
    clearSavedForm();
  }
});

startOverButton.addEventListener("click", function () {
  clearSavedForm();
  multiStepForm.classList.remove("hidden");
  confirmationMessage.classList.add("hidden");
});

function getSelectedFeatures() {
  const selected = [];

  document.querySelectorAll('input[name="features"]:checked').forEach(function (checkbox) {
    selected.push(checkbox.value);
  });

  return selected;
}

function saveFormData() {
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    location: locationInput.value.trim(),
    role: roleInput.value,
    experience: experienceInput.value,
    goal: goalInput.value.trim(),
    projectType: projectTypeInput.value,
    timeline: timelineInput.value,
    features: getSelectedFeatures()
  };

  localStorage.setItem("multiStepFormData", JSON.stringify(formData));
  saveMessage.textContent = "Draft saved locally.";
}

function loadFormData() {
  const savedData = JSON.parse(localStorage.getItem("multiStepFormData"));

  if (!savedData) {
    return;
  }

  nameInput.value = savedData.name || "";
  emailInput.value = savedData.email || "";
  locationInput.value = savedData.location || "";
  roleInput.value = savedData.role || "";
  experienceInput.value = savedData.experience || "";
  goalInput.value = savedData.goal || "";
  projectTypeInput.value = savedData.projectType || "";
  timelineInput.value = savedData.timeline || "";

  document.querySelectorAll('input[name="features"]').forEach(function (checkbox) {
    checkbox.checked = savedData.features && savedData.features.includes(checkbox.value);
  });

  saveMessage.textContent = "Saved draft loaded.";
}

function saveCurrentStep() {
  localStorage.setItem("multiStepCurrentStep", currentStep);
}

function updateStepDisplay() {
  formSteps.forEach(function (step) {
    const stepNumber = Number(step.dataset.step);

    if (stepNumber === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  stepIndicators.forEach(function (indicator) {
    const stepNumber = Number(indicator.dataset.step);

    indicator.classList.remove("active");
    indicator.classList.remove("completed");

    if (stepNumber === currentStep) {
      indicator.classList.add("active");
    }

    if (stepNumber < currentStep) {
      indicator.classList.add("completed");
    }
  });

  progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

  backButton.disabled = currentStep === 1;

  if (currentStep === totalSteps) {
    nextButton.classList.add("hidden");
    submitButton.classList.remove("hidden");
    renderReview();
  } else {
    nextButton.classList.remove("hidden");
    submitButton.classList.add("hidden");
  }

  clearErrors();
}

function validateStep(step) {
  clearErrors();

  if (step === 1) {
    if (!nameInput.value.trim() || !emailInput.value.trim() || !locationInput.value.trim()) {
      stepOneError.textContent = "Please complete all personal info fields.";
      return false;
    }

    if (!emailInput.checkValidity()) {
      stepOneError.textContent = "Please enter a valid email address.";
      return false;
    }
  }

  if (step === 2) {
    if (!roleInput.value || !experienceInput.value || !goalInput.value.trim()) {
      stepTwoError.textContent = "Please complete your developer goals.";
      return false;
    }
  }

  if (step === 3) {
    if (!projectTypeInput.value || !timelineInput.value) {
      stepThreeError.textContent = "Please choose a project type and timeline.";
      return false;
    }
  }

  return true;
}

function clearErrors() {
  stepOneError.textContent = "";
  stepTwoError.textContent = "";
  stepThreeError.textContent = "";
}

function renderReview() {
  const features = getSelectedFeatures();

  reviewBox.innerHTML = `
    <div class="review-item">
      <strong>Name</strong>
      <span>${nameInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Email</strong>
      <span>${emailInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Location</strong>
      <span>${locationInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Current Focus</strong>
      <span>${roleInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Experience Level</strong>
      <span>${experienceInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Main Goal</strong>
      <span>${goalInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Preferred Project Type</strong>
      <span>${projectTypeInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Timeline</strong>
      <span>${timelineInput.value || "Not added"}</span>
    </div>

    <div class="review-item">
      <strong>Features</strong>
      <span>${features.length ? features.join(", ") : "No features selected"}</span>
    </div>
  `;
}

function clearSavedForm() {
  localStorage.removeItem("multiStepFormData");
  localStorage.removeItem("multiStepCurrentStep");

  multiStepForm.reset();

  currentStep = 1;
  saveMessage.textContent = "Saved form cleared.";
  updateStepDisplay();
}

loadFormData();
updateStepDisplay();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const steps = document.querySelectorAll('.form-step');
    const stepItems = document.querySelectorAll('.step-item');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const internshipExp = document.getElementById('internshipExp');
    const internshipDetails = document.getElementById('internshipDetails');

    // Resume Drop Zone
    const dropZone = document.getElementById('dropZone');
    const resumeInput = document.getElementById('resumeInput');
    const fileInfo = document.getElementById('fileInfo');

    let currentStep = 1;
    const totalSteps = steps.length;

    // --- Navigation Logic ---

    function updateNavigation() {
        steps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        stepItems.forEach(item => {
            const stepNum = parseInt(item.dataset.step);
            item.classList.toggle('active', stepNum === currentStep);
            item.classList.toggle('completed', stepNum < currentStep);

            const icon = item.querySelector('.step-icon');
            if (stepNum < currentStep) {
                icon.innerHTML = '<i class="bi bi-check-lg"></i>';
            } else {
                icon.innerHTML = stepNum;
            }
        });

        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';

        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateNavigation();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateNavigation();
        }
    });

    function validateStep(stepNum) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            } else if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Internship Toggle
    internshipExp.addEventListener('change', (e) => {
        if (e.target.checked) {
            internshipDetails.style.display = 'block';
            internshipDetails.querySelectorAll('input').forEach(i => i.required = true);
        } else {
            internshipDetails.style.display = 'none';
            internshipDetails.querySelectorAll('input').forEach(i => i.required = false);
        }
    });

    // Drop Zone Logic
    dropZone.addEventListener('click', () => resumeInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover'));
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            resumeInput.files = files;
            handleFileSelect(files[0]);
        }
    });

    resumeInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('PDF, DOC, DOCX files only.');
            resumeInput.value = '';
            fileInfo.style.display = 'none';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Max file size is 5MB.');
            resumeInput.value = '';
            fileInfo.style.display = 'none';
            return;
        }
        fileInfo.innerHTML = `<i class="bi bi-file-earmark-check-fill me-2"></i> ${file.name}`;
        fileInfo.style.display = 'block';
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        const formData = new FormData(form);

        // Ensure values for toggles
        formData.set('willing_to_relocate', form.querySelector('[name="willing_to_relocate"]').checked);
        formData.set('current_arrears', form.querySelector('[name="current_arrears"]').checked);
        formData.set('internship_experience', form.querySelector('[name="internship_experience"]').checked);
        formData.set('declaration_accepted', form.querySelector('[name="declaration_accepted"]').checked);

        if (internshipExp.checked) {
            const details = {
                company: formData.get('internship_company'),
                role: formData.get('internship_role'),
                duration: formData.get('internship_duration')
            };
            formData.append('internship_details', JSON.stringify(details));
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing...';

        try {
            const response = await fetch('/api/registrations/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const successContainer = document.getElementById('successContainer');
                const contentArea = document.querySelector('.content-area');

                contentArea.innerHTML = ''; // Clear form
                contentArea.appendChild(successContainer);
                successContainer.style.display = 'block';
                document.getElementById('regIdDisplay').textContent = result.data.registration_id;

                stepItems.forEach(item => {
                    item.classList.add('completed');
                    item.querySelector('.step-icon').innerHTML = '<i class="bi bi-check-lg"></i>';
                });
            } else {
                alert('Error: ' + result.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Application';
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Submission failed. Check your connection.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Application';
        }
    });
});

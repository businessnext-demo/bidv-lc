document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const nextBtns = document.querySelectorAll('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    const form = document.getElementById('letterOfCreditForm');
    
    let currentStep = 0;
    
    // Initialize form
    function initForm() {
        showStep(currentStep);
        
        // Add event listeners to buttons
        prevBtns.forEach(btn => {
            btn.addEventListener('click', prevStep);
        });
        
        nextBtns.forEach(btn => {
            btn.addEventListener('click', nextStep);
        });
        
        if (submitBtn) {
            submitBtn.addEventListener('click', submitForm);
        }
        
        // Add validation listeners to all form fields
        const formFields = document.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Remove error styling on input
                this.classList.remove('error');
                const errorMessage = this.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.remove('visible');
                }
            });
        });
    }
    
    // Show the specified step and update indicators
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            
            if (index < stepIndex) {
                indicator.classList.add('completed');
            } else if (index === stepIndex) {
                indicator.classList.add('active');
            }
        });
        
        // Hide/show prev/next buttons based on step
        if (stepIndex === 0) {
            document.querySelector('.btn-prev').style.display = 'none';
        } else {
            document.querySelector('.btn-prev').style.display = 'block';
        }
        
        if (stepIndex === formSteps.length - 1) {
            document.querySelector('.btn-next').style.display = 'none';
            document.querySelector('.btn-submit').style.display = 'block';
        } else {
            document.querySelector('.btn-next').style.display = 'block';
            document.querySelector('.btn-submit').style.display = 'none';
        }
    }
    
    // Go to previous step
    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }
    
    // Go to next step if current step is valid
    function nextStep() {
        const currentStepFields = formSteps[currentStep].querySelectorAll('.form-control');
        const isStepValid = validateStepFields(currentStepFields);
        
        if (isStepValid) {
            currentStep++;
            if (currentStep < formSteps.length) {
                showStep(currentStep);
                
                // Smooth scroll to top of form
                document.querySelector('.form-container').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Validate all fields in the current step
    function validateStepFields(fields) {
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate a single field
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const minLength = field.getAttribute('minlength');
        const type = field.getAttribute('type');
        const pattern = field.getAttribute('pattern');
        
        let errorMessage = '';
        
        // Check if required field is empty
        if (isRequired && value === '') {
            errorMessage = 'This field is required';
        } 
        // Check min length
        else if (minLength && value.length < parseInt(minLength)) {
            errorMessage = `Must be at least ${minLength} characters`;
        } 
        // Email validation
        else if (type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
        } 
        // Pattern validation (for custom regex)
        else if (pattern && value !== '') {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                errorMessage = field.getAttribute('data-error-message') || 'Invalid format';
            }
        }
        
        // Display error message if any
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            if (errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('visible');
                field.classList.add('error');
                return false;
            } else {
                errorElement.classList.remove('visible');
                field.classList.remove('error');
                return true;
            }
        }
        
        return !errorMessage;
    }
    
    
    // Initialize the form
    initForm();
});
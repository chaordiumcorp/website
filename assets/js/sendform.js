// Validação em tempo real e contador de caracteres
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const mensagem = document.getElementById('mensagem');
    const charCounter = document.querySelector('.char-counter span');
    const formStatus = document.getElementById('formStatus');
    
    // Contador de caracteres para textarea
    if (mensagem && charCounter) {
        mensagem.addEventListener('input', function() {
            charCounter.textContent = this.value.length;
            
            // Altera cor conforme se aproxima do limite
            if (this.value.length > 950) {
                charCounter.style.color = '#dc3545';
            } else if (this.value.length > 800) {
                charCounter.style.color = '#ffc107';
            } else {
                charCounter.style.color = '#28a745';
            }
        });
        
        // Inicializa contador
        charCounter.textContent = mensagem.value.length;
    }
    
    // Validação em tempo real para todos os campos
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Validação ao sair do campo (blur)
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Limpa mensagens de erro ao começar a digitar
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                clearError(this);
            }
        });
    });
    
    // Validação no envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        let firstInvalidField = null;
        
        // Valida todos os campos
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        });
        
        if (isValid) {
            // Simula envio (substituir por AJAX/Fetch)
            showFormStatus('success', 'Mensagem enviada com sucesso!');
            form.reset();
            
            // Reseta contador
            if (charCounter) {
                charCounter.textContent = '0';
                charCounter.style.color = '#28a745';
            }
            
            // Foca no primeiro campo após envio
            setTimeout(() => {
                form.querySelector('input').focus();
            }, 1000);
        } else {
            showFormStatus('error', 'Por favor, corrija os erros no formulário.');
            
            // Rola até o primeiro campo inválido
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                firstInvalidField.focus();
            }
        }
    });
    
    // Função para validar campo individual
    function validateField(field) {
        const errorMessage = field.parentNode.querySelector('.error-message');
        
        if (field.checkValidity()) {
            clearError(field);
            return true;
        } else {
            showError(field, errorMessage);
            return false;
        }
    }
    
    // Mostra erro no campo
    function showError(field, errorElement) {
        field.classList.add('error');
        
        // Mensagem de erro customizada baseada no tipo de erro
        if (field.validity.valueMissing) {
            errorElement.textContent = 'Este campo é obrigatório';
        } else if (field.validity.typeMismatch) {
            errorElement.textContent = 'Formato inválido';
        } else if (field.validity.tooShort) {
            errorElement.textContent = `Mínimo de ${field.minLength} caracteres`;
        } else if (field.validity.tooLong) {
            errorElement.textContent = `Máximo de ${field.maxLength} caracteres`;
        } else if (field.validity.patternMismatch) {
            errorElement.textContent = field.type === 'email' 
                ? 'Email inválido (exemplo@dominio.com)'
                : 'Formato inválido';
        }
        
        errorElement.style.display = 'block';
    }
    
    // Limpa erro do campo
    function clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    // Mostra status do formulário
    function showFormStatus(type, message) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        
        // Esconde após 5 segundos
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
});
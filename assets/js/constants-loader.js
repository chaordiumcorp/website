// constants-loader.js - CSS otimizado para balão fixo
import { CONSTANTS, copyToClipboard, showToast, canUseClipboard } from './constants.js';

class ConstantsLoader {
    constructor() {
        this.processed = new WeakSet();
        this.cache = new Map(Object.entries(CONSTANTS));
        this.init();
        
        // Adicionar estilos dinamicamente
        this.injectStyles();
    }

    injectStyles() {
        if (!document.getElementById('constants-styles')) {
            const style = document.createElement('style');
            style.id = 'constants-styles';
            style.textContent = this.getToastStyles() + this.getEmailStyles() + this.getPlaceholderStyles();
            document.head.appendChild(style);
        }
    }

    getToastStyles() {
        return `
            /* TOAST NOTIFICATION - BALÃO FIXO QUE NÃO SAI DA TELA */
            .constants-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 16px;
                max-width: 350px;
                z-index: 999999;
                opacity: 0;
                transform: translateX(120%) translateY(-20px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                pointer-events: auto;
            }
            
            .constants-toast.show {
                opacity: 1;
                transform: translateX(0) translateY(0);
            }
            
            .constants-toast-success {
                border-left: 4px solid #4CAF50;
            }
            
            .constants-toast-error {
                border-left: 4px solid #f44336;
            }
            
            .constants-toast-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .constants-toast-icon {
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .constants-toast-message {
                font-size: 14px;
                line-height: 1.4;
                color: #333;
                flex: 1;
                margin-right: 8px;
            }
            
            .constants-toast-close {
                background: none;
                border: none;
                padding: 0;
                width: 20px;
                height: 20px;
                cursor: pointer;
                color: #999;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .constants-toast-close:hover {
                background: #f5f5f5;
                color: #666;
            }
            
            .constants-toast-close:active {
                transform: scale(0.9);
            }
            
            /* Mobile: toast na parte inferior */
            @media (max-width: 768px) {
                .constants-toast {
                    top: auto;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    max-width: none;
                    transform: translateY(120%);
                }
                
                .constants-toast.show {
                    transform: translateY(0);
                }
            }
        `;
    }

    getEmailStyles() {
        return `
            /* EMAIL COM CÓPIA  */
            .email-with-copy {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                position: relative;
            }
            
            .copy-email-btn {
                
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                color: white;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                position: relative;
            }
            
            .copy-email-btn:hover {
                border-color: #007bff;
                color: #007bff;
            }
            
            .copy-email-btn:active {
                transform: scale(0.95);
            }
            
            .copy-email-btn.copied {
                background: #4CAF50;
                border-color: #4CAF50;
                color: white;
            }
            
            
        `;
    }

    getPlaceholderStyles() {
        return `
            /* PLACEHOLDERS */
            [data-const]:not([data-processed]):not(i):not(.icon):not([class*="fa-"]):not([class*="bi-"]),
            [data-const-href]:not([data-processed]):not(i):not(.icon):not([class*="fa-"]):not([class*="bi-"]),
            [data-const-tel]:not([data-processed]):not(i):not(.icon):not([class*="fa-"]):not([class*="bi-"]),
            [data-const-mailto]:not([data-processed]):not(i):not(.icon):not([class*="fa-"]):not([class*="bi-"]) {
                display: inline-block;
                min-width: 100px;
                min-height: 1em;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 3px;
                color: transparent !important;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processAll());
        } else {
            this.processAll();
        }
    }

    processAll() {
        this.processEmailElements();
        this.processOtherElements();
    }

    processEmailElements() {
        document.querySelectorAll('[data-const-mailto]').forEach(element => {
            if (this.processed.has(element)) return;
            
            const constName = element.getAttribute('data-const-mailto');
            const email = this.cache.get(constName);
            
            if (email) {
                // Configurar email
                element.href = `mailto:${email}`;
                
                // Atualizar texto
                const textConst = element.getAttribute('data-const-text') || constName;
                const textValue = this.cache.get(textConst) || email;
                this.updateLinkText(element, textValue);
                
                // Adicionar funcionalidade de cópia
                this.addCopyButton(element, email);
                
                this.processed.add(element);
                element.setAttribute('data-processed', 'true');
            }
        });
    }

    processOtherElements() {
        const selectors = [
            '[data-const]:not([data-const-mailto])',
            '[data-const-href]',
            '[data-const-tel]'
        ].map(sel => `${sel}:not([data-processed])`).join(',');
        
        document.querySelectorAll(selectors).forEach(element => {
            if (this.processed.has(element)) return;
            
            if (element.hasAttribute('data-const-href')) {
                this.processLink(element);
            } else if (element.hasAttribute('data-const-tel')) {
                this.processPhone(element);
            } else if (element.hasAttribute('data-const')) {
                this.processText(element);
            }
            
            this.processed.add(element);
            element.setAttribute('data-processed', 'true');
        });
    }

    processLink(element) {
        const constName = element.getAttribute('data-const-href');
        const url = this.cache.get(constName);
        
        if (url) {
            element.href = url;
            const textConst = element.getAttribute('data-const-text');
            if (textConst) {
                this.updateLinkText(element, this.cache.get(textConst));
            }
        }
    }

    processPhone(element) {
        const constName = element.getAttribute('data-const-tel');
        const phone = this.cache.get(constName);
        
        if (phone) {
            const cleanNumber = phone.replace(/\D/g, '');
            element.href = `tel:+55${cleanNumber}`;
            
            const textConst = element.getAttribute('data-const-text') || constName;
            this.updateLinkText(element, this.cache.get(textConst) || phone);
        }
    }

    processText(element) {
        const constName = element.getAttribute('data-const');
        const value = this.cache.get(constName);
        
        if (value) {
            element.textContent = value;
        }
    }

    updateLinkText(element, text) {
        if (!text) return;
        
        if (element.childNodes.length > 0) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            let found = false;
            
            while (node = walker.nextNode()) {
                if (node.textContent.trim()) {
                    node.textContent = text;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                element.appendChild(document.createTextNode(text));
            }
        } else {
            element.textContent = text;
        }
    }

    addCopyButton(emailElement, email) {
        // Verificar se já tem botão de cópia
        if (emailElement.nextElementSibling?.classList?.contains('copy-email-btn')) {
            return;
        }
        
        // Criar botão de cópia
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-email-btn';
        copyBtn.type = 'button';
        copyBtn.setAttribute('aria-label', 'Copiar e-mail');
        
        // Usar dataset em vez de title para evitar tooltip nativo
        copyBtn.dataset.tooltip = 'Copiar e-mail';
        
        // SVG do ícone de cópia
        copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" >
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        `;
        
        // Adicionar evento de cópia
        copyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await this.handleCopy(email, copyBtn);
        });
        
        // Inserir o botão APÓS o link de email (não criar wrapper)
        emailElement.insertAdjacentElement('afterend', copyBtn);
        
        // Adicionar classe ao emailElement para estilização
        emailElement.classList.add('has-copy-button');
        
        // Adicionar CSS dinâmico se necessário
        //this.addCopyButtonStyles();
    }

    
    async handleCopy(text, button) {
        const success = await copyToClipboard(text);
        
        if (success) {
            showToast(CONSTANTS.COPY_SUCCESS, 'success');
            
            // Feedback visual no botão
            button.classList.add('copied');
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            `;
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" >
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                `;
            }, 2000);
        } else {
            const message = canUseClipboard() 
                ? CONSTANTS.COPY_ERROR 
                : CONSTANTS.COPY_SECURE_ERROR;
            showToast(message, 'error');
        }
    }
}





// Inicialização
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.constantsLoader = new ConstantsLoader();
            }, 100);
        });
    } else {
        setTimeout(() => {
            window.constantsLoader = new ConstantsLoader();
        }, 100);
    }
})();



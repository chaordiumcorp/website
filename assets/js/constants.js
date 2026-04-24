export const CONSTANTS = Object.freeze({
    // Contato
    TELEFONE: "(19) 98195-9907",
    TELEFONE_LIMPO: "+5519981959907",
    EMAIL: "contato@advocaciapatriciaferreira.com.br",
    
    // Empresa
    NOME: "Advocacia Patrícia Ferreira",
    NOME_UPPER: "ADVOCACIA PATRÍCIA FERREIRA",
    SLOGAN: "Atendemos Empresas e Famílias",
    ENDERECO: "R. Arnold Baccan, 825 - Jardim Maria Flora - Limeira/SP CEP:13480-388",
    
    // URLs
    URL_HOME:"https://www.advocaciapatriciaferreira.com.br/",
    URL_WHATSAPP: "https://wa.me/5519981959907",
    URL_CALENDAR: "https://calendar.app.google/g6c2rzTV8Vvg2Pkh7",
    URL_MAPS: "https://maps.app.goo.gl/TG6LMBfmU5ZoSPzj7",
    URL_LINKEDIN: "https://www.linkedin.com/in/advocaciapatriciaferreira",
    URL_FACEBOOK: "https://www.facebook.com/profile.php?id=61585122471528",
    URL_INSTAGRAM: "https://www.instagram.com/adv.patricia.ferreira/",

    // Mensagens
    COPY_SUCCESS: "E-mail copiado para a área de transferência!",
    COPY_ERROR: "Não foi possível copiar o e-mail."
});

// SVG ícones embutidos (não dependem de fontes externas)
const SVG_ICONS = {
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#f44336"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
};

// Função de cópia com fallback robusto
export async function copyToClipboard(text) {
    // Fallback 1: Clipboard API moderna
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn('Clipboard API failed:', err);
        }
    }
    
    // Fallback 2: Método antigo (funciona em HTTP)
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return successful;
    } catch (err) {
        console.error('Copy fallback failed:', err);
        return false;
    }
}

// Função para verificar se pode usar Clipboard API
export function canUseClipboard() {
    return navigator.clipboard && window.isSecureContext;
}

// Toast notification COM BALÃO QUE NÃO SAI DA TELA
export function showToast(message, type = 'success') {
    // Remover toasts antigos
    const existingToasts = document.querySelectorAll('.constants-toast');
    existingToasts.forEach(toast => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            setTimeout(() => toast.parentNode.removeChild(toast), 300);
        }
    });
    
    // Criar toast
    const toast = document.createElement('div');
    toast.className = `constants-toast constants-toast-${type}`;
    
    // Ícone baseado no tipo
    const icon = type === 'success' ? SVG_ICONS.check : SVG_ICONS.error;
    
    toast.innerHTML = `
        <div class="constants-toast-content">
            <div class="constants-toast-icon">${icon}</div>
            <span class="constants-toast-message">${message}</span>
            <button class="constants-toast-close" aria-label="Fechar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Posicionar para não sair da tela
    positionToast(toast);
    
    // Adicionar evento de fechar
    const closeBtn = toast.querySelector('.constants-toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));
    
    // Auto-dismiss após 4 segundos
    const dismissTimeout = setTimeout(() => dismissToast(toast), 4000);
    
    // Pausar timeout no hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(dismissTimeout);
    });
    
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => dismissToast(toast), 3000);
    });
    
    // Reposicionar em redimensionamento
    window.addEventListener('resize', () => positionToast(toast));
}

// Posicionar toast para não sair da tela
export function positionToast(toast) {
    const toastHeight = toast.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calcular posição Y ideal
    let topPosition = scrollTop + viewportHeight - toastHeight - 20;
    
    // Garantir que não saia da tela
    const maxTop = scrollTop + viewportHeight - toastHeight - 10;
    const minTop = scrollTop + 10;
    
    if (topPosition > maxTop) topPosition = maxTop;
    if (topPosition < minTop) topPosition = minTop;
    
    // Aplicar posição
    toast.style.top = `${topPosition}px`;
    toast.style.right = '20px';
    toast.style.left = 'auto';
    
    // Mostrar com animação
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
}

// Fechar toast com animação
export function dismissToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}
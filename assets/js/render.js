   
    <!-- Fallback para navegadores sem módulos -->
    
        // Fallback simples
        document.addEventListener('DOMContentLoaded', function() {
            var constants = {
                TELEFONE: "(19) 98195-9907",
                EMAIL: "contato@advocaciapatriciaferreira.com.br",
                NOME: "Advocacia Patrícia Ferreira"
            };
            
            document.querySelectorAll('[data-const]').forEach(function(el) {
                var key = el.getAttribute('data-const');
                if (constants[key]) el.textContent = constants[key];
            });
        });
    



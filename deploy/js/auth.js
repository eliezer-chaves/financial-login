// Configuração do Supabase
const supabaseUrl = 'https://ttuwpchkotalpponbjzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXdwY2hrb3RhbHBwb25ianp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzY3NTksImV4cCI6MjA1OTAxMjc1OX0.gL_1exIGEYLiU475i_vcm06nt39VkgX7OYauMuxWDDY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: 'public'
    }
});


document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Coletar dados do formulário
    const user = {
        name: document.getElementById('name').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        role: document.querySelector('input[name="role"]:checked').value
    };

    // Validações
    if (!validateForm(user)) {
        return;
    }

    // Desabilitar botão durante o processamento
    const submitBtn = document.getElementById('submitButton');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';

    try {
        // Cadastrar no Supabase Auth
        const { data, error } = await supabaseClient.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    full_name: user.name,
                    phone: user.telefone,
                    role: user.role
                }
            }
        });

        if (error) throw error;
        
        // Sucesso - redirecionar ou mostrar mensagem
        alert('Cadastro realizado! Verifique seu email para confirmação.');
        //window.location.href = '/login.html'; // Ajuste conforme necessário
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert(`Erro: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar';
    }
});

// Função de validação
function validateForm(user) {
    // Validação de senha
    if (user.password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    // Confirmação de senha
    const confirmPassword = document.getElementById('confirm_password').value;
    if (user.password !== confirmPassword) {
        alert('As senhas não coincidem');
        return false;
    }
    
    // Validação simples de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        alert('Por favor, insira um email válido');
        return false;
    }
    
    return true;
}

// Mantenha suas funções auxiliares existentes
// togglePasswordVisibility, validatePassword, checkPasswordsMatch, etc.
// Configuração do Supabase
const supabaseUrl = 'https://ttuwpchkotalpponbjzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXdwY2hrb3RhbHBwb25ianp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzY3NTksImV4cCI6MjA1OTAxMjc1OX0.gL_1exIGEYLiU475i_vcm06nt39VkgX7OYauMuxWDDY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: 'public'
    }
});

// Função para verificar autenticação e redirecionar
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// Função para fazer login
async function login(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw error;
    }
    return data;
}

// Função para fazer logout
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        throw error;
    }
}

// Registro de usuário
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Coletar dados do formulário
            const user = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim().toLowerCase(),
                password: document.getElementById('password').value,
            };

            // Desabilitar botão durante o processamento
            const submitBtn = document.getElementById('submitButton');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registrando...';

            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: user.email,
                    password: user.password,
                    options: {
                        emailRedirectTo: 'https://login-project-e0576.firebaseapp.com/pages/welcome.html',
                        data: {
                            full_name: user.name
                        }
                    }
                });
            
                if (error) throw error;
                
                // Mostrar modal de confirmação de e-mail
                const emailModal = new bootstrap.Modal(document.getElementById('emailConfirmationModal'));
                emailModal.show();
                document.getElementById('registrationForm').reset();
                
            } catch (error) {
                console.error('Erro no cadastro:', error);
                showErrorModal(`Erro: ${error.message}`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Criar conta';
            }
        });
    }

    // Login de usuário
    const loginForm = document.querySelector('form[method="post"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Entrando...';
            
            try {
                await login(email, password);
                window.location.href = "pages/welcome.html";
            } catch (error) {
                console.error('Erro no login:', error);
                const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                errorModal.show();
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        });
    }

    // Login com Google
    const googleSignupBtn = document.getElementById('google-signup-btn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async () => {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://login-project-e0576.firebaseapp.com/pages/welcome.html'
                }
            });
            
            if (error) {
                showErrorModal('Erro ao entrar com o Google: ' + error.message);
            }
        });
    }
});

function showErrorModal(message) {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        const modal = new bootstrap.Modal(errorModal);
        modal.show();
    } else {
        alert(message);
    }
}
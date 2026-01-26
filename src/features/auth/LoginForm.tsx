import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRateLimit } from '../../lib/hooks/useRateLimit';
import Input from './ui/Input';
import Button from '../../components/shared/ui/Button';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // RATE LIMIT : 5 tentatives, Blocage 60 min (1h)
    const { isBlocked, formatTimeLeft, recordAttempt, resetAttempts } = useRateLimit('auth_login_limit', 5, 60);

    // Validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = password.length >= 6;
    const isFormValid = isValidEmail && isValidPassword && !isBlocked;

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isBlocked) return;

        if (!isFormValid) {
            setError('Veuillez vous assurer que votre e-mail est valide et que le mot de passe contient au moins 6 caractères.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                recordAttempt(); // On enregistre l'échec

                const baseMsg = authError.message === 'Invalid login credentials'
                    ? 'Identifiants invalides.'
                    : authError.message;

                setError(baseMsg);
            } else {
                resetAttempts(); // Succès : On remet le compteur à zéro
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('Une erreur inattendue est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Brand Header */}
            <div className="text-center mb-8 pt-4">
                <h1 className="text-3xl font-black text-main tracking-tight italic">TOTAL <span className="text-primary not-italic underline decoration-4 underline-offset-4 decoration-primary/20">BOUMIA</span></h1>
                <p className="text-muted font-bold mt-2 uppercase tracking-widest text-[10px]">Gestion Station Service</p>
            </div>

            {/* Card Layout */}
            <div className="bg-surface dark:bg-surface-dark rounded-[2.5rem] shadow-2xl p-8 border border-border/50 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    {/* Email Input */}
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Compte Administrateur"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@total.com"
                        required
                        autoComplete="email"
                        icon={Mail}
                        error={email && !isValidEmail ? 'Format e-mail invalide' : undefined}
                    />

                    {/* Password Input */}
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Clé de Sécurité"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        showPasswordToggle
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        error={password && !isValidPassword ? 'Min. 6 caractères requis' : undefined}
                    />


                    {/* Error Alert */}
                    {error && !isBlocked && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start space-x-3 animate-in shake-1" role="alert">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-800 dark:text-red-300 font-bold uppercase tracking-tight leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!isFormValid || isBlocked}
                        loading={loading}
                        fullWidth
                        size="lg"
                    >
                        {isBlocked ? `Bloqué (Attente ${formatTimeLeft})` : 'Accéder au Tableau de Bord'}
                    </Button>
                </form>
            </div>

            {/* Signature Area */}
            <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted/40">Realiser par Aakki Oussama</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
        </div>
    );
};

export default LoginForm;

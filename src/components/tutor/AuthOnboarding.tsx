import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Check,
  Smartphone,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

type AuthStep = 'splash' | 'login' | 'register';

export const AuthOnboarding: React.FC = () => {
  const { setShowAuthModal, quickDemoLogin, pushToast } = usePetHub();
  const [step, setStep] = useState<AuthStep>('login');
  const [showPass, setShowPass] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState('eduardo.silva@exemplo.com');
  const [loginPassword, setLoginPassword] = useState('PetHub@2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [fullName, setFullName] = useState('Eduardo Silva');
  const [regEmail, setRegEmail] = useState('eduardo.silva@exemplo.com');
  const [whatsapp, setWhatsapp] = useState('(11) 99812-4410');
  const [regPassword, setRegPassword] = useState('PetHub2026');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptAlerts, setAcceptAlerts] = useState(true);

  // Password strength calculation
  const getPasswordStrength = (
    pwd: string
  ): { level: 0 | 1 | 2 | 3; label: string; color: string } => {
    if (!pwd) return { level: 0, label: 'Mín. 8 caracteres', color: 'bg-[#E8DDD8]' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && /[A-Z0-9]/.test(pwd)) score++;
    if (pwd.length >= 10 && /[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Fraca', color: 'bg-red-500' };
    if (score === 2) return { level: 2, label: 'Boa', color: 'bg-amber-400' };
    return { level: 3, label: 'Forte', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(regPassword);

  const handleCompleteAuth = (mode: 'login' | 'register') => {
    setShowAuthModal(false);
    pushToast(
      mode === 'login' ? 'Bem-vindo de volta, Eduardo!' : 'Conta PetHub Club Criada!',
      mode === 'login'
        ? 'Sessão sincronizada com seus pets Thor e Mia no Supabase.'
        : `Alertas de SLA e status do banho ativados no WhatsApp ${whatsapp}.`
    );
  };

  if (step === 'splash') {
    return (
      <div className="min-h-[760px] bg-[#A84A32] text-white flex flex-col justify-between p-7 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/15">
            Pets & Care
          </span>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-xs font-semibold text-white/80 hover:text-white underline"
          >
            Pular para o App
          </button>
        </div>

        <div className="my-auto flex flex-col items-center text-center z-10">
          <div className="w-28 h-28 rounded-full bg-[#FAF5F2] shadow-xl flex items-center justify-center mb-5 relative">
            <span className="text-5xl" role="img" aria-label="Pet">
              🐶
            </span>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-[#2D1E1A] flex items-center justify-center text-sm font-black shadow">
              🐾
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">PetHub</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2D1E1A] text-[11px] font-black tracking-wide">
              CLUB
            </span>
          </div>
          <p className="text-xs text-white/85 max-w-[240px] mt-2 leading-relaxed">
            Rações, farmácia e agendamento de banho & tosa em uma única comanda.
          </p>
        </div>

        <div className="space-y-3 z-10">
          <button
            onClick={() => setStep('login')}
            className="w-full py-3.5 rounded-full bg-[#FAF5F2] text-[#A84A32] font-bold text-sm shadow-md hover:bg-white transition"
          >
            Login
          </button>
          <button
            onClick={() => setStep('register')}
            className="w-full py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/25 transition"
          >
            Cadastrar-se
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[760px] bg-[#FAF5F2] flex flex-col">
      {/* Clean Terracotta Header */}
      <div className="bg-[#A84A32] text-white pt-5 pb-10 px-5 rounded-b-[28px] relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (step === 'register' ? setStep('login') : setStep('splash'))}
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStep('splash')}
              className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-white/15 hover:bg-white/25"
            >
              Splash
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-black/25 hover:bg-black/40"
            >
              Ver App Logado
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#FAF5F2] flex items-center justify-center shadow-md relative mb-2.5">
            <span className="text-3xl">🐶</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-400 text-[10px] flex items-center justify-center">
              🐾
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight">PetHub</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#2D1E1A] text-[10px] font-black">
              CLUB
            </span>
          </div>
        </div>
      </div>

      {/* Minimalist White Card */}
      <div className="px-4 -mt-5 pb-6 flex-1 flex flex-col justify-between">
        <div className="bg-white rounded-3xl border border-[#E8DDD8] shadow-clean p-5">
          {/* Quick Demo Access Bar (Tutor, Lojista, Admin) */}
          <div className="mb-4 p-2.5 rounded-2xl bg-[#FDF4F1] border border-[#A84A32]/25">
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#A84A32] text-center mb-1.5">
              ⚡ Acesso Rápido de Demonstração (Supabase Auth)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => quickDemoLogin('tutor')}
                className="py-1.5 px-2 rounded-xl bg-[#A84A32] text-white text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-xs hover:bg-[#8E3B26] transition"
              >
                <Smartphone className="w-3 h-3" />
                <span>Tutor</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('merchant')}
                className="py-1.5 px-2 rounded-xl bg-white text-[#2D1E1A] border border-[#E8DDD8] text-[10px] font-extrabold flex items-center justify-center gap-1 hover:border-[#A84A32] transition"
              >
                <Store className="w-3 h-3 text-[#A84A32]" />
                <span>Lojista</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="py-1.5 px-2 rounded-xl bg-white text-[#2D1E1A] border border-[#E8DDD8] text-[10px] font-extrabold flex items-center justify-center gap-1 hover:border-[#A84A32] transition"
              >
                <ShieldCheck className="w-3 h-3 text-[#A84A32]" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Switch Tabs Login / Cadastro */}
          <div className="grid grid-cols-2 bg-[#FAF5F2] p-1 rounded-2xl mb-4 border border-[#E8DDD8]">
            <button
              onClick={() => setStep('login')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                step === 'login' ? 'bg-white text-[#A84A32] shadow-sm' : 'text-[#7A6660]'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setStep('register')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                step === 'register' ? 'bg-white text-[#A84A32] shadow-sm' : 'text-[#7A6660]'
              }`}
            >
              Junte-se ao Club
            </button>
          </div>

          {step === 'login' ? (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-extrabold text-[#2D1E1A]">Bem-vindo!</h2>
                <p className="text-xs text-[#7A6660] mt-0.5">
                  Acesse sua conta para cuidar do seu melhor amigo
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A] mb-1.5">
                  E-mail ou Telefone
                </label>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2.5 focus-within:border-[#A84A32]">
                  <Mail className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A] mb-1.5">
                  Senha
                </label>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2.5 focus-within:border-[#A84A32]">
                  <Lock className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#7A6660] hover:text-[#2D1E1A]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#2D1E1A] font-medium">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      rememberMe
                        ? 'bg-[#A84A32] border-[#A84A32] text-white'
                        : 'border-[#E8DDD8] bg-white'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3" />}
                  </button>
                  <span>Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  onClick={() => pushToast('Recuperação enviada', 'Link enviado para seu e-mail.')}
                  className="text-[#A84A32] font-bold hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                onClick={() => handleCompleteAuth('login')}
                className="w-full py-3 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="text-center">
                <h2 className="text-lg font-extrabold text-[#2D1E1A]">Junte-se ao Club! 🐾</h2>
                <p className="text-[11px] text-[#7A6660] mt-0.5">
                  Cadastre-se para agendar banho e pedir produtos sem fila
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A] mb-1">
                  Nome Completo
                </label>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2">
                  <User className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A] mb-1">
                  E-mail
                </label>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2">
                  <Mail className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A]">
                    Telefone / WhatsApp
                  </label>
                  <span className="text-[10px] text-[#A84A32] font-semibold">
                    Alertas de SLA & Banho
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2">
                  <Phone className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D1E1A] mb-1">
                  Senha
                </label>
                <div className="flex items-center gap-2.5 bg-[#FAF5F2] border border-[#E8DDD8] rounded-2xl px-3.5 py-2">
                  <Lock className="w-4 h-4 text-[#7A6660]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#7A6660]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter (3 bars + label) */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 grid grid-cols-3 gap-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        strength.level >= 1 ? strength.color : 'bg-[#E8DDD8]'
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        strength.level >= 2 ? strength.color : 'bg-[#E8DDD8]'
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        strength.level >= 3 ? strength.color : 'bg-[#E8DDD8]'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#7A6660] min-w-[36px] text-right">
                    {strength.label}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#7A6660]">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 accent-[#A84A32]"
                  />
                  <span>
                    Li e concordo com os{' '}
                    <strong className="text-[#A84A32] underline">Termos de Uso</strong> e{' '}
                    <strong className="text-[#A84A32] underline">Privacidade</strong> do PetHub
                    Club.
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#7A6660]">
                  <input
                    type="checkbox"
                    checked={acceptAlerts}
                    onChange={(e) => setAcceptAlerts(e.target.checked)}
                    className="mt-0.5 accent-[#A84A32]"
                  />
                  <span>Quero receber alertas de SLA e triagem do meu pet no WhatsApp 🎁</span>
                </label>
              </div>

              <button
                onClick={() => handleCompleteAuth('register')}
                className="w-full py-3 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span>Criar minha conta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Social Login Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px bg-[#E8DDD8] flex-1" />
            <span className="text-[10px] uppercase tracking-wider text-[#7A6660] font-semibold">
              ou continue com
            </span>
            <div className="h-px bg-[#E8DDD8] flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleCompleteAuth('login')}
              className="py-2.5 rounded-2xl border border-[#E8DDD8] bg-white hover:bg-[#FAF5F2] flex items-center justify-center text-xs font-extrabold text-[#2D1E1A] transition"
            >
              Google
            </button>
            <button
              onClick={() => handleCompleteAuth('login')}
              className="py-2.5 rounded-2xl border border-[#E8DDD8] bg-white hover:bg-[#FAF5F2] flex items-center justify-center text-xs font-extrabold text-[#2D1E1A] transition"
            >
              Apple
            </button>
            <button
              onClick={() => handleCompleteAuth('login')}
              className="py-2.5 rounded-2xl border border-[#E8DDD8] bg-[#FAF5F2] hover:bg-[#F4E8E2] flex items-center justify-center gap-1 text-xs font-extrabold text-[#A84A32] transition"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>ID</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DDD8] text-[11px] font-semibold text-[#7A6660]">
            <Sparkles className="w-3.5 h-3.5 text-[#A84A32]" />
            <span>Clube de Vantagens e Saúde Pet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

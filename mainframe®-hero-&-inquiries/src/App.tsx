/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Gamepad2,
  Layers,
  Cpu,
  Zap,
  Gauge,
  Monitor,
  Flame,
  BatteryCharging,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  Building2,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Boxes,
  Briefcase,
  X,
  Send,
  ChevronDown,
  HardDrive,
} from 'lucide-react';
import { saveCustomVideo, loadCustomVideo } from './lib/videoStorage';

const DEFAULT_VIDEO_URL = '/notebook-360.mp4';

const COMPANY_VIDEO_URL =
  'https://v16-pippit-video-cdn.pippit.ai/0db12abacc7a2cae2c9d828d6ef521c3/6baaf449/video/tos/alisg/tos-alisg-v-3bfc40-sg/oMP9aOwXfYEX8MCAABi1hjAFpiAqi7ARytAEq9/?a=573081&bti=ZHZocnV3ZzF2cXZld3NsQGJvc1xsZmJwYmZyK2ZtbWA%3D&&bt=3308&ft=cpOXzGz7ThWHc8saLGZmo0P&mime_type=video_mp4&rc=amh3O3c5cmd0ZGYzODQ6NEBpamh3O3c5cmd0ZGYzODQ6NEAvLzZtMmRjYHJhLS1kNDFzYSMvLzZtMmRjYHJhLS1kNDFzcw%3D%3D&vvpl=1&l=202610010811090E5B5923A1486C8ED60D&btag=e00078000';

// Audiences data for the modern showcase view
const CATEGORIES = [
  {
    id: 'programmers',
    label: 'Programadores',
    icon: Code2,
    tagline: 'Compilações instantâneas, múltiplos containers e execução local de modelos de IA.',
    metrics: [
      { label: 'Tempo de Build Docker', value: '-64%', desc: 'vs. chips da geração anterior' },
      { label: 'Memória Unificada', value: '128 GB', desc: 'Largura de banda de até 400 GB/s' },
      { label: 'Containers Paralelos', value: '30+', desc: 'Zero throttling térmico' },
    ],
    features: [
      {
        icon: Terminal,
        title: 'Kernel Unix Nativo & Emulação Zero',
        desc: 'Suporte a arquitetura ARM64 pura, execução de stacks inteiras em Linux/macOS com I/O SSD superior a 7.400 MB/s.',
      },
      {
        icon: Cpu,
        title: 'NPU Dedicada para Modelos Locais',
        desc: 'Execute LLMs locais de 8B e 14B parâmetros (Ollama, vLLM) diretamente na memória unificada com zero latência na nuvem.',
      },
      {
        icon: Monitor,
        title: 'Fluxo Triplo de Monitores 6K',
        desc: 'Conecte até 3 telas externas Thunderbolt 5 mantendo taxas de 120Hz para código, documentação e simuladores ativos.',
      },
    ],
  },
  {
    id: 'gamers',
    label: 'Gamers',
    icon: Gamepad2,
    tagline: 'Ray tracing em tempo real, 240Hz com preto absoluto e zero tearing de imagem.',
    metrics: [
      { label: 'Taxa de Atualização', value: '240 Hz', desc: 'Painel OLED com 0.03ms GTG' },
      { label: 'Ray Tracing GPU', value: '+140%', desc: 'Cores dedicados de iluminação' },
      { label: 'Latência do Sistema', value: '3.2 ms', desc: 'Modo reflex com taxa máxima' },
    ],
    features: [
      {
        icon: Flame,
        title: 'Câmara de Vapor de Fase Dupla',
        desc: 'Dissipação contínua de 175W TGP sem barulho agudo de turbina, mantendo frequências máximas no boost de clock.',
      },
      {
        icon: Gauge,
        title: 'DLSS 3.5 & Frame Generation 4K',
        desc: 'Renderização neural que triplica a fluidez em títulos pesados como Cyberpunk 2077 e Black Myth: Wukong em resolução máxima.',
      },
      {
        icon: Zap,
        title: 'Áudio Espacial Tridimensional',
        desc: 'Sistema com 6 alto-falantes de cancelamento de força com tweeters dedicados para localização precisa de passos e tiros.',
      },
    ],
  },
  {
    id: 'multitasking',
    label: 'Multitarefa Extrema',
    icon: Layers,
    tagline: 'O fim dos gargalos entre renderização 3D, streaming e trabalho analítico pesado.',
    metrics: [
      { label: 'Eficiência Energética', value: '22 hrs', desc: 'Bateria em tarefas mistas' },
      { label: 'Decodificação AV1', value: '8K 60fps', desc: 'Dois motores dedicados' },
      { label: 'Troca de Contexto', value: '< 1 ms', desc: 'Memória de alta densidade' },
    ],
    features: [
      {
        icon: BatteryCharging,
        title: 'Desempenho Idêntico Fora da Tomada',
        desc: 'Diferente dos notebooks convencionais, a arquitetura moderna entrega 100% da potência de CPU e GPU alimentada apenas pela bateria.',
      },
      {
        icon: Activity,
        title: 'Agendador de Tarefas Heterogêneo',
        desc: 'Núcleos de alta eficiência gerenciam downloads, render em segundo plano e sincronização sem roubar ciclos dos núcleos de performance.',
      },
      {
        icon: Sparkles,
        title: 'Tela Liquid Retina XDR de 1600 nits',
        desc: 'Contraste de 1.000.000:1 com precisão de cor calibrada de fábrica, perfeita para alternar entre edição de vídeo HDR e IDE de código.',
      },
    ],
  },
];

const EXPLODED_COMPONENTS = [
  {
    id: 'thermal',
    name: 'Câmaras de Vapor de Fase Dupla & Exaustores MagLev',
    tag: 'SISTEMA DE RESFRIAMENTO',
    highlight: 'Dissipação contínua de 175W TGP abaixo de 72°C',
    description:
      'Como visível no final do vídeo, dois blocos de cobre sinterizado conduzem calor instantaneamente para ventoinhas de levitação magnética com 89 lâminas ultrafinas, garantindo boost máximo de CPU e GPU sem ruído de turbina.',
    advantage: 'Zero perda de FPS por aquecimento ou desconforto térmico no teclado.',
    icon: Flame,
    accent: 'cyan',
  },
  {
    id: 'silicon',
    name: 'Silício Proprietário com NPU Neural Integrada',
    tag: 'MOTOR DE INTELIGÊNCIA ARTIFICIAL',
    highlight: 'Até 45 TOPS em inferência local de LLMs',
    description:
      'A placa-mãe de alta densidade abriga núcleos de IA que processam modelos de linguagem (Ollama, DeepSeek, vLLM) e geração de quadros em tempo real diretamente na memória unificada.',
    advantage: 'Execute copilots de código e agentes locais sem enviar dados para a nuvem.',
    icon: Cpu,
    accent: 'violet',
  },
  {
    id: 'memory',
    name: 'Memória Unificada de 400 GB/s & SSD NVMe Gen 5',
    tag: 'I/O & DADOS EM TEMPO REAL',
    highlight: '7.400 MB/s de taxa de leitura sequencial',
    description:
      'Eliminação total do barramento PCI compartilhado: CPU, GPU e NPU acessam o mesmo pool de até 128 GB de memória com latência inferior a 1 microssegundo.',
    advantage: 'Abra 40 containers Docker e simuladores 3D sem lentidão ou recarregamento.',
    icon: HardDrive,
    accent: 'lime',
  },
  {
    id: 'chassis',
    name: 'Chassi Unibody Aeroespacial & Bateria de Grafeno',
    tag: 'ESTRUTURA & ENERGIA',
    highlight: 'Até 22 horas de uso com 100% de performance fora da tomada',
    description:
      'Usinado a partir de um bloco sólido de alumínio série 7000 com absorção de impacto estrutural e bateria de 99.6Wh em células de densidade extrema.',
    advantage: 'Desempenho gráfico idêntico esteja você conectado à tomada ou no aeroporto.',
    icon: BatteryCharging,
    accent: 'orange',
  },
];

const BUYING_REASONS = [
  {
    target: 'Para o Gamer Competitivo',
    tagline: 'Fluidez Cirúrgica Sem Queda de Rendimento',
    icon: Gamepad2,
    pitch:
      'Chega de ver seu FPS despencar de 240 para 90 após 20 minutos de jogo por causa de superaquecimento. O sistema de resfriamento exposto no vídeo mantém o clock no teto durante maratonas completas, com tela OLED de 0.03ms e latência zero.',
    bullets: [
      'Taxa de quadros travada em 240Hz com preto infinito OLED',
      'Geração de quadros por IA em 4K com DLSS 3.5',
      'Teclado com atuação mecânica de resposta tátil ultrarrápida',
    ],
    borderGlow: 'hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]',
    badgeColor: 'text-cyan-400',
  },
  {
    target: 'Para o Engenheiro & Desenvolvedor de Software',
    tagline: 'Ambiente de Desenvolvimento Sem Gargalos',
    icon: Code2,
    pitch:
      'O tempo de compilação é dinheiro. Com até 128GB de memória unificada a 400 GB/s e arquitetura ARM/Unix nativa, você compila bases de código gigantescas, sobe clusters de microsserviços locais e executa LLMs offline enquanto programa.',
    bullets: [
      'Redução de até 64% no tempo de compilação Docker',
      'Kernel Unix nativo sem camadas de emulação pesadas',
      'Suporte para até 3 monitores externos 6K simultâneos',
    ],
    borderGlow: 'hover:border-violet-400/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.18)]',
    badgeColor: 'text-violet-400',
  },
  {
    target: 'Para Empresários & Mentes Criativas',
    tagline: 'O Fim da Dependência Excessiva de Nuvem',
    icon: Layers,
    pitch:
      'Economize milhares em instâncias de GPU em nuvem trazendo a inferência e a renderização pesada para as máquinas do seu time. Durabilidade de nível corporativo, segurança em hardware e 100% de potência garantida fora da tomada.',
    bullets: [
      'Retorno sobre Investimento (ROI) comprovado em menos de 5 meses',
      'Soberania de dados e privacidade total para projetos sigilosos',
      'Bateria de 22 horas para trabalhar de qualquer lugar do mundo',
    ],
    borderGlow: 'hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]',
    badgeColor: 'text-emerald-400',
  },
];

const COMPARISON_POINTS = [
  {
    feature: 'Estabilidade Térmica sob Carga Contínua',
    traditional: 'Throttling térmico agressivo após 20 minutos (temperaturas de 95°C+)',
    mainframe: 'Câmaras de vapor de fase dupla que mantêm temperaturas abaixo de 72°C constantes',
  },
  {
    feature: 'Desempenho Fora da Tomada',
    traditional: 'Queda de até 50% na frequência de GPU e CPU na bateria',
    mainframe: '100% da potência entregue mesmo desconectado da tomada',
  },
  {
    feature: 'Capacidade de Multitarefas',
    traditional: 'Gargalo de barramento PCI e lentidão com múltiplos apps pesados',
    mainframe: 'Memória unificada de 400 GB/s acessível por CPU, GPU e NPU simultaneamente',
  },
  {
    feature: 'Execução de Inteligência Artificial',
    traditional: 'Dependente de servidores em nuvem com alta latência e custos recorrentes',
    mainframe: 'NPU dedicada com suporte nativo para LLMs e visão computacional offline',
  },
];

export default function App() {
  // Navigation view:
  // 'hero' (3D notebook + "Você é capaz de fazer tudo" + CTAs)
  // 'showcase' (white spotlight window for Gamers and Programmers)
  // 'company' (dedicated window with 16:9 split-screen video about Mainframe corporate hardware & AI)
  const [currentView, setCurrentView] = useState<'hero' | 'showcase' | 'company'>('hero');
  const [activeCategory, setActiveCategory] = useState<'programmers' | 'gamers' | 'multitasking'>('programmers');

  // Video source - automatically loads from IndexedDB if saved
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO_URL);

  // Inquiry Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Video references
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-load notebook video from IndexedDB on startup
  useEffect(() => {
    async function initSavedVideo() {
      const savedFile = await loadCustomVideo();
      if (savedFile) {
        const url = URL.createObjectURL(savedFile);
        setVideoSrc(url);
      }
    }
    initSavedVideo();
  }, []);

  // Silent drag-and-drop listener to update video without cluttering UI
  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm|m4v)$/i)) {
        const objectUrl = URL.createObjectURL(file);
        setVideoSrc(objectUrl);
        await saveCustomVideo(file);
      }
    }
  }, []);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleDrop]);

  // Ensure continuous background video playback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, [videoSrc, currentView]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsInquiryModalOpen(false);
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactMessage('');
    }, 2200);
  };

  const currentCategoryData = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="relative bg-[#070A13] text-slate-100 font-sans selection:bg-cyan-400 selection:text-black antialiased overflow-x-hidden min-h-screen">
      {/* 
        ===========================================================================
        GLOBAL IMMERSIVE BACKGROUND:
        - Deep Space Obsidian canvas (#070A13)
        - Ambient mesh gradients (electric cyan, deep violet, vibrant emerald & orange)
        - Subtle technical vector grid overlay with delicate circuit lines
        ===========================================================================
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle isometric tech grid overlay */}
        <div className="absolute inset-0 bg-tech-grid opacity-[0.035]" />

        {/* Ambient mesh neons */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-violet-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 -right-48 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[400px] bg-orange-500/08 rounded-full blur-[150px]" />
      </div>

      {/* 
        PERSISTENT 3D NOTEBOOK BACKGROUND VIDEO LAYER (HERO VIEW):
        - Mounted constantly at root to preserve video buffers and prevent freezing on view changes.
        - Expansive scale (1.24x) to crop out the top-left 'Pippit AI' watermark
        - High clarity & vivid brightness
      */}
      <div
        className={`fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full bg-[#070A13] flex items-center justify-center transition-opacity duration-700 ${
          currentView === 'hero' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
          src={videoSrc}
          className="w-auto h-full max-h-[105vh] min-w-[70vw] lg:min-w-[80vw] max-w-[98vw] object-contain sm:object-cover object-center pointer-events-none transform scale-[1.24] origin-center"
        />

        {/* Soft atmospheric gradient scrims for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A13] via-transparent to-[#070A13]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A13]/60 via-transparent to-[#070A13]/60 pointer-events-none" />
        
        {/* Subtle decorative circuit vector framing */}
        <div className="absolute inset-8 sm:inset-12 border border-white/[0.04] rounded-[32px] pointer-events-none hidden md:block">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/50" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/50" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/50" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'hero' && (
          /* =========================================================================
             VIEW 1: HERO VIEW (3D NOTEBOOK WITH "Você é capaz de fazer tudo" + ACTION BUTTONS)
             - Extreme typographic contrast (Syne display font)
             - Frosted glassmorphism action island
             - Minimalist luxury tech aesthetics
             ========================================================================= */
          <motion.div
            key="hero-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="relative min-h-screen w-full flex flex-col justify-between"
          >
            {/* Top Bar following Top Bar Contract: Brand zone + links */}
            <header className="fixed top-0 inset-x-0 z-20 px-6 sm:px-12 py-5 sm:py-7 flex flex-row justify-between items-center bg-[#070A13]/40 backdrop-blur-xl border-b border-white/[0.06]">
              <div className="flex flex-row items-center gap-3 select-none">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  MAINFRAME
                </span>
                <span className="text-cyan-400 text-lg leading-none select-none font-mono">
                  &bull;
                </span>
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase hidden sm:inline">
                  TITANIUM 2026
                </span>
              </div>

              <nav className="flex items-center gap-4 sm:gap-7">
                <button
                  type="button"
                  onClick={() => setCurrentView('company')}
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.06]"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sobre a Empresa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('showcase')}
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.06]"
                >
                  <span>Multitarefas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </nav>
            </header>

            {/* Central Stage: "Você é capaz de fazer tudo" + Action Buttons */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto my-auto pt-32 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* Subtle Editorial Kicker */}
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400/90 uppercase mb-5 select-none">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>ENGENHARIA DE ULTRA-DENSIDADE COMPUTACIONAL</span>
                </div>

                {/* Large Central Title in Syne */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-bold tracking-tight text-white leading-[1.04] font-display max-w-4xl select-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400/70 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                  Você é capaz de fazer tudo
                </h1>

                {/* Subtitle Accent */}
                <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Potência computacional sem limites para criar, compilar e vencer.
                </p>

                {/* Clickable Action Buttons Grid */}
                <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                  {/* Button 1: Showcase (White Spotlight, Gamers & Devs) */}
                  <motion.button
                    type="button"
                    onClick={() => setCurrentView('showcase')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm sm:text-base shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:shadow-[0_0_70px_rgba(6,182,212,0.4)] transition-all cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <span>Conhecer o Futuro Multitarefas</span>
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.button>

                  {/* Button 2: Company Vision & Hardware AI */}
                  <motion.button
                    type="button"
                    onClick={() => setCurrentView('company')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full glass-panel hover:border-cyan-400/50 text-white font-medium text-sm sm:text-base transition-all cursor-pointer shadow-lg w-full sm:w-auto justify-center hover:shadow-[0_0_35px_rgba(6,182,212,0.18)]"
                  >
                    <div className="w-7 h-7 rounded-full bg-cyan-400/15 text-cyan-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span>Sobre a Mainframe&reg; &bull; IA &amp; Hardware</span>
                  </motion.button>
                </div>
              </motion.div>
            </main>

            {/* Bottom Subtle Guidance */}
            <footer className="relative z-10 py-6 px-8 sm:px-12 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono gap-3 border-t border-white/[0.04] bg-[#070A13]/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Visualização 3D contínua de hardware</span>
              </div>
              <span className="text-slate-500">Mainframe&reg; Hardware &bull; Edição 2026</span>
            </footer>
          </motion.div>
        )}

        {currentView === 'showcase' && (
          /* =========================================================================
             VIEW 2: SHOWCASE VIEW (MODERN SPOTLIGHT & EXPLODED ANATOMY)
             - Geometric Space Grotesk / Syne headings
             - Asymmetric floating banner with glowing multi-stop border
             - Clean frosted glassmorphism cards with glowing edge states
             ========================================================================= */
          <motion.div
            key="showcase-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen w-full bg-[#070A13] text-slate-100 overflow-hidden pb-28"
          >
            {/* AMBIENT SPOTLIGHT: Dual-tone luminescent spotlight cone emanating from the top center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-500/18 via-violet-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[380px] bg-white/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Header with Back Button */}
            <header className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setCurrentView('hero')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-cyan-400/40 text-xs sm:text-sm font-medium transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
                <span>Voltar ao Início</span>
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('company')}
                  className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.06]"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sobre a Empresa</span>
                </button>
                <span className="text-white/20">|</span>
                <span className="text-lg font-bold tracking-tight text-white font-display">Mainframe&reg;</span>
              </div>
            </header>

            {/* Showcase Stage Header */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 sm:pt-24 text-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Zero-Pill Clean Typographic Kicker */}
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>ANATOMIA INTERNA &bull; ALTA DENSIDADE DE SILÍCIO</span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6 font-tech">
                  Conheça o Futuro Multitarefas: Construído de Dentro Para Fora
                </h2>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto font-sans">
                  A verdadeira modernidade não está apenas na carcaça externa, mas na precisão de cada componente interno. Veja como a arquitetura do Mainframe&reg; elimina qualquer gargalo entre gamers de elite, desenvolvedores e criadores.
                </p>
              </motion.div>
            </div>

            {/* 
              CINEMATOGRAPHIC RECTANGULAR VIDEO BANNER WITH ROUNDED CORNERS:
              - Asymmetric floating depth with multi-stop glowing border
              - Native video file playing continuously and seamlessly
              - No buttons, no play/pause mechanics, purely the video
            */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 mt-12 sm:mt-14">
              {/* Soft ambient back-glow behind the banner */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-600/20 to-emerald-500/20 rounded-[34px] blur-xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[30px] overflow-hidden border border-white/[0.12] bg-[#0A0E1A] aspect-video group shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  src={COMPANY_VIDEO_URL}
                  className="w-full h-full object-cover object-center scale-[1.02] pointer-events-none"
                />

                {/* Ambient Top Badges */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-[#0B101D]/80 backdrop-blur-xl border border-white/[0.12] px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-medium text-white tracking-wide">
                    ANATOMIA EXPLODIDA &bull; MAINFRAME&reg; TITANIUM
                  </span>
                </div>

                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-[#0B101D]/80 backdrop-blur-xl border border-white/[0.12] px-3.5 py-1 rounded-full text-[11px] font-mono text-slate-300 pointer-events-none hidden sm:block">
                  1080p 60fps &bull; Visão de Engenharia
                </div>

                {/* Bottom Exploded View Caption Bar */}
                <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 bg-[#0B101D]/85 backdrop-blur-xl border border-white/[0.12] px-5 py-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none">
                  <div className="flex items-center gap-2.5 text-xs text-white font-medium">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Ao final do vídeo: separação das câmaras de vapor em cobre sinterizado, ventoinhas MagLev e módulos de memória unificada.</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono shrink-0 font-semibold uppercase tracking-wider">Zero Throttling</span>
                </div>
              </motion.div>
            </div>

            {/* 
              SECTION 1: ANATOMY OF HARDWARE COMPONENTS (Tied directly to the exploded view in the video)
              - Asymmetric Bento-grid layout with varied card weights
              - Glassmorphism with glowing border strokes
            */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 mt-24 sm:mt-32">
              <div className="text-center mb-14">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 block mb-3">
                  ENGENHARIA DAS PEÇAS INTERNAS
                </span>
                <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-tech">
                  A Anatomia por Trás da Efetividade Extrema
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
                  Cada milímetro exposto no vídeo foi concebido para resolver os maiores problemas dos notebooks da atualidade: calor excessivo, perda de FPS e falta de memória para IA.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {EXPLODED_COMPONENTS.map((comp, index) => {
                  const CompIcon = comp.icon;
                  return (
                    <motion.div
                      key={comp.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="glass-panel-glow rounded-[28px] p-8 sm:p-9 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Ambient corner light accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/05 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                            <CompIcon className="w-6 h-6 text-cyan-300" />
                          </div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                            {comp.tag}
                          </span>
                        </div>

                        <h4 className="text-2xl font-bold text-white tracking-tight mb-2.5 font-tech">
                          {comp.name}
                        </h4>

                        <div className="inline-block text-xs font-mono text-slate-200 bg-white/[0.06] border border-white/[0.08] px-3.5 py-1.5 rounded-lg mb-5">
                          {comp.highlight}
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6 font-sans">
                          {comp.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.08] flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Efeito no uso real:</strong> {comp.advantage}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 
              SECTION 2: POR QUE COMPRAR ESTE NOTEBOOK? (NARRATIVA COMERCIAL PARA GAMERS, DEVS E EMPRESÁRIOS)
            */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 mt-28 sm:mt-36">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 block mb-3">
                  PROPOSTA DE VALOR REAL
                </span>
                <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-tech">
                  Por Que Você Deve Escolher o Mainframe&reg;?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
                  Construído para quem não aceita desculpas de máquina lenta, travamento no meio da partida ou renderização que arrasta o dia inteiro.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {BUYING_REASONS.map((reason, index) => {
                  const TargetIcon = reason.icon;
                  return (
                    <motion.div
                      key={reason.target}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.65, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
                      className={`glass-panel rounded-[28px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ${reason.borderGlow}`}
                    >
                      <div>
                        <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mb-6 shadow-md">
                          <TargetIcon className="w-6 h-6 text-white" />
                        </div>

                        <span className={`text-xs uppercase tracking-wider font-semibold ${reason.badgeColor} block mb-1 font-mono`}>
                          {reason.target}
                        </span>

                        <h4 className="text-2xl font-bold text-white tracking-tight mb-4 font-tech">
                          {reason.tagline}
                        </h4>

                        <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6 font-sans">
                          {reason.pitch}
                        </p>

                        <div className="space-y-3 mb-8">
                          {reason.bullets.map((b) => (
                            <div key={b} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="w-full py-3.5 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-black font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer border border-white/[0.14] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                      >
                        Configurar Esta Versão
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 
              SECTION: AUDIENCE TABS & METRICS (Programadores, Gamers, Multitarefa Extrema)
              - Interactive tab switcher for key domains
            */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 mt-28 sm:mt-36">
              <div className="text-center mb-10">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 block mb-2">
                  PERFORMANCE POR PERFIL
                </span>
                <h4 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-tech">
                  Feito sob Medida para Cada Demanda Extrema
                </h4>
              </div>

              {/* Segmented Control */}
              <div className="p-1.5 rounded-full glass-panel border border-white/[0.1] max-w-xl mx-auto flex items-center justify-between gap-1 mb-10">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-black shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel */}
              <div className="glass-panel-glow rounded-[28px] p-8 sm:p-10 border border-white/[0.12]">
                <p className="text-base sm:text-lg text-slate-200 mb-8 font-medium">
                  {currentCategoryData.tagline}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {currentCategoryData.metrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                      <span className="text-3xl sm:text-4xl font-bold text-white block font-mono">
                        {m.value}
                      </span>
                      <span className="text-xs font-semibold text-cyan-400 block mt-1">{m.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{m.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {currentCategoryData.features.map((f, idx) => {
                    const FIcon = f.icon;
                    return (
                      <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                      >
                        <FIcon className="w-5 h-5 text-cyan-400 mb-3" />
                        <h5 className="text-sm font-bold text-white mb-1.5">{f.title}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 
              SECTION 3: COMPARATIVO DE EFETIVIDADE (Notebooks Comuns vs. Mainframe Titanium)
            */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 mt-28 sm:mt-36">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel rounded-[28px] p-8 sm:p-10 border border-white/[0.12]"
              >
                <div className="text-center mb-10">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 block mb-2">
                    EFETIVIDADE COMPROVADA EM TESTES
                  </span>
                  <h4 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-tech">
                    Notebook Convencional vs. Mainframe&reg; Titanium
                  </h4>
                </div>

                <div className="divide-y divide-white/[0.08]">
                  {COMPARISON_POINTS.map((pt, idx) => (
                    <motion.div
                      key={pt.feature}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      <div className="md:col-span-4">
                        <span className="text-sm font-semibold text-white font-sans">{pt.feature}</span>
                      </div>
                      <div className="md:col-span-4 bg-red-950/20 border border-red-500/25 rounded-2xl p-4">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-red-400 block mb-1 font-mono">
                          Notebooks Comuns
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{pt.traditional}</p>
                      </div>
                      <div className="md:col-span-4 bg-emerald-950/25 border border-emerald-500/35 rounded-2xl p-4">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 block mb-1 font-mono">
                          Mainframe&reg; Titanium
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">{pt.mainframe}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 mt-20 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.35)] cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Solicitar Proposta / Test-Drive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('hero')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-panel hover:border-cyan-400/40 text-white font-medium text-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Voltar ao Início</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'company' && (
          /* =========================================================================
             VIEW 3: COMPANY VISION & ENTERPRISE HARDWARE
             - Widescreen 16:9 Video integrated into HALF OF THE PAGE
             - Clear, vibrant, and focused on corporate architecture and hardware AI
             - Architectural typography and deep blue-black glass panels
             ========================================================================= */
          <motion.div
            key="company-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen w-full bg-[#070A13] text-slate-100 overflow-hidden pb-28"
          >
            {/* AMBIENT MESH GLOW */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[500px] bg-cyan-500/12 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

            {/* Header with Back Button */}
            <header className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setCurrentView('hero')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-cyan-400/40 text-xs sm:text-sm font-medium transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
                <span>Voltar ao Início</span>
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('showcase')}
                  className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/[0.06]"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ver Specs Multitarefas</span>
                </button>
                <span className="text-white/20">|</span>
                <span className="text-lg font-bold tracking-tight text-white font-display">Mainframe&reg;</span>
              </div>
            </header>

            {/* 
              SPLIT-SCREEN HERO SECTION:
              - Left Half: Corporate vision & AI narrative
              - Right Half: Widescreen 16:9 Video
            */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 sm:pt-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column (Narrative & Strategy) */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-7 flex flex-col items-start text-left"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-6">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>INTELIGÊNCIA ARTIFICIAL &bull; HARDWARE DE ALTA DENSIDADE</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06] mb-6 font-display">
                    Mainframe&reg;: A Vanguarda em Notebooks Multitarefas
                  </h2>

                  <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl font-sans">
                    Desenvolvemos notebooks de alta densidade computacional que combinam aceleração neural local, multitarefas ininterrupta e eficiência energética incomparável para líderes de mercado, empresas inovadoras e profissionais de tecnologia.
                  </p>

                  {/* Highlights Metric Cards */}
                  <div className="grid grid-cols-3 gap-3.5 w-full max-w-lg mb-9">
                    <div className="glass-panel rounded-2xl p-4 text-center border border-white/[0.08]">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">0 ms</span>
                      <span className="text-[11px] text-slate-400">Latência Local de IA</span>
                    </div>
                    <div className="glass-panel rounded-2xl p-4 text-center border border-white/[0.08]">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">128 GB</span>
                      <span className="text-[11px] text-slate-400">NPU Unificada</span>
                    </div>
                    <div className="glass-panel rounded-2xl p-4 text-center border border-white/[0.08]">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 block">-42%</span>
                      <span className="text-[11px] text-slate-400">Custos com Nuvem</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-xl cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Falar com Consultor Corporativo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('showcase')}
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-panel hover:border-cyan-400/40 text-white font-medium text-sm transition-colors cursor-pointer"
                    >
                      <span>Ver Benchmarks</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </motion.div>

                {/* Right Column (WIDESCREEN 16:9 VIDEO CONTAINER) */}
                <motion.div
                  initial={{ opacity: 0, y: 36, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5 w-full relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/25 to-violet-600/25 rounded-[32px] blur-xl opacity-75 pointer-events-none" />

                  <div className="relative rounded-[28px] overflow-hidden border border-white/[0.14] shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#0A0E1A] aspect-video group">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      src={COMPANY_VIDEO_URL}
                      className="w-full h-full object-cover object-center rounded-[28px]"
                    />

                    {/* Subtle ambient overlay & badges */}
                    <div className="absolute top-3.5 right-3.5 bg-[#0B101D]/80 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Mainframe&reg; AI Hardware</span>
                    </div>

                    <div className="absolute bottom-3.5 inset-x-3.5 bg-[#0B101D]/80 backdrop-blur-md border border-white/[0.1] p-3 rounded-2xl pointer-events-none flex items-center justify-between">
                      <span className="text-xs text-white font-medium">Arquitetura de Silício Unificado</span>
                      <span className="text-[11px] text-cyan-400 font-mono">1080p 60fps</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-16 sm:mt-20 flex flex-col items-center justify-center select-none"
              >
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('company-pillars')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group flex flex-col items-center gap-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                  aria-label="Scroll to company pillars"
                >
                  <motion.span
                    animate={{ opacity: [0.45, 0.95, 0.45] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-xs font-mono uppercase tracking-[0.25em]"
                  >
                    Scroll for details
                  </motion.span>
                  <motion.div
                    animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center group-hover:bg-white/[0.15] group-hover:border-white/[0.3] transition-all"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Key Corporate Pillars */}
            <div id="company-pillars" className="relative z-10 max-w-6xl mx-auto px-6 mt-16 sm:mt-24 scroll-mt-24">
              <div className="text-center mb-14">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 block mb-3">
                  DIFERENCIAIS COMPETITIVOS
                </span>
                <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-tech">
                  Projetado para Empresas, Líderes &amp; Desenvolvedores
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Pillar 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel-glow rounded-[28px] p-8 sm:p-10"
                >
                  <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center mb-6 shadow-lg">
                    <BrainCircuit className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3 font-tech">
                    IA Generativa On-Device &amp; Soberania de Dados
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
                    Em um cenário onde privacidade e conformidade são inegociáveis, a Mainframe&reg; equipa seus notebooks com NPUs dedicadas de ultra-largura de banda. Execute modelos de linguagem avançados e agentes de código localmente sem enviar segredos comerciais ou dados de clientes para a nuvem de terceiros.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Conformidade total com LGPD, GDPR e normas bancárias</span>
                  </div>
                </motion.div>

                {/* Pillar 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel-glow rounded-[28px] p-8 sm:p-10"
                >
                  <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center mb-6 shadow-lg">
                    <Boxes className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3 font-tech">
                    Multitarefas Extrema sem Queda de Frequência
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
                    Projetado para ambientes de alta pressão: compile microsserviços, treine modelos locais, execute benchmarks em 4K e realize conferências com codificação AV1 simultaneamente. Nossos algoritmos preditivos de carga distribuem tarefas de forma heterogênea entre núcleos de performance e eficiência com zero throttling.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Câmara de vapor de ciclo contínuo com ruído acústico mínimo</span>
                  </div>
                </motion.div>

                {/* Pillar 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel-glow rounded-[28px] p-8 sm:p-10"
                >
                  <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center mb-6 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3 font-tech">
                    Retorno sobre Investimento (ROI) para Empresários
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
                    Reduza em até 42% os custos operacionais com instâncias de GPU em nuvem ao migrar testes e inferências para o hardware local dos seus desenvolvedores e analistas. Menos tempo de espera em compilação significa entregas de produtos mais rápidas e maior retenção de talentos técnicos.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Economia média anual comprovada de R$ 18.000 por engenheiro</span>
                  </div>
                </motion.div>

                {/* Pillar 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel-glow rounded-[28px] p-8 sm:p-10"
                >
                  <div className="w-13 h-13 rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white flex items-center justify-center mb-6 shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-3 font-tech">
                    Segurança de Nível de Silício &amp; Durabilidade
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal font-sans">
                    Construção unibody usinada em alumínio aeroespacial de grau militar com blindagem eletromagnética. Inclui coprocessador criptográfico independente (Hardware Root of Trust), proteção contra cold-boot attacks e suporte corporativo 24/7 com reposição prioritária no dia seguinte.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Criptografia de disco em hardware AES-XTS de 256 bits</span>
                  </div>
                </motion.div>
              </div>

              {/* Enterprise CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-14 glass-panel rounded-[32px] p-8 sm:p-14 text-center border border-cyan-500/25 relative overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.12)]"
              >
                <div className="absolute top-0 right-1/4 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 block mb-3">
                  PARCERIAS CORPORATIVAS &bull; FROTAS EMPRESARIAIS
                </span>
                <h4 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 max-w-2xl mx-auto font-tech">
                  Pronto para equipar seu time com os notebooks mais rápidos do mercado?
                </h4>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 font-normal leading-relaxed font-sans">
                  Converse diretamente com nossos consultores de infraestrutura para condições de leasing corporativo, frotas customizadas e testes de bancada de 14 dias sem compromisso.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(true)}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-xl cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Falar com Consultor Corporativo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('hero')}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full glass-panel hover:border-cyan-400/40 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-cyan-400" />
                    <span>Voltar ao Início</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute inset-0 bg-[#070A13]/80 backdrop-blur-xl cursor-pointer"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full max-w-lg glass-panel text-white rounded-[32px] p-6 sm:p-9 shadow-2xl z-10 border border-cyan-500/30"
            >
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(false)}
                aria-label="Close dialog"
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                    Atendimento Corporativo
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs text-slate-400 font-mono">Mainframe&reg; Hardware</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight font-tech">
                  Consultoria &amp; Frotas Empresariais
                </h3>
                <p className="text-sm text-slate-300 mt-1 font-sans">
                  Preencha seus dados para receber um estudo de viabilidade técnica e proposta customizada.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center bg-white/[0.04] rounded-2xl border border-white/[0.08]">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-black mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-tech">Solicitação Recebida!</h4>
                  <p className="text-xs text-slate-300 mt-1 font-sans">
                    Obrigado, {contactName || 'parceiro'}! Um executivo de contas da Mainframe&reg; entrará em contato em até 4 horas úteis.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="company-name" className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                      Seu Nome Completo
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      required
                      placeholder="Ex: Carlos Albuquerque"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all font-sans placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-corp" className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                      Nome da Empresa / Organização
                    </label>
                    <input
                      id="company-corp"
                      type="text"
                      required
                      placeholder="Ex: Nexus Corp / Fintech Ltd"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all font-sans placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-email" className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                      Email Corporativo
                    </label>
                    <input
                      id="company-email"
                      type="email"
                      required
                      placeholder="carlos@empresa.com.br"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all font-sans placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-desc" className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                      Volume Estimado de Máquinas / Necessidade
                    </label>
                    <textarea
                      id="company-desc"
                      rows={3}
                      placeholder="Ex: Equipe de 25 engenheiros de software precisando de máquinas com 64GB+ para IA local e Docker..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition-all font-sans placeholder:text-slate-500 resize-none"
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-colors cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      <span>Enviar Solicitação</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

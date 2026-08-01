import React, { useEffect, useRef, useState } from 'react';
import { CHECKOUTS, IMAGES, VISUAL_GALLERY } from './config/offer.js';

const completeOfferImage = IMAGES.completePlan;

const audienceCards = [
  [
    'Para quem quer terminar a faxina mais rápido',
    'Técnicas diretas para seguir uma ordem melhor e ganhar tempo em cada ambiente.'
  ],
  [
    'Para quem se cansa de voltar ao mesmo lugar',
    'Orientações para reduzir retrabalho e resolver cada etapa antes de seguir para a próxima.'
  ],
  [
    'Para a faxina de casa',
    'Com técnicas para banheiro, cozinha, quartos, salas, pisos, vidros e finalização.'
  ],
  [
    'Para quem quer uma rotina mais leve',
    'Consulte o que fazer em cada etapa, sem complicar a faxina nem gastar esforço à toa.'
  ]
];

const bonuses = [
  {
    title: 'Calculadora para saber quanto cobrar pela faxina',
    text: 'Uma tabela simples para ajudar você a calcular o valor do serviço sem cobrar no chute, considerando tempo, transporte, materiais e dificuldade da limpeza.',
    image: IMAGES.bonusCalculator,
    value: 'Bônus 01',
    price: 'R$ 27,00'
  },
  {
    title: 'Agenda da semana para anotar seus clientes',
    text: 'Folhas prontas para organizar clientes, horários, valores combinados, pagamentos e observações da semana.',
    image: IMAGES.bonusAgenda,
    value: 'Bônus 02',
    price: 'R$ 17,00'
  },
  {
    title: 'Artes prontas para divulgar sua faxina',
    text: 'Modelos visuais para divulgar seus serviços no WhatsApp, Instagram e grupos de bairro, de forma clara e bonita.',
    image: IMAGES.bonusArts,
    value: 'Bônus 03',
    price: 'R$ 23,00'
  },
  {
    title: 'Certificado de Conclusão',
    text: 'Um certificado bonito para preencher, imprimir ou salvar ao terminar o material.',
    image: IMAGES.bonusCertificate,
    value: 'Bônus 04',
    price: 'R$ 20,00'
  }
];

const basicItems = [
  ['yes', '+250 técnicas de limpeza'],
  ['yes', 'Acesso imediato']
];

const completeItems = [
  '+250 técnicas de limpeza',
  'Calculadora para saber quanto cobrar pela faxina',
  'Agenda da semana para anotar seus clientes',
  'Artes prontas para divulgar sua faxina',
  'Certificado de Conclusão',
  'Material digital',
  'Pronto para imprimir',
  'Acesso imediato'
];

const upsellItems = [
  'Calculadora para cobrar com mais organização',
  'Agenda para anotar clientes e horários',
  'Artes prontas para divulgar seu serviço',
  'Certificado de Conclusão'
];

const faqs = [
  [
    'O material é físico ou digital?',
    'É digital. Você recebe o acesso online e pode imprimir as páginas quando quiser.'
  ],
  [
    'Preciso ter experiência com limpeza?',
    'Não. O material usa linguagem simples para ajudar você a fazer a faxina com uma ordem mais prática.'
  ],
  [
    'Posso imprimir?',
    'Sim. O material foi feito para imprimir e consultar sempre que precisar.'
  ],
  [
    'O Plano Básico vem com os bônus?',
    'Não. O Plano Básico vem com as +250 técnicas. Os bônus ficam no Plano Completo.'
  ],
  [
    'Quais bônus vêm no Plano Completo?',
    'Calculadora para saber quanto cobrar pela faxina, agenda da semana, artes prontas para divulgar sua faxina e certificado de conclusão.'
  ],
  [
    'Serve para limpeza residencial?',
    'Sim. O material foi pensado para a faxina de casas e apartamentos.'
  ],
  [
    'Serve para pós-obra?',
    'Sim, o material possui técnicas para pós-obra leve. Não é um serviço técnico especializado.'
  ],
  [
    'O acesso é imediato?',
    'Sim. Após a confirmação do pagamento, o acesso é liberado conforme a plataforma de checkout.'
  ]
];

const OFFER_DURATION_SECONDS = 60 * 60 + 7 * 60 + 43;

function useOfferCountdown() {
  const endsAtRef = useRef(Date.now() + OFFER_DURATION_SECONDS * 1000);
  const getRemaining = () => Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return remaining;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function playWaterSound(audioContext) {
  if (!audioContext) return;

  const duration = 1.75;
  const sampleRate = audioContext.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
  const output = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const time = index / sampleRate;
    const fadeIn = Math.min(1, time / 0.18);
    const fadeOut = Math.min(1, (duration - time) / 0.45);
    const envelope = fadeIn * fadeOut;
    const swish = Math.sin(2 * Math.PI * (95 + Math.sin(time * 9) * 24) * time);
    const ripple = Math.sin(2 * Math.PI * (260 + Math.sin(time * 13) * 70) * time);
    const droplets = Math.sin(2 * Math.PI * (950 + Math.sin(time * 23) * 220) * time);
    output[index] =
      ((Math.random() * 2 - 1) * 0.24 + swish * 0.08 + ripple * 0.045 + droplets * 0.018) * envelope;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(740, audioContext.currentTime);
  filter.Q.setValueAtTime(0.95, audioContext.currentTime);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.075, audioContext.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  source.start();
  source.stop(audioContext.currentTime + duration);
}

function CleanerIllustration() {
  return (
    <svg className="cleanerSvg" viewBox="0 0 96 92" aria-hidden="true" focusable="false">
      <g className="cleanerBody">
        <path className="cleanerBucket" d="M8 65h22l-4 18H12z" />
        <path className="cleanerBucketLine" d="M9 66c6 5 14 5 21 0" />
        <path className="cleanerLeg" d="M44 49l-8 31h10l8-31z" />
        <path className="cleanerLeg" d="M57 49l7 31h10l-5-31z" />
        <path className="cleanerShoe" d="M34 82h16c0 5-3 7-10 7h-8z" />
        <path className="cleanerShoe" d="M62 82h16c1 5-2 7-9 7h-8z" />
        <path className="cleanerTorso" d="M43 25h25l5 26c-9 6-25 6-36 0z" />
        <path className="cleanerArm" d="M39 31c-8 4-13 10-14 17 6 2 12-3 18-11z" />
        <path className="cleanerArm" d="M68 33c7 4 11 9 13 16-5 3-11-1-16-10z" />
        <circle className="cleanerHead" cx="55" cy="17" r="11" />
        <path className="cleanerHairBack" d="M43 15c-4 13 1 25 10 29 2-8 5-17 12-25z" />
        <path className="cleanerHair" d="M42 15c4-15 24-15 31-2-8-1-17-5-31 2z" />
        <path className="cleanerHairSide" d="M68 12c7 8 6 20-1 27-2-9-3-17 1-27z" />
        <path className="cleanerSmile" d="M54 20c3 3 7 3 10 0" />
        <circle className="cleanerEye" cx="52" cy="16" r="1.4" />
        <circle className="cleanerEye" cx="63" cy="15" r="1.4" />
        <path className="cleanerLash" d="M50 14l-3-2M65 13l3-2" />
        <path className="cleanerGlove" d="M23 45c5-2 9 0 11 5-4 5-9 5-13 1z" />
        <path className="cleanerGlove" d="M75 45c5-2 9 1 10 5-4 5-9 4-12 0z" />
      </g>
      <g className="mopGroup">
        <path className="mopHandle" d="M35 12l43 70" />
        <path className="mopHead" d="M73 80c4-6 10-6 15-2-3 9-15 11-24 6 2-3 5-4 9-4z" />
        <path className="mopStrand" d="M70 82c5 4 11 5 18 1M66 86c7 3 14 3 22-2M76 78c2 5 1 8-3 11" />
      </g>
      <path className="cleaningSparkle" d="M83 61c2 3 4 5 8 6-4 1-6 3-8 6-2-3-4-5-8-6 4-1 6-3 8-6z" />
    </svg>
  );
}

function CleaningProgress() {
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const checkout = document.getElementById('checkout');
        const page = document.documentElement;
        const targetTop = checkout ? checkout.offsetTop : page.scrollHeight - window.innerHeight;
        const finishPoint = Math.max(1, targetTop - window.innerHeight * 0.22);
        setProgress(clamp(window.scrollY / finishPoint));
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const unlockAudio = async () => {
      if (audioContextRef.current) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      playWaterSound(audioContext);
      window.setTimeout(() => playWaterSound(audioContext), 450);
      intervalRef.current = window.setInterval(() => playWaterSound(audioContext), 15000);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.clearInterval(intervalRef.current);
      audioContextRef.current?.close?.();
    };
  }, []);

  return (
    <div className="cleaningProgress" aria-label="Progresso até a seção de preços">
      <div
        className="cleaningProgressInner"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progress * 100)}
        style={{ '--clean-progress': progress }}
      >
        <span className="cleanTrack" aria-hidden="true" />
        <span className="cleanFill" aria-hidden="true" />
        <span className="cleanFoam" aria-hidden="true" />
        <span className="cleanerRunner">
          <CleanerIllustration />
        </span>
      </div>
    </div>
  );
}

function CountdownBar({ remaining }) {
  return (
    <div className="topCountdown" aria-label="Oferta exclusiva apenas hoje">
      <div className="topCountdownInner">
        <strong>OFERTA EXCLUSIVA APENAS HOJE</strong>
        <span>FALTAM {formatTime(remaining)}</span>
      </div>
    </div>
  );
}

function CTA({ children = 'Quero acessar o material', className = '', href = '#checkout', onClick }) {
  return (
    <a className={`cta ${className}`} href={href} onClick={onClick}>
      {children}
    </a>
  );
}

function ImageBlock({ src, alt, className = '', loading = 'lazy', fetchPriority = 'auto' }) {
  const shouldDefer = loading === 'lazy';

  return (
    <figure className={`imageBlock ${className}`}>
      <img
        src={shouldDefer ? undefined : src}
        data-src={shouldDefer ? src : undefined}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </figure>
  );
}

function loadDeferredImage(image) {
  if (!image?.dataset?.src) return;

  image.loading = 'eager';
  image.fetchPriority = 'auto';
  image.src = image.dataset.src;
  image.removeAttribute('data-src');
}

function shuffleSlides(slides) {
  const shuffled = [...slides];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function LegacyMaterialCarousel() {
  const [slides] = useState(() => shuffleSlides(VISUAL_GALLERY));
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartRef = useRef(null);

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
    setCycleKey((current) => current + 1);
  };

  const goTo = (index) => {
    setActiveIndex(index);
    setCycleKey((current) => current + 1);
  };

  useEffect(() => {
    if (isPaused) return undefined;
    const interval = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(interval);
  }, [isPaused, cycleKey, slides.length]);

  const positionFor = (index) => {
    const offset = (index - activeIndex + slides.length) % slides.length;
    if (offset === 0) return 'isActive';
    if (offset === 1) return 'isNext';
    if (offset === slides.length - 1) return 'isPrevious';
    return 'isHidden';
  };

  const handlePointerUp = (event) => {
    if (pointerStartRef.current === null) return;
    const distance = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;
    if (Math.abs(distance) < 42) return;
    move(distance < 0 ? 1 : -1);
  };

  return (
    <div
      className={`materialCarousel ${isPaused ? 'isPaused' : ''}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Páginas do material de limpeza"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setIsPaused(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setIsPaused(false);
      }}
      onPointerDown={(event) => {
        pointerStartRef.current = event.clientX;
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
    >
      <div className="carouselStage">
        {slides.map((slide, index) => {
          const position = positionFor(index);
          const isVisible = position !== 'isHidden';
          return (
            <button
              className={`carouselSlide ${position}`}
              type="button"
              key={slide.src}
              tabIndex={isVisible ? 0 : -1}
              aria-label={
                position === 'isPrevious'
                  ? 'Ver página anterior'
                  : position === 'isNext'
                    ? 'Ver próxima página'
                    : `Página ${activeIndex + 1} de ${slides.length}. Avançar`
              }
              aria-hidden={!isVisible}
              onClick={() => move(position === 'isPrevious' ? -1 : 1)}
            >
              <img src={slide.src} alt={position === 'isActive' ? slide.alt : ''} loading="lazy" decoding="async" />
            </button>
          );
        })}
        <button className="carouselArrow carouselArrowPrev" type="button" onClick={() => move(-1)} aria-label="Página anterior">‹</button>
        <button className="carouselArrow carouselArrowNext" type="button" onClick={() => move(1)} aria-label="Próxima página">›</button>
      </div>
      <div className="carouselMeta" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <div className="carouselDots" aria-label="Escolher página">
          {slides.map((slide, index) => (
            <button
              className={index === activeIndex ? 'isActive' : ''}
              type="button"
              key={slide.src}
              onClick={() => goTo(index)}
              aria-label={`Ir para página ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
      <div className="carouselTimer" aria-hidden="true">
        <span key={`${activeIndex}-${cycleKey}`} />
      </div>
    </div>
  );
}

function MaterialCarousel() {
  const [slides] = useState(() => shuffleSlides(VISUAL_GALLERY));
  const lowerRowSlides = [...slides.slice(3), ...slides.slice(0, 3)];

  const renderRow = (rowSlides, direction, label) => (
    <div className={`marqueeWindow marqueeWindow${direction}`} aria-label={label}>
      <div className="marqueeTrack">
        {[0, 1].map((set) => (
          <div className="marqueeGroup" key={set} aria-hidden={set === 1}>
            {rowSlides.map((slide) => (
              <figure className="marqueeCard" key={`${set}-${slide.src}`}>
                <img src={slide.src} alt={set === 0 ? slide.alt : ''} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="materialCarousel" role="region" aria-label="Paginas do material de limpeza">
      {renderRow(slides, 'Right', 'Paginas do material passando para a direita')}
      {renderRow(lowerRowSlides, 'Left', 'Paginas do material passando para a esquerda')}
    </div>
  );
}

function BonusSummary() {
  return (
    <aside className="bonusSummary" aria-label="Soma dos bônus incluídos">
      <p className="bonusSummaryKicker">Presentes incluídos</p>
      <h3>Somando tudo o que você vai levar:</h3>
      <ul className="bonusSummaryList">
        {bonuses.map((bonus) => (
          <li key={bonus.value}>
            <strong>{bonus.value}</strong>
            <span>{bonus.price}</span>
          </li>
        ))}
      </ul>
      <div className="bonusSummaryTotal">
        <span>Valor total dos bônus</span>
        <strong>R$ 87,00</strong>
      </div>
      <div className="bonusSummaryFree">
        <span>Mas hoje, tudo sairá por:</span>
        <strong>R$ 0 <small>(Grátis)</small></strong>
      </div>
    </aside>
  );
}

function CheckoutCountdown({ remaining }) {
  const [hours, minutes, seconds] = formatTime(remaining).split(':');
  const units = [
    ['Horas', hours],
    ['Minutos', minutes],
    ['Segundos', seconds]
  ];

  return (
    <section id="oferta-temporizada" className="checkoutCountdown reveal" aria-label="Tempo restante da oferta">
      <img className="countdownCleaner countdownCleanerLeft" src="/images/cleaner-left.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="checkoutCountdownContent">
        <p className="checkoutCountdownKicker">Oferta especial de hoje</p>
        <h2>
          <span>Termine sua faxina mais rápido</span>
          <strong>Condição liberada por tempo limitado</strong>
        </h2>
        <p className="checkoutCountdownLead">
          Garanta as +250 técnicas e os 4 bônus antes do tempo acabar.
        </p>
        <div className="countdownBoard" aria-label={`Faltam ${formatTime(remaining)}`}>
          {units.map(([label, value], index) => (
            <React.Fragment key={label}>
              <div className="countdownUnit">
                <div className="countdownDigits" aria-hidden="true">
                  {value.split('').map((digit, digitIndex) => (
                    <span className="countdownDigit" key={`${label}-${digitIndex}`}>{digit}</span>
                  ))}
                </div>
                <small>{label}</small>
              </div>
              {index < units.length - 1 && <span className="countdownSeparator" aria-hidden="true">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <img className="countdownCleaner countdownCleanerRight" src="/images/cleaner-right.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    </section>
  );
}

function FloatingActions({ onPlansClick }) {
  return (
    <div className="floatingActions singleAction">
      <a
        className="floatingOffer"
        href="#checkout"
        aria-label="Ver planos a partir de R$10"
        onClick={onPlansClick}
      >
        <span>A partir de R$10</span>
        <strong>Ver Planos</strong>
      </a>
    </div>
  );
}

function ModalShell({ children, onClose, variant = '' }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modalOpen');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modalOpen');
    };
  }, [onClose]);

  return (
    <div className={`modalOverlay ${variant}`} onMouseDown={onClose} role="presentation">
      <div
        className="modalPanel"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modalClose" type="button" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function ModalBenefitList({ items }) {
  return (
    <ul className="modalBenefitList">
      {items.map((item) => (
        <li key={item}>
          <span>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function BasicPlanUpsellModal({ onClose, onCheckout }) {
  return (
    <ModalShell onClose={onClose} variant="upsellOverlay">
      <div className="upsellModal">
        <p className="modalKicker">Antes de escolher</p>
        <h2>Espere! Você pode levar o material completo por R$17,90</h2>
        <p className="modalDescription">
          Além das +250 técnicas, você também recebe a calculadora para saber quanto cobrar, a
          agenda da semana, as artes para divulgar sua faxina e o certificado de conclusão.
        </p>
        <img
          className="modalProductImage"
          src={completeOfferImage}
          alt="Plano completo com +250 técnicas e quatro bônus"
          loading="lazy"
          decoding="async"
        />
        <ModalBenefitList items={upsellItems} />
        <div className="upsellPrice">R$ 17,90</div>
        <p className="modalReinforce">Material completo com os 4 bônus.</p>
        <a
          className="modalPrimaryCta"
          href={CHECKOUTS.completePopup}
          onClick={() => onCheckout('completePopup')}
        >
          Quero o Plano Completo <span>→</span>
        </a>
        <a
          className="modalSecondaryLink"
          href={CHECKOUTS.basicFull}
          onClick={() => onCheckout('basicFull')}
        >
          Não, quero apenas o Plano Básico
        </a>
      </div>
    </ModalShell>
  );
}

function LandingPage() {
  const [isBasicUpsellOpen, setIsBasicUpsellOpen] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const remaining = useOfferCountdown();

  const markCheckoutClick = () => {
    window.sessionStorage.setItem('checkout-clicked', 'true');
  };

  const handlePlansClick = (event) => {
    event.preventDefault();
    window.history.replaceState(window.history.state, '', '#checkout');
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (window.location.hash) {
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' });
      }, 120);
    }
  }, []);

  useEffect(() => {
    const openBasicUpsell = () => setIsBasicUpsellOpen(true);
    window.addEventListener('landing:open-basic-upsell', openBasicUpsell);
    return () => window.removeEventListener('landing:open-basic-upsell', openBasicUpsell);
  }, []);

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
      const rootMargin = connection?.saveData ? '260px 0px' : slowConnection ? '620px 0px' : '1150px 0px';
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const image = entry.target;
            loadDeferredImage(image);
            imageObserver.unobserve(image);
          });
        },
        { rootMargin }
      );

      lazyImages.forEach((image) => imageObserver.observe(image));

      const primeUpcomingImages = () => {
        document.querySelectorAll('img[data-src]').forEach((image, index) => {
          if (index < 4) loadDeferredImage(image);
        });
      };

      const idleId =
        'requestIdleCallback' in window
          ? window.requestIdleCallback(primeUpcomingImages, { timeout: 2200 })
          : window.setTimeout(primeUpcomingImages, 1200);

      return () => {
        imageObserver.disconnect();
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      };
    }

    document.querySelectorAll('img[data-src]').forEach((image) => {
      loadDeferredImage(image);
    });
  }, [isBasicUpsellOpen]);

  useEffect(() => {
    let frame = 0;

    const updateFloatingActions = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        setShowFloatingActions(hero.getBoundingClientRect().bottom <= 90);
      });
    };

    updateFloatingActions();
    window.addEventListener('scroll', updateFloatingActions, { passive: true });
    window.addEventListener('resize', updateFloatingActions);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateFloatingActions);
      window.removeEventListener('resize', updateFloatingActions);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.reveal, .audienceCard, .bonusCard, .basicCard, .completeCard, .faqStack details'
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('isVisible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CleaningProgress />
      <CountdownBar remaining={remaining} />
      <main className="mobileShell">
        <section className="hero reveal">
          <div className="heroCopy">
            <p className="heroBadge">Material Ilustrado</p>
            <h1>
              <span>+250 técnicas de limpeza</span>
              <br />
              para terminar a faxina mais rápido,
              <br />
              com menos esforço e sem retrabalho
            </h1>
            <p className="subheadline">
              Material visual, organizado por ambiente e pronto para imprimir, com uma ordem simples
              para você limpar sem perder tempo voltando ao mesmo lugar.
            </p>
            <ImageBlock
              src={IMAGES.hero}
              alt="Material digital com técnicas de limpeza"
              className="heroImage"
              loading="eager"
              fetchPriority="high"
            />
            <div className="heroActions">
              <CTA className="pulseCta" onClick={handlePlansClick}>
                Acessar as técnicas
              </CTA>
              <a className="secondaryHeroLink" href="#recebe">
                Ver o que vou receber
              </a>
            </div>
            <p className="accessNote">Acesso digital imediato após a confirmação do pagamento</p>
          </div>
        </section>

        <section className="section audienceSection reveal">
          <h2>Para quem é este material?</h2>
          <div className="audienceStack">
            {audienceCards.map(([title, text]) => (
              <article className="audienceCard" key={title}>
                <div className="checkIcon">✓</div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section demoSection reveal" id="visual">
          <h2>Visual, organizado e pronto para imprimir</h2>
          <p>
            As páginas foram pensadas para serem simples de entender, com técnicas curtas, separadas
            por ambiente e fáceis de consultar para fazer cada etapa com mais rapidez e menos esforço.
          </p>
          <MaterialCarousel />
          <div className="pillRow">
            <span>Fácil de consultar</span>
            <span>Fácil de imprimir</span>
            <span>Fácil de aplicar</span>
          </div>
        </section>

        <section className="section bonusSection reveal" id="recebe">
          <p className="sectionKicker">Bônus do plano completo</p>
          <h2>Além das +250 técnicas, você também recebe 4 bônus</h2>
          <div className="bonusStack">
            {bonuses.map((bonus) => (
              <article className="bonusCard" key={bonus.title}>
                <ImageBlock src={bonus.image} alt={bonus.title} className="bonusImage" />
                <span className="bonusNumber">{bonus.value}</span>
                <p>{bonus.text}</p>
                <div className="bonusPrice">
                  <span>{bonus.price}</span>
                  <strong>Grátis</strong>
                </div>
              </article>
            ))}
          </div>
          <BonusSummary />
        </section>

        <CheckoutCountdown remaining={remaining} />

        <section className="priceSection reveal" id="checkout">
          <div className="priceIntro">
            <p className="sectionKicker">Acesso digital</p>
            <h2>Escolha seu acesso</h2>
            <p>Comece pelo básico ou leve o material completo com todos os bônus.</p>
          </div>

          <article className="basicCard">
            <div className="planTopline">PLANO BÁSICO</div>
            <h3>Plano Básico</h3>
            <p className="planSub">Para acessar apenas as +250 técnicas</p>
            <div className="basicPrice">R$ 10,00</div>
            <ul className="planList basicList">
              {basicItems.map(([type, text]) => (
                <li className={type === 'no' ? 'notIncluded' : ''} key={text}>
                  <span>{type === 'no' ? '×' : '✓'}</span>
                  {text}
                </li>
              ))}
            </ul>
            <button
              className="secondaryButton"
              type="button"
              data-open-basic-upsell
              data-no-initiate-checkout
              onClick={() => setIsBasicUpsellOpen(true)}
            >
              Quero o Plano Básico
            </button>
          </article>

          <article className="completeCard">
            <div className="featuredBadge">Mais recomendado</div>
            <div className="planTopline">PLANO COMPLETO</div>
            <h3>Plano Completo</h3>
            <p className="planSub">Para ter o material completo com bônus</p>
            <ImageBlock
              src={completeOfferImage}
              alt="Plano completo com +250 técnicas e quatro bônus"
              className="planProductImage"
            />
            <div className="priceAnchor">
              <span>De R$97,00</span>, por:
            </div>
            <div className="completePrice">R$ 27,90</div>
            <ul className="planList completeList">
              {completeItems.map((item) => (
                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <img
              className="checkoutTrustImage"
              src={IMAGES.checkoutTrust}
              alt="Compra segura e garantia"
              loading="lazy"
              decoding="async"
            />
            <CTA
              className="completeCta pulseCta"
              href={CHECKOUTS.completeFull}
              onClick={markCheckoutClick}
            >
              Quero o Plano Completo
            </CTA>
          </article>
        </section>

        <section className="section guarantee reveal">
          <img
            className="guaranteeSeal"
            src={IMAGES.guaranteeSeal}
            alt="Selo de garantia de 7 dias"
            loading="lazy"
            decoding="async"
          />
          <h2>Garantia simples de 7 dias</h2>
          <p>
            Você tem 7 dias para acessar o material com tranquilidade. Se não for o que esperava, é
            só solicitar o reembolso dentro do prazo.
          </p>
        </section>

        <section className="section faq reveal">
          <h2>Perguntas frequentes</h2>
          <div className="faqStack">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="finalCta reveal">
          <h2>Termine a faxina com mais rapidez, menos esforço e sem voltar ao mesmo lugar</h2>
          <p>+250 técnicas visuais e 4 bônus para deixar sua rotina mais leve e organizada.</p>
          <CTA className="pulseCta" onClick={handlePlansClick}>
            Quero acessar o material
          </CTA>
        </section>
      </main>
      {showFloatingActions && <FloatingActions onPlansClick={handlePlansClick} />}
      {isBasicUpsellOpen && (
        <BasicPlanUpsellModal
          onClose={() => setIsBasicUpsellOpen(false)}
          onCheckout={markCheckoutClick}
        />
      )}
    </>
  );
}

export default function App() {
  return <LandingPage />;
}

import React, { useEffect, useRef, useState } from 'react';
import { CHECKOUTS, IMAGES } from './config/offer.js';

const completeOfferImage = IMAGES.completePlan;

const audienceCards = [
  [
    'Para diaristas e faxineiras',
    'Que querem consultar técnicas simples antes, durante ou depois da faxina.'
  ],
  [
    'Para quem faz limpeza completa',
    'Com técnicas para banheiro, cozinha, quartos, salas, pisos, vidros e finalização.'
  ],
  [
    'Para quem atende casas, apartamentos e escritórios',
    'Com orientações para ambientes residenciais e comerciais leves.'
  ],
  [
    'Para quem quer evitar retrabalho',
    'Com técnicas para seguir uma ordem melhor e não esquecer detalhes importantes.'
  ]
];

const materialItems = [
  [
    '+250 técnicas de limpeza profissional',
    'Técnicas práticas separadas em 10 módulos para limpeza residencial e comercial leve.'
  ],
  [
    'Técnicas por ambiente',
    'Banheiros, cozinha, quartos, salas, pisos, vidros, escritórios e pós-obra leve.'
  ],
  [
    'Técnicas de organização da faxina',
    'Orientações para seguir uma ordem melhor, evitar retrabalho e revisar o serviço.'
  ],
  [
    'Técnicas de cuidado e segurança',
    'Cuidados com panos, produtos, superfícies delicadas, ventilação e uso seguro.'
  ],
  [
    'Material pronto para imprimir',
    'Você pode baixar, imprimir e consultar sempre que precisar.'
  ]
];

const bonuses = [
  {
    title: 'Calculadora para saber quanto cobrar pela faxina',
    text: 'Uma tabela simples para ajudar você a calcular o valor do serviço sem cobrar no chute, considerando tempo, transporte, materiais e dificuldade da limpeza.',
    image: IMAGES.bonusCalculator,
    value: 'Bônus 01'
  },
  {
    title: 'Agenda da semana para anotar seus clientes',
    text: 'Folhas prontas para organizar clientes, horários, valores combinados, pagamentos e observações da semana.',
    image: IMAGES.bonusAgenda,
    value: 'Bônus 02'
  },
  {
    title: 'Artes prontas para divulgar sua faxina',
    text: 'Modelos visuais para divulgar seus serviços no WhatsApp, Instagram e grupos de bairro, de forma mais bonita e profissional.',
    image: IMAGES.bonusArts,
    value: 'Bônus 03'
  },
  {
    title: 'Certificado de Conclusão',
    text: 'Um certificado bonito para preencher, imprimir ou salvar ao terminar o material.',
    image: IMAGES.bonusCertificate,
    value: 'Bônus 04'
  }
];

const basicItems = [
  ['yes', '+250 técnicas de limpeza profissional']
];

const completeItems = [
  '+250 técnicas de limpeza profissional',
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
    'Preciso ter experiência com limpeza profissional?',
    'Não. O material usa linguagem simples e foi feito para facilitar a consulta no dia a dia.'
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
    'Sim. O foco principal é limpeza residencial e comercial leve.'
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

function getBrasiliaRemaining() {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hours = Number(values.hour === '24' ? 0 : values.hour);
  const minutes = Number(values.minute);
  const seconds = Number(values.second);
  const elapsed = hours * 3600 + minutes * 60 + seconds;
  return Math.max(0, 86400 - elapsed);
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

function CountdownBar() {
  const [remaining, setRemaining] = useState(getBrasiliaRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = getBrasiliaRemaining();
      setRemaining(next === 0 ? 86400 : next);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

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

function ExitPlanList({ items }) {
  return (
    <ul className="exitPlanList">
      {items.map(([type, text]) => (
        <li className={type === 'no' ? 'notIncluded' : ''} key={text}>
          <span>{type === 'no' ? '×' : '✓'}</span>
          {text}
        </li>
      ))}
    </ul>
  );
}

function ExitOfferPage({ onContinue }) {
  const completeExitItems = completeItems.map((item) => ['yes', item]);

  const handleCheckoutClick = () => {
    window.sessionStorage.setItem('checkout-clicked', 'true');
  };

  return (
    <>
      <CountdownBar />
      <main className="exitPageShell">
        <section className="exitPageHero reveal isVisible">
          <p className="modalKicker">Opção especial</p>
          <h1>Antes de sair, veja esta opção especial</h1>
          <p className="subheadline">Você ainda pode garantir o material com desconto hoje.</p>
        </section>

        <section className="exitPagePlans">
          <article className="exitBasicPlan">
            <h3>Básico com desconto</h3>
            <p>+250 técnicas de limpeza profissional</p>
            <div className="exitOldPrice">De R$ 10,00</div>
            <div className="exitPrice darkText">R$ 5,90</div>
            <ExitPlanList items={basicItems} />
            <a
              className="exitBasicButton"
              href={CHECKOUTS.basicDownsell}
              onClick={handleCheckoutClick}
            >
              Garantir Plano Básico
            </a>
          </article>

          <article className="exitCompletePlan">
            <div className="featuredBadge">Mais recomendado</div>
            <h3>Completo com desconto</h3>
            <p>+250 técnicas + 4 bônus</p>
            <img
              className="exitProductImage"
              src={completeOfferImage}
              alt="Plano completo com material e bônus"
              loading="lazy"
              decoding="async"
            />
            <div className="exitOldPrice light">De R$ 27,90</div>
            <div className="exitPrice">R$ 17,90</div>
            <small>Oferta especial antes de sair</small>
            <ExitPlanList items={completeExitItems} />
            <a
              className="exitCompleteButton"
              href={CHECKOUTS.completeDownsell}
              onClick={handleCheckoutClick}
            >
              Garantir Plano Completo
            </a>
          </article>
        </section>

        {onContinue ? (
          <button className="exitReturnLink" type="button" onClick={onContinue}>
            Continuar navegando
          </button>
        ) : (
          <a className="exitReturnLink" href="/">
            Continuar navegando
          </a>
        )}
      </main>
    </>
  );
}

function LandingPage() {
  const isExitOfferPage = false;
  const [isBasicUpsellOpen, setIsBasicUpsellOpen] = useState(false);
  const [hasClickedCheckout, setHasClickedCheckout] = useState(false);
  const [showExitOfferPage, setShowExitOfferPage] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const suppressExitUntilRef = useRef(0);

  const markCheckoutClick = () => {
    setHasClickedCheckout(true);
    window.sessionStorage.setItem('checkout-clicked', 'true');
  };

  const suppressExitIntent = (duration = 1800) => {
    const until = Date.now() + duration;
    suppressExitUntilRef.current = until;
    window.sessionStorage.setItem('suppress-exit-until', String(until));
  };

  const handlePlansClick = (event) => {
    event.preventDefault();
    suppressExitIntent(2200);
    window.history.replaceState(window.history.state, '', '#checkout');
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const redirectToExitOffer = () => {
    const alreadyRedirected = window.sessionStorage.getItem('exit-redirect-used') === 'true';
    const checkoutClicked =
      hasClickedCheckout || window.sessionStorage.getItem('checkout-clicked') === 'true';
    const suppressedUntil = Math.max(
      suppressExitUntilRef.current,
      Number(window.sessionStorage.getItem('suppress-exit-until') || 0)
    );

    if (
      isExitOfferPage ||
      alreadyRedirected ||
      checkoutClicked ||
      isBasicUpsellOpen ||
      showExitOfferPage ||
      Date.now() < suppressedUntil
    ) {
      return false;
    }

    window.sessionStorage.setItem('exit-redirect-used', 'true');
    setShowExitOfferPage(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return true;
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
  }, [isBasicUpsellOpen, showExitOfferPage]);

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

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (event.clientY <= 10) redirectToExitOffer();
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasClickedCheckout, isBasicUpsellOpen, showExitOfferPage]);

  useEffect(() => {
    const stateKey = 'landing-exit-guard';

    if (!window.history.state?.[stateKey]) {
      window.history.pushState({ [stateKey]: true }, '', window.location.href);
    }

    const handlePopState = () => redirectToExitOffer();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasClickedCheckout, isBasicUpsellOpen, showExitOfferPage]);

  if (showExitOfferPage) {
    return <ExitOfferPage onContinue={() => setShowExitOfferPage(false)} />;
  }

  return (
    <>
      <CleaningProgress />
      <CountdownBar />
      <main className="mobileShell">
        <section className="hero reveal">
          <div className="heroCopy">
            <h1>
              <span>+250 técnicas de limpeza profissional</span> prontas para imprimir e usar no
              dia a dia
            </h1>
            <ImageBlock
              src={IMAGES.hero}
              alt="Material digital de técnicas de limpeza profissional"
              className="heroImage"
              loading="eager"
              fetchPriority="high"
            />
            <div className="heroActions">
              <CTA className="pulseCta" onClick={handlePlansClick}>
                Acessar as técnicas
              </CTA>
              <a className="secondaryHeroLink" href="#recebe" onClick={suppressExitIntent}>
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

        <section className="section demoSection reveal">
          <h2>Visual, organizado e pronto para imprimir</h2>
          <p>
            As páginas foram pensadas para serem simples de entender, com técnicas curtas, separadas
            por ambiente e fáceis de consultar durante a rotina de limpeza.
          </p>
          <ImageBlock
            src={IMAGES.visual}
            alt="Páginas internas do material de limpeza prontas para imprimir"
            className="demoImage"
          />
          <div className="pillRow">
            <span>Fácil de consultar</span>
            <span>Fácil de imprimir</span>
            <span>Fácil de aplicar</span>
          </div>
        </section>

        <section className="section receiveSection reveal" id="recebe">
          <p className="sectionKicker">O material principal</p>
          <h2>O que você recebe no material</h2>
          <div className="receiveGrid">
            {materialItems.map(([title, text]) => (
              <article className="receiveCard" key={title}>
                <span>✓</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section bonusSection reveal">
          <p className="sectionKicker">Bônus do plano completo</p>
          <h2>Além das +250 técnicas, você também recebe 4 bônus</h2>
          <div className="bonusStack">
            {bonuses.map((bonus) => (
              <article className="bonusCard" key={bonus.title}>
                <ImageBlock src={bonus.image} alt={bonus.title} className="bonusImage" />
                <span className="bonusNumber">{bonus.value}</span>
                <p>{bonus.text}</p>
              </article>
            ))}
          </div>
        </section>

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
          <h2>Tenha um material pronto para consultar, imprimir e usar na rotina de limpeza</h2>
          <p>+250 técnicas visuais e 4 bônus para deixar seu dia a dia mais organizado.</p>
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
  const isExitOfferPage = window.location.pathname.replace(/\/+$/, '') === '/oferta-especial';

  if (isExitOfferPage) {
    return <ExitOfferPage />;
  }

  return <LandingPage />;
}

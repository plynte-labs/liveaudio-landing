/**
 * features.ts — i18n strings for the FeaturesGrid island (6 interactive sandboxes).
 *
 * EVERY user-visible string lives here as { en, es } so ZERO Spanish leaks onto
 * the EN page (the OLD src/features/landing/components/FeaturesGrid.tsx hardcoded
 * ~28 Spanish literals: preset names Rápido/Balanceado, "Esperando audio",
 * device names, "[PANTALLA CONGELADA...]", etc.).
 *
 * Fact-checked against the product spec (v1.2.0):
 *   - Profiles: Fast / Balanced / Quality / Stable Streaming. FPS-aware,
 *     never "no FPS drops". Stable Streaming = "reduces GPU
 *     load while gaming" — no third-party game name.
 *   - Whisper models: tiny / base / small / turbo. Per-model VRAM/latency
 *     are SIMULATED — every such metric carries an amber sim-label.
 *   - Blacklist defaults = config.json.example list VERBATIM — NOT invented
 *     words.
 *   - Backlog policy: Auto / Live only / Send all — controls only what shows
 *     live in OBS; everything valid is always saved.
 *   - Hot-swap device/model without restart. Loopback is Windows-only
 *     → amber flag on the loopback device.
 *   - Silero VAD trims silence. GPU optional; CPU works; CUDA driver ≥525,
 *     VRAM ≥4 GiB. Latency "well under a second", never
 *     "milliseconds".
 */

export type Lang = "en" | "es";

export interface FeaturesStrings {
  // Section header
  eyebrow: string;
  title: string;
  subtitle: string;

  // Left rail
  cards: [string, string][]; // [title, description] per sandbox, in order 0..5
  activePanelLabel: string; // mono footer label on the left rail
  runtimeNote: string; // small line under the section header

  // Shared / chrome
  simLabel: string; // amber "(Simulated / illustrative)"
  simBannerNote: string; // plain sentence beside the top-of-section sim banner
  illustrative: string; // amber inline "illustrative" qualifier
  waitingForAudio: string;

  // Sandbox 0 — Profiles (Fast / Balanced / Quality / Stable Streaming)
  profiles: {
    title: string;
    description: string;
    kicker: string; // tile-kicker mono
    presetNames: { fast: string; balanced: string; quality: string; stable: string };
    presetSubs: { fast: string; balanced: string; quality: string; stable: string };
    presetDescs: { fast: string; balanced: string; quality: string; stable: string };
    metricLatency: string;
    metricVram: string;
    metricVadCutoff: string;
    statusLabel: string;
    statusReady: string;
    statusRunning: string;
    run: string;
    fpsNote: string; // "FPS-aware preset" caption
  };

  // Sandbox 1 — Whisper models (tiny / base / small / turbo)
  models: {
    title: string;
    description: string;
    kicker: string;
    vramLabel: string; // "GPU VRAM footprint"
    computeLabel: string; // "Inference compute"
    computeValues: { tiny: string; base: string; small: string; turbo: string };
    tipLabel: string;
    tipTurbo: string;
    tipSmall: string;
  };

  // Sandbox 2 — Hallucination blacklist
  blacklist: {
    title: string;
    description: string;
    kicker: string;
    termsLabel: string;
    rawLabel: string;
    outputLabel: string;
    empty: string;
    loading: string;
    filteredToken: string; // replacement marker e.g. [FILTERED]
    loadDemo: string;
    filter: string;
    // illustrative demo strings (labeled illustrative in the UI)
    demoTerms: string; // = config.json.example list (joined)
    demoRaw: string; // a sample raw Whisper line containing demo terms
  };

  // Sandbox 3 — OBS backlog policy (Auto / Live only / Send all)
  backlog: {
    title: string;
    description: string;
    kicker: string;
    policyNames: { auto: string; live_only: string; send_all: string };
    bufferLabel: string; // ASR buffer column
    obsLabel: string; // OBS output column
    bufferEmpty: string;
    frozen: string; // "SCREEN FROZEN — catching up"
    freeze: string; // button
    catchUp: string; // button
    savedNote: string; // "everything valid is always saved"
    // illustrative backlog lines
    demoLines: string[];
    liveOnlyResult: string; // shown after catch-up under Live only policy
  };

  // Sandbox 4 — Hot-swap devices
  devices: {
    title: string;
    description: string;
    kicker: string;
    listLabel: string;
    placeholder: string;
    add: string;
    activeLabel: string;
    // illustrative device names; loopback entry is flagged Windows-only
    list: string[];
    loopbackIndex: number; // which entry carries the amber Windows-only flag
    loopbackFlag: string; // "loopback — Windows only"
  };

  // Sandbox 5 — Silero VAD
  vad: {
    title: string;
    description: string;
    kicker: string;
    speechLabel: string; // "Normal speech"
    speechSub: string;
    noiseLabel: string; // "Desk bang / click"
    noiseSub: string;
    empty: string;
    inputSignal: string;
    speechName: string; // illustrative captured speech line
    noiseName: string; // illustrative captured noise line
    passed: string;
    blocked: string;
    passedNote: string;
    blockedNote: string;
    footer: string; // "Powered by Silero VAD (local)"
  };
}

export const features: Record<Lang, FeaturesStrings> = {
  en: {
    eyebrow: "// interactive sandboxes",
    title: "Six controls, six live sandboxes.",
    subtitle:
      "Every LiveAudio setting maps to a knob you can feel before you download. Profiles, Whisper models, the hallucination blacklist, OBS backlog policy, hot-swap devices, and Silero VAD — try each one below.",
    cards: [
      ["Profiles", "Fast, Balanced, Quality, Stable Streaming — FPS-aware presets you switch on the fly."],
      ["Whisper models", "tiny, base, small, turbo. Trade footprint for accuracy; swap without restarting."],
      ["Hallucination blacklist", "An editable list strips Whisper's filler phrases before they reach OBS."],
      ["OBS backlog policy", "Auto, Live only, or Send all — decide what shows live when the engine catches up."],
      ["Hot-swap devices", "Change mic or system audio mid-stream — no restart, no dropped captions."],
      ["Silero VAD", "Voice activity detection gates the stream so silence never wakes Whisper."],
    ],
    activePanelLabel: "sandbox active",
    runtimeNote: "Pick a control on the left to open its sandbox.",
    simLabel: "Simulated / illustrative",
    simBannerNote:
      "These sandboxes are an interactive preview — they mimic the controls, not the live app. Numbers shown are illustrative.",
    illustrative: "illustrative",
    waitingForAudio: "Waiting for audio…",
    profiles: {
      title: "FPS-aware profiles",
      description:
        "Fast, Balanced, Quality, and Stable Streaming retune latency, model, and silence gate together. Editing a built-in makes a Custom profile; apply changes to activate.",
      kicker: "// profiles",
      presetNames: { fast: "Fast", balanced: "Balanced", quality: "Quality", stable: "Stable Streaming" },
      presetSubs: {
        fast: "Low latency / tiny",
        balanced: "Recommended / small",
        quality: "Higher accuracy / turbo",
        stable: "FPS-safe while gaming / small",
      },
      presetDescs: {
        fast: "Tuned for the lowest practical latency.",
        balanced: "The recommended balance of speed and accuracy.",
        quality: "Higher accuracy with the larger model — more VRAM.",
        stable: "Reduces GPU load so you keep frames while gaming.",
      },
      metricLatency: "Latency",
      metricVram: "VRAM",
      metricVadCutoff: "VAD cutoff",
      statusLabel: "status",
      statusReady: "ready",
      statusRunning: "measuring…",
      run: "Run latency test",
      // Builder guidance (do NOT surface on screen): never claim "no FPS drops";
      // present the FPS-aware presets as the positive capability instead (§9 row 5).
      fpsNote: "FPS-aware presets: Fast / Balanced / Quality / Stable Streaming.",
    },
    models: {
      title: "Whisper model footprint",
      description:
        "tiny, base, small, and turbo trade resource footprint for accuracy. Documented install footprint is ~400 MB CPU / ~2.5 GB CUDA; per-model VRAM below is illustrative.",
      kicker: "// models",
      vramLabel: "GPU VRAM footprint",
      computeLabel: "Inference compute",
      computeValues: {
        tiny: "Fastest",
        base: "Fast",
        small: "Balanced",
        turbo: "Most precise",
      },
      tipLabel: "Sizing tip",
      tipTurbo:
        "GPU is optional and CPU works. CUDA is auto-detected and recommended (driver ≥ 525, VRAM ≥ 4 GiB). turbo is the largest model.",
      tipSmall:
        "small / base is the streamer sweet spot: fast transcription, modest footprint. GPU optional — CPU works fine.",
    },
    blacklist: {
      title: "Hallucination blacklist",
      description:
        "Whisper sometimes emits filler from training data. An editable, comma-separated blacklist strips those phrases before captions reach OBS.",
      kicker: "// blacklist",
      termsLabel: "Blacklist terms (comma-separated)",
      rawLabel: "Raw Whisper output",
      outputLabel: "OBS caption output",
      empty: "Load the demo and run the filter to see blacklisted phrases removed.",
      loading: "filtering…",
      filteredToken: "[filtered]",
      loadDemo: "Load demo",
      filter: "Filter captions",
      // config.json.example default blacklist — VERBATIM (from the product spec). Spanish on purpose.
      demoTerms:
        "amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor",
      demoRaw:
        "amara.org subtítulos por la comunidad — gracias por ver, suscríbete y dale like",
    },
    backlog: {
      title: "OBS backlog policy",
      description:
        "When the engine falls behind, the backlog policy controls only what shows live in OBS — everything valid is always saved to your session files.",
      kicker: "// backlog",
      policyNames: { auto: "Auto", live_only: "Live only", send_all: "Send all" },
      bufferLabel: "ASR buffer",
      obsLabel: "OBS output",
      bufferEmpty: "Buffer empty",
      frozen: "SCREEN FROZEN — catching up",
      freeze: "Simulate freeze",
      catchUp: "Catch up",
      savedNote: "Live policy only changes the OBS view — every valid line is still saved.",
      demoLines: [
        "okay we are live everyone",
        "welcome to the stream today",
        "let's get this run started",
      ],
      liveOnlyResult: "let's get this run started (older lines dropped from OBS, still saved)",
    },
    devices: {
      title: "Hot-swap devices",
      description:
        "Switch microphone or system audio without restarting. Pick the active input; the engine swaps capture live with no dropped captions.",
      kicker: "// hot-swap",
      listLabel: "Available inputs",
      placeholder: "Add a simulated device…",
      add: "Add",
      activeLabel: "Active input",
      list: [
        "Microphone (Realtek Audio)",
        "System audio (WASAPI loopback)",
        "Headset mic (USB)",
      ],
      loopbackIndex: 1,
      loopbackFlag: "loopback — Windows only",
    },
    vad: {
      title: "Silero VAD gate",
      description:
        "Silero VAD trims silence and non-speech so Whisper only runs on real voice. v1.2.0 adds a configurable onset pre-roll and VAD threshold.",
      kicker: "// silero vad",
      speechLabel: "Normal speech",
      speechSub: "16 kHz voice stream",
      noiseLabel: "Desk bang / click",
      noiseSub: "Mechanical noise",
      empty: "Send a signal to see the VAD gate pass speech and block noise.",
      inputSignal: "Input signal",
      speechName: "Streamer speaking (\"hey everyone, how's it going?\")",
      noiseName: "Mug knock / sharp desk tap",
      passed: "Passed",
      blocked: "Blocked",
      passedNote: "Speech detected — chunk dispatched to the Whisper engine.",
      blockedNote: "Below threshold — Whisper inference skipped; no compute spent.",
      footer: "Powered by the local Silero VAD model.",
    },
  },

  es: {
    eyebrow: "// sandboxes interactivos",
    title: "Seis controles, seis sandboxes en vivo.",
    subtitle:
      "Cada ajuste de LiveAudio es una perilla que podés probar antes de descargar. Perfiles, modelos Whisper, la blacklist de alucinaciones, la política de backlog de OBS, cambio de dispositivos en caliente y Silero VAD — probá cada uno abajo.",
    cards: [
      ["Perfiles", "Fast, Balanced, Quality, Stable Streaming — presets que tienen en cuenta los FPS y cambiás al vuelo."],
      ["Modelos Whisper", "tiny, base, small, turbo. Cambiás huella por precisión, sin reiniciar."],
      ["Blacklist de alucinaciones", "Una lista editable quita las muletillas de Whisper antes de que lleguen a OBS."],
      ["Política de backlog de OBS", "Auto, Live only o Send all — decidís qué se muestra en vivo cuando el motor se pone al día."],
      ["Dispositivos en caliente", "Cambiás micrófono o audio del sistema en medio del stream — sin reiniciar, sin perder subtítulos."],
      ["Silero VAD", "La detección de actividad de voz filtra el stream para que el silencio nunca despierte a Whisper."],
    ],
    activePanelLabel: "sandbox activo",
    runtimeNote: "Elegí un control a la izquierda para abrir su sandbox.",
    simLabel: "Simulado / ilustrativo",
    simBannerNote:
      "Estos sandboxes son una vista previa interactiva — imitan los controles, no la app real. Los números mostrados son ilustrativos.",
    illustrative: "ilustrativo",
    waitingForAudio: "Esperando audio…",
    profiles: {
      title: "Perfiles que consideran los FPS",
      description:
        "Fast, Balanced, Quality y Stable Streaming reajustan latencia, modelo y filtro de silencio en conjunto. Editar uno integrado crea un perfil Custom; aplicá los cambios para activarlo.",
      kicker: "// perfiles",
      presetNames: { fast: "Fast", balanced: "Balanced", quality: "Quality", stable: "Stable Streaming" },
      presetSubs: {
        fast: "Baja latencia / tiny",
        balanced: "Recomendado / small",
        quality: "Mayor precisión / turbo",
        stable: "Cuida los FPS al jugar / small",
      },
      presetDescs: {
        fast: "Ajustado para la menor latencia práctica.",
        balanced: "El balance recomendado entre velocidad y precisión.",
        quality: "Mayor precisión con el modelo más grande — más VRAM.",
        stable: "Reduce la carga de GPU para mantener FPS mientras jugás.",
      },
      metricLatency: "Latencia",
      metricVram: "VRAM",
      metricVadCutoff: "Corte VAD",
      statusLabel: "estado",
      statusReady: "listo",
      statusRunning: "midiendo…",
      run: "Probar latencia",
      // Guía interna (NO mostrar en pantalla): nunca afirmar "sin caídas de FPS";
      // presentar los presets sensibles a los FPS como la capacidad positiva (§9 fila 5).
      fpsNote: "Presets sensibles a los FPS: Fast / Balanced / Quality / Stable Streaming.",
    },
    models: {
      title: "Huella de los modelos Whisper",
      description:
        "tiny, base, small y turbo cambian huella de recursos por precisión. La huella de instalación documentada es ~400 MB en CPU / ~2.5 GB en CUDA; la VRAM por modelo de abajo es ilustrativa.",
      kicker: "// modelos",
      vramLabel: "Huella de VRAM en GPU",
      computeLabel: "Cómputo de inferencia",
      computeValues: {
        tiny: "El más rápido",
        base: "Rápido",
        small: "Balanceado",
        turbo: "El más preciso",
      },
      tipLabel: "Recomendación",
      tipTurbo:
        "La GPU es opcional y la CPU funciona. CUDA se detecta solo y es recomendado (driver ≥ 525, VRAM ≥ 4 GiB). turbo es el modelo más grande.",
      tipSmall:
        "small / base es el punto justo para streamers: transcripción rápida, huella moderada. GPU opcional — la CPU anda bien.",
    },
    blacklist: {
      title: "Blacklist de alucinaciones",
      description:
        "Whisper a veces emite muletillas de su entrenamiento. Una blacklist editable, separada por comas, quita esas frases antes de que los subtítulos lleguen a OBS.",
      kicker: "// blacklist",
      termsLabel: "Términos de la blacklist (separados por coma)",
      rawLabel: "Salida cruda de Whisper",
      outputLabel: "Salida de subtítulos en OBS",
      empty: "Cargá el demo y ejecutá el filtro para ver cómo se quitan las frases de la blacklist.",
      loading: "filtrando…",
      filteredToken: "[filtrado]",
      loadDemo: "Cargar demo",
      filter: "Filtrar subtítulos",
      // config.json.example default blacklist — VERBATIM (from the product spec).
      demoTerms:
        "amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor",
      demoRaw:
        "amara.org subtítulos por la comunidad — gracias por ver, suscríbete y dale like",
    },
    backlog: {
      title: "Política de backlog de OBS",
      description:
        "Cuando el motor se atrasa, la política de backlog controla solo lo que se muestra en vivo en OBS — todo lo válido siempre se guarda en tus archivos de sesión.",
      kicker: "// backlog",
      policyNames: { auto: "Auto", live_only: "Live only", send_all: "Send all" },
      bufferLabel: "Búfer del ASR",
      obsLabel: "Salida de OBS",
      bufferEmpty: "Búfer vacío",
      frozen: "PANTALLA CONGELADA — poniéndose al día",
      freeze: "Simular congelamiento",
      catchUp: "Ponerse al día",
      savedNote: "La política solo cambia la vista de OBS — cada línea válida igual se guarda.",
      demoLines: [
        "bien, estamos en vivo gente",
        "bienvenidos al stream de hoy",
        "arranquemos esta partida",
      ],
      liveOnlyResult: "arranquemos esta partida (líneas viejas descartadas de OBS, igual guardadas)",
    },
    devices: {
      title: "Dispositivos en caliente",
      description:
        "Cambiá micrófono o audio del sistema sin reiniciar. Elegí la entrada activa; el motor cambia la captura en vivo sin perder subtítulos.",
      kicker: "// hot-swap",
      listLabel: "Entradas disponibles",
      placeholder: "Agregar un dispositivo simulado…",
      add: "Agregar",
      activeLabel: "Entrada activa",
      list: [
        "Micrófono (Realtek Audio)",
        "Audio del sistema (WASAPI loopback)",
        "Micrófono de auriculares (USB)",
      ],
      loopbackIndex: 1,
      loopbackFlag: "loopback — solo Windows",
    },
    vad: {
      title: "Filtro Silero VAD",
      description:
        "Silero VAD recorta el silencio y el ruido para que Whisper solo corra con voz real. v1.2.0 agrega un pre-roll de inicio y un umbral VAD configurables.",
      kicker: "// silero vad",
      speechLabel: "Voz normal",
      speechSub: "Stream de voz a 16 kHz",
      noiseLabel: "Golpe / clic en el escritorio",
      noiseSub: "Ruido mecánico",
      empty: "Enviá una señal para ver al filtro VAD dejar pasar la voz y bloquear el ruido.",
      inputSignal: "Señal de entrada",
      speechName: "Streamer hablando (\"hola a todos, ¿cómo va?\")",
      noiseName: "Golpe de taza / toque seco en el escritorio",
      passed: "Aceptada",
      blocked: "Bloqueada",
      passedNote: "Voz detectada — fragmento enviado al motor Whisper.",
      blockedNote: "Bajo el umbral — se omite la inferencia de Whisper; cero cómputo gastado.",
      footer: "Con tecnología del modelo local Silero VAD.",
    },
  },
};

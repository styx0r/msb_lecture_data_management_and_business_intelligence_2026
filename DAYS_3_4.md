# Ablaufplan Blocktag 3 und 4 (Entwurf 2026-10-28, Stand 2026-11-06)

Stand: Tag 1 (Do 2026-10-15) und Tag 2 (Mo 2026-10-19) sind gelaufen. Es bleiben
**Sa 2026-11-14** und **Mo 2026-11-16**, jeweils 9:00-17:45.

Noch offen: **Data Management** (37 Slides, am Tag 2 nicht mehr geschafft), A/B-Testing (42),
Introduction to AI (41), Neural Networks (31), Generative AI & Agents (55) plus die zugehörigen Labs.
Annahme: mit "Data Architectures" ist das Deck `slides/data_management` (Data Management Architectures:
Warehouse, Lake, Lakehouse, ETL, dbt) gemeint, nicht `slides/database_architectures` (112 Slides, war Tag 2).
Das ist ohne Interaktion schon voll. Deshalb gilt für beide Tage: **jedes interaktive
Format ersetzt Vortragszeit**, nichts kommt obendrauf. Vortragsanteil des Dozenten
pro Block max. 45-50 min am Stück (siehe PLAN_2026.md, Punkt 6).

Annahmen (bitte prüfen):
- ca. 15-20 Teilnehmende, **6 Gruppen à 2-3 Personen**. Gruppen vom Tag 1 wiederverwenden,
  falls die Einteilung noch existiert, sonst am 14.11. um 9:00 neu losen. Ausnahme: der Data-Management-Block
  (Expertengruppen und Kosten-Wettbewerb) läuft mit **vier neuen Gruppen**, eine pro Architektur.
- Mini-Vorträge und Streitgespräche zählen als Teilnahme, nicht als Note (Klausur ist MC).
- Vergabe der Mini-Vortragsthemen **per Mail bis spätestens Fr 2026-10-30**, damit zwei
  Wochen Vorbereitung bleiben.

Pausenraster an beiden Tagen: Vormittagspause ca. 10:15 (Tag 3: 10:49, 15 min), 12:30 Mittag (60 min), Nachmittagspause ca. 15:00-15:15 (15 min).

---

## Tag 3: Sa 2026-11-14 — Data Management + A/B-Testing

Data Management kommt an den Anfang (Anschluss an Tag 2, frische Köpfe) und ist komplett auf "erst machen,
dann benennen" umgebaut: drei Doing-Blöcke, Dozent redet in 110 min ca. 20 min. Introduction to AI ist
komplett auf Tag 4 gewandert (Stand 2026-11-06), dort eingedampft auf Use-Case-Pitch und k-means-Übung. Dafür
bekommt Tag 3 den ersten Teil des Prüfungs-Quiz. Der Tag endet planmäßig 16:20, die 25 min bis 16:45 sind
Reserve für die Expertenrunde und das Review Board, die erfahrungsgemäß überziehen. Wer bis 17:45 füllen will:
Intro to AI Teil 1 (Timeline, Eras, Symbolic AI, 35 min) passt vor das Streitgespräch, siehe Tag 4.

| Zeit | Dauer | Format | Inhalt | Material |
|---|---|---|---|---|
| 09:00 | 10 | **Team-Quiz** | Rückblick Tag 1+2: 8 Fragen aus dem Mock Exam (BI, Datenbanken), Gruppen antworten per Handzeichen, Punktestand an der Tafel | `exam/mock_exam.md` |
| 09:10 | 5 | Einstieg | Data Management: "Where are we?" (SVG, Warehouse-Ebene markiert, AI über alle Ebenen), Frage des Tages: zwischen Annas Bestellung und dem Dashboard, wo liegen die Daten? Agenda "heute macht ihr drei Dinge" | `slides/data_management` |
| 09:15 | 20 | **Doing 1: ETL von Hand (Paare, Colab)** | Rohtabellen (Klicks, Bestellungen) zu Staging-Tabellen und Dashboard-Mart umbauen, 12 min Timer, LLM ausdrücklich erlaubt (steht auf der Slide und im Notebook, jeder Schritt hat einen Hinweis mit der Funktion). Danach Lösung: "What is messy" (ANSWER), "How to approach it" (Methode: Typen anschauen, Grain, Typen fixen, groupby, merge, Check), dann pro Task eine ANSWER-Slide mit Code, der schrittweise hervorgehoben wird (Pfeiltaste), "What you just did has names" (ETL, Staging, Mart, Warehouse), "Monday 9:00" (vier Pannen aus der Übung, wo fängt man sie?), guter ETL-Prozess (Tabelle mit Verortung raw/staging/mart), dbt auf zwei Slides (Dateien + SQL, Lineage + Tests-YAML), max. 10 min Dozent. Papier-Variante als Fallback | `colab/data_management_etl.ipynb` |
| 09:35 | 42 | **Doing 2: Expertengruppen** | Vorab 3 min "Four architectures, one legend" (Warehouse-Bild von vorhin neben der Legende: Speicher, Zahnrad, Pfeile; die drei folgenden Bilder unterscheiden sich nur in wo gespeichert und wann transformiert). Jede Gruppe ein Briefing (Bild + vier Fakten, im Deck unter ihrer Architektur) plus eine Transferfrage, die das Briefing nicht beantwortet (Antworten auf versteckten ANSWER-Slides, Schalter `SHOW_SOLUTIONS` im Deck). Dafür vier neue Gruppen, durchnummeriert 1 bis 4 (1 Warehouse, 2 Lake, 3 Hybrid, 4 Lakehouse, abzählen im Raum). 15 min Vorbereitung, LLM erlaubt, je 5 min pro Architektur am Screen (Bild lesen, Frage, Stärke/Schwäche, Firma), Zuhörer notieren Stärke/Schwäche pro Architektur. Dozent korrigiert max. 4 min, dann Slide "The four at a glance" | `slides/data_management`, vertikale Stacks |
| 10:17 | 25 | **Doing 3: Architektur-Wettbewerb (Gruppen, Colab)** | Gleiche vier Gruppen wie in Doing 2. Jede Gruppe rechnet nur die 2-Jahres-Kosten ihrer eigenen Architektur (10 min), Zahlen an die Tafel, dann je 2 min Empfehlung mit der Regel "nicht die eigene", ein Kosten- und ein Nicht-Kosten-Argument. Referenzwerte auf der versteckten ANSWER-Slide | `colab/data_management_architecture.ipynb` |
| 10:42 | 7 | Zuruf + Brücke | "Spot the pattern": lyvy-Architektur, wo ist E/T/L, welche der vier? Dann eine Slide "AI at every layer" als Brücke zu Tag 4 und zum Streitgespräch, Takeaways. Realtime und Cloud vs. On-Premise nur als Selbststudium (Cloud ist prüfungsrelevant, Mock Exam 54/57) | |
| 10:49 | 15 | Pause | | |
| 11:04 | 40 | Vortrag + Live-Simulation | A/B-Testing Teil 1: "Where are we?" (gewohnter Stack, Analyse- und Entscheidungsebene markiert, dann OODA-Loop aus dem BI-Deck: A/B-Test sitzt in "Decide: testing hypotheses"), ShopNow-Checkout, Korrelation vs. Kausalität, Hypothese, Metriken, Noise (**live**: A/A-Simulator, Studierende stellen Nutzerzahl und Lift ein), p-Wert (**live**: Glockenkurve, Band = α, rote Fläche = p, Slider für den beobachteten Lift), Fehler 1./2. Art, Power (**live**: α/β/Power-Bild) | `slides/ab_testing` |
| 11:44 | 25 | Vortrag + Live-Simulation | A/B-Testing Teil 2: Fallzahl, Faustformel, Power-Kurve (**live**: Planer mit Baseline, MDE, Traffic, "days you have"), statsmodels, Randomize & Run, Peeking (**live**: p-Wert-Pfade, Peeking vs. einmal entscheiden) | `slides/ab_testing` |
| 12:09 | 21 | **Lab Teil 1 (Paare)** | ShopNow checkout experiment: Fallzahl planen, Experiment aufsetzen und simulieren. Das Warm-up-Notebook entfällt, die "Your turn"-Slide verweist stattdessen auf Aufgabe 1 des Labs. Wer nicht fertig wird, macht nach dem Essen weiter | `colab/ab_testing.ipynb` |
| 12:30 | 60 | Mittag | | |
| 13:30 | 15 | Vortrag + Live-Simulation | A/B-Testing Teil 3: Analyze (Proportionen), "Day 31" mit den drei Fragen des Business, Konfidenzintervall (**live**: das Band um unsere Zahl), Decide. Multiple Testing (**live**: Dashboard mit k Metriken) kommt beim Review Board | `slides/ab_testing` |
| 13:45 | 35 | **Lab Teil 2 (Paare)** | Peeken, auswerten, entscheiden. Zwei Paare zeigen ihr Ergebnis (je 2 min) | `colab/ab_testing.ipynb` |
| 14:20 | 40 | **Experiment Review Board** (ersetzt den Pitfalls-Vortrag) | Jede Gruppe bekommt eine Ergebniskarte und muss dem "Board" (Plenum) ship / no-ship empfehlen. 12 min Vorbereitung, je 3 min Vortrag + 1 min Rückfragen, Board stimmt ab. Dozent schließt mit den Pitfalls-Slides die Lücken (Multiple Testing, Novelty, Simpson, SRM), max. 5 min | Ergebniskarten (zu erstellen, siehe unten) |
| 15:00 | 15 | Pause | | |
| 15:15 | 30 | **Streitgespräch 1** | "In fünf Jahren braucht ShopNow keine BI-Analysten mehr, nur noch KI." Zwei Gruppen mit zugeloster Position (pro / contra), Rest ist Jury. 6 min Vorbereitung, je 2 min Eröffnung, 6 min Schlagabtausch, je 1 min Schlusswort, Jury stimmt vorher und nachher ab. Dozent moderiert nur, 3 Sätze Fazit. Munition: "AI at every layer" vom Vormittag und das Review Board | Leitfragen in den Sprechernotizen (zu ergänzen) |
| 15:45 | 20 | **Prüfungs-Quiz Teil 1 (Teams)** | 15 Fragen aus den Abschnitten BI, Datenbanken, Data Management und A/B-Testing des Mock Exam, Punktestand an der Tafel, bei strittigen Fragen kurze Erklärung. Teil 2 (AI-Module) am Tag 4 | `exam/mock_exam.md` |
| 16:05 | 15 | Abschluss | Ausblick Tag 4 (Intro AI mit Pitch und Live-Demos, Mini-Vorträge, Leaderboard), Reihenfolge der Mini-Vorträge bestätigen, Hausaufgabe nennen | |

Planmäßiges Ende 16:20, Reserve bis 16:45. Wenn der Vormittag überzieht, verschiebt sich alles nach hinten, es muss nichts gestrichen werden.

**Lösungen zeigen (Data-Management-Deck):** die Antworten zu allen Aufgaben liegen als versteckte Slides mit
ANSWER-Badge direkt unter der jeweiligen Aufgabe. Schalter: `const SHOW_SOLUTIONS = false;` ganz oben in
`slides/data_management/index.html`. Im Repo bleibt `false`, bis die Vorlesung durch ist (Studierende sehen 27 Slides), danach auf `true` setzen
und committen (38 Slides). **Zum Präsentieren lokal auf `true` stellen**, nicht committen: dann kannst du die ETL-Lösung
nach dem Timer Schritt für Schritt zeigen und die ANSWER-Slides der Expertengruppen einfach überspringen, bis sie dran
sind. Die Sprechernotizen (Taste `s`) enthalten nur noch Regie-Hinweise.

**Hausaufgabe bis Mo 16.11.:** `colab/introduction_ai.ipynb` Part A (A/B nach Kohorten, passt zu heute) und Part B
(Klassifikation) durcharbeiten. Part B ist die Grundlage für den Leaderboard-Wettbewerb am Tag 4; die Vorlesung dazu
kommt erst am Montagvormittag, das Notebook erklärt genug, um es vorher durchzuarbeiten.
Optional: Bonus-Aufgabe des Data-Management-Notebooks (Backup, Schema-Update).

Dozenten-Vortrag am Tag 3: ca. 2 h 10 min. Studierende aktiv: ca. 4 h 15 min.

---

## Tag 4: Mo 2026-11-16 — Introduction to AI (kompakt) + Neural Networks + Generative AI & Agents

Introduction to AI kommt als 75-min-Block an den Anfang (Deck am 2026-11-10 komplett neu gebaut, 27 Slides,
`slides/introduction_to_ai/index.html` + `ai.js`): Spiel "Is this AI?", Definition, Karte (AI > ML > DL > GenAI,
Symbolic daneben), "Generative or general?", drei Akte, Investitionen 2013-2025 live (AI Index 2026), Big-Tech-Capex
2026 vs. Apollo, EU AI Act, Use-Case-Pitch, Regression live (Linie per Slider, dann Gradient Descent), k-means live
(Schritt für Schritt, dann "name the groups"), Reinforcement, "Before you believe a model". Sprechernotizen (Taste `s`)
sind ein Erzählskript pro Slide. Moore's Law und die einzelnen Timeline-Meilensteine bleiben Selbststudium (Mock
Exam enthält Fragen dazu, beim Abschluss ansagen). Die 10 min mehr gegenüber dem 65-min-Plan kommen aus
NN Teil 1 (-3), Leaderboard (-5) und NN Teil 2 (-2); Mittag bleibt 12:30.

Die **Mini-Vorträge der Studierenden (5 min + 3 min Fragen)** sitzen jeweils an der Stelle im
Deck, an der das Thema dran ist. Danach zeigt der Dozent höchstens 2-3 eigene Slides als
Zusammenfassung oder Korrektur, kein zweiter Vortrag zum selben Thema.

| Zeit | Dauer | Format | Inhalt | Material |
|---|---|---|---|---|
| 09:00 | 10 | Team-Quiz | Rückblick Tag 3: 8 Fragen aus den Abschnitten Data Management und A/B-Testing des Mock Exam | `exam/mock_exam.md` |
| 09:10 | 12 | Einstieg + **Spiel "Is this AI?"** | "Where are we?" (AI-Balken orange, Anschluss an "AI at every layer"), Tagesstruktur: vormittags AI, die vorhersagt, nachmittags AI, die erzeugt. Dann zehn Karten (Excel-SUM, Thermostat, Deep Blue, Google Maps, Fraud-Regeln, Spamfilter, Netflix, Face Unlock, ChatGPT, der A/B-Test vom Samstag): Handzeichen, Klick, Antwort. Danach Dartmouth-Definition, Karte (Symbolic / ML / DL / GenAI, die Karten landen in den Kreisen), "Generative or general?" | `slides/introduction_to_ai`, Abschnitt 1 |
| 09:22 | 11 | Vortrag + Live-Chart | Drei Akte (Timeline-Bild als Karte), "Why 2012?" (Daten, Compute, Algorithmen), **Follow the money (live)**: erst Schätzungen aus dem Raum, dann Balken Jahr für Jahr 2013-2025, GenAI-Anteil einblenden; Big Tech 2026 (~730 Mrd.) vs. Manhattan/ISS/Apollo/Interstate; drei Zahlen (53 % / 88 % / x60); EU AI Act mit Zuruf (überspringen, wenn spät) | Abschnitt 2 |
| 09:33 | 5 | Vortrag | "Rules or examples?" (Fraud-Regeln als Code vs. Tabelle mit Label), "Three ways to learn" mit der Frage "is there a label?" | Abschnitt 3 |
| 09:38 | 27 | **Use-Case-Pitch (Gruppen)** | Gruppen 1+2 supervised, 3+4 unsupervised, 5+6 reinforcement. Template Problem / Data / Algorithm / Output / Decision (Slide bleibt stehen, dazu die Quick reference cards). 10 min Vorbereitung (LLM erlaubt), je 2 min Pitch (12 min), dann ist der Raum das Management: zwei Stimmen pro Person, zwei Projekte werden finanziert (3 min). Dozent korrigiert mit den Reference Cards (2 min) | Slides "Your turn", "The template", "Quick reference cards" |
| 10:05 | 20 | **Live-Demos** | Supervised: **Regression live** (Studierende rufen w und b zu, Loss sinkt; "1 step", "let the machine learn", Lernrate zu groß: explodiert; "show best line"), dann "What the machine just did" (MSE, Gradient, Lernrate, Stop: Prüfungsstoff), Klassifikation (Brücke zu Hausaufgabe Part B und Leaderboard). Unsupervised: **k-means live** (erst Gruppen raten, dann 1-2-3 per Knopf, "run to the end", k = 2 und 5, "name the groups"), "k-means in four moves". Reinforcement eine Slide (RLHF als Brücke zum Nachmittag), "Before you believe a model", Takeaways | Abschnitte 4-7 |
| 10:25 | 15 | Pause | | |
| 10:40 | 37 | Vortrag | Neural Networks Teil 1: Lineare Regression als Neuron (knüpft an die Regression-Demo an), Aktivierung, Layer, Universal Approximation (Intuition) | `slides/neural_networks` |
| 11:17 | 8 | **Mini-Vortrag 1** | Backpropagation: wie lernt ein Netz? (nur Intuition, ein Bild) | Gruppe A |
| 11:25 | 5 | Vortrag | Dozent: Zusammenfassung, Brücke zu Training in der Praxis | |
| 11:30 | 40 | **Leaderboard-Wettbewerb (Gruppen)** | Klassifikation auf den ShopNow-Daten (Part B der Hausaufgabe): jede Gruppe trainiert ein kleines Netz (sklearn `MLPClassifier`), dreht an Layern, Lernrate, Epochen. Accuracy auf dem Testset kommt auf das Leaderboard an der Tafel. Beste Gruppe erklärt in 3 min, was sie geändert hat | Notebook-Zelle ergänzen (siehe unten) |
| 12:10 | 20 | Vortrag | Neural Networks Teil 2: Overfitting (direkt am Leaderboard-Ergebnis), warum Deep Learning erst ab 2010 (Daten, GPUs), Anwendungen im Business, Brücke zu GenAI | `slides/neural_networks` |
| 12:30 | 60 | Mittag | | |
| 13:30 | 8 | **Mini-Vortrag 2** | GANs: wie kann ein Netz Bilder erzeugen? | Gruppe B |
| 13:38 | 30 | Vortrag | GenAI Teil 1: What is generative AI, Encoder-Decoder, Transformer vs. frühere Architekturen, Inference | `slides/generative_ai_and_agents` |
| 14:08 | 8 | **Mini-Vortrag 3** | Was ist ein Token und was sagt ein LLM eigentlich voraus? | Gruppe C |
| 14:16 | 25 | Vortrag | GenAI Teil 2: Training, Parameter-Skalierung, MoE, ChatGPT als Produkt, API, Prompt-Rollen, stateless Context | `slides/generative_ai_and_agents` |
| 14:41 | 8 | **Mini-Vortrag 4** | Halluzination: warum passiert sie und wie erkennt man sie? | Gruppe D |
| 14:49 | 12 | Vortrag | GenAI Teil 3: Context vs. World knowledge, was passiert ohne Context, manuelle vs. automatische Context-Bereitstellung | |
| 15:01 | 15 | Pause | | |
| 15:16 | 8 | **Mini-Vortrag 5** | Vector Embeddings und Vektordatenbanken: warum "Kaffeemühle" nahe bei "Espressomaschine" liegt | Gruppe E |
| 15:24 | 8 | **Mini-Vortrag 6** | RAG und Agents (inkl. MCP): wie ein Assistent an Firmendaten kommt und Werkzeuge nutzt | Gruppe F |
| 15:32 | 22 | Vortrag | GenAI Teil 4: RAG-Architektur, Agents, MCP, Tool-Landschaft 2026 (Slides aktualisieren, siehe PLAN Punkt 3) | |
| 15:54 | 45 | **Lab + Red Teaming (Paare)** | Agents & Vector Databases Notebook: Produktdatenbank, Embeddings, Agent. Letzte 15 min: jedes Paar versucht, den Shop-Assistenten zum Halluzinieren, zu falschen Preisen oder zum Preisgeben fremder Kundendaten zu bringen. Jedes Paar nennt einen gefundenen Fehler (1 min) | `colab/agents_and_vector_databases.ipynb` (Aufgaben-Version fehlt im Repo, nur Solution vorhanden) |
| 16:39 | 25 | **Streitgespräch 2** | "ShopNow setzt einen LLM-Kundenassistenten mit Zugriff auf echte Kundendaten (Bestellungen, Tickets, Retouren) ein." Zwei Gruppen mit zugeloster Position, Rest Jury, Ablauf wie Tag 3 (6 min Vorbereitung, je 2 min Eröffnung, 6 min Schlagabtausch, je 1 min Schlusswort). Die Red-Teaming-Funde sind Munition | Leitfragen: Datenschutz, Halluzination, Haftung, Nutzen |
| 17:04 | 20 | **Prüfungs-Quiz Teil 2 (Teams)** | 15 Fragen aus den Abschnitten Intro AI, Neural Networks und GenAI des Mock Exam, Punktestand an der Tafel, bei strittigen Fragen kurze Erklärung | `exam/mock_exam.md` |
| 17:24 | 20 | Abschluss | Prüfungsformat, Termin, Materialzugang, Selbststudium ansagen (AI-Timeline, Realtime, Cloud), Feedbackrunde (3 Zettel: behalten / ändern / weglassen) | |

Dozenten-Vortrag am Tag 4: ca. 3 h. Studierende aktiv: ca. 3 h 50 min. Der Tag ist dicht, Reserve gibt es keine.
Wenn etwas kippt: Streitgespräch 2 streichen (25 min), das Red Teaming übernimmt dann die Diskussion.

---

## Mini-Vorträge: Themen, Anforderungen, Zuteilung

**Format**
- Gruppe von 2-3 Personen, **5 min Vortrag + 3 min Fragen**, hartes Zeitlimit (Timer sichtbar).
- 3-5 Slides oder ein Whiteboard-Bild, kein Notebook nötig.
- Pflicht: (1) Erklärung mit einem eigenen Beispiel, (2) warum ist das für ein Unternehmen relevant,
  (3) eine Frage ans Plenum.
- Zählt als Teilnahme, nicht als Note. Die Themen sind prüfungsrelevant.
- Abgabe der Slides (PDF) bis So 15.11. 20:00 per Mail, damit sie am Montag auf dem Dozentenrechner liegen.

**Themenpool (6 Gruppen, Reihenfolge = Reihenfolge am Tag 4)**

| # | Thema | Leitfrage | Einstiegsquellen |
|---|---|---|---|
| A | Backpropagation | Wie lernt ein neuronales Netz aus seinen Fehlern? | 3Blue1Brown "What is backpropagation really doing?" (YouTube); Rumelhart, Hinton, Williams 1986, *Learning representations by back-propagating errors*, Nature |
| B | GANs | Wie bringt man zwei Netze dazu, Bilder zu erzeugen? | Goodfellow et al. 2014, *Generative Adversarial Nets*; Google ML Crash Course, Abschnitt "GAN" |
| C | Token und Next-Token-Prediction | Was sagt ein LLM wirklich voraus, und warum zählt es keine Buchstaben? | OpenAI Tokenizer (platform.openai.com/tokenizer); Andrej Karpathy "Intro to Large Language Models" (YouTube, erste 20 min) |
| D | Halluzination | Warum erfinden LLMs Fakten und wie prüft man Antworten? | Ji et al. 2023, *Survey of Hallucination in Natural Language Generation*, ACM Computing Surveys; ein eigenes Beispiel mit ChatGPT/Claude/Gemini mitbringen |
| E | Vector Embeddings und Vektordatenbanken | Warum liegt "Kaffeemühle" nahe bei "Espressomaschine", und wozu braucht man dafür eine Datenbank? | Mikolov et al. 2013, *Efficient Estimation of Word Representations in Vector Space*; Pinecone "What is a Vector Database?" (Blog) |
| F | RAG, Agents und MCP | Wie kommt ein Assistent an Firmendaten und wie nutzt er Werkzeuge? | Lewis et al. 2020, *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*; Anthropic, "Introducing the Model Context Protocol" (Blog, 2024) |

Reserve bei mehr als 6 Gruppen: Transformer vs. RNN (Vaswani et al. 2017), Mixture of Experts,
Simpson's Paradox in A/B-Tests (Kohavi/Tang/Xu, Kap. 3), Peeking und Sequential Testing (Evan Miller,
"How Not To Run an A/B Test").

**Zuteilung:** per Los in der Mail (Gruppe 1 = A usw.), Tausch untereinander erlaubt, bis Mo 2.11.
per Mail melden.

---

## Streitgespräche: Regeln (beide Tage gleich)

1. Zwei Gruppen werden gelost, die Position (pro / contra) wird gelost, nicht gewählt.
2. 8 min Vorbereitung in der Gruppe, die übrigen Gruppen sammeln als Jury je zwei Fragen.
3. Ablauf: je 3 min Eröffnung, 6 min freier Schlagabtausch (Jury darf Fragen einwerfen), je 1 min Schlusswort.
4. Jury stimmt **vor** und **nach** dem Gespräch ab (Handzeichen). Gewonnen hat, wer mehr Stimmen bewegt hat.
5. Dozent moderiert, hält die Zeit, fasst am Ende in 3 Sätzen zusammen, was fachlich richtig war. Kein eigener Vortrag.

---

## Vorbereitung durch den Dozenten (Checkliste)

- [ ] Mail mit Themenzuteilung bis Fr 2026-10-30 (Entwurf unten)
- [ ] Gruppenliste vom Tag 1 heraussuchen oder Losverfahren für 9:00 am 14.11. vorbereiten
- [ ] **Ergebniskarten Experiment Review Board** (6 Karten, je eine halbe Seite, z.B. als Slide-Block im A/B-Deck):
  1. sauberes Ergebnis, signifikant, ausreichend Power -> ship
  2. signifikant, aber nach 3 Tagen abgebrochen (Peeking) -> no ship, weiterlaufen lassen
  3. 48 % / 52 % Verteilung der Nutzer (Sample Ratio Mismatch) -> Ergebnis ungültig
  4. p = 0.08 bei halber geplanter Fallzahl (unterpowered) -> nicht entscheidbar
  5. Gesamteffekt positiv, in beiden Segmenten negativ (Simpson) -> no ship, Segmentierung prüfen
  6. 20 Metriken getestet, eine signifikant (Multiple Testing) -> no ship
- [x] Data-Management-Deck umgebaut (2026-11-01): Where-are-we als SVG, Doing 1 ETL, Doing 2 Expertengruppen (Pro/Contra als versteckte vertikale Slides), Doing 3 Wettbewerb, lyvy "Spot the pattern", "AI at every layer", Takeaways; Realtime + Cloud als Anhang "self-study". Alte Fassung in Git-History
- [x] Neues Notebook `colab/data_management_etl.ipynb` + Solution (raw -> staging -> mart in pandas, 4 Aufgaben, Lösung läuft durch), in `index.html` verlinkt
- [x] Kosten-Notebook (2026-11-01): Quelle C ist jetzt ein gekaufter Finanzdaten-Feed (20 GB/Monat, 20 $/GB, jeder erneute Download kostet voll), Zusatzfrage in der Empfehlungsrunde, Bonus-Aufgabe (Incident + Schema-Update) sauber formuliert und mit Lösung
- [x] Kosten-Notebook auf Gruppenformat umgebaut (`MY_ARCHITECTURE`, nur eigene Architektur, "nicht die eigene empfehlen", alle vier als Hausaufgabe); Lösung neu, alter Fehler in der Gesamtsumme (Query-Kosten der letzten Architektur für alle Zeilen) behoben; Speicherangabe vereinheitlicht (20 GB/Monat Wachstum, die widersprüchlichen "Year 1: 100 TB / Year 2: 150 TB" entfernt)
- [ ] Deck und beide Notebooks einmal in Colab/Browser durchklicken, dann committen
- [ ] Tafelvorlage für den Architektur-Wettbewerb: Tabelle Architekturen x fünf Kostenkomponenten + Summe, während der Expertenrunde anzeichnen. Referenzwerte (Solution, mit gekauftem Finanzdaten-Feed 20 $/GB als Quelle C): Lakehouse 16.723, Lake 17.077, Warehouse 17.990, Hybrid 18.770 $; Zusatzfrage "wer zahlt den Feed zweimal": nur das Warehouse (Bonus: ca. 30.100 $)
- [ ] A/B-Deck: "Your turn"-Slide auf Lab-Aufgabe 1 umlenken (Warm-up-Notebook entfällt am Tag 3, bleibt als Übung auf der Kursseite)
- [x] Mini-Talk-Slide im Intro-AI-Deck auf das Pitch-Format umschreiben (erledigt 2026-11-10 mit dem Neubau des Decks: 10 min Vorbereitung, 2 min Pitch, Abstimmung)
- [ ] Leitfragen für beide Streitgespräche als Sprechernotizen in die Decks (Taste `s`)
- [ ] **Leaderboard-Zelle** für den NN-Wettbewerb in `colab/introduction_ai.ipynb` Part B oder in einem neuen kurzen
  Notebook `colab/nn_competition.ipynb`: Train/Test-Split fest vorgeben, `MLPClassifier` mit 3-4 Parametern
  zum Drehen, Accuracy ausgeben
- [ ] `colab/agents_and_vector_databases.ipynb` (Aufgaben-Version ohne Lösung) anlegen, im Repo liegt nur die Solution
- [ ] Quiz-Fragen aus `exam/mock_exam.md` auswählen: 8 (Tag 3 Start), 15 (Tag 3 Ende: BI, DB, DM, A/B), 8 (Tag 4 Start), 15 (Tag 4 Ende: AI, NN, GenAI)
- [ ] GenAI-Deck: Modellnamen und Tool-Landschaft auf Stand 2026 bringen, MCP/Agents-Slides prüfen (PLAN Punkt 3)
- [ ] Planungstabelle in `index.html`: 2027-11-16 auf 2026-11-16 korrigieren, Data Management aus der Zeile vom 2026-10-19 nach Tag 3 verschieben, Inhalte für Tag 3 und 4 eintragen,
  Abschnitt "Presentations" mit Format und Themenliste anlegen
- [ ] Timer-Slide oder Handy-Timer für die 5-min-Vorträge

---

## Mail-Entwurf an die Studierenden

Betreff: Data Management & BI: Mini-Vorträge am 16.11. (Themenzuteilung)

Hallo zusammen,

an den beiden letzten Blocktagen (Sa 14.11. und Mo 16.11.) übernehmt ihr einen Teil der Vorlesung
selbst. Am Montag, 16.11., hält jede Gruppe einen Mini-Vortrag von 5 Minuten (plus 3 Minuten
Fragen) zu einem Thema aus dem Bereich Neural Networks und Generative AI. Die Themen sind
prüfungsrelevant, der Vortrag selbst wird nicht benotet.

Was wir erwarten:
- 3-5 Slides oder ein Tafelbild, kein Code nötig
- eine Erklärung mit einem eigenen Beispiel
- ein Satz dazu, warum das Thema für ein Unternehmen relevant ist
- eine Frage an das Plenum
- 5 Minuten, wir stoppen die Zeit

Zuteilung (Gruppen vom ersten Blocktag):
- Gruppe 1: Backpropagation. Wie lernt ein neuronales Netz aus seinen Fehlern?
- Gruppe 2: GANs. Wie bringt man zwei Netze dazu, Bilder zu erzeugen?
- Gruppe 3: Token und Next-Token-Prediction. Was sagt ein LLM wirklich voraus?
- Gruppe 4: Halluzination. Warum erfinden LLMs Fakten und wie prüft man Antworten?
- Gruppe 5: Vector Embeddings und Vektordatenbanken. Warum liegt "Kaffeemühle" nahe bei "Espressomaschine"?
- Gruppe 6: RAG, Agents und MCP. Wie kommt ein Assistent an Firmendaten und nutzt Werkzeuge?

Zu jedem Thema stehen ein bis zwei Einstiegsquellen auf der Kursseite (Abschnitt "Presentations").
Tausch von Themen untereinander ist möglich, bitte bis Montag, 2.11., per Mail melden.
Slides bitte als PDF bis Sonntag, 15.11., 20:00 Uhr an mich.

Außerdem gibt es an beiden Tagen Gruppenaufgaben und zwei kurze Streitgespräche, dafür müsst ihr
nichts vorbereiten. Als Hausaufgabe zwischen den beiden Tagen bitte das Notebook "Introduction
to AI" durcharbeiten (Link auf der Kursseite), das brauchen wir am Montag für einen kleinen Wettbewerb.

Viele Grüße
Christoph

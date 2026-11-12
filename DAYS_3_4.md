# Ablaufplan Blocktag 3 und 4 (Entwurf 2026-10-28, Stand 2026-11-12)

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
  (Expertengruppen und Kosten-Wettbewerb) läuft mit **drei neuen Gruppen** (Lake, Hybrid, Lakehouse); das Warehouse ist die Referenz, die sie am
  Vormittag selbst gebaut haben (Entscheidung 2026-11-12).
- Gruppenaufgaben und Streitgespräche zählen als Teilnahme, nicht als Note (Klausur ist MC).
- Die ursprünglich geplanten Mini-Vorträge der Studierenden sind gestrichen (2026-11-12, keine Vorbereitungszeit).
  Nichts muss vorbereitet werden, und es gibt keine Hausaufgabe zwischen den beiden Tagen (Entscheidung 2026-11-12).

Pausenraster: Vormittagspause 15 min (Tag 3: 10:49, Tag 4: 10:33), Mittag 60 min (Tag 3: 12:30, Tag 4: 12:00), Nachmittagspause 15 min (Tag 3 ca. 15:00, Tag 4: 14:25).

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
| 09:15 | 25 | **Doing 1: ETL von Hand (Paare, Colab)** | Rohtabellen (Klicks, Bestellungen) zu Staging-Tabellen und Dashboard-Mart umbauen, 15 min Timer, LLM ausdrücklich erlaubt (steht auf der Slide und im Notebook, jeder Schritt hat ein Beispiel desselben Pandas-Musters auf einer anderen Tabelle, Support-Tickets, das sie übertragen). Danach Lösung: "What is messy" (ANSWER), "How to approach it" (Methode: Typen anschauen, Grain, Typen fixen, groupby, merge, Check), dann pro Task eine ANSWER-Slide mit Code, der schrittweise hervorgehoben wird (Pfeiltaste), "What you just did has names" (ETL, Staging, Mart, Warehouse), "Monday 9:00" (vier Pannen aus der Übung, wo fängt man sie?), guter ETL-Prozess (Tabelle mit Verortung raw/staging/mart), dbt auf zwei Slides (Dateien + SQL, Lineage + Tests-YAML), max. 10 min Dozent. Papier-Variante als Fallback | `colab/data_management_etl.ipynb` |
| 09:40 | 42 | **Doing 2: Expertengruppen** | Vorab 3 min "Four architectures, one legend" (Warehouse-Bild von vorhin neben der Legende: Speicher, Zahnrad, Pfeile; die drei folgenden Bilder unterscheiden sich nur in wo gespeichert und wann transformiert). Jede Gruppe ein Briefing (Bild + vier Fakten, im Deck unter ihrer Architektur) plus eine Transferfrage, die das Briefing nicht beantwortet (Antworten auf versteckten ANSWER-Slides, Schalter `SHOW_SOLUTIONS` im Deck). Das Warehouse ist die Referenz (Legende: "hält keine Rohdaten", sagt der Dozent selbst), dafür drei neue Gruppen (1 Lake, 2 Hybrid, 3 Lakehouse, abzählen im Raum), die Lakehouse-Gruppe bekommt zusätzlich die Bounce-Frage gegen das Warehouse. 15 min Vorbereitung, LLM erlaubt, je 5 min pro Architektur am Screen (Bild lesen, Frage, Stärke/Schwäche, Use Case), Zuhörer notieren Stärke/Schwäche pro Architektur. Dozent korrigiert max. 4 min, dann Slides "The four at a glance", "Database or files?", "Inside the files" (JSON, Parquet, Iceberg-Metadatei) und "What a GB costs per month" (Hetzner Object Storage vs. Cloud Volume vs. Datenbank, erklärt die Preistabelle des Wettbewerbs), zusammen 5 min | `slides/data_management`, vertikale Stacks |
| 10:22 | 20 | **Doing 3: Architektur-Wettbewerb (Gruppen, Colab)** | Gleiche drei Gruppen wie in Doing 2. Die Warehouse-Zahl (17.990 $, ShopNow heute) ist vorgegeben, jede Gruppe rechnet die 2-Jahres-Kosten ihrer eigenen Alternative (10 min), Zahlen an die Tafel, dann je 2 min Empfehlung (drei Gruppen, 6 min) mit der Regel "nicht die eigene" (beim Warehouse bleiben ist erlaubt), ein Kosten- und ein Nicht-Kosten-Argument. Referenzwerte auf der versteckten ANSWER-Slide | `colab/data_management_architecture.ipynb` |
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
| 16:05 | 15 | Abschluss | Ausblick Tag 4 (Intro AI mit Pitch und Live-Demos, Leaderboard, GenAI mit Lab), keine Hausaufgabe | |

Planmäßiges Ende 16:20, Reserve bis 16:45. Wenn der Vormittag überzieht, verschiebt sich alles nach hinten, es muss nichts gestrichen werden.

**Lösungen zeigen (Data-Management-Deck):** die Antworten zu allen Aufgaben liegen als versteckte Slides mit
ANSWER-Badge direkt unter der jeweiligen Aufgabe. Schalter: `const SHOW_SOLUTIONS = false;` ganz oben in
`slides/data_management/index.html`. Im Repo bleibt `false`, bis die Vorlesung durch ist (Studierende sehen 27 Slides), danach auf `true` setzen
und committen (38 Slides). **Zum Präsentieren lokal auf `true` stellen**, nicht committen: dann kannst du die ETL-Lösung
nach dem Timer Schritt für Schritt zeigen und die ANSWER-Slides der Expertengruppen einfach überspringen, bis sie dran
sind. Die Sprechernotizen (Taste `s`) enthalten nur noch Regie-Hinweise.

**Keine Hausaufgabe zwischen den Tagen (Entscheidung 2026-11-12, zu wenig Zeit).** Das Leaderboard am Tag 4 setzt
nichts voraus, Daten und Pipeline sind im Notebook vorgegeben. Die "Optional"-Teile der Notebooks (Kosten: alle vier
Architekturen, Incident und Schema-Update) bleiben für Interessierte stehen, werden aber nur erwähnt.

Dozenten-Vortrag am Tag 3: ca. 2 h 10 min. Studierende aktiv: ca. 4 h 15 min.

---

## Tag 4: Mo 2026-11-16 — Introduction to AI + Leaderboard + Generative AI & Agents (Neural Networks nur Selbststudium)

Introduction to AI kommt als 75-min-Block an den Anfang (Deck am 2026-11-10 komplett neu gebaut, 27 Slides,
`slides/introduction_to_ai/index.html` + `ai.js`): Spiel "Is this AI?", Definition, Karte (AI > ML > DL > GenAI,
Symbolic daneben), "Generative or general?", drei Akte, Investitionen 2013-2025 live (AI Index 2026), Big-Tech-Capex
2026 vs. Apollo, EU AI Act, Use-Case-Pitch, Regression live (Linie per Slider, dann Gradient Descent), k-means live
(Schritt für Schritt, dann "name the groups"), Reinforcement, "Before you believe a model". Sprechernotizen (Taste `s`)
sind ein Erzählskript pro Slide. Moore's Law und die einzelnen Timeline-Meilensteine bleiben Selbststudium (Mock
Exam enthält Fragen dazu, beim Abschluss ansagen).

**Neural Networks entfällt als Vorlesung (Entscheidung 2026-11-11, Zeitgründe).** `slides/neural_networks` bleibt auf der
Kursseite als "(VI-bonus)" zum Selbststudium verlinkt, nicht prüfungsrelevant (das Mock Exam enthält keine NN-Fragen).
Die frei gewordene Zeit: Pitch und Live-Demos bekommen Luft (+8), Leaderboard 50 min plus 17 min Auswertung,
Mittag ab 12:00.

**Mini-Vorträge der Studierenden gestrichen (Entscheidung 2026-11-12, die Studierenden haben keine Zeit zur
Vorbereitung).** Die sechs Themen (Backpropagation, GANs, Token, Halluzination, Embeddings, RAG/Agents) übernimmt
der Dozent im GenAI-Deck selbst, der GenAI-Vortrag bekommt dafür die Zeit zurück (115 statt 89 min, siehe Tabelle).
Backpropagation nur noch als Brücke in zwei Sätzen vor dem Leaderboard. Planmäßiges Ende 17:00, Reserve 45 min.

| Zeit | Dauer | Format | Inhalt | Material |
|---|---|---|---|---|
| 09:00 | 10 | Team-Quiz | Rückblick Tag 3: 8 Fragen aus den Abschnitten Data Management und A/B-Testing des Mock Exam | `exam/mock_exam.md` |
| 09:10 | 12 | Einstieg + **Spiel "Is this AI?"** | "Where are we?" (AI-Balken orange, Anschluss an "AI at every layer"), Tagesstruktur: vormittags AI, die vorhersagt, nachmittags AI, die erzeugt. Dann zehn Karten (Excel-SUM, Thermostat, Deep Blue, Google Maps, Fraud-Regeln, Spamfilter, Netflix, Face Unlock, ChatGPT, der A/B-Test vom Samstag): Handzeichen, Klick, Antwort. Danach Dartmouth-Definition, Karte (Symbolic / ML / DL / GenAI, die Karten landen in den Kreisen), "Generative or general?" | `slides/introduction_to_ai`, Abschnitt 1 |
| 09:22 | 11 | Vortrag + Live-Chart | Drei Akte (Timeline-Bild als Karte), "Why 2012?" (Daten, Compute, Algorithmen), **Follow the money (live)**: erst Schätzungen aus dem Raum, dann Balken Jahr für Jahr 2013-2025, GenAI-Anteil einblenden; Big Tech 2026 (~730 Mrd.) vs. Manhattan/ISS/Apollo/Interstate; drei Zahlen (53 % / 88 % / x60); EU AI Act mit Zuruf (überspringen, wenn spät) | Abschnitt 2 |
| 09:33 | 5 | Vortrag | "Rules or examples?" (Fraud-Regeln als Code vs. Tabelle mit Label), "Three ways to learn" mit der Frage "is there a label?" | Abschnitt 3 |
| 09:38 | 30 | **Use-Case-Pitch (Gruppen)** | Gruppen 1+2 supervised, 3+4 unsupervised, 5+6 reinforcement. Template Problem / Data / Algorithm / Output / Decision (Slide bleibt stehen, dazu die Quick reference cards). 12 min Vorbereitung (LLM erlaubt), je 2 min Pitch (12 min), dann ist der Raum das Management: zwei Stimmen pro Person, zwei Projekte werden finanziert (3 min). Dozent korrigiert mit den Reference Cards (3 min) | Slides "Your turn", "The template", "Quick reference cards" |
| 10:08 | 25 | **Live-Demos** | Supervised: **Regression live** (Studierende rufen w und b zu, Loss sinkt; "1 step", "let the machine learn", Lernrate zu groß: explodiert; "show best line"), dann "What the machine just did" (MSE, Gradient, Lernrate, Stop: Prüfungsstoff), Klassifikation (Fraud-Beispiel, Brücke zum Leaderboard). Unsupervised: **k-means live** (erst Gruppen raten, dann 1-2-3 per Knopf, "run to the end", k = 2 und 5, "name the groups"), "k-means in four moves". Reinforcement eine Slide (RLHF als Brücke zum Nachmittag), "Before you believe a model", Takeaways, "Next" (NN-Deck als Bonus ansagen) | Abschnitte 4-7 |
| 10:33 | 15 | Pause | | |
| 10:48 | 5 | Vortrag | Dozent: Brücke von "What the machine just did" zum Netz in zwei Sätzen (ein Netz = viele Linien gestapelt, Training = derselbe Loop mit Millionen Parametern), NN-Deck als Selbststudium ansagen, Leaderboard-Regeln | |
| 10:53 | 50 | **Leaderboard-Wettbewerb (Gruppen)** | Fraud-Klassifikation auf synthetischen ShopNow-Bestellungen (dasselbe Beispiel wie auf der Classification-Slide). Daten, Split, Pipeline und Baseline sind vorgegeben (Zellen 1-3 nur ausführen), jede Gruppe dreht in Zelle 4 an vier Parametern des `MLPClassifier`: Schichten, Lernrate (kennen sie aus der Regression-Demo), Epochen, alpha. Startwerte liegen auf Baseline-Niveau (79 %), gute Einstellungen erreichen ca. 90 %, große Netze fallen durch Overfitting zurück. Test-Accuracy mit Parametern an die Tafel, Regel "nur der Testwert zählt, bei Gleichstand das kleinere Netz" | `colab/classification_leaderboard.ipynb` |
| 11:43 | 17 | Auswertung | Beste Gruppe erklärt in 3 min, was sie geändert hat. Dozent: Overfitting direkt am Ergebnis (Zelle "After the competition" im Notebook: Train- vs. Test-Accuracy für wachsende Netze, Rückgriff auf "How was it tested?" aus Abschnitt 7), warum ein Testset Pflicht ist | `colab/classification_leaderboard.ipynb` |
| 12:00 | 60 | Mittag | | |
| 13:00 | 35 | Vortrag | GenAI Teil 1: What is generative AI, GANs in zwei Slides (zwei Netze erzeugen Bilder), Encoder-Decoder, Transformer vs. frühere Architekturen, Inference | `slides/generative_ai_and_agents` |
| 13:35 | 30 | Vortrag | GenAI Teil 2: Token und Next-Token-Prediction (Tokenizer live zeigen: warum zählt ein LLM keine Buchstaben?), Training, Parameter-Skalierung, MoE, ChatGPT als Produkt, API, Prompt-Rollen, stateless Context | `slides/generative_ai_and_agents` |
| 14:05 | 20 | Vortrag | GenAI Teil 3: Context vs. World knowledge, Halluzination (warum sie passiert, wie man sie erkennt, ein Live-Beispiel), was passiert ohne Context, manuelle vs. automatische Context-Bereitstellung | |
| 14:25 | 15 | Pause | | |
| 14:40 | 30 | Vortrag | GenAI Teil 4: Vector Embeddings (warum "Kaffeemühle" nahe bei "Espressomaschine" liegt), Vektordatenbanken, RAG-Architektur, Agents, MCP, Tool-Landschaft 2026 (Slides aktualisieren, siehe PLAN Punkt 3) | |
| 15:10 | 45 | **Lab + Red Teaming (Paare)** | Agents & Vector Databases Notebook: Produktdatenbank, Embeddings, Agent. Letzte 15 min: jedes Paar versucht, den Shop-Assistenten zum Halluzinieren, zu falschen Preisen oder zum Preisgeben fremder Kundendaten zu bringen. Jedes Paar nennt einen gefundenen Fehler (1 min) | `colab/agents_and_vector_databases.ipynb` (Aufgaben-Version fehlt im Repo, nur Solution vorhanden) |
| 15:55 | 25 | **Streitgespräch 2** | "ShopNow setzt einen LLM-Kundenassistenten mit Zugriff auf echte Kundendaten (Bestellungen, Tickets, Retouren) ein." Zwei Gruppen mit zugeloster Position, Rest Jury, Ablauf wie Tag 3 (6 min Vorbereitung, je 2 min Eröffnung, 6 min Schlagabtausch, je 1 min Schlusswort). Die Red-Teaming-Funde sind Munition | Leitfragen: Datenschutz, Halluzination, Haftung, Nutzen |
| 16:20 | 20 | **Prüfungs-Quiz Teil 2 (Teams)** | 15 Fragen aus den Abschnitten Intro AI und GenAI des Mock Exam, Punktestand an der Tafel, bei strittigen Fragen kurze Erklärung | `exam/mock_exam.md` |
| 16:40 | 20 | Abschluss | Prüfungsformat, Termin, Materialzugang, Selbststudium ansagen (AI-Timeline, Realtime, Cloud; NN-Deck als Bonus ohne Prüfungsrelevanz), Feedbackrunde (3 Zettel: behalten / ändern / weglassen) | |
| 17:00 | 45 | Reserve | Puffer bis 17:45, falls der Vormittag oder das Lab überzieht | |

Dozenten-Vortrag am Tag 4: ca. 2 h 55 min. Studierende aktiv: ca. 3 h 20 min. Planmäßiges Ende 17:00, Reserve 45 min.
Wenn trotzdem etwas kippt: Streitgespräch 2 streichen (25 min), das Red Teaming übernimmt dann die Diskussion.

---

## Streitgespräche: Regeln (beide Tage gleich)

1. Zwei Gruppen werden gelost, die Position (pro / contra) wird gelost, nicht gewählt.
2. 8 min Vorbereitung in der Gruppe, die übrigen Gruppen sammeln als Jury je zwei Fragen.
3. Ablauf: je 3 min Eröffnung, 6 min freier Schlagabtausch (Jury darf Fragen einwerfen), je 1 min Schlusswort.
4. Jury stimmt **vor** und **nach** dem Gespräch ab (Handzeichen). Gewonnen hat, wer mehr Stimmen bewegt hat.
5. Dozent moderiert, hält die Zeit, fasst am Ende in 3 Sätzen zusammen, was fachlich richtig war. Kein eigener Vortrag.

---

## Vorbereitung durch den Dozenten (Checkliste)

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
- [x] Kosten-Notebook auf Gruppenformat umgebaut (`MY_ARCHITECTURE`, nur eigene Architektur, "nicht die eigene empfehlen", alle vier optional zu Hause); Lösung neu, alter Fehler in der Gesamtsumme (Query-Kosten der letzten Architektur für alle Zeilen) behoben; Speicherangabe vereinheitlicht (20 GB/Monat Wachstum, die widersprüchlichen "Year 1: 100 TB / Year 2: 150 TB" entfernt)
- [ ] Deck und beide Notebooks einmal in Colab/Browser durchklicken, dann committen
- [ ] Tafelvorlage für den Architektur-Wettbewerb: Tabelle Architekturen x fünf Kostenkomponenten + Summe, Warehouse-Zeile schon eingetragen (12.103 / 1.800 / 1.821 / 1.066 / 1.200 / 17.990), während der Expertenrunde anzeichnen. Referenzwerte (Solution, mit gekauftem Finanzdaten-Feed 20 $/GB als Quelle C): Lakehouse 16.723, Lake 17.077, Warehouse 17.990, Hybrid 18.770 $; Zusatzfrage "wer zahlt den Feed zweimal": nur das Warehouse (Bonus: ca. 30.100 $)
- [ ] A/B-Deck: "Your turn"-Slide auf Lab-Aufgabe 1 umlenken (Warm-up-Notebook entfällt am Tag 3, bleibt als Übung auf der Kursseite)
- [x] Intro-AI-Deck: Gruppenaufgabe als Use-Case-Pitch (erledigt 2026-11-10 mit dem Neubau des Decks: 12 min Vorbereitung, 2 min Pitch, Abstimmung)
- [ ] Leitfragen für beide Streitgespräche als Sprechernotizen in die Decks (Taste `s`)
- [x] **Leaderboard-Notebook** `colab/classification_leaderboard.ipynb` (2026-11-12): synthetische ShopNow-Bestellungen mit
  Fraud-Label, fester Split, Pipeline, Baseline, eine Zelle mit vier Parametern, Overfitting-Tabelle für die Auswertung;
  auf der Kursseite verlinkt. `colab/introduction_ai.ipynb` bleibt als Übung stehen, wird nicht mehr vorausgesetzt
- [ ] `colab/agents_and_vector_databases.ipynb` (Aufgaben-Version ohne Lösung) anlegen, im Repo liegt nur die Solution
- [ ] Quiz-Fragen aus `exam/mock_exam.md` auswählen: 8 (Tag 3 Start), 15 (Tag 3 Ende: BI, DB, DM, A/B), 8 (Tag 4 Start), 15 (Tag 4 Ende: AI, GenAI)
- [ ] GenAI-Deck: Modellnamen und Tool-Landschaft auf Stand 2026 bringen, MCP/Agents-Slides prüfen (PLAN Punkt 3)
- [ ] Planungstabelle in `index.html`: 2027-11-16 auf 2026-11-16 korrigieren, Data Management aus der Zeile vom 2026-10-19 nach Tag 3 verschieben, Inhalte für Tag 3 und 4 eintragen
- [ ] Timer-Slide oder Handy-Timer für Pitches (2 min), Expertenrunde und Streitgespräche

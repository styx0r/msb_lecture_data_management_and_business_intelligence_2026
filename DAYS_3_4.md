# Ablaufplan Blocktag 3 und 4 (Entwurf 2026-10-28, Stand 2026-11-13)

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

Pausenraster: Vormittagspause 15 min (Tag 3: 11:19, Tag 4: 10:42), Mittag 60 min (Tag 3: 13:00, Tag 4: 12:00), Nachmittagspause 15 min (Tag 3: 15:30, Tag 4: 14:25).

---

## Tag 3: Sa 2026-11-14 — Data Management + A/B-Testing

Data Management kommt an den Anfang (Anschluss an Tag 2, frische Köpfe) und ist komplett auf "erst machen,
dann benennen" umgebaut: drei Doing-Blöcke, Dozent redet in 110 min ca. 20 min. Introduction to AI ist
komplett auf Tag 4 gewandert (Stand 2026-11-06), dort eingedampft auf Use-Case-Pitch und k-means-Übung. Dafür
bekommt Tag 3 den ersten Teil des Prüfungs-Quiz. **Neuer Start (Entscheidung 2026-11-13):** statt des Team-Quiz
gibt es den Entry Test auf Papier (`exam/entry_test_day3.pdf`, 20 MC-Fragen zu Tag 1+2, 15 min) und davor und danach
die Pandas-Lösung: während der Dozent druckt, lesen die Studierenden die Solution von "Pandas Data Aggregation and
Visualization", nach dem Test wird sie vorne gemeinsam durchgegangen, jede Person erklärt eine Zeile Code. Das kostet
30 min mehr als das Quiz, alles danach rückt um 30 min nach hinten, der Abschluss ist auf 10 min gekürzt. Planmäßiges
Ende 16:45, also keine Reserve mehr. Wenn es kippt: Code-Runde nach 10 min abbrechen, Prüfungs-Quiz Teil 1 auf
10 Fragen kürzen (zusammen ca. 12 min), zur Not Streitgespräch 1 auf Tag 4 schieben.

| Zeit | Dauer | Format | Inhalt | Material |
|---|---|---|---|---|
| 09:00 | 10 | Ankommen + Drucken | Dozent druckt den Entry Test (`exam/entry_test_day3.pdf`, eine Kopie pro Person, plus `entry_test_day3_solution.pdf` für sich). Ansage an die Studierenden: Solution von "Pandas Data Aggregation and Visualization" in Colab öffnen (Link auf der Kursseite, Tag 1) und den Code noch einmal lesen, gleich erklärt jeder eine Zeile | `colab/python_pandas_visualization_solution.ipynb` |
| 09:10 | 15 | **Entry Test (einzeln, Papier)** | 20 MC-Fragen zu Tag 1+2, 15 min, keine Notizen, kein Laptop. Einsammeln. Lösung nicht sofort besprechen, die Fragen kommen im Prüfungs-Quiz am Nachmittag wieder | `exam/entry_test_day3.pdf`, `exam/entry_test_day3_solution.pdf` |
| 09:25 | 15 | **Code-Runde (Plenum)** | Pandas-Solution vorne am Screen, reihum erklärt jede Person eine Zeile Code (Format von Tag 2). Dozent fragt nur nach ("was steht danach in der Tabelle?"), bei `groupby`, `merge` und dem Plot etwas länger bleiben. Nach 15 min abbrechen, auch wenn das Notebook nicht durch ist | `colab/python_pandas_visualization_solution.ipynb` |
| 09:40 | 5 | Einstieg | Data Management: "Where are we?" (SVG, Warehouse-Ebene markiert, AI über alle Ebenen), Frage des Tages: zwischen Annas Bestellung und dem Dashboard, wo liegen die Daten? Agenda "heute macht ihr drei Dinge" | `slides/data_management` |
| 09:45 | 25 | **Doing 1: ETL von Hand (Paare, Colab)** | Rohtabellen (Klicks, Bestellungen) zu Staging-Tabellen und Dashboard-Mart umbauen, 15 min Timer, LLM ausdrücklich erlaubt (steht auf der Slide und im Notebook, jeder Schritt hat ein Beispiel desselben Pandas-Musters auf einer anderen Tabelle, Support-Tickets, das sie übertragen). Danach Lösung: "What is messy" (ANSWER), "How to approach it" (Methode: Typen anschauen, Grain, Typen fixen, groupby, merge, Check), dann pro Task eine ANSWER-Slide mit Code, der schrittweise hervorgehoben wird (Pfeiltaste), "What you just did has names" (ETL, Staging, Mart, Warehouse), "Monday 9:00" (vier Pannen aus der Übung, wo fängt man sie?), guter ETL-Prozess (Tabelle mit Verortung raw/staging/mart), dbt auf zwei Slides (Dateien + SQL, Lineage + Tests-YAML), max. 10 min Dozent. Papier-Variante als Fallback | `colab/data_management_etl.ipynb` |
| 10:10 | 42 | **Doing 2: Expertengruppen** | Vorab 3 min "Four architectures, one legend" (Warehouse-Bild von vorhin neben der Legende: Speicher, Zahnrad, Pfeile; die drei folgenden Bilder unterscheiden sich nur in wo gespeichert und wann transformiert). Jede Gruppe ein Briefing (Bild + vier Fakten, im Deck unter ihrer Architektur) plus eine Transferfrage, die das Briefing nicht beantwortet (Antworten auf versteckten ANSWER-Slides, Schalter `SHOW_SOLUTIONS` im Deck). Das Warehouse ist die Referenz (Legende: "hält keine Rohdaten", sagt der Dozent selbst), dafür drei neue Gruppen (1 Lake, 2 Hybrid, 3 Lakehouse, abzählen im Raum), die Lakehouse-Gruppe bekommt zusätzlich die Bounce-Frage gegen das Warehouse. 15 min Vorbereitung, LLM erlaubt, je 5 min pro Architektur am Screen (Bild lesen, Frage, Stärke/Schwäche, Use Case), Zuhörer notieren Stärke/Schwäche pro Architektur. Dozent korrigiert max. 4 min, dann Slides "The four at a glance", "Database or files?", "Inside the files" (JSON, Parquet, Iceberg-Metadatei) und "What a GB costs per month" (Hetzner Object Storage vs. Cloud Volume vs. Datenbank, erklärt die Preistabelle des Wettbewerbs), zusammen 5 min | `slides/data_management`, vertikale Stacks |
| 10:52 | 20 | **Doing 3: Architektur-Wettbewerb (Gruppen, Colab)** | Gleiche drei Gruppen wie in Doing 2. Die Warehouse-Zahl (17.990 $, ShopNow heute) ist vorgegeben, jede Gruppe rechnet die 2-Jahres-Kosten ihrer eigenen Alternative (10 min), Zahlen an die Tafel, dann je 2 min Empfehlung (drei Gruppen, 6 min) mit der Regel "nicht die eigene" (beim Warehouse bleiben ist erlaubt), ein Kosten- und ein Nicht-Kosten-Argument. Referenzwerte auf der versteckten ANSWER-Slide | `colab/data_management_architecture.ipynb` |
| 11:12 | 7 | Zuruf + Brücke | "Spot the pattern": lyvy-Architektur, wo ist E/T/L, welche der vier? Dann eine Slide "AI at every layer" als Brücke zu Tag 4 und zum Streitgespräch, Takeaways. Realtime und Cloud vs. On-Premise nur als Selbststudium (Cloud ist prüfungsrelevant, Mock Exam 54/57) | |
| 11:19 | 15 | Pause | | |
| 11:34 | 40 | Vortrag + Live-Simulation | A/B-Testing Teil 1: "Where are we?" (gewohnter Stack, Analyse- und Entscheidungsebene markiert, dann OODA-Loop aus dem BI-Deck: A/B-Test sitzt in "Decide: testing hypotheses"), ShopNow-Checkout, Korrelation vs. Kausalität, Hypothese, Metriken, "Two metrics, two shapes" (**live**, bewusst 3 % Kaufrate statt der 5 % Baseline: zwei Balken für gekauft ja/nein neben dem Spend-Histogramm, erst linear, dann Umschalter auf log-Skala, Knopf "new sample", Standardfehler Conversion ±8 %, Umsatz pro Besucher ±14 %, ca. 3× Besucher nötig), Noise (**live**: A/A-Simulator, Studierende stellen Nutzerzahl und Lift ein), p-Wert (**live**: Glockenkurve, Band = α, rote Fläche = p, Slider für den beobachteten Lift), Fehler 1./2. Art, Power (**live**: α/β/Power-Bild) | `slides/ab_testing` |
| 12:14 | 25 | Vortrag + Live-Simulation | A/B-Testing Teil 2: Fallzahl, Faustformel, Power-Kurve (**live**: Planer mit Baseline, MDE, Traffic, "days you have"), statsmodels, Randomize & Run, Peeking (**live**: p-Wert-Pfade, Peeking vs. einmal entscheiden) | `slides/ab_testing` |
| 12:39 | 21 | **Lab Teil 1 (Paare)** | ShopNow checkout experiment: Fallzahl planen, Experiment aufsetzen und simulieren. Das Warm-up-Notebook entfällt, die "Your turn"-Slide verweist stattdessen auf Aufgabe 1 des Labs. Wer nicht fertig wird, macht nach dem Essen weiter (Mittag erst 13:00) | `colab/ab_testing.ipynb` |
| 13:00 | 60 | Mittag | | |
| 14:00 | 15 | Vortrag + Live-Simulation | A/B-Testing Teil 3: Analyze (Proportionen), "Day 31" mit den drei Fragen des Business, Konfidenzintervall (**live**: das Band um unsere Zahl), Decide. Multiple Testing (**live**: Dashboard mit k Metriken) kommt beim Review Board | `slides/ab_testing` |
| 14:15 | 35 | **Lab Teil 2 (Paare)** | Peeken, auswerten, entscheiden. Zwei Paare zeigen ihr Ergebnis (je 2 min) | `colab/ab_testing.ipynb` |
| 14:50 | 40 | **Experiment Review Board** (ersetzt den Pitfalls-Vortrag) | Jede Gruppe bekommt eine Ergebniskarte und muss dem "Board" (Plenum) ship / no-ship empfehlen. 12 min Vorbereitung, je 3 min Vortrag + 1 min Rückfragen, Board stimmt ab. Dozent schließt mit den Pitfalls-Slides die Lücken (Multiple Testing, Novelty, Simpson, SRM), max. 5 min | Ergebniskarten (zu erstellen, siehe unten) |
| 15:30 | 15 | Pause | | |
| 15:45 | 30 | **Streitgespräch 1** | "In fünf Jahren braucht ShopNow keine BI-Analysten mehr, nur noch KI." Zwei Gruppen mit zugeloster Position (pro / contra), Rest ist Jury. 6 min Vorbereitung, je 2 min Eröffnung, 6 min Schlagabtausch, je 1 min Schlusswort, Jury stimmt vorher und nachher ab. Dozent moderiert nur, 3 Sätze Fazit. Munition: "AI at every layer" vom Vormittag und das Review Board | Leitfragen in den Sprechernotizen (zu ergänzen) |
| 16:15 | 20 | **Prüfungs-Quiz Teil 1 (Teams)** | 15 Fragen aus den Abschnitten BI, Datenbanken, Data Management und A/B-Testing des Mock Exam, Punktestand an der Tafel, bei strittigen Fragen kurze Erklärung. Teil 2 (AI-Module) am Tag 4 | `exam/mock_exam.md` |
| 16:35 | 10 | Abschluss | Ausblick Tag 4 (Intro AI mit Pitch und Live-Demos, Leaderboard, GenAI mit Lab), keine Hausaufgabe | |

Planmäßiges Ende 16:45, keine Reserve (Entry Test und Code-Runde kosten 30 min mehr als das alte Team-Quiz). Wenn der Vormittag überzieht: Code-Runde bei 10 min abbrechen, Prüfungs-Quiz Teil 1 auf 10 Fragen kürzen, zur Not Streitgespräch 1 auf Tag 4 (Reserve dort 45 min).

**Lösungen zeigen (Data-Management-Deck):** die Antworten zu allen Aufgaben liegen als versteckte Slides mit
ANSWER-Badge direkt unter der jeweiligen Aufgabe. Schalter: `const SHOW_SOLUTIONS = false;` ganz oben in
`slides/data_management/index.html`. Im Repo bleibt `false`, bis die Vorlesung durch ist (Studierende sehen 27 Slides), danach auf `true` setzen
und committen (38 Slides). **Zum Präsentieren lokal auf `true` stellen**, nicht committen: dann kannst du die ETL-Lösung
nach dem Timer Schritt für Schritt zeigen und die ANSWER-Slides der Expertengruppen einfach überspringen, bis sie dran
sind. Die Sprechernotizen (Taste `s`) enthalten nur noch Regie-Hinweise.

**Keine Hausaufgabe zwischen den Tagen (Entscheidung 2026-11-12, zu wenig Zeit).** Das Leaderboard am Tag 4 setzt
nichts voraus, Daten und Pipeline sind im Notebook vorgegeben. Die "Optional"-Teile der Notebooks (Kosten: alle vier
Architekturen, Incident und Schema-Update) bleiben für Interessierte stehen, werden aber nur erwähnt.

Dozenten-Vortrag am Tag 3: ca. 2 h 10 min. Studierende aktiv: ca. 4 h 45 min (inkl. Entry Test und Code-Runde).

---

## Tag 4: Mo 2026-11-16 — Introduction to AI + Leaderboard + Generative AI & Agents (Neural Networks nur Selbststudium)

Introduction to AI kommt als 75-min-Block an den Anfang (Deck am 2026-11-10 komplett neu gebaut, 33 Slides (Stand 2026-11-13),
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
Backpropagation steckt jetzt im Intro-AI-Deck: drei Slides nach der Classification-Slide (ein Neuron = eine Regression, mehrere Neuronen = Netz, Training live mit einem echten 3-3-1-Netz auf acht gelabelten Bestellungen, forward / compare / backward per Knopf, dann "train on all orders"; Stand 2026-11-13). Planmäßiges Ende 17:00, Reserve 45 min.

| Zeit | Dauer | Format | Inhalt | Material |
|---|---|---|---|---|
| 09:00 | 10 | Team-Quiz | Rückblick Tag 3: 8 Fragen aus den Abschnitten Data Management und A/B-Testing des Mock Exam | `exam/mock_exam.md` |
| 09:10 | 12 | Einstieg + **Spiel "Is this AI?"** | "Where are we?" (AI-Balken orange, Anschluss an "AI at every layer"), Tagesstruktur: vormittags AI, die vorhersagt, nachmittags AI, die erzeugt. Dann zehn Karten (Excel-SUM, Thermostat, Deep Blue, Google Maps, Fraud-Regeln, Spamfilter, Netflix, Face Unlock, ChatGPT, der A/B-Test vom Samstag): Handzeichen, Klick, Antwort. Danach Dartmouth-Definition, Karte (Symbolic / ML / DL / GenAI, die Karten landen in den Kreisen), "Generative or general?" | `slides/introduction_to_ai`, Abschnitt 1 |
| 09:22 | 11 | Vortrag + Live-Chart | Drei Akte (Timeline-Bild als Karte), "Why 2012?" (Daten, Compute, Algorithmen), **Follow the money (live)**: erst Schätzungen aus dem Raum, dann Balken Jahr für Jahr 2013-2025, GenAI-Anteil einblenden; Big Tech 2026 (~730 Mrd.) vs. Manhattan/ISS/Apollo/Interstate; drei Zahlen (53 % / 88 % / x60); EU AI Act mit Zuruf (überspringen, wenn spät) | Abschnitt 2 |
| 09:33 | 5 | Vortrag | "Rules or examples?" (Fraud-Regeln als Code vs. Tabelle mit Label), "Three ways to learn" mit der Frage "is there a label?" | Abschnitt 3 |
| 09:38 | 30 | **Use-Case-Pitch (Gruppen)** | Gruppen 1+2 supervised, 3+4 unsupervised, 5+6 reinforcement. Template Problem / Data / Algorithm / Output / Decision (Slide bleibt stehen, dazu die Quick reference cards). 12 min Vorbereitung (LLM erlaubt), je 2 min Pitch (12 min), dann ist der Raum das Management: zwei Stimmen pro Person, zwei Projekte werden finanziert (3 min). Dozent korrigiert mit den Reference Cards (3 min) | Slides "Your turn", "The template", "Quick reference cards" |
| 10:08 | 34 | **Live-Demos** | Supervised: erst das Bild "train, then predict" (Tabelle mit Label → Training → Modell; neue Bestellung ohne Label → Vorhersage), dann **Regression live** (Studierende rufen w und b zu, Loss sinkt; "1 step", "let the machine learn", Lernrate zu groß: explodiert; "show best line"), dann "What the machine just did" (MSE, Gradient, Lernrate, Stop: Prüfungsstoff), dann **die Daten**: Tabelle mit acht Bestellungen (Wert, neuer Kunde, Nachtbestellung, Label fraud 0/1, Label = Chargeback innerhalb 90 Tagen), "From the table to the model" (Training liest die Tabelle, übrig bleiben 16 Zahlen), Klassifikation (neue Bestellung → trainiertes Modell → P(fraud)), **Netz in drei Slides**: "One neuron = one regression" (drei Inputs, Gewichte, Summe, Squash), "Many neurons, stacked" (3-3-1, 16 Zahlen), **Training live** (Zufallsgewichte, Bestellung 1 forward → P(fraud) 0.43, compare → Label ok, Fehler +0.43, backward → Gewichte werden angestupst; Bestellung 2 genauso; dann "train on all orders": nach ca. 110 Updates 8 von 8 richtig, niemand hat die Regel geschrieben). Unsupervised: **k-means live** (erst Gruppen raten, dann 1-2-3 per Knopf, "run to the end", k = 2 und 5, "name the groups"), "k-means in four moves". Reinforcement eine Slide (RLHF als Brücke zum Nachmittag), "Before you believe a model", Takeaways, "Next" (NN-Deck als Bonus ansagen) | Abschnitte 4-7 |
| 10:42 | 15 | Pause | | |
| 10:57 | 50 | **Leaderboard-Wettbewerb (Gruppen)** | Zwei Minuten Regeln, dann: Fraud-Klassifikation auf synthetischen ShopNow-Bestellungen (dasselbe Beispiel wie auf der Classification-Slide). Daten, Split, Pipeline und Baseline sind vorgegeben (Zellen 1-3 nur ausführen), jede Gruppe dreht in Zelle 4 an vier Parametern des `MLPClassifier`: Schichten, Lernrate (kennen sie aus der Regression-Demo), Epochen, alpha. Startwerte liegen auf Baseline-Niveau (79 %), gute Einstellungen erreichen ca. 90 %, große Netze fallen durch Overfitting zurück. Test-Accuracy mit Parametern an die Tafel, Regel "nur der Testwert zählt, bei Gleichstand das kleinere Netz" | `colab/classification_leaderboard.ipynb` |
| 11:47 | 13 | Auswertung | Beste Gruppe erklärt in 3 min, was sie geändert hat. Dozent: Overfitting direkt am Ergebnis (Zelle "After the competition" im Notebook: Train- vs. Test-Accuracy für wachsende Netze, Rückgriff auf "How was it tested?" aus Abschnitt 7), warum ein Testset Pflicht ist | `colab/classification_leaderboard.ipynb` |
| 12:00 | 60 | Mittag | | |
| 13:00 | 35 | Vortrag + Live | GenAI Teil 1 (Deck am 2026-11-12 komplett neu gebaut, `slides/generative_ai_and_agents/index.html` + `genai.js`, 40 Slides (Stand 2026-11-13), Sprechernotizen als Erzählskript): "Where are we?", vier Teile, Warm-up "finish the sentence" (Zuruf, dann die Wahrscheinlichkeitsverteilung), predict vs. generate, GAN, Encoder-Decoder, **Attention live** (Satz mit umschaltbarem Ende), Token, **"You are the LLM" live** (Trigramm-Modell auf ShopNow-Reviews, Temperatur, Halluzination vorführen), vier Trainingsschritte mit den GIFs | Abschnitt 1 |
| 13:35 | 30 | Vortrag + Live | GenAI Teil 2: **Skalierung live** (Kreise GPT-2 bis Kimi K2, open vs. closed, aktive Parameter), **Mixture of Experts** (Router klickbar), **GPU-Rechner live** (Parameter, Präzision, Karten, Kauf- und Mietpreis), ChatGPT vs. API, drei Rollen mit Code, **Context-Window live** (Chat, Fenster läuft voll, "what is my name?", Kosten pro Call) | Abschnitt 2 |
| 14:05 | 20 | Vortrag + Zuruf | GenAI Teil 3: Context vs. World knowledge, "what happens when context is missing" (Abstimmung A/B), **"Spot the hallucination"** (sechs Karten, Handzeichen, Klick), drei Grenzen und drei Fixes, wie Context reinkommt (manuell vs. automatisch) | Abschnitt 3 |
| 14:25 | 15 | Pause | | |
| 14:40 | 30 | Vortrag + Live | GenAI Teil 4: Embeddings (Bild + king/queen), **Embedding-Karte live** (25 ShopNow-Begriffe, "Kaffeemühle" klicken), Vector Search, **RAG-Trace** (Schritt für Schritt), **Agent-Trace** (ReAct mit get_order und DHL-Tool), **Harness** (Modell in der Mitte, drumherum System-Prompt, Tools, Permissions, Memory, Logs, Evals; ChatGPT vs. Claude Code vs. Lab-Notebook; Workflow vs. Agent), Deep Agents, **MCP** (SVG + Request-Flow), Landschaft Mitte 2026, "Before you deploy" (Injection, Leak, falsche Aktionen) als Brücke zum Lab | Abschnitt 4 |
| 15:10 | 45 | **Lab + Red Teaming (Paare)** | Notebook (neu 2026-11-12): 40 ShopNow-Produkte werden mit `text-embedding-3-small` eingebettet, Vektordatenbank in numpy, alles vorgegeben. Task 1 Vector- vs. Keyword-Suche (drei Queries, eine auf Deutsch), Task 2 gegroundeter Assistent (RAG, drei Fragen prüfen), Task 3 Tool `get_order` (Function Calling, eine Runde), Task 4 Red Teaming (erfinden, Daten fremder Kunden über das Tool, Prompt Injection über eine Produktbeschreibung mit `add_product`). API-Key an die Tafel, Kosten wenige Cent. Jedes Paar nennt einen Fund (1 min), die Funde sind Munition fürs Streitgespräch | `colab/agents_and_vector_databases.ipynb` + Solution |
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
- [ ] Leitfragen für Streitgespräch 1 als Sprechernotizen ins A/B-Deck (Taste `s`); Streitgespräch 2 hat seine Slide mit Notizen im GenAI-Deck
- [x] **Leaderboard-Notebook** `colab/classification_leaderboard.ipynb` (2026-11-12): synthetische ShopNow-Bestellungen mit
  Fraud-Label, fester Split, Pipeline, Baseline, eine Zelle mit vier Parametern, Overfitting-Tabelle für die Auswertung;
  auf der Kursseite verlinkt. `colab/introduction_ai.ipynb` bleibt als Übung stehen, wird nicht mehr vorausgesetzt
- [x] `colab/agents_and_vector_databases.ipynb` + Solution neu gebaut (2026-11-12): Vektordatenbank mit OpenAI-Embeddings, RAG, Tool, Red Teaming. **Vor Montag einmal mit echtem Key durchlaufen lassen** (Claude konnte die API-Aufrufe nicht testen, nur den Code mit einem Fake-Client); OpenAI-Key mit kleinem Budget anlegen (Modelle `text-embedding-3-small`, `gpt-5-mini`, in Zelle 1 änderbar)
- [ ] Quiz-Fragen aus `exam/mock_exam.md` auswählen: 15 (Tag 3 Ende: BI, DB, DM, A/B), 8 (Tag 4 Start), 15 (Tag 4 Ende: AI, GenAI). Tag-3-Start ist jetzt der Entry Test (`exam/entry_test_day3.pdf`), vorher drucken: eine Kopie pro Person plus Lösung
- [x] GenAI-Deck komplett neu gebaut (2026-11-12): Full-HTML-Deck mit `genai.js`, acht Live-Bausteine, Landschaft Mitte 2026, MCP. Vor Montag: Slide "The landscape" und die Preise im GPU-Rechner (H100 ca. 30 k$, 2.5 $/h) gegenlesen
- [x] Kursseite `index.html` (2026-11-13): Planungstabelle ersetzt durch Tages-Karten (Lectures und Exercises je vier Karten, gleiche Farbe pro Tag), Entry Test und Code-Runde auf der Tag-3-Karte, Datumsfehler 2027 korrigiert, Homework-Block entfernt
- [ ] Timer-Slide oder Handy-Timer für Pitches (2 min), Expertenrunde und Streitgespräche

<style>
.small-list {
    font-size: 0.7em;
    list-style: none;
    counter-reset: section;
}
.small-list li {
    counter-increment: section;
    margin-bottom: 0.5em;
}
.smaller-list {
    font-size: 0.6em;
    list-style: none;
    counter-reset: section;
}
.smaller-list li {
    counter-increment: section;
    margin-bottom: 0.5em;
}
.small-text {
    font-size: 0.7em;
}
.smaller-text {
    font-size: 0.6em;
}
.two-col {
    display: flex;
    gap: 2rem;
    justify-content: center;
    text-align: left;
}
.two-col > div {
    flex: 1;
}
.badge {
    display: inline-block;
    border: 2px solid #f0b03f;
    color: #f0b03f;
    border-radius: 8px;
    padding: 0.05em 0.5em;
    font-size: 0.5em;
    letter-spacing: 0.08em;
    vertical-align: middle;
}
.task {
    text-align: left;
    font-size: 0.75em;
}
.task li {
    margin-bottom: 0.4em;
}
</style>

### Where are we?

<svg viewBox="200 190 1700 700" style="width: 100%; max-height: 480px; background: transparent" font-family="Helvetica, Arial, sans-serif" fill="#fff" text-anchor="middle" font-size="56">
  <rect x="355" y="213" width="1145" height="120" fill="#5f5f5f"/>
  <text x="928" y="291" font-size="56">Decisions</text>
  <rect x="355" y="347" width="1145" height="120" fill="#8e8e8e"/>
  <text x="928" y="425" font-size="56">Reporting (Visualisation)</text>
  <rect x="355" y="481" width="1145" height="120" fill="#8e8e8e"/>
  <text x="928" y="559" font-size="56">Data Analysis &amp; Exploration</text>
  <rect x="355" y="615" width="1145" height="120" fill="#f0b03f"/>
  <text x="928" y="693" font-size="56">Data Warehousing / Data Marts</text>
  <rect x="355" y="749" width="1145" height="120" fill="#5f5f5f"/>
  <text x="928" y="827" font-size="48">Raw Data (self produced or foreign sources)</text>
  <rect x="230" y="213" width="110" height="654" fill="#5f5f5f"/><text x="285" y="560">AI</text>
  <path d="M1500,807 H1550 V673 H1517" fill="none" stroke="#f0b03f" stroke-width="6"/><polygon points="1503,673 1527,658 1527,688" fill="#f0b03f"/>
  <text x="1560" y="720" font-size="42" fill="#f0b03f" text-anchor="start">Data Integration</text><text x="1560" y="765" font-size="42" fill="#f0b03f" text-anchor="start">ETL / ELT</text>
</svg>

<span style="color: lightgreen;">Between Anna's order (day 1) and the dashboard: where does the data live, and who brings it into shape?</span>

Note:

- 30 seconds only. Same stack as in the BI deck, today we are on the orange layer and the arrow next to it. AI spans all layers: it needs this layer as much as a dashboard does, and it increasingly builds this layer (more on that at the end).
- Anna, the coffee grinder and the five source systems with three different IDs are from the BI walkthrough on day 1. That mess is where today starts.

---

### Today you do three things

<ol class="task" style="font-size: 0.85em;">
  <li><b>Build</b> an ETL pipeline from raw clicks to a dashboard table (pairs, Colab)</li>
  <li><b>Explain</b> one data architecture to the others (expert groups)</li>
  <li><b>Pick</b> an architecture for a company and defend it with numbers (group competition)</li>
</ol>

<p class="small-text">Then: spot the pattern in a real company, and what this has to do with AI.</p>

Note:

- Lecturer talks for about 15 minutes in total today. Everything else is the students. Keep it that way, even when the solutions look tempting to present.

---

### 1. You are the ETL process <span class="badge">12 MIN</span>

<div class="task">

ShopNow wants a daily funnel dashboard: sessions → add to cart → orders, per day and traffic source, with bounce rate, conversion and revenue in EUR. Two raw sources: one row per click, one row per order.

<ul>
  <li>in pairs, open the Colab notebook <a href="https://colab.research.google.com/github/styx0r/msb_lecture_data_management_and_business_intelligence_2026/blob/main/colab/data_management_etl.ipynb">ETL by hand</a></li>
  <li>Task 1: find three things that are messy (2 min)</li>
  <li>Task 2: build the clean staging tables (6 min)</li>
  <li>Task 3: build the one table the dashboard needs (4 min)</li>
  <li>get as far as you can, stop when the timer rings</li>
</ul>

<p class="smaller-text">No laptop? Paper: which columns and rows does the dashboard table need, and how do you get them from the raw tables (next slide)?</p>

</div>

Note:

- Start the timer visibly. Walk around. Typical sticking points: date parsing format string, the groupby/agg syntax (hints are in the notebook), merge with how="left".
- Do not help with the concepts, only with syntax. The goal is that they feel the three steps, not that everybody finishes.
- Guiding question while walking: "Which of these steps would you want to run every night automatically?" (all of them, that is the pipeline).
- Paper fallback: ask for the columns of the dashboard table and how each column is computed from the raw tables.

--

#### Raw tables (messy)

<div class="two-col">
  <div>
    <div style="color: orange;">raw_web_events</div>
    <table class="small-list">
      <tr><th>event_time</th><th>session_id</th><th>user_id</th><th>event</th><th>utm_source</th></tr>
      <tr><td>2024/10/01 12:01</td><td>s-11</td><td>u-7</td><td>page_view</td><td>paid</td></tr>
      <tr><td>2024/10/01 12:02</td><td>s-11</td><td>u-7</td><td>add_to_cart</td><td>paid</td></tr>
      <tr><td>2024/10/01 12:03</td><td>s-12</td><td>u-9</td><td>page_view</td><td>organic</td></tr>
    </table>
  </div>
  <div>
    <div style="color: orange;">raw_orders</div>
    <table class="small-list">
      <tr><th>order_time</th><th>order_id</th><th>session_id</th><th>total_cents</th><th>currency</th></tr>
      <tr><td>2024-10-01T12:05Z</td><td>O-1001</td><td>s-11</td><td>12990</td><td>USD</td></tr>
      <tr><td>2024-10-01T12:10Z</td><td>O-1002</td><td>s-12</td><td>4990</td><td>EUR</td></tr>
    </table>
  </div>
</div>

<div style="margin-top: 0.6rem; font-size: 0.85em;">
  <span style="color: lightgreen;">What is messy here?</span>
</div>

Note:

- Collect three answers from the plenum before showing the next slide: two time formats (and both are text), several rows per session, cents in two currencies.
- Fourth one nobody names: nothing here says what a "session" or a "bounce" is. Business definitions live in the transform step.

--

#### Staging tables (cleaned, reusable)

<div class="two-col">
  <div>
    <div style="color: orange;">stg_sessions</div>
    <table class="small-list">
      <tr><th>session_id</th><th>date</th><th>utm_source</th><th>events</th><th>add_to_cart</th><th>bounce</th></tr>
      <tr><td>s-11</td><td>2024-10-01</td><td>paid</td><td>5</td><td>1</td><td>0</td></tr>
      <tr><td>s-12</td><td>2024-10-01</td><td>organic</td><td>1</td><td>0</td><td>1</td></tr>
    </table>
  </div>
  <div>
    <div style="color: orange;">stg_orders</div>
    <table class="small-list">
      <tr><th>order_id</th><th>date</th><th>session_id</th><th>revenue_eur</th></tr>
      <tr><td>O-1001</td><td>2024-10-01</td><td>s-11</td><td>118.21</td></tr>
      <tr><td>O-1002</td><td>2024-10-01</td><td>s-12</td><td>49.90</td></tr>
    </table>
  </div>
</div>

<div style="margin-top: 0.6rem; font-size: 0.85em;">
  One row per business object, real types, one currency. Reusable for many dashboards (marketing, finance, product).
</div>

Note:

- Ask: "Who else in the company could use stg_orders?" Finance (revenue per month), product (which products), customer service (orders per customer). That is why staging exists: clean once, use many times.

--

#### Mart table (dashboard-specific)

<div style="color: orange;">mart_daily_funnel</div>
<table class="small-list">
  <tr><th>date</th><th>utm_source</th><th>sessions</th><th>bounces</th><th>add_to_cart</th><th>orders</th><th>revenue_eur</th><th>conversion</th></tr>
  <tr><td>2024-10-01</td><td>paid</td><td>120</td><td>18</td><td>45</td><td>20</td><td>2,310.40</td><td>16.7%</td></tr>
  <tr><td>2024-10-01</td><td>organic</td><td>180</td><td>40</td><td>30</td><td>15</td><td>1,480.90</td><td>8.3%</td></tr>
</table>

<div style="margin-top: 0.6rem; font-size: 0.85em;">
  Built exactly for the dashboard charts. The chart code is one line.
</div>

--

#### What you just did has names

<table class="small-list" style="margin: 0 auto;">
  <tr><th>Your step</th><th>Name</th><th>Where it lives</th></tr>
  <tr><td>looked at the two source tables</td><td style="color: orange;"><b>E</b>xtract</td><td>source systems (tracking tool, shop backend)</td></tr>
  <tr><td>parsed dates, converted currency, one row per session</td><td style="color: orange;"><b>T</b>ransform</td><td>staging tables</td></tr>
  <tr><td>built the one table the dashboard needs</td><td style="color: orange;"><b>L</b>oad</td><td>data mart in the <b>data warehouse</b></td></tr>
</table>

<p class="small-text">A <b>data warehouse</b> is the place where cleaned, structured tables live, built from many sources by ETL, so that reporting is fast and consistent.</p>

<p class="small-text">Library analogy: to answer "Q4 revenue in Germany" you go to the right shelf (sales) and index (country, date). Nobody re-reads every receipt.</p>

Note:

- This is the only definition slide of the morning. Say it once, point back to what they did, move on.

--

#### The picture of what you built

<img
  src="../assets/data_management/imgs/imgs.002.png"
  alt="Data Warehouse"
  style="
    width: 1600px;
    margin: 0 auto 2rem auto;
    background: transparent;
  "
/>

Note:

- Left: short-term persistence, the sources keep data only for a while (7-day logs, API limits). Middle: transform, nothing is stored. Right: long-term persistence, the warehouse keeps the marts. Then reporting.
- Ask: "Where in this picture was your notebook?" In the middle box. In real life it runs every night, unattended.

--

#### What makes a good ETL process?

<ul class="small-list">
  <li><b>Schema documentation:</b> clear column names and types (order_date is a date, not text)</li>
  <li><b>Traceability:</b> know the source of each mart (dependency graph raw → staging → mart)</li>
  <li><b>Monitoring and alerts:</b> missing data triggers a notification (Slack, email)</li>
  <li><b>Testing and logging:</b> row counts, null checks, unknown currencies, errors are logged</li>
</ul>

<span style="color: lightgreen;">Task 4 in the notebook: where would you put a test so that a broken tracking tool is noticed before the dashboard is wrong?</span>

Note:

- Take two answers from the reflection task. Expected: between raw and staging (row counts per day, no nulls in session_id, only known currencies). The CHF question shows the silent failure: np.where treats CHF like EUR, no error, wrong revenue.

--

#### Use tooling meant for this purpose

<ul class="small-list">
  <li>Often done with plain Python: connect to sources, transform, load into the warehouse. Works, until the third person touches it.</li>
  <li>By far better: a tool like <b>dbt</b>. Each staging and mart table is one SQL file, by convention in a folder structure; documentation, tests and lineage come for free.</li>
</ul>

<img
  src="../assets/data_management/imgs/imgs.010.png"
  alt="dbt documentation web UI with lineage graph"
  style="
    max-height: 300px;
    width: auto;
    margin: 0 auto 0 auto;
    background: transparent;
  "
/>

Note:

- The screenshot is the dbt docs UI: every box is a table, the arrows are the lineage raw → staging → mart. This is "traceability" from the slide before, generated from the code.
- One sentence on ELT vs ETL: with cheap storage people load raw data first and transform inside the warehouse. Same steps, different order, the lake slides explain why.

---

### 2. Expert groups <span class="badge">8 + 2 MIN</span>

<div class="task">

Each group gets one architecture picture and one question. Prepare 8 minutes, then 2 minutes per group at the screen: <b>point at the picture</b> while you explain.

<table class="small-list" style="margin: 0.5em auto;">
  <tr><th>Group</th><th>Architecture</th><th>Your question</th></tr>
  <tr><td>1 and 5</td><td>Data Warehouse</td><td>What can be high cost drivers in a pure warehouse?</td></tr>
  <tr><td>2 and 6</td><td>Data Lake</td><td>Pros and cons? Where is the "swamp" risk?</td></tr>
  <tr><td>3</td><td>Hybrid Data Lake</td><td>Storage is doubled. When is it still advisable?</td></tr>
  <tr><td>4</td><td>Lakehouse</td><td>Lower complexity than hybrid. What is the catch?</td></tr>
</table>

Every group also names <b>one company situation</b> in which they would pick their architecture.

</div>

Note:

- Groups get the picture and the description slide (down arrow on the following slides, or printed). Pros/cons slides stay hidden until the group has presented.
- With fewer than 6 groups: warehouse and lake once each, hybrid and lakehouse once each.
- While they present: do not interrupt. Afterwards correct with the hidden slides only where something was wrong or missing, max 4 minutes in total.
- Common gaps: warehouse group forgets that raw data can be lost; lake group forgets that every query costs compute; hybrid group does not say "two systems to maintain"; lakehouse group does not know that a separate query engine is needed.

--

<span style="color: orange;">Data Warehouse</span> (groups 1 and 5)

<img
  src="../assets/data_management/imgs/imgs.002.png"
  alt="Data Warehouse"
  style="
    width: 1400px;
    margin: 0 auto 1rem auto;
    background: transparent;
  "
/>

<p class="smaller-text">Central hub for cleaned, structured data. Many sources are collected, cleaned and loaded (ETL) into consistent tables. Result: fast, consistent reporting.</p>

--

<span style="color: lightgreen;">What can be high cost drivers in a pure data warehouse architecture?</span>

<ul class="small-list">
  <li><b>Schema changes:</b> changing a mart often means reprocessing months or years of data</li>
  <li><b>Complex ETL:</b> many joins and transformations increase compute time</li>
  <li><b>Large history reloads:</b> backfills are expensive</li>
  <li><b>Many marts:</b> maintaining many curated tables adds cost and effort</li>
</ul>

--

<div class="two-col">
  <div>
    <div style="color: orange;">Pros</div>
    <ul class="smaller-list">
      <li><b>Clear lineage:</b> you can see how a table was built</li>
      <li><b>Fast queries:</b> dashboards load quickly on curated marts</li>
      <li><b>Stronger governance:</b> access control by domain (HR mart separate from sales)</li>
    </ul>
  </div>
  <div>
    <div style="color: orange;">Cons</div>
    <ul class="smaller-list">
      <li><b>Less flexible for raw exploration:</b> not ideal for logs, text, images</li>
      <li><b>Schema changes are costly:</b> pipelines have to be reloaded</li>
      <li><b>Raw data may be lost:</b> if the source keeps data only briefly (7-day logs)</li>
    </ul>
  </div>
</div>

--

<span style="color: orange;">Data Lake</span> (groups 2 and 6)

<img
  src="../assets/data_management/imgs/imgs.003.png"
  alt="Data Lake"
  style="
    width: 1400px;
    margin: 0 auto 1rem auto;
    background: transparent;
  "
/>

<p class="smaller-text">Central hub for all kinds of data. Information is extracted and loaded directly, without transformation. A copy of the original sources, kept long-term, for exploration, data science and machine learning.</p>

--

<span style="color: lightgreen;">Pros and cons of the Data Lake?</span>

<div class="two-col">
  <div>
    <div style="color: orange;">Pros</div>
    <ul class="smaller-list">
      <li>high flexibility, no limits regarding format, type or amount of data</li>
      <li>cheap storage (roughly $0.01 to $0.025 per GB per month)</li>
      <li>raw data is never lost, you can always rebuild</li>
    </ul>
  </div>
  <div>
    <div style="color: orange;">Cons</div>
    <ul class="smaller-list">
      <li>higher costs for processing: every query works on raw data</li>
      <li>lack of structure, lack of transparency: risk of becoming a <b>data swamp</b></li>
      <li>security: hard to spot threats in a vast amount of formats</li>
      <li>no default query execution, another tool is necessary</li>
    </ul>
  </div>
</div>

--

<span style="color: orange;">Hybrid Data Lake</span> (group 3)

<img
  src="../assets/data_management/imgs/imgs.004.png"
  alt="Hybrid Data Lake"
  style="
    width: 1400px;
    margin: 0 auto 1rem auto;
    background: transparent;
  "
/>

<p class="smaller-text">Combines the advantages of warehouse and lake, at the expense of complexity: two systems, data stored twice.</p>

<span style="color: lightgreen;">Storage is doubled. When is it still advisable?</span>

Note:

- Expected: when low-latency operational BI (dashboards with many users, sub-second queries) and cheap exploration of raw data are both hard requirements, and the team can run two systems. Typical in larger companies with a mature data team.

--

<span style="color: orange;">Data Lakehouse</span> (group 4)

<img
  src="../assets/data_management/imgs/imgs.005.png"
  alt="Lakehouse"
  style="
    width: 1400px;
    margin: 0 auto 1rem auto;
    background: transparent;
  "
/>

<p class="smaller-text">Combines the advantages of warehouse and lake and keeps complexity low: one storage, transformation happens inside, a standalone query engine on top.</p>

<span style="color: lightgreen;">Lower complexity than hybrid. What is the catch?</span>

Note:

- Expected: a separate query engine is necessary (Dremio, Trino, Spark, Databricks), performance for many concurrent dashboard users is below a tuned warehouse, and the table format (Iceberg, Delta) is a skill the team must have.

--

#### Hybrid Data Lake or Lakehouse?

<ul class="small-list">
  <li><b>Hybrid Data Lake:</b> high performance (low latency for operational BI) with cheap exploration, paid for with two systems</li>
  <li><b>Lakehouse:</b> lower complexity, less maintenance, still good performance, sufficient for most cases</li>
</ul>

<p class="small-text">Don't think of these architectures as set in stone. They all have advantages and disadvantages and are applied in modified and combined forms.</p>

---

### 3. Architecture competition <span class="badge">COLAB</span> <span class="badge">10 + 2 MIN</span>

<div class="task">

A company has to choose one of the four architectures. Cost table and usage are in the notebook <a href="https://colab.research.google.com/github/styx0r/msb_lecture_data_management_and_business_intelligence_2026/blob/main/colab/data_management_architecture.ipynb">Data management: cost estimation</a>.

<ul>
  <li>each group calculates the <b>2-year cost of its own architecture</b> (the one you just explained), 10 min</li>
  <li>write your total and the five components on the whiteboard <span class="badge">WHITEBOARD</span></li>
  <li>then 2 min per group: <b>recommend one architecture to the company, not your own</b>. One cost argument, one non-cost argument.</li>
</ul>

<p class="smaller-text">Bonus at home: calculate all four and check the whiteboard. Plus: what changes after an incident and a schema update (bonus task in the notebook).</p>

</div>

Note:

- Whiteboard table: rows = architectures, columns = acquisition, storage, transfer, queries, maintenance, total. Prepare it during the expert round.
- Reference numbers (solution notebook, month = 365/12 days): Lakehouse 7,603, Data Lake 7,957, Data Warehouse 8,870, Hybrid 9,650 dollars in 2 years. Acquisition (2,983) and transfer (1,821) are identical for all, so the ranking comes from storage, queries and maintenance.
- When two groups have the same architecture and different numbers: that is the discussion. Typical causes: month = 30 vs 365/12 days, TB vs GB, forgetting that storage is billed every month on the growing volume.
- Recommendation round: the "not your own" rule forces them to use the other groups' arguments. Push for non-cost arguments: team skills, share of unstructured data, how often schemas change, how many dashboard users.
- Wrap up in 3 sentences: cheapest on paper is the lakehouse, the warehouse buys speed and governance, hybrid only when both are hard requirements. And: cost is never the only factor.

---

### Spot the pattern: a real company

<img
  src="../assets/data_management/imgs/imgs.007.png"
  alt="lyvy lakehouse architecture"
  style="
    max-height: 480px;
    width: auto;
    margin: 0 auto 0.5rem auto;
    background: transparent;
  "
/>

<span style="color: lightgreen;">Where is Extract, where is Load, where is Transform? Which of the four architectures is this?</span>

Note:

- Zuruf, 5 minutes. Extract and Load: dlt (dltHub) pulls from the ad platforms and tracking into raw data, Skupper connects the secured sources. Storage: MinIO filesystem, that is the lake. Transform: dbt builds the marts, Dremio is the query engine on Iceberg tables. Reporting: Superset. Orchestration: Argo on Kubernetes.
- Architecture: a lakehouse. One storage, transformation inside, a query engine on top, no separate warehouse.
- Ask: "Which of the four cost components from the competition would you worry about here?" Maintenance: self hosted on k8s means people, not a cloud bill.

---

### AI at every layer

<ul class="small-list">
  <li><b>AI consumes this layer:</b> the regression this afternoon and the classifier on Monday train on staging tables, not on raw clicks. Garbage in, garbage out applies to models more than to dashboards.</li>
  <li><b>AI needs the lake:</b> documents, images, support tickets have no columns. On day 4 they become embeddings in a vector database, and they come from the lake, not from the warehouse.</li>
  <li><b>AI builds this layer:</b> today most ETL and dbt code is written with an LLM. The tests from "what makes a good ETL process" are what keeps that safe.</li>
</ul>

Note:

- This is why the AI bar spans all layers in the stack. Keep it to one minute, it is a bridge to Monday.

---

### Takeaways

<ul class="small-list">
  <li>Between raw sources and a dashboard sits a pipeline: <b>Extract, Transform, Load</b>. You built one.</li>
  <li><b>Staging</b> tables are cleaned once and reused many times, <b>marts</b> are built for one purpose.</li>
  <li>A <b>warehouse</b> stores curated tables, a <b>lake</b> stores everything raw, a <b>lakehouse</b> tries to do both with one storage.</li>
  <li>The choice is a trade-off: cost, query speed, flexibility, team skills. Never cost alone.</li>
  <li>Good pipelines are documented, tested and monitored. Tools like dbt make that cheap.</li>
</ul>

---

### Optional: self-study for the exam

<div class="task">

<p><b>On-Premises vs. Cloud</b> (exam relevant). Read <a href="https://www.bmc.com/blogs/saas-vs-paas-vs-iaas-whats-the-difference-and-how-to-choose/">this article</a> and explain in your own words: what is the difference between on-premises and cloud, and how do IaaS, PaaS and SaaS differ?</p>

<p><b>Realtime architecture</b>: the next slide shows a streaming setup with Kafka. Which of the four architectures does it resemble, and what is different about "when" data arrives?</p>

</div>

--

#### A realtime architecture

<img
  src="../assets/data_management/imgs/imgs.008.png"
  alt="Realtime architecture with Kafka"
  style="
    width: 1500px;
    margin: 0 auto 1rem auto;
    background: transparent;
  "
/>

Note:

- Only if there is time left. Producer writes events in real time, Kafka keeps them as a long-term log (the lake), consumers transform and load into a warehouse (here ArangoDB). Same ETL steps, but continuous instead of nightly.

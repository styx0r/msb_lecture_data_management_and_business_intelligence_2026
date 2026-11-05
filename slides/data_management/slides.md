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
.tname {
    color: orange;
    font-size: 0.6em;
    text-align: left;
    margin: 0.3em 0 0 0;
}
table.tbl {
    font-size: 0.45em;
    margin: 0 0 0.3em 0;
    white-space: nowrap;
}
table.tbl th, table.tbl td {
    padding: 0.15em 0.7em;
}
table.tbl th {
    color: #f0b03f;
}
.reveal pre {
    width: 100%;
    font-size: 0.36em;
    box-shadow: none;
    margin: 0.3em auto;
}
.reveal pre code {
    max-height: 560px;
    padding: 0.5em 0.8em;
    line-height: 1.25;
}
.steps {
    font-size: 0.45em;
    text-align: left;
    color: #bbb;
    margin: 0.2em 0 0 0;
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

</div>

Note:

- Start the timer visibly. Walk around. Typical sticking points: date parsing format string, the groupby/agg syntax (hints are in the notebook), merge with how="left".
- Do not help with the concepts, only with syntax. The goal is that they feel the three steps, not that everybody finishes.
- Guiding question while walking: "Which of these steps would you want to run every night automatically?" (all of them, that is the pipeline).
- Paper fallback: ask for the columns of the dashboard table and how each column is computed from the raw tables.

--

#### Raw tables (messy)

<div class="tname">raw_web_events (one row per click)</div>
<table class="tbl">
  <tr><th>event_time</th><th>session_id</th><th>user_id</th><th>event</th><th>utm_source</th></tr>
  <tr><td>2024/10/01 17:26</td><td>s-100</td><td>u-4</td><td>page_view</td><td>email</td></tr>
  <tr><td>2024/10/01 17:29</td><td>s-100</td><td>u-4</td><td>page_view</td><td>email</td></tr>
  <tr><td>2024/10/01 17:30</td><td>s-100</td><td>u-4</td><td>add_to_cart</td><td>email</td></tr>
  <tr><td>2024/10/01 18:47</td><td>s-101</td><td>u-29</td><td>page_view</td><td>email</td></tr>
</table>

<div class="tname">raw_orders (one row per order)</div>
<table class="tbl">
  <tr><th>order_time</th><th>order_id</th><th>user_id</th><th>session_id</th><th>total_cents</th><th>currency</th></tr>
  <tr><td>2024-10-01T18:54Z</td><td>O-1001</td><td>u-29</td><td>s-101</td><td>23278</td><td>EUR</td></tr>
  <tr><td>2024-10-01T17:54Z</td><td>O-1002</td><td>u-18</td><td>s-104</td><td>10116</td><td>EUR</td></tr>
  <tr><td>2024-10-01T12:59Z</td><td>O-1003</td><td>u-38</td><td>s-105</td><td>4553</td><td>USD</td></tr>
</table>

<div style="margin-top: 0.4rem; font-size: 0.8em;">
  <span style="color: lightgreen;">What is messy here?</span>
</div>

Note:

- Collect three answers from the plenum before showing the answer slide: two time formats (and both are text), several rows per session, cents in two currencies.
- Fourth one nobody names: nothing here says what a "session" or a "bounce" is. Business definitions live in the transform step.

--

<!-- .slide: data-visibility="hidden" -->

#### Task 1: what is messy <span class="badge">ANSWER</span>

<ul class="smaller-list" style="text-align: left;">
  <li><b>Two time formats, both text.</b> <code>2024/10/01 17:26</code> vs. <code>2024-10-01T18:54Z</code>. <code>raw_web_events.dtypes</code> says <code>object</code> (or <code>str</code>) for every column: nothing is a date yet, you cannot group by day.</li>
  <li><b>Wrong grain.</b> One row per click, but the dashboard counts sessions. Session s-100 appears three times.</li>
  <li><b>Money in cents and in two currencies.</b> Summing <code>total_cents</code> adds dollars to euros.</li>
  <li><b>Missing definitions (nobody names this one).</b> Nothing in the data says what a "session", a "bounce" or a "conversion" is. These are business rules, and they live in the transform step.</li>
</ul>

--

#### How to approach it (any ETL task)

<ol class="smaller-list" style="text-align: left; margin: 0 auto;">
  <li><b>Look before you code.</b> <code>.head()</code>, <code>.dtypes</code>. Everything <code>object</code>? Then nothing is a date or a number yet.</li>
  <li><b>Decide the grain.</b> One row per what? Raw: click. Staging: session, order. Mart: day and source.</li>
  <li><b>Fix types first.</b> <code>pd.to_datetime(..., format=...)</code>, cents to euros, one currency.</li>
  <li><b>One row per business object.</b> Helper column per row, then <code>groupby().agg()</code> with named columns.</li>
  <li><b>Join, then aggregate.</b> <code>merge(how="left")</code>, <code>fillna(0)</code>, then groupby to the mart grain.</li>
  <li><b>Check.</b> Row counts (90 sessions? 26 orders?), no nulls in keys, revenue sum still matches the source?</li>
</ol>

Note:

- This is the method slide, show it before the solution. Every step maps to a cell in the solution notebook.
- Step 1 is the one students skip: they start typing before they know that event_time is text. Make them run .dtypes.

--

#### Staging tables (cleaned, reusable)

<div class="tname">stg_sessions (one row per session)</div>
<table class="tbl">
  <tr><th>session_id</th><th>date</th><th>utm_source</th><th>events</th><th>add_to_cart</th><th>bounce</th></tr>
  <tr><td>s-100</td><td>2024-10-01</td><td>email</td><td>3</td><td>1</td><td>0</td></tr>
  <tr><td>s-101</td><td>2024-10-01</td><td>email</td><td>4</td><td>1</td><td>0</td></tr>
  <tr><td>s-102</td><td>2024-10-01</td><td>organic</td><td>1</td><td>0</td><td>1</td></tr>
</table>

<div class="tname">stg_orders (one row per order, EUR)</div>
<table class="tbl">
  <tr><th>order_id</th><th>date</th><th>session_id</th><th>revenue_eur</th></tr>
  <tr><td>O-1001</td><td>2024-10-01</td><td>s-101</td><td>232.78</td></tr>
  <tr><td>O-1002</td><td>2024-10-01</td><td>s-104</td><td>101.16</td></tr>
  <tr><td>O-1003</td><td>2024-10-01</td><td>s-105</td><td>41.43</td></tr>
</table>

<div style="margin-top: 0.3rem; font-size: 0.6em;">
  One row per business object, real types, one currency. Reusable for many dashboards (marketing, finance, product).
</div>

Note:

- Ask: "Who else in the company could use stg_orders?" Finance (revenue per month), product (which products), customer service (orders per customer). That is why staging exists: clean once, use many times.

--

<!-- .slide: data-visibility="hidden" -->

#### Task 2a: stg_sessions, step by step <span class="badge">ANSWER</span>

```python [1-2|4-5|7-8|10-16|18-19]
raw_web_events.dtypes            # every column: object / str
events = raw_web_events.copy()   # -> event_time is text, not a date

# 1. fix the type, then extract the day
events["date"] = pd.to_datetime(events["event_time"], format="%Y/%m/%d %H:%M").dt.date

# 2. helper column, computed per row, before the groupby
events["is_add_to_cart"] = events["event"] == "add_to_cart"

# 3. one row per session: groupby + named aggregations
stg_sessions = events.groupby("session_id").agg(
    date=("date", "min"),
    utm_source=("utm_source", "first"),
    events=("event", "count"),
    add_to_cart=("is_add_to_cart", "max"),
).reset_index()

# 4. business rule "bounce": exactly one event
stg_sessions["bounce"] = (stg_sessions["events"] == 1).astype(int)
```

<p class="steps">Check: 90 rows (45 sessions × 2 days), 27 bounces. <code>add_to_cart</code> is still bool, <code>.astype(int)</code> makes it 0/1.</p>

--

<!-- .slide: data-visibility="hidden" -->

#### Task 2b: stg_orders, step by step <span class="badge">ANSWER</span>

```python [1|3-4|6-9|11-12]
raw_orders.dtypes                # order_time: object, total_cents: int64, currency: object

# 1. ISO format: pd.to_datetime understands it without a format string
orders["date"] = pd.to_datetime(orders["order_time"]).dt.date

# 2. cents -> euros, one currency (the rate comes from finance, not from the code)
amount = orders["total_cents"] / 100
orders["revenue_eur"] = np.where(orders["currency"] == "USD",
                                 amount * EUR_PER_USD, amount).round(2)

# 3. keep only what the staging table promises
stg_orders = orders[["order_id", "date", "session_id", "revenue_eur"]]
```

<p class="steps">Check: 26 rows, 3,633.41 EUR in total. Note the silent failure: a third currency (CHF) would be treated like EUR. That is reflection question 1.</p>

--

#### Mart table (dashboard-specific)

<div class="tname">mart_daily_funnel (one row per day and traffic source)</div>
<table class="tbl">
  <tr><th>date</th><th>utm_source</th><th>sessions</th><th>bounces</th><th>add_to_cart</th><th>orders</th><th>revenue_eur</th><th>conversion</th></tr>
  <tr><td>2024-10-01</td><td>email</td><td>13</td><td>4</td><td>7</td><td>5</td><td>900.65</td><td>38.5</td></tr>
  <tr><td>2024-10-01</td><td>organic</td><td>18</td><td>7</td><td>9</td><td>8</td><td>1143.48</td><td>44.4</td></tr>
  <tr><td>2024-10-01</td><td>paid</td><td>14</td><td>1</td><td>9</td><td>3</td><td>390.82</td><td>21.4</td></tr>
  <tr><td>2024-10-02</td><td>email</td><td>18</td><td>9</td><td>5</td><td>2</td><td>203.97</td><td>11.1</td></tr>
  <tr><td>2024-10-02</td><td>organic</td><td>12</td><td>2</td><td>9</td><td>6</td><td>828.55</td><td>50.0</td></tr>
  <tr><td>2024-10-02</td><td>paid</td><td>15</td><td>4</td><td>6</td><td>2</td><td>165.94</td><td>13.3</td></tr>
</table>

<div style="margin-top: 0.3rem; font-size: 0.6em;">
  Built exactly for the dashboard charts. The chart code is one line:<br/><code style="font-size: 0.75em;">mart.pivot(index="date", columns="utm_source", values="conversion").plot.bar()</code>
</div>

Note:

- Six rows, that is the whole dashboard. Ask: "How many rows did we start with?" 259 events and 26 orders. ETL is compression into exactly the shape one question needs.

--

<!-- .slide: data-visibility="hidden" -->

#### Task 3: mart_daily_funnel, step by step <span class="badge">ANSWER</span>

```python [1-4|6-9|11-17|19-21]
# 1. bring orders to the grain of sessions: one row per session
orders_per_session = stg_orders.groupby("session_id").agg(
    orders=("order_id", "count"), revenue_eur=("revenue_eur", "sum")
)

# 2. left join: sessions without an order must survive (with 0, not NaN)
sessions = stg_sessions.merge(orders_per_session, on="session_id", how="left")
sessions = sessions.fillna({"orders": 0, "revenue_eur": 0})
sessions["orders"] = sessions["orders"].astype(int)

# 3. aggregate to the grain of the dashboard: day x traffic source
mart_daily_funnel = sessions.groupby(["date", "utm_source"]).agg(
    sessions=("session_id", "count"), bounces=("bounce", "sum"),
    add_to_cart=("add_to_cart", "sum"), orders=("orders", "sum"),
    revenue_eur=("revenue_eur", "sum"),
).reset_index()

# 4. derived KPI, computed last, from the aggregated columns
mart_daily_funnel["conversion"] = (
    100 * mart_daily_funnel["orders"] / mart_daily_funnel["sessions"]).round(1)
```

<p class="steps">Check: 6 rows, sessions sum to 90, orders to 26, revenue to 3,633.41. Common mistake: <code>how="inner"</code> drops the 64 sessions without an order and the conversion rate becomes 100%.</p>

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

--

<!-- .slide: data-visibility="hidden" -->

#### Task 4: reflection <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li><b>CHF:</b> step 2b breaks silently. <code>np.where(currency == "USD", ...)</code> treats CHF like EUR, revenue is wrong, no error. You notice it only when someone compares the dashboard to the bank account. Fix: a currency table and a test that fails on unknown currencies.</li>
  <li><b>Finance report:</b> start from <code>stg_orders</code>. Clean (dates, EUR) but not yet aggregated for one dashboard. The mart is too specific, raw is too messy. Clean once, use many times.</li>
  <li><b>Test:</b> between raw and staging. Row counts per day (zero events = tracking broken), no nulls in session_id, every session_id in orders exists in events, only known currencies. dbt lets you declare these in a few lines.</li>
</ul>

---

### How to read the pictures

<div class="task">

All four architecture pictures are built from the same parts. They differ in only two things: <b>where</b> data is stored and <b>when</b> it is transformed.

<table class="small-list" style="margin: 0.5em auto;">
  <tr><th>In the picture</th><th>Meaning</th><th>Ask yourself</th></tr>
  <tr><td>grey column with "persistence"</td><td>a place where data is stored, short-term or long-term</td><td>how many storages? what is kept raw, what cleaned?</td></tr>
  <tr><td>gear</td><td>Transform: cleaning, joining, aggregating (your notebook)</td><td>before or after the long-term storage?</td></tr>
  <tr><td>orange arrows E, L</td><td>Extract and Load: data moves</td><td>how often is data copied, and where to?</td></tr>
  <tr><td>right column</td><td>who uses the data: reporting, data science</td><td>what do they need: fast queries or raw material?</td></tr>
</table>

</div>

Note:

- 3 minutes, lecturer. This is the key to all four pictures. Point at the warehouse picture: one long-term storage, transform before it, reporting on the right. Every other picture is a variation of that.

---

### 2. Expert groups <span class="badge">8 + 2 MIN</span>

<div class="task">

One architecture per group: a <b>briefing</b> (picture plus facts, down arrow under your architecture) and <b>one question</b> the briefing does not answer. 8 min preparation, then 2 min per group at the screen, <b>finger on the picture</b>.

<table class="small-list" style="margin: 0.5em auto;">
  <tr><th>Group</th><th>Architecture</th><th>Your question</th></tr>
  <tr><td>1 and 5</td><td>Data Warehouse</td><td>After a year ShopNow changes the definition of "bounce". What has to happen in your architecture, and what does it cost?</td></tr>
  <tr><td>2 and 6</td><td>Data Lake</td><td>Three years in, nobody knows what the 400 folders contain. What went wrong, and why is every query more expensive than in the warehouse?</td></tr>
  <tr><td>3</td><td>Hybrid Data Lake</td><td>You store everything twice. Name one company where that is still right and one where it is waste. What decides?</td></tr>
  <tr><td>4</td><td>Lakehouse</td><td>What does the lakehouse need that the warehouse already includes, and which skill does your team need for it?</td></tr>
</table>

Also name <b>one company situation</b> where you would pick your architecture. Asking an LLM is allowed, reading its answer from the phone is not.

</div>

Note:

- Presentation order: warehouse, lake, hybrid, lakehouse. The later groups may build on the earlier ones ("hybrid is both of those").
- During the 8 minutes go to groups 3 and 4 first, they have the hardest pictures.
- The answers are on hidden slides (ANSWER badge) under each briefing. They are hidden while `SHOW_SOLUTIONS` at the top of index.html is false; set it to true and commit after the lecture. After all four talks: correct only what was wrong, max 4 minutes, then the summary slide.
- With fewer than 6 groups: warehouse and lake once each, hybrid and lakehouse once each.

--

#### Briefing: <span style="color: orange;">Data Warehouse</span> (groups 1 and 5)

<img
  src="../assets/data_management/imgs/imgs.002.png"
  alt="Data Warehouse"
  style="
    max-height: 270px;
    width: auto;
    margin: 0 auto 0.3rem auto;
    background: transparent;
  "
/>

<ul style="text-align: left; margin: 0 auto; width: 92%; font-size: 0.55em; list-style: none;">
  <li><b>Stored:</b> only the cleaned, structured tables (staging, marts). Raw data is not kept, the sources keep it for a while.</li>
  <li><b>Transformed:</b> before loading, in a nightly ETL job. Every mart has a fixed schema (columns and types).</li>
  <li><b>Used by:</b> dashboards and reports, many users, queries take seconds.</li>
  <li><b>Costs:</b> expensive storage per GB, cheap queries, one system to maintain. Tools: Snowflake, BigQuery, Redshift, Postgres.</li>
</ul>

Note:

- Question: changing the definition of "bounce". Expected: the staging table stg_sessions and every mart built on it must be recomputed for the whole history (backfill). That needs the raw events of a year, which the warehouse does not keep; if the tracking tool keeps only 7 days, the old numbers can never be corrected. Cost drivers: schema changes, backfills, complex ETL, many marts.
- Bonus they may find: the new and the old definition cannot be compared unless both are kept, so versioned marts.

--

<!-- .slide: data-visibility="hidden" -->

#### Warehouse: changing the definition of "bounce" <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li><code>stg_sessions</code> and every mart built on it must be <b>recomputed for the whole history</b> (a backfill).</li>
  <li>That needs the raw events of a year. The warehouse does not keep them; if the tracking tool keeps 7 days, the old numbers can never be corrected.</li>
  <li>Cost drivers of a pure warehouse: <b>schema changes, backfills, complex ETL, many marts.</b></li>
  <li>Bonus: old and new definition cannot be compared unless both are kept, so versioned marts.</li>
</ul>

--

#### Briefing: <span style="color: orange;">Data Lake</span> (groups 2 and 6)

<img
  src="../assets/data_management/imgs/imgs.003.png"
  alt="Data Lake"
  style="
    max-height: 270px;
    width: auto;
    margin: 0 auto 0.3rem auto;
    background: transparent;
  "
/>

<ul style="text-align: left; margin: 0 auto; width: 92%; font-size: 0.55em; list-style: none;">
  <li><b>Stored:</b> everything, as it arrives: tables, logs, images, documents. Files in folders on cheap object storage ($0.01 to $0.025 per GB per month).</li>
  <li><b>Transformed:</b> not on the way in. Whoever reads the data cleans it, every time, in their own code.</li>
  <li><b>Used by:</b> data scientists and ML, few users, long-running jobs.</li>
  <li><b>Costs:</b> cheap storage, expensive processing, a separate tool is needed to query at all. Tools: S3, MinIO, Azure Data Lake, plus Spark or similar.</li>
</ul>

Note:

- Question: 400 folders, nobody knows the content. Expected: a data swamp, no structure or documentation was enforced, nobody owned the lake. Prevention: naming conventions, a catalog, ownership. Why every query is more expensive: the cleaning from Task 2 runs again on every read, on raw data, instead of once in ETL; plus no index, no curated marts.
- Security point if they find it: hard to see what is sensitive in thousands of files of unknown format.

--

<!-- .slide: data-visibility="hidden" -->

#### Lake: 400 folders, nobody knows <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li>A <b>data swamp</b>: no structure or documentation was enforced, nobody owned the lake. Prevention: naming conventions, a catalog, ownership.</li>
  <li>Every query is more expensive because the <b>cleaning from Task 2 runs again on every read</b>, on raw data, instead of once in ETL. No index, no curated marts, and a separate engine has to be run.</li>
  <li>Security: hard to see what is sensitive in thousands of files of unknown format.</li>
</ul>

--

#### Briefing: <span style="color: orange;">Hybrid Data Lake</span> (group 3)

<img
  src="../assets/data_management/imgs/imgs.004.png"
  alt="Hybrid Data Lake"
  style="
    max-height: 270px;
    width: auto;
    margin: 0 auto 0.3rem auto;
    background: transparent;
  "
/>

<ul style="text-align: left; margin: 0 auto; width: 92%; font-size: 0.55em; list-style: none;">
  <li><b>Stored:</b> twice. Everything raw in the lake, the cleaned tables additionally in a warehouse.</li>
  <li><b>Transformed:</b> after the lake, before the warehouse. The lake is the long-term memory, the warehouse the fast front.</li>
  <li><b>Used by:</b> dashboards from the warehouse (many users, sub-second), data science from the lake.</li>
  <li><b>Costs:</b> two systems, two bills, two teams or one that can do both. Highest maintenance of the four.</li>
</ul>

Note:

- Question: where is storing twice still right? Expected: large companies where both are hard requirements: operational BI with many concurrent users needing sub-second answers (the warehouse), and ML or audit needs on raw history (the lake), and a team that can run two systems. Waste: a 30-person company with three dashboards and no data science; or any company that only wants one of the two uses. What decides: concurrent dashboard users, latency requirements, share of raw and unstructured data, team size.

--

<!-- .slide: data-visibility="hidden" -->

#### Hybrid: when is storing twice right? <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li><b>Right:</b> a large company where both are hard requirements: operational BI with many concurrent users and sub-second answers (warehouse) <i>and</i> ML or audit on raw history (lake), plus a team that can run two systems.</li>
  <li><b>Waste:</b> a 30-person company with three dashboards and no data science, or any company that needs only one of the two uses.</li>
  <li><b>What decides:</b> concurrent dashboard users, latency requirements, share of raw and unstructured data, team size.</li>
</ul>

--

#### Briefing: <span style="color: orange;">Data Lakehouse</span> (group 4)

<img
  src="../assets/data_management/imgs/imgs.005.png"
  alt="Lakehouse"
  style="
    max-height: 270px;
    width: auto;
    margin: 0 auto 0.3rem auto;
    background: transparent;
  "
/>

<ul style="text-align: left; margin: 0 auto; width: 92%; font-size: 0.55em; list-style: none;">
  <li><b>Stored:</b> once, on cheap object storage like a lake, but the cleaned tables are written back into the same storage in a table format (Iceberg, Delta) that behaves like database tables.</li>
  <li><b>Transformed:</b> inside the storage, after loading (ELT). Raw and cleaned live side by side.</li>
  <li><b>Used by:</b> both: dashboards and data science read from the same place.</li>
  <li><b>Costs:</b> lake-cheap storage, queries in between warehouse and lake, one system. Tools: Databricks, Dremio, Trino, Snowflake on Iceberg.</li>
</ul>

Note:

- Question: what does it need that the warehouse includes? Expected: a query engine. A warehouse is storage and query engine in one product; a lakehouse is files on object storage, so a separate engine (Dremio, Trino, Spark, Databricks) must be run and tuned, and the table format must be managed. Skills: running that engine, the table format, and discipline to keep raw and cleaned areas apart, otherwise it is a lake with extra steps. Performance for many concurrent dashboard users is below a tuned warehouse.

--

<!-- .slide: data-visibility="hidden" -->

#### Lakehouse: what does it need? <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li>A <b>query engine</b>. A warehouse is storage and engine in one product; a lakehouse is files on object storage, so a separate engine (Dremio, Trino, Spark, Databricks) must be run and tuned, and the table format (Iceberg, Delta) must be managed.</li>
  <li><b>Skills:</b> running that engine, the table format, and the discipline to keep raw and cleaned areas apart. Otherwise it is a lake with extra steps.</li>
  <li>Performance for many concurrent dashboard users is below a tuned warehouse.</li>
</ul>

--

#### The four at a glance

<table style="margin: 0 auto; font-size: 0.55em;">
  <tr><th></th><th>Warehouse</th><th>Lake</th><th>Hybrid</th><th>Lakehouse</th></tr>
  <tr><td>stored</td><td>cleaned only</td><td>raw only</td><td>raw + cleaned, two systems</td><td>raw + cleaned, one storage</td></tr>
  <tr><td>transform</td><td>before (ETL)</td><td>on every read</td><td>between the two</td><td>inside (ELT)</td></tr>
  <tr><td>strong</td><td>fast, governed reporting</td><td>cheap, flexible, never loses raw data</td><td>both, at full speed</td><td>both, with one system</td></tr>
  <tr><td>weak</td><td>schema changes, raw data lost</td><td>swamp risk, expensive queries, no engine</td><td>cost and complexity of two systems</td><td>needs own query engine and skills</td></tr>
</table>

<p class="smaller-text">Hybrid buys low latency for operational BI at the price of two systems; the lakehouse is sufficient for most cases. None of these is set in stone, companies combine them.</p>

Note:

- Show after all four talks. One minute. This is the exam-relevant summary.

---

### 3. Architecture competition <span class="badge">COLAB</span> <span class="badge">10 + 2 MIN</span>

<div class="task">

A company has to choose one of the four architectures. Cost table and usage are in the notebook <a href="https://colab.research.google.com/github/styx0r/msb_lecture_data_management_and_business_intelligence_2026/blob/main/colab/data_management_architecture.ipynb">Data management: cost estimation</a>.

<ul>
  <li>each group calculates the <b>2-year cost of its own architecture</b> (the one you just explained), 10 min</li>
  <li>write your total and the five components on the whiteboard <span class="badge">WHITEBOARD</span></li>
  <li>then 2 min per group: <b>recommend one architecture to the company, not your own</b>. One cost argument, one non-cost argument.</li>
  <li>extra question: after a year the schema changes and all history is rebuilt from raw data. <b>Which architecture pays the financial data feed a second time?</b></li>
</ul>

<p class="smaller-text">Bonus at home: calculate all four and check the whiteboard. Plus: what changes after an incident and a schema update (bonus task in the notebook).</p>

</div>

Note:

- Whiteboard table: rows = architectures, columns = acquisition, storage, transfer, queries, maintenance, total. Prepare it during the expert round.
- Reference numbers (solution notebook, month = 365/12 days): Lakehouse 16,723, Data Lake 17,077, Data Warehouse 17,990, Hybrid 18,770 dollars in 2 years. Acquisition (12,103, of which 9,600 is the purchased financial feed) and transfer (1,821) are identical for all, so the ranking comes from storage, queries and maintenance. The extra question is where the feed starts to matter: only the warehouse has to buy it again.
- When two groups have the same architecture and different numbers: that is the discussion. Typical causes: month = 30 vs 365/12 days, TB vs GB, forgetting that storage is billed every month on the growing volume.
- Recommendation round: the "not your own" rule forces them to use the other groups' arguments. Push for non-cost arguments: team skills, share of unstructured data, how often schemas change, how many dashboard users.
- Wrap up in 3 sentences: cheapest on paper is the lakehouse, the warehouse buys speed and governance, hybrid only when both are hard requirements. Expensive purchased data is the strongest argument for keeping raw data somewhere. And: cost is never the only factor.

--

<!-- .slide: data-visibility="hidden" -->

#### Reference numbers (2 years, $) <span class="badge">ANSWER</span>

<table class="small-list" style="margin: 0 auto;">
  <tr><th></th><th>acquisition</th><th>storage</th><th>transfer</th><th>queries</th><th>maintenance</th><th>total</th></tr>
  <tr><td>Lakehouse</td><td>12,103</td><td>480</td><td>1,821</td><td>1,600</td><td>720</td><td><b>16,723</b></td></tr>
  <tr><td>Data Lake</td><td>12,103</td><td>300</td><td>1,821</td><td>2,133</td><td>720</td><td><b>17,077</b></td></tr>
  <tr><td>Data Warehouse</td><td>12,103</td><td>1,800</td><td>1,821</td><td>1,066</td><td>1,200</td><td><b>17,990</b></td></tr>
  <tr><td>Hybrid Data Lake</td><td>12,103</td><td>2,100</td><td>1,821</td><td>1,066</td><td>1,680</td><td><b>18,770</b></td></tr>
</table>

<p class="smaller-text">Month = 365/12 days. Acquisition (9,600 of it is the purchased feed) and transfer are identical for all, the ranking comes from storage, queries and maintenance. Typical deviations: month = 30 days, TB vs GB, storage billed once instead of every month.</p>

<p class="smaller-text"><b>Extra question:</b> only the warehouse keeps no raw data. Rebuilding 12 months means buying source C again: 240 GB at $20 = 4,800, about 7,000 with A, B and transfer. The others re-run the transformation on data they already have. Full bonus (incident + schema change): warehouse ends at about 30,100, see solution notebook.</p>

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

--

<!-- .slide: data-visibility="hidden" -->

#### lyvy: the pattern <span class="badge">ANSWER</span>

<ul class="small-list" style="text-align: left;">
  <li><b>Extract and Load:</b> dlt (dltHub) pulls ads and tracking data into raw data, Skupper connects the secured sources.</li>
  <li><b>Storage:</b> MinIO filesystem, that is the lake. One storage for raw and transformed data.</li>
  <li><b>Transform:</b> dbt builds the marts, Dremio is the query engine on Iceberg tables.</li>
  <li><b>Reporting:</b> Superset. Orchestration: Argo on Kubernetes.</li>
  <li><b>Architecture:</b> a lakehouse. Cost component to worry about: maintenance, self-hosted on k8s means people, not a cloud bill.</li>
</ul>

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

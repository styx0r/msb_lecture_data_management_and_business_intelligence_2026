# Entry Test, Block Day 3

20 multiple choice questions on days 1 and 2. Exactly one answer per question, tick the box. 15 minutes, no notes, no laptop.

## Business Intelligence

1. The BI stack from day 1 has five layers. Which order is correct, from bottom to top?
   A. Decisions, Reporting, Analysis, Warehousing, Raw data
   B. Raw data, Warehousing, Analysis, Reporting, Decisions
   C. Raw data, Reporting, Warehousing, Analysis, Decisions
   D. Warehousing, Raw data, Analysis, Decisions, Reporting

2. Anna orders a coffee grinder, gets a voucher after a complaint, and buys again. Why did we call the BI stack a loop rather than a pipeline?
   A. Every decision produces new raw data, which enters the stack again at the bottom
   B. Reports are rebuilt every night
   C. Dashboards refresh when the browser reloads
   D. The warehouse deletes old data in a cycle

3. "Which product category is losing customers, and since when?" is a question for which layer?
   A. Raw data
   B. Data integration (ETL)
   C. Data analysis and exploration
   D. Decisions

4. Marketing keeps its own customer spreadsheet, support keeps another, and the numbers disagree. On day 1 we called this:
   A. Operational BI
   B. A data silo
   C. A data-driven culture
   D. Shadow BI done right

5. "How many orders will we get next week?" belongs to which kind of analytics?
   A. Descriptive (what happened?)
   B. Diagnostic (why did it happen?)
   C. Predictive (what will happen?)
   D. None, BI never looks forward

6. Of the four BI goals from day 1, which one is this: the emergency department plans staff per shift along the hourly patient curve?
   A. Decide better
   B. Earn more
   C. Run cheaper
   D. Know what is going on

## Python and pandas

7. What is `[x * 2 for x in [1, 2, 3]]`?
   A. `[1, 2, 3, 1, 2, 3]`
   B. `[2, 4, 6]`
   C. `6`
   D. An error

8. For `prices = {"grinder": 89, "filter": 5}`, what is `prices["filter"]`?
   A. `"filter"`
   B. `5`
   C. `1`
   D. An error, dicts need numbers as keys

9. `df[df["amount"] > 100]` returns:
   A. The number of rows with amount above 100
   B. Only the rows whose amount is above 100
   C. The column `amount` with values above 100 set to NaN
   D. True or False

10. `df.groupby("country").agg(revenue=("amount", "sum"))` returns:
   A. One row per order with the country added
   B. One row per country with the summed amount in a column called `revenue`
   C. The total revenue as a single number
   D. An error, because `agg` needs a list

11. A column `order_date` with values like `2024/10/01` has dtype `object` (or `str`). What is true?
   A. pandas already treats it as a date, you can group by month
   B. It is text. You need `pd.to_datetime` before you can work with it as a date
   C. `object` means the column contains numbers
   D. The column must be deleted

12. `orders.merge(customers, on="customer_id", how="left")` keeps:
   A. Only orders whose customer exists in `customers`
   B. All orders, with customer columns filled where a match exists and NaN otherwise
   C. All customers, even without orders
   D. Only rows that exist in both tables

## Database Architectures

13. CRUD stands for:
   A. Create, Read, Update, Delete
   B. Copy, Run, Undo, Deploy
   C. Cache, Restore, Update, Drop
   D. Create, Replace, Use, Dump

14. In a row-oriented database, finding all customers from Munich without an index is slow because:
   A. The data is encrypted
   B. The database has to scan every row and compare the city value
   C. Row stores cannot filter by column
   D. Munich is stored in a separate file

15. Adding an index on the `city` column:
   A. Makes reads by city faster and writes slightly slower, because the index must be maintained
   B. Makes both reads and writes faster
   C. Has no cost at all
   D. Replaces the primary key

16. A bank transfer moves 100 EUR from account A to account B. Which ACID property guarantees that either both bookings happen or neither?
   A. Consistency
   B. Isolation
   C. Atomicity
   D. Durability

17. A primary key:
   A. Identifies each row uniquely and must not be empty
   B. May repeat as long as the table is small
   C. Is always a person's name
   D. Is only needed in NoSQL databases

18. In an `orders` table, `customer_id` refers to the `customers` table. `customer_id` is:
   A. The primary key of `orders`
   B. A foreign key in `orders`
   C. An index by definition
   D. A transaction

19. Which statement about document databases (for example MongoDB) is correct?
   A. They store each record as a flexible document, such as JSON, and do not require a fixed table schema
   B. They require all records to have exactly the same columns
   C. They cannot store nested data
   D. They are the same as a file system

20. "No free lunch" in database design means:
   A. Storage is never free
   B. Every design choice trades something off, for example faster reads for slower writes
   C. Backups are optional
   D. Cloud databases are always cheaper

Answer Key
1-B, 2-A, 3-C, 4-B, 5-C, 6-C, 7-B, 8-B, 9-B, 10-B, 11-B, 12-B, 13-A, 14-B, 15-A, 16-C, 17-A, 18-B, 19-A, 20-B

Scoring: one point per question. 17 to 20: ready for day 3. 12 to 16: reread the BI stack and the database slides. Below 12: talk to me in the break.

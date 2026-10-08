# Mock Exam: Data Management & Business Intelligence

105 multiple choice questions. Choose one answer (A-D) per question.

## Business Intelligence

1. What does BI stand for?
   A. Business Information
   B. Business Intelligence
   C. Binary Index
   D. Budget Integration

2. What is the main purpose of BI?
   A. Replace databases
   B. Support decision making with data
   C. Store raw logs only
   D. Increase file system speed

3. BI is not an end in itself. It should be:
   A. Isolated from business processes
   B. Fully integrated into decision-making processes
   C. Used only for compliance
   D. Limited to IT departments

4. A data-driven culture means:
   A. Decisions rely on data and analytics
   B. Decisions rely on intuition only
   C. Data stored in spreadsheets only
   D. No data sharing allowed

5. Data silos are:
   A. Shared company-wide data lakes
   B. Isolated data systems across departments
   C. Backups stored offsite
   D. Encrypted databases

6. Shadow BI refers to:
   A. Official BI tools used by IT
   B. Unofficial BI practices outside central governance
   C. Historical BI reports
   D. BI training courses

7. Descriptive analytics answers:
   A. What should we do?
   B. Why did it happen?
   C. What happened?
   D. What will happen?

8. Operational BI (OBI) focuses on:
   A. Long-term research only
   B. Real-time or near-real-time operational decisions
   C. Replacing data warehouses
   D. Writing code without data

9. Business-data disconnect means:
   A. Data is encrypted
   B. Data insights are misaligned with business goals
   C. Too many dashboards
   D. Only IT can access data

10. Diagnostic analytics answers:
   A. What happened?
   B. Why did it happen?
   C. What will happen?
   D. What should we do?

11. The decision-action gap means:
   A. Too much data
   B. Decisions are made without data
   C. Insights exist but are not acted on
   D. Data is deleted too early

12. Predictive analytics answers:
   A. What happened?
   B. Why did it happen?
   C. What will happen?
   D. What should we do?

13. Organizational silos mainly refer to:
   A. Too many dashboards
   B. Lack of communication between departments
   C. Too many backups
   D. Slow internet

14. Prescriptive analytics answers:
   A. What happened?
   B. Why did it happen?
   C. What will happen?
   D. What should we do?

15. Netflix collects viewing data mainly to:
   A. Reduce storage costs only
   B. Understand engagement and guide content decisions
   C. Replace all BI tools
   D. Avoid dashboards

## Python

16. Which is a valid Python variable name?
   A. total_sales
   B. 2nd_value
   C. class
   D. total-sales

17. What is the result of `len([1, 2, 3, 4])`?
   A. 3
   B. 4
   C. 5
   D. Error

18. Which type stores key-value pairs?
   A. list
   B. tuple
   C. dict
   D. set

19. What does this print?
   ```
   for i in range(3):
       print(i)
   ```
   A. 1 2 3
   B. 0 1 2
   C. 0 1 2 3
   D. 3 2 1

20. What is the result of `"data".upper()`?
   A. "Data"
   B. "DATA"
   C. "data"
   D. Error

21. What does `my_list.append(5)` do?
   A. Adds 5 to the start
   B. Adds 5 to the end
   C. Removes 5
   D. Sorts the list

22. What prints?
   ```
   x = 5
   if x > 3:
       print("yes")
   else:
       print("no")
   ```
   A. yes
   B. no
   C. 5
   D. Error

23. What does this return?
   ```
   def add(a, b):
       return a + b
   add(2, 3)
   ```
   A. 2
   B. 5
   C. 6
   D. Error

24. For `items = [10, 20, 30]`, what is `items[0]`?
   A. 10
   B. 20
   C. 30
   D. Error

25. What does `import math` do?
   A. Deletes a module
   B. Imports the math module for use
   C. Creates a new file
   D. Runs a script

26. What is `sum([1, 2, 3])`?
   A. 3
   B. 5
   C. 6
   D. 7

27. What is `{"a": 1, "b": 2}["b"]`?
   A. 1
   B. 2
   C. "b"
   D. Error

28. What is `[x * 2 for x in [1, 2, 3]]`?
   A. [2, 4, 6]
   B. [1, 2, 3]
   C. [2, 3, 4]
   D. Error

29. What is `"a,b,c".split(",")`?
   A. ["a,b,c"]
   B. ["a", "b", "c", ""]
   C. ["a", "b", "c"]
   D. Error

30. For `items = ["a", "b", "c"]`, what is `items[-1]`?
   A. "a"
   B. "b"
   C. "c"
   D. Error

## Database Architectures

31. What is a task of a file system?
   A. Bring order to files/folders and metadata
   B. Train ML models
   C. Replace SQL
   D. Encrypt all data

32. CRUD stands for:
   A. Create, Read, Update, Delete
   B. Copy, Run, Undo, Deploy
   C. Cache, Restore, Update, Drop
   D. Create, Replace, Use, Dump

33. The no free lunch theorem implies:
   A. No backups are required
   B. Performance tradeoffs exist (faster reads can mean slower writes)
   C. Data is always consistent
   D. Storage is free

34. In a row-oriented database, accessing by row index is typically:
   A. Fast (direct access)
   B. Slow because it scans all rows
   C. Impossible
   D. Only possible in the cloud

35. Searching by column value in a row-oriented DB is slow because:
   A. Data is encrypted
   B. You often scan rows to compare values
   C. Rows are sorted by that column by default
   D. Indexes are free and automatic

36. A transaction is:
   A. A single query only
   B. A unit of work treated as one
   C. A backup file
   D. A schema definition

37. An index is mainly used to:
   A. Slow down reads
   B. Speed up searches and lookups
   C. Replace primary keys
   D. Store images

38. Binary search complexity is:
   A. O(1)
   B. O(n)
   C. O(log n)
   D. O(n^2)

39. A tradeoff of using indexes is:
   A. No storage needed
   B. Slower reads only
   C. Extra storage and slower writes or updates
   D. Data becomes raw

40. ACID stands for:
   A. Atomicity, Consistency, Isolation, Durability
   B. Accuracy, Control, Index, Data
   C. Access, Compute, Integrate, Delete
   D. Archive, Copy, Inspect, Deploy

41. A primary key:
   A. Allows duplicate values
   B. Uniquely identifies each row
   C. Stores blobs
   D. Is optional for tables

42. A foreign key:
   A. Uniquely identifies rows in the same table
   B. References a primary key in another table
   C. Stores passwords
   D. Replaces indexes

43. Document databases typically store:
   A. Fixed rows and columns only
   B. JSON-like documents with flexible schema
   C. Only CSV files
   D. Only images

44. SQL JOIN is used to:
   A. Back up data
   B. Combine rows from multiple tables
   C. Delete a table
   D. Change column types

45. Many-to-many relationships usually use:
   A. A linking table
   B. A single column only
   C. A file folder
   D. A view only

## Data Management

46. A data warehouse is mainly:
   A. Raw data storage without transformations
   B. Central hub for cleaned structured data loaded via ETL
   C. Only used for image storage
   D. A file system replacement

47. ETL stands for:
   A. Extract, Transform, Load
   B. Encode, Transfer, List
   C. Extract, Translate, Link
   D. Export, Test, Log

48. A data lake typically:
   A. Stores only structured data
   B. Loads data without transformations
   C. Requires fixed schema
   D. Rejects text or audio

49. Staging tables are:
   A. Final dashboard tables
   B. Cleaned reusable tables for multiple marts
   C. Only for backups
   D. Raw unprocessed logs

50. A common risk of data lakes is:
   A. Data becoming a data swamp due to lack of structure
   B. Too much normalization
   C. Only supporting SQL
   D. Overly strict schemas

51. A mart table is:
   A. A raw data dump
   B. A dashboard-specific curated table
   C. A file system index
   D. A log archive

52. A data lake advantage is:
   A. Low flexibility
   B. Supports many data types and formats
   C. Requires heavy transformations
   D. Only for small datasets

53. A hybrid data lake:
   A. Is a data warehouse only
   B. Combines data lake and data warehouse but adds complexity
   C. Removes the need for storage
   D. Works only on-prem

54. On-premises vs cloud: which is correct?
   A. On-prem uses provider data centers only
   B. Cloud means local servers only
   C. On-prem uses company-owned infrastructure; cloud uses hosted services
   D. They are identical

55. A lakehouse:
   A. Combines data warehouse and data lake with lower complexity
   B. Is identical to a file system
   C. Avoids query engines
   D. Stores only logs

56. A good ETL process includes:
   A. No documentation
   B. Monitoring, testing, and lineage/traceability
   C. Only manual steps
   D. Deleting errors

57. Which is a common cloud service model?
   A. KaaS
   B. IaaS, PaaS, or SaaS
   C. DaaS only
   D. FaaS only

58. A high cost driver in a pure data warehouse can be:
   A. Schema changes requiring large backfills
   B. No storage
   C. No transformations
   D. Only text data

59. A data lake often needs:
   A. No query tooling
   B. Extra tooling for query and processing
   C. Only spreadsheets
   D. Only SQL views

60. A potential disadvantage of a lakehouse is:
   A. It cannot store structured data
   B. A standalone query engine may be needed
   C. It blocks ETL
   D. It only works on-prem

## Introduction to AI

61. Artificial Intelligence is defined as:
   A. Simulation of intelligence, especially learning
   B. Only robots
   C. Only databases
   D. Only hardware

62. Era 1 (pre-deep learning) focused on:
   A. Rules, logic, expert systems
   B. Large-scale LLMs only
   C. Purely random search
   D. No data

63. Regression outputs:
   A. A category label
   B. A number
   C. A document
   D. An image

64. Supervised learning uses:
   A. No labels
   B. Labels for training
   C. Only rules
   D. Only random actions

65. Mean squared error (MSE) is:
   A. A type of database
   B. A common loss for regression
   C. A clustering method
   D. A storage format

66. Unsupervised learning example is:
   A. Demand forecasting
   B. Customer segmentation
   C. Spam classification
   D. Price prediction

67. Classification outputs:
   A. A category label
   B. A number
   C. A file
   D. A graph

68. Reinforcement learning learns by:
   A. Labels only
   B. Rewards and feedback
   C. Fixed rules only
   D. SQL queries

69. Gradient descent updates parameters by:
   A. Moving in the direction of higher loss
   B. Moving opposite the gradient
   C. Random guessing only
   D. No updates

70. k-means steps are:
   A. Initialize, assign, update, repeat
   B. Encode, train, deploy, monitor
   C. Select, delete, migrate, backup
   D. Sort, join, filter, group

71. k-means output is:
   A. A single number
   B. Cluster assignment for each point
   C. A decision tree
   D. A SQL query

72. Supervised learning example:
   A. Customer churn prediction
   B. Discovering clusters
   C. Anomaly grouping without labels
   D. Random guessing

73. Unsupervised learning uses:
   A. Inputs with labels y
   B. Only rewards
   C. Inputs without labels
   D. Only rules

74. The learning rate in gradient descent is:
   A. A type of dataset
   B. The step size for updates
   C. A measure of accuracy
   D. A storage limit

75. Training typically repeats until:
   A. Loss stops improving
   B. The dataset is deleted
   C. Labels are removed
   D. Queries fail

## Generative AI and Agents

76. Generative AI primarily:
   A. Creates synthetic data or content
   B. Only stores data
   C. Only classifies text
   D. Only deletes data

77. An LLM mainly predicts:
   A. Database schema
   B. The next token
   C. A SQL join
   D. A file path

78. The context window is:
   A. The model's training dataset size
   B. The amount of text the model can use at once
   C. The output length limit only
   D. The GPU memory size

79. A hallucination is:
   A. Perfect memory
   B. Confident but incorrect output
   C. A database index
   D. A training label

80. A GAN has:
   A. Encoder and decoder only
   B. Generator and discriminator
   C. Router and cache
   D. Tokenizer only

81. Transformers use attention to:
   A. Ignore all context
   B. Capture dependencies and focus on relevant tokens
   C. Remove tokens
   D. Encrypt data

82. Encoder-decoder models are often used to:
   A. Map input sequences to output sequences (e.g., translation)
   B. Store images only
   C. Run SQL
   D. Compress files only

83. Vector databases exist mainly for:
   A. Keyword search only
   B. Semantic similarity search in embeddings
   C. Storing backups
   D. Running ETL

84. An embedding is:
   A. A high-dimensional vector representation of data
   B. A primary key
   C. A file extension
   D. A SQL query

85. RAG stands for:
   A. Retrieve, Augment, Generate
   B. Read, Analyze, Graph
   C. Random, Approximate, Guess
   D. Reduce, Aggregate, Group

86. A ReAct agent combines:
   A. Reasoning and acting with observations
   B. Only training
   C. Only storage
   D. Only encryption

87. A simple agent loop includes:
   A. Goal, plan, tools, feedback loop
   B. Tables, rows, columns, keys
   C. Images, audio, video only
   D. Compile, link, run, exit

88. Tool calls are:
   A. External function interfaces the model can invoke
   B. Only UI buttons
   C. SQL backups
   D. Static images

89. MCP stands for:
   A. Model Context Protocol
   B. Machine Code Parser
   C. Multi Cloud Platform
   D. Model Cache Process

90. What is the main idea of MCP?
   A. A database for vector search
   B. A standard way to connect apps to tools and context
   C. A GPU training protocol
   D. A file compression method

## A/B Testing

91. A dashboard shows that users of a new feature convert more often. Why does this not prove that the feature causes higher conversion?
    A. Dashboards cannot compute conversion rates
    B. Users who choose the feature may differ from the others (self-selection, confounding)
    C. Conversion is not a valid metric
    D. Only SQL can prove causality

92. In an A/B test, the treatment group:
    A. Sees the new variant
    B. Sees the existing version
    C. Is never measured
    D. Is chosen by hand

93. Which statement is the alternative hypothesis of a checkout experiment?
    A. The sample size is large enough
    B. The new checkout changes nothing
    C. The new checkout changes the conversion rate
    D. The metric is a proportion

94. "p = 0.3, so the new checkout has no effect." This conclusion is:
    A. Correct
    B. Wrong, a large p-value means we did not detect an effect, not that there is none
    C. Correct only for conversion rates
    D. Correct only if the sample is small

95. A type II error is:
    A. Declaring an effect that does not exist
    B. Choosing α too small
    C. Missing an effect that really exists
    D. Running the test too long

96. With a power of 80%:
    A. 80% of users convert
    B. The test has a 20% false alarm rate
    C. A real effect of the planned size is detected in about 4 out of 5 experiments
    D. The confidence interval is 80% wide

97. Which of these is NOT needed to compute the sample size of an A/B test?
    A. The baseline conversion rate
    B. The minimum detectable effect
    C. The significance level and the power
    D. The result of the experiment

98. A test needs 8,000 users per group to detect +1 pp. To detect +0.5 pp it needs roughly:
    A. 4,000 per group
    B. 16,000 per group
    C. 32,000 per group
    D. 8,000 per group

99. What should you do if the p-value is 0.06 at the planned end of the experiment?
    A. Run a few more days until it drops below 0.05
    B. Report the result as not significant together with the effect size and confidence interval
    C. Remove the users who did not convert
    D. Switch to a one-sided test

100. Why does checking the p-value every day and stopping at the first p < 0.05 inflate the false alarm rate?
    A. Because noise gets many chances to cross the threshold instead of one
    B. Because the sample size grows
    C. Because conversions are binary
    D. It does not inflate the false alarm rate

101. You planned a 50/50 split and observe 50.8% / 49.2% with 100,000 users (p < 0.001). The right reaction is:
    A. Ignore it, it is close enough
    B. Treat it as a sample ratio mismatch: find the bug before analyzing
    C. Declare B the winner
    D. Reduce α to 1%

102. For comparing revenue per visitor (a continuous metric) between A and B, a suitable test is:
    A. A two-sample t-test
    B. k-means clustering
    C. A chi-squared test on the 2x2 table
    D. Normalization to third normal form

103. A guardrail metric is:
    A. The one metric that decides the experiment
    B. A metric that must not get worse, e.g. page load time or support tickets
    C. The baseline conversion rate
    D. The metric with the smallest p-value

104. Why should an A/B test have exactly one primary metric, chosen before the test?
    A. Because statsmodels only accepts one metric
    B. Because testing many metrics and picking the best one inflates the false alarm rate
    C. Because dashboards can show only one chart
    D. Because secondary metrics are never relevant

105. The novelty effect means:
    A. New users convert better than returning users
    B. A new variant shows a lift at first because it is new, which fades over time
    C. The first week of data must be discarded
    D. Variant B is always better in the long run

Answer Key
1-B, 2-B, 3-B, 4-A, 5-B, 6-B, 7-C, 8-B, 9-B, 10-B,
11-C, 12-C, 13-B, 14-D, 15-B, 16-A, 17-B, 18-C, 19-B, 20-B,
21-B, 22-A, 23-B, 24-A, 25-B, 26-C, 27-B, 28-A, 29-C, 30-C,
31-A, 32-A, 33-B, 34-A, 35-B, 36-B, 37-B, 38-C, 39-C, 40-A,
41-B, 42-B, 43-B, 44-B, 45-A, 46-B, 47-A, 48-B, 49-B, 50-A,
51-B, 52-B, 53-B, 54-C, 55-A, 56-B, 57-B, 58-A, 59-B, 60-B,
61-A, 62-A, 63-B, 64-B, 65-B, 66-B, 67-A, 68-B, 69-B, 70-A,
71-B, 72-A, 73-C, 74-B, 75-A, 76-A, 77-B, 78-B, 79-B, 80-B,
81-B, 82-A, 83-B, 84-A, 85-A, 86-A, 87-A, 88-A, 89-A, 90-A,
91-B, 92-A, 93-C, 94-B, 95-C, 96-C, 97-D, 98-C, 99-B, 100-A,
101-B, 102-A, 103-B, 104-B, 105-B

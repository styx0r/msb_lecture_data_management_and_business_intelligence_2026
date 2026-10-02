# Mock Exam: Data Management & Business Intelligence

90 multiple choice questions. Choose one answer (A-D) per question.

## Business Intelligence

1. What does BI stand for?
   A. Business Information
   B. Binary Index
   C. Business Intelligence
   D. Budget Integration

2. What is the main purpose of BI?
   A. Replace databases
   B. Increase file system speed
   C. Store raw logs only
   D. Support decision making with data

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

6. Descriptive analytics answers:
   A. What should we do?
   B. Why did it happen?
   C. What happened?
   D. What will happen?

7. Diagnostic analytics answers:
   A. What happened?
   B. Why did it happen?
   C. What will happen?
   D. What should we do?

8. The decision-action gap means:
   A. Too much data
   B. Decisions are made without data
   C. Insights exist but are not acted on
   D. Data is deleted too early

9. Predictive analytics answers:
   A. What happened?
   B. Why did it happen?
   C. What will happen?
   D. What should we do?

10. Organizational silos mainly refer to:
    A. Too many dashboards
    B. Lack of communication between departments
    C. Too many backups
    D. Slow internet

11. Prescriptive analytics answers:
    A. What happened?
    B. Why did it happen?
    C. What will happen?
    D. What should we do?

12. Netflix collects viewing data mainly to:
    A. Reduce storage costs only
    B. Understand engagement and guide content decisions
    C. Replace all BI tools
    D. Avoid dashboards

13. A KPI is best described as:
    A. A raw data table
    B. A database schema
    C. A measurable metric tied to a business goal
    D. A SQL join

14. A common BI benefit is:
    A. More manual reporting
    B. Slower decision making
    C. Fewer data sources
    D. Faster, data-driven decisions

15. Which element is typically part of a BI stack?
    A. Data warehouse
    B. CPU cache
    C. Version control
    D. Compiler

## Python

16. Which is a valid Python variable name?
    A. total_sales
    B. 2nd_value
    C. class
    D. total-sales

17. What is the result of `len([1, 2, 3, 4])`?
    A. 3
    B. 5
    C. 4
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

21. What prints?

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

22. What does this return?

```
def add(a, b):
    return a + b
add(2, 3)
```

A. 2
B. 5
C. 6
D. Error

23. For `items = [10, 20, 30]`, what is `items[0]`?
    A. 10
    B. 20
    C. 30
    D. Error

24. What is `sum([1, 2, 3])`?
    A. 3
    B. 5
    C. 6
    D. 7

25. What is `{"a": 1, "b": 2}["b"]`?
    A. 1
    B. 2
    C. "b"
    D. Error

26. What is `[x * 2 for x in [1, 2, 3]]`?
    A. [2, 4, 6]
    B. [1, 2, 3]
    C. [2, 3, 4]
    D. Error

27. For `items = ["a", "b", "c"]`, what is `items[-1]`?
    A. "a"
    B. "b"
    C. "c"
    D. Error

28. For `items = [10, 20, 30, 40]`, what is `items[1:3]`?
    A. [10, 20]
    B. [20, 30, 40]
    C. [20, 30]
    D. [10, 30]

29. Which statement about dictionaries is true?
    A. Keys are always ordered alphabetically
    B. Keys can be mutable lists
    C. Duplicate keys create multiple entries
    D. Keys must be unique

30. What is `len("hi" * 3)`?
    A. 3
    B. 2
    C. 6
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
    B. Storage is free
    C. Data is always consistent
    D. Performance tradeoffs exist (faster reads can mean slower writes)

34. In a row-oriented database, accessing by row index is typically:
    A. Fast (direct access)
    B. Slow because it scans all rows
    C. Impossible
    D. Only possible in the cloud

35. A transaction is:
    A. A single query only
    B. A unit of work treated as one
    C. A backup file
    D. A schema definition

36. An index is mainly used to:
    A. Slow down reads
    B. Store images
    C. Replace primary keys
    D. Speed up searches and lookups

37. Binary search complexity is:
    A. O(1)
    B. O(n)
    C. O(log n)
    D. O(n^2)

38. ACID stands for:
    A. Atomicity, Consistency, Isolation, Durability
    B. Accuracy, Control, Index, Data
    C. Access, Compute, Integrate, Delete
    D. Archive, Copy, Inspect, Deploy

39. A primary key:
    A. Allows duplicate values
    B. Uniquely identifies each row
    C. Stores blobs
    D. Is optional for tables

40. A foreign key:
    A. Uniquely identifies rows in the same table
    B. References a primary key in another table
    C. Stores passwords
    D. Replaces indexes

41. Document databases typically store:
    A. Fixed rows and columns only
    B. JSON-like documents with flexible schema
    C. Only CSV files
    D. Only images

42. Many-to-many relationships usually use:
    A. A linking table
    B. A single column only
    C. A file folder
    D. A view only

43. Which ACID property ensures transactions don't interfere?
    A. Atomicity
    B. Consistency
    C. Isolation
    D. Durability

44. Which database type is best for flexible JSON-like documents?
    A. Document database
    B. Graph database
    C. Time-series database
    D. Relational database

45. Binary search requires the data to be:
    A. Random
    B. Encrypted
    C. Duplicated
    D. Sorted

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

48. Staging tables are:
    A. Final dashboard tables
    B. Only for backups
    C. Cleaned reusable tables for multiple marts
    D. Raw unprocessed logs

49. A common risk of data lakes is:
    A. Data becoming a data swamp due to lack of structure
    B. Too much normalization
    C. Only supporting SQL
    D. Overly strict schemas

50. A mart table is:
    A. A raw data dump
    B. A dashboard-specific curated table
    C. A file system index
    D. A log archive

51. A data lake advantage is:
    A. Low flexibility
    B. Supports many data types and formats
    C. Requires heavy transformations
    D. Only for small datasets

52. A hybrid data lake:
    A. Is a data warehouse only
    B. Combines data lake and data warehouse but adds complexity
    C. Removes the need for storage
    D. Works only on-prem

53. On-premises vs cloud: which is correct?
    A. On-prem uses provider data centers only
    B. Cloud means local servers only
    C. On-prem uses company-owned infrastructure; cloud uses hosted services
    D. They are identical

54. A lakehouse:
    A. Combines data warehouse and data lake with lower complexity
    B. Is identical to a file system
    C. Avoids query engines
    D. Stores only logs

55. A good ETL process includes:
    A. No documentation
    B. Deleting errors
    C. Only manual steps
    D. Monitoring, testing, and lineage/traceability

56. A high cost driver in a pure data warehouse can be:
    A. Schema changes requiring large backfills
    B. No storage
    C. No transformations
    D. Only text data

57. A potential disadvantage of a lakehouse is:
    A. It cannot store structured data
    B. A standalone query engine may be needed
    C. It blocks ETL
    D. It only works on-prem

58. Which is an example of ETL monitoring?
    A. Changing chart colors
    B. Choosing a dashboard theme
    C. Row count checks and alerts
    D. Writing user passwords

59. Why can storage costs increase in a hybrid data lake?
    A. It deletes historical data
    B. It stores only aggregated data
    C. It uses no marts
    D. It can duplicate data across lake and warehouse

60. Which cloud model provides ready-to-use software for end users?
    A. IaaS
    B. SaaS
    C. PaaS
    D. On-prem

## Introduction to AI

61. Artificial Intelligence is defined as:
    A. Simulation of intelligence, especially learning
    B. Only robots
    C. Only databases
    D. Only hardware

62. Regression outputs:
    A. A category label
    B. A number
    C. A document
    D. An image

63. Supervised learning uses:
    A. No labels
    B. Only random actions
    C. Only rules
    D. Labels for training

64. Mean squared error (MSE) is:
    A. A type of database
    B. A common loss for regression
    C. A clustering method
    D. A storage format

65. Unsupervised learning example is:
    A. Demand forecasting
    B. Customer segmentation
    C. Spam classification
    D. Price prediction

66. Classification outputs:
    A. A category label
    B. A number
    C. A file
    D. A graph

67. Reinforcement learning learns by:
    A. Labels only
    B. Rewards and feedback
    C. Fixed rules only
    D. SQL queries

68. Gradient descent updates parameters by:
    A. Moving in the direction of higher loss
    B. Random guessing only
    C. Moving opposite the gradient
    D. No updates

69. k-means steps are:
    A. Initialize, assign, update, repeat
    B. Encode, train, deploy, monitor
    C. Select, delete, migrate, backup
    D. Sort, join, filter, group

70. k-means output is:
    A. A single number
    B. Cluster assignment for each point
    C. A decision tree
    D. A SQL query

71. Supervised learning example:
    A. Customer churn prediction
    B. Discovering clusters
    C. Anomaly grouping without labels
    D. Random guessing

72. The learning rate in gradient descent is:
    A. A type of dataset
    B. The step size for updates
    C. A measure of accuracy
    D. A storage limit

73. Training typically repeats until:
    A. Loss stops improving
    B. The dataset is deleted
    C. Labels are removed
    D. Queries fail

74. If the learning rate is too small, gradient descent:
    A. Diverges immediately
    B. Skips the loss calculation
    C. Jumps randomly
    D. Converges very slowly

75. In k-means, k represents:
    A. The number of features
    B. The number of iterations
    C. The number of clusters
    D. The number of labels

## Generative AI and Agents

76. Generative AI primarily:
    A. Creates synthetic data or content
    B. Only stores data
    C. Only classifies text
    D. Only deletes data

77. An LLM mainly predicts:
    A. Database schema
    B. A SQL join
    C. The next token
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

80. Transformers use attention to:
    A. Ignore all context
    B. Encrypt data
    C. Remove tokens
    D. Capture dependencies and focus on relevant tokens

81. Encoder-decoder models are often used to:
    A. Map input sequences to output sequences (e.g., translation)
    B. Store images only
    C. Run SQL
    D. Compress files only

82. An embedding is:
    A. A high-dimensional vector representation of data
    B. A primary key
    C. A file extension
    D. A SQL query

83. RAG stands for:
    A. Retrieve, Augment, Generate
    B. Read, Analyze, Graph
    C. Random, Approximate, Guess
    D. Reduce, Aggregate, Group

84. A ReAct agent combines:
    A. Reasoning and acting with observations
    B. Only training
    C. Only storage
    D. Only encryption

85. A simple agent loop includes:
    A. Goal, plan, tools, feedback loop
    B. Tables, rows, columns, keys
    C. Images, audio, video only
    D. Compile, link, run, exit

86. MCP stands for:
    A. Model Context Protocol
    B. Machine Code Parser
    C. Multi Cloud Platform
    D. Model Cache Process

87. What is the main idea of MCP?
    A. A database for vector search
    B. A standard way to connect apps to tools and context
    C. A GPU training protocol
    D. A file compression method

88. A common limitation of LLMs is:
    A. Perfect factual recall
    B. Unlimited context length
    C. Hallucinations or stale knowledge
    D. Guaranteed real-time data

89. Vector similarity search often uses:
    A. SQL joins
    B. Exact keyword matching
    C. Sorting by timestamp
    D. Cosine similarity

90. After a tool executes, the agent typically adds:
    A. The observation to the context
    B. A new dataset
    C. A schema migration
    D. A new training run

Answer Key
1-C, 2-D, 3-B, 4-A, 5-B, 6-C, 7-B, 8-C, 9-C, 10-B,
11-D, 12-B, 13-C, 14-D, 15-A, 

16-A, 17-C, 18-C, 19-B, 20-B,
21-A, 22-B, 23-A, 24-C, 25-B, 26-A, 27-C, 28-C, 29-D, 30-C,

31-A, 32-A, 33-D, 34-A, 35-B, 36-D, 37-C, 38-A, 39-B, 40-B,
41-B, 42-A, 43-C, 44-A, 45-D, 

46-B, 47-A, 48-C, 49-A, 50-B,
51-B, 52-B, 53-C, 54-A, 55-D, 56-A, 57-B, 58-C, 59-D, 60-B,

61-A, 62-B, 63-D, 64-B, 65-B, 66-A, 67-B, 68-C, 69-A, 70-B,
71-A, 72-B, 73-A, 74-D, 75-C,

76-A, 77-C, 78-B, 79-B, 80-D,
81-A, 82-A, 83-A, 84-A, 85-A, 86-A, 87-B, 88-C, 89-D, 90-A



# MSB lecture Data Management and Business Intelligence

"You will never ever use Excel again"
We aim to teach theoretical foundations and practicel skills by illustrating the teaching concepts with Python.
Students should require the necessary skills to start a data science project and should have enough theoretical foundation to evolve on their own.  


### Feedback from 2024 Course: 
- In general: make relation of material to the future work more clear.
- Why do we need this for our future work.
- More figures instead of text. 
- Neural Networks: more applications and use case and real life examples (This could be done by adding an introductory section to neural networks).
- More group works (generates more interaction)
- Python lab worked well.

### Development of colab notebooks
- `pipenv install`
- Develop locally using jupyter 
- Make sure to add the individual dependencies in the notebook for colab

### Making slides
- Uses (reveal.js)[https://github.com/hakimel/reveal.js]
- Solution slides are marked `<!-- .slide: data-visibility="hidden" -->` in `slides.md`. The switch `SHOW_SOLUTIONS` at the top of the deck's `index.html` hides them (`false`, during the lecture) or shows them (`true`, set after the lecture and commit so students can see them)
- There is a Makefile in the slides folder
	- `make get-reveal`: add reveal.js as submodule into slides folder
	- `make update-reveal`: updates reveal.js
	- In the reveal.js folder look at `demo.html` for a reveal demo.
- You can either use markdown or html.
- **Todo:** currently we clone reveal.js locally or via github actions
- However we could also directly get the classes in html files without cloning. 


### Recources
- [Pandas tutorial from Kristian Rother](https://www.academis.eu/pandas_go_to_space/)
- [Parametrization of Von Neumann quote](https://publications.mpi-cbg.de/Mayer_2010_4314.pdf) 

### Kind of event
The teaching and learning events are offered in lecture and semi-
nar form. As part of the lecture, the teaching and learning content
is presented by the teachers and placed in a larger context. The
learning context is prepared in such a way that students can build
up and deepen their knowledge base. In the seminar, students
work on practice-relevant topics independently, including using lit-
erature from one or more sources or using case studies. The
teacher takes on the role of “learning coach” and accompanies the
students in analyzing, discussing and reflecting on the teaching
and learning content in smaller groups.

### Qualification Goals
The students should understand the importance of information for
a company, recognize and perceive it as critical success factors
and be able to apply it to different markets. They will gain access
to tools for determining information needs and designing infor-
mation systems and will learn about the main application areas of
eHealth, which includes the entire process from collection and pro-
cessing to analysis and evaluation of specific digital health data.
The graduates of the event know about the importance of IT for
the management process and company success and learn to un-
derstand how business intelligence (BI) is integrated into company
IT. They will gain knowledge of the basic architecture of BI sys-
tems and the ability to analyze and visualize data.
After completing the course, students are also able to design
smaller data cubes and create and evaluate them using appropri-
ate software.

### Content of Module
- Data acquisition and data analysis
- Sampling procedure & Statistical testing procedures
- Basic procedures of multivariate data analysis
- Time series analysis & Analysis of variance
- Factor analysis & Cluster analysis
- Multiple regression, logistic regression, etc
- Introduction to Business Intelligence
- Database basics Relational databases, SQL lab, normaliza-
tion, multidimensional data modeling
- Sales, inventory control, procurement, order management
- Analytical information systems: OLAP laboratory, information
visualization, dashboard laboratory, text mining, data mining
- Big Data, Artificial intelligence, machine learning
- Social media analysis
- Business intelligence, controlling and statistics tools
- Business applications (operational applications, applications
for the management process (MIS; data warehouse)

### Teaching Strategy
- Lecture 0.5 day followed by 1.5 days of practical exercises using Python.
- Unclear: what about reading a Paper.  

### Structure: 
1. Data Management
2. Data Science / AI
3. Reading a Paper.

### Data Management:
**Theoretical learnings**
- SQL
- Big Data Tools
- ETL
- Visualization Tools
  
**Python specific learnings**
- Set up Python and virtual environement
- Pandas as SQL alternative
- Matplotlib.
- Maybe an interactive Plotting routine?

**Exercises**
- Tbd

### Data Science / AI
**Theoretical learnings**
0. Basic overview.
1. Linear Regression.
     - This should be the motivation for Neural Networks.
     - Derive analytical solution
     - Point out that optimisation could be done also numerically.
     - Local optimisation (Newton)
3. Deep Neural Networks.
      - Formulation
      - Understand DNN diagrams
      - Back propagation
      - Optimisers (as extension over Newton)
      - Loss function
      - Activation function and why it is necessary (avoid naive model)
      - Regularisation (Batching as regularizer, and other methods)
      - Universal approximation theorem
      - Overfitting as an implication, how to avoid it, and why it is a miracle that it works after all (vat: there is some paper i need to find). 
      - Drawbacks (eg. many parameters for sequence and image models) as motivation for other network structures
5. Transfer learning 
6. Sequence Modelling (?, high level)
7. Paper Reading (?, Attention is all you need)
8. Convolutional Networks (?, high level)
9. Generative Processes (?, GAN, normalizing flow, diffusion model, high level)   
10. Overview of packages and implementations 


**Python specific learnings**
- Numpy, pytorch, scikit learn, sklearn

**Exercises**
0. Vectorization exercise 
  - A note on "how fast is python" + getting familiar with numpy and pytorch
  - Introduce numpy objects
  - Introduce pytorch objects.
  - Performance study. For loop vs vectorized numpy pytorch implementation 
1. Linear Regression.
  - sklearn
  - Implement with numpy analytical solution
  - Implement with numpy and optimiser loss function directly
  - Linear regression as a neural network
2. Universal approximation theorem.
 - Illustration that a neural network can fit any function
.... 

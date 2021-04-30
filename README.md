<p style="text-align:center" align="center"><img src="./assets/uassign.png" width="200"></p>

# UAssign: A Modern Platform for Programming Assignments

## 1. Background Information

### 1.1 Core Question

How can we improve the experience involved with computer science assignments?

### 1.2 Solution Summary

UAssign is a web platform designed specifically for programming assignments by facilitating automated submission execution, enabling instant feedback.

### 1.3 Who Should Care?

- Professors: Assignment marking turnaround time is significantly reduced through automated submission output evaluation
- Teaching Assistants: Simplified marking workflow enables teaching assistants to be more efficient while marking assignments
- Students: Automated execution allows for instant feedback, allowing students to improve their submissions and learn from their mistakes

## 2. Local Deployment

### 2.1 Prerequisites

You should have the following installed on your machine before starting:

- [Node.js / npm](https://nodejs.org/en/) (npm version 7.11.x or higher)

You will also need the `.env` file with the secret API keys. If wanted, please contact us for the `.env` file.

### 2.2 React Frontend

```
cd frontend/
npm install && npm start
```

### 2.3 Serverless API Backend

```
cd lambda/
npm install && npm start
```

### 2.4 Backend Test Coverage

```
cd lambda/
npm run coverage
```

## 3. Credits

UAssign is the 4P02 project of:

- Tennyson Demchuk - td16qg@brocku.ca - 6190532
- Mutaz Fattal - mf17lg@brocku.ca - 6362156
- Joel Gritter - jg17uy@brocku.ca - 6331763
- Kindeep Singh Kargil - kk17xg@brocku.ca - 6329817
- Aditya Rajyaguru - ar18xp@brocku.ca - 6582282
- Daniel Sokic - ds16sz@brocku.ca - 6164545

We'd like to thank our TA's for their work in this course, and for hosting workshops:

- Amirali Madani - am18gk@brocku.ca
- Sajad Saha - ss17de@brocku.ca

Finally, many thanks to Professor Naser for teaching us in both 4P01 and 4P02!

- Naser Ezzati-Jivan - nezzati@brocku.ca

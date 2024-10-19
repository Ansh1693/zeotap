# AST Rule Engine

## Project Structure

The project is divided into two main parts: the client and the server.

arch/
├── client/
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.tsx
│ │ │ ├── input.tsx
│ │ │ ├── textarea.tsx
│ │ │ └── dialog.tsx
│ │ ├── EvaluateModal.tsx
│ │ ├── AddCardModal.tsx
│ ├── pages/
│ │ ├── index.tsx
│ │ └── \_app.tsx
│ ├── styles/
│ │ └── globals.css
│ ├── hooks/
│ │ └── use-toast.ts
│ ├── utils/
│ │ └── api.ts
│ ├── tsconfig.json
│ ├── package.json
│ └── Dockerfile
├── server/
│ ├── src/
│ │ ├── routes/
│ │ │ └── rules.ts
│ │ ├── controllers/
│ │ │ └── rulesController.ts
│ │ ├── models/
│ │ │ └── rule.ts
│ │ ├── utils/
│ │ │ └── initialisers/
│ │ │ └── mongoose.ts
│ │ ├── app.ts
│ │ ├── tsconfig.json
│ │ ├── package.json
│ │ └── Dockerfile
├── docker-compose.yml
└── README.md

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, ShadCN, Typescript(Strongly typed language)
- **Backend**: Express, Node.js, MongoDB, Typescript
- **Build Tools**: Docker, Docker Compose
- **Testing**: Mocha, Chai
- **Linting**: ESLint, Prettier

## Idea

- I have used Abstract Syntax Trees as a way of storing rule strings. AST Node has comprises of-
  Left Node- Can be another AST Node or null, Right - Can be another ASTNode or null, type can be operand or operator, value can be expression for operand and 'And' or 'Or' for operator.

- For creating rule, I am first validating rule string if its valid and all attributes inside it are valid and then creating ast recursively
- For evaluating, I am recursively traversing the tree and validating the expression at root nodes and propagating the values through to the root.

- For combining , I am using most common operator within strings taking base case as 'AND' and merging strings based on most common operators.

- Bonus:
  - Implemented error handling for invalid rules or invalid dataformats
  - Implemented validation for catalog
  - Can modify already made ast by updating the rule by sending new rulestring

## Tests

The following test scenarios have been implemented to ensure the correctness and robustness of the AST Rule Engine:

### Test 1: Individual Rule Creation and AST Verification

- **Simple Comparison Rule**: Verifies that a simple comparison rule (e.g., `age > 30`) is correctly parsed into an AST with the appropriate operand node.
- **String Comparison Rule**: Verifies that a string comparison rule (e.g., `department = 'IT'`) is correctly parsed into an AST with the appropriate operand node.
- **Compound AND Rule**: Verifies that a compound rule with an AND operator (e.g., `(age > 30 AND salary > 50000)`) is correctly parsed into an AST with the appropriate operator and operand nodes.
- **Compound OR Rule**: Verifies that a compound rule with an OR operator (e.g., `(department = 'IT' OR department = 'HR')`) is correctly parsed into an AST with the appropriate operator and operand nodes.

### Test 2: Rule Combination and AST Structure

- **Combine Two Simple Rules with AND**: Verifies that two simple rules are correctly combined into a single AST using the AND operator.
- **Combine Three Rules Maintaining Structure**: Verifies that three rules are correctly combined into a single AST while maintaining the logical structure.
- **Handle Mixed AND/OR Operations**: Verifies that rules with mixed AND and OR operators are correctly combined into a single AST.

### Test 3: Rule Evaluation with Sample Data

- **Evaluate Simple Comparison**: Verifies that a simple comparison rule is correctly evaluated against sample data.
- **Evaluate String Comparison**: Verifies that a string comparison rule is correctly evaluated against sample data.
- **Evaluate Compound AND Conditions**: Verifies that a compound rule with AND conditions is correctly evaluated against sample data.
- **Evaluate Compound OR Conditions**: Verifies that a compound rule with OR conditions is correctly evaluated against sample data.

### Test 4: Complex Scenarios and Edge Cases

- **Handle Deeply Nested Rules**: Verifies that deeply nested rules are correctly parsed into an AST and evaluated against sample data.
- **Handle Multiple OR Conditions**: Verifies that rules with multiple OR conditions are correctly combined and evaluated against sample data.
- **Handle Empty or Invalid Data Gracefully**: Verifies that the system handles empty or invalid data gracefully during rule evaluation.
- **Maintain Rule Integrity After Conversion**: Verifies that the rule integrity is maintained after converting an AST back to a rule string and re-parsing it.

### Test 5: Invalid Rule Creation

- **Handle Missing Comparison Operator**: Verifies that the system throws an error for rules with missing comparison operators (e.g., `age 30`).
- **Handle Invalid Comparison Operator**: Verifies that the system throws an error for rules with invalid comparison operators (e.g., `age >> 30`).
- **Handle Missing Operand**: Verifies that the system throws an error for rules with missing operands (e.g., `> 30`).
- **Handle Invalid Operand Type**: Verifies that the system throws an error for rules with invalid operand types (e.g., `age > 'thirty'`).

### Test 6: Invalid Rule Combination

- **Handle Empty Rule List**: Verifies that the system throws an error when attempting to combine an empty list of rules.
- **Handle Invalid Rule in List**: Verifies that the system throws an error when attempting to combine a list of rules that contains an invalid rule.

### Test 7: Invalid Rule Evaluation

- **Handle Evaluation of Invalid Rule**: Verifies that the system throws an error when attempting to evaluate an invalid rule (e.g., `age >> 30`).
- **Handle Evaluation with Missing Data**: Verifies that the system correctly handles evaluation when the required data attributes are missing.

### Running the Project

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Ansh1693/Zeotap.git
   cd AST
   ```

2. **Run using Docker**:

```sh
    docker-compose up --build
```

3. **Access the client**:
   ```sh
   http://localhost:4000/
   ```
4. **Access the server**:
   ```sh
   http://localhost:5000/
   ```

### You can run client and server seperately

#### Running the Client Separately

1. **Navigate to the client directory**:

   ```sh
   cd Zeotap/AST/client
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. Copy .env.example to .env.local

4. **Start the client**:

   ```sh
   npm run dev
   ```

5. **Access the client**:

   ```sh
   http://localhost:4000/
   ```

#### Running the Server Separately

1. **Navigate to the server directory**:

   ```sh
   cd Zeotap/AST/server
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Env creation**:

   ```sh
   MONGO_URI= mongourl
   ```

4. **Start the server**:

   ```sh
   npm run start
   ```

5. **Access the server**:

   ```sh
   http://localhost:5000/
   ```

6. **Run Tests**:
   ```sh
   npm run test
   ```

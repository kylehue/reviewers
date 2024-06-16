# MATH 015 (Symbolic Logic)

## Prelim
> To be added.

## Midterm

### Formal Proof of Validity {#formal-proof-of-validity}
- **Proof**: A demonstration on how to derivate the conclusion from the given premises of a valid argument.
- How to write a proof:
  1. Create a 2-column table:
     - Column 1: Propositions
     - Column 2: Reasons
     - Number the rows
  2. Write the reason for each proposition in the row.
     - Must include the row number of the propositions that has used for derivation.

#### Example {#formal-proof-of-validity-example}
<Markdown class="w-fit">
$$
\frac{
  \begin{align*}
  & (p \vee q) \rightarrow r \\
  & p \\
  & \neg (r \wedge s) \\
  \end{align*}
}{
  \therefore \neg s
}
$$
</Markdown>

Proof:

| Propositions                  | Reasons                              |
| ----------------------------- | ------------------------------------ |
| 1. $(p \vee r) \rightarrow r$ | Premise #1                           |
| 2. $p$                        | Premise #2                           |
| 3. $\neg (r \wedge s)$        | Premise #3                           |
| 4. $p \vee q$                 | 2 - Addition Law                     |
| 5. $r$                        | 1 $\wedge$ 4 - Modus Ponens          |
| 6. $\neg r \vee \neg s$       | 3 - De Morgan's Law                  |
| 7. $\neg s$                   | 5 $\wedge$ 6 - Disjunctive Syllogism |

---

### Reductio Ad Absurdum {#reductio-ad-absurdum}
- Translates to *"reduction to absurdity"*.
- Method of proving in which negation of conclusion is assumed to be true.
- Together with the given premises and the negation of the conclusion, the goal is to demonstrate that such assumptions lead to a **contradiction**.
- Must use the **Complement Law** ($P \wedge \neg P \equiv 0$) to arrive in a contradiction.

#### Example {#reductio-ad-absurdum-example}
<Markdown class="w-fit">
$$
\frac{
  \begin{align*}
  & (p \vee q) \rightarrow r \\
  & p \\
  & \neg (r \wedge s) \\
  \end{align*}
}{
  \therefore \neg s
}
$$
</Markdown>

Proof:

| Propositions                  | Reasons                              |
| ----------------------------- | ------------------------------------ |
| 1. $(p \vee r) \rightarrow r$ | Premise #1                           |
| 2. $p$                        | Premise #2                           |
| 3. $\neg (r \wedge s)$        | Premise #3                           |
| 4. $s$                        | Negation of Conclusion               |
| 5. $\neg r \vee \neg s$       | 3 - De Morgan's Law                  |
| 6. $\neg r$                   | 5 $\wedge$ 4 - Disjunctive syllogism |
| 7. $\neg (p \vee q)$          | 1 $\wedge$ 6 - Modus Tollens         |
| 8. $\neg p \wedge \neg q$     | 7 - De Morgan's Law                  |
| 9. $\neg p$                   | 8 - Simplification Law               |
| 10. ⚡                         | 2 $\wedge$ 9 - Complement Law        |

---

### Shorter Truth Table
- The same as [reductio ad absurdum](#reductio-ad-absurdum).

#### Example
<Markdown class="w-fit">
$$
\frac{
  \begin{align*}
  & p \rightarrow \neg s \\
  & \neg s \rightarrow r \\
  \end{align*}
}{
  \therefore p \rightarrow r
}
$$
</Markdown>

**Using shorter truth table:**
1. Same as [reductio ad absurdum](#reductio-ad-absurdum), we assume that conclusion is false and all premises are true:
   - $p \rightarrow r \equiv 0$
   - In order for $p \rightarrow r$ to be false, $r$ must be false and $p$ must be true. 
   - $s$ can either be true or false.
2. Create the table:
   |     |     |     |          | Premise #1           | Premise #2            |
   | --- | --- | --- | -------- | -------------------- | --------------------- |
   | $p$ | $r$ | $s$ | $\neg s$ | $p\rightarrow\neg s$ | $\neg s\rightarrow r$ |
   | 1   | 0   | 1   | 0        | 0                    | 1                     |
   | 1   | 0   | 0   | 1        | 1                    | 0                     |

3. Argument is **valid** because each row in the premise columns contains a false value.
   | Premise #1           | Premise #2            |
   | -------------------- | --------------------- |
   | $p\rightarrow\neg s$ | $\neg s\rightarrow r$ |
   | 0                    | 1                     |
   | 1                    | 0                     |

---

### Rules of Equivalence {#rules-of-equivalence}
- Used in deriving propositions.

#### Group A - For simplifying {#rules-of-equivalence-a}

::: info RULES OF EQUIVALENCE (A)
<div class="flex flex-wrap justify-between gap-4 my-4">
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.1) Annulment Law</span>
      <Markdown>
         $P \vee 1 \equiv 1$
      </Markdown>
      <Markdown>
         $P \wedge 0 \equiv 0$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.2) Identity Law</span>
      <Markdown>
         $P \vee 0 \equiv P$
      </Markdown>
      <Markdown>
         $P \wedge 1 \equiv P$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.3) Idempotent Law</span>
      <Markdown>
         $P \vee P \equiv P$
      </Markdown>
      <Markdown>
         $P \wedge P \equiv P$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.4) Complement Law</span>
      <Markdown>
         $P \vee \neg P \equiv 1$
      </Markdown>
      <Markdown>
         $P \wedge \neg P \equiv 0$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.5) Double-Negation Law</span>
      <Markdown>
         $\neg ( \neg P ) \equiv P$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(A.6) Absorption Law</span>
      <Markdown>
         $P \wedge (P \vee Q) \equiv P$
      </Markdown>
      <Markdown>
         $P \vee (P \wedge Q) \equiv P$
      </Markdown>
   </div>
</div>
:::

#### Group B - For manipulating {#rules-of-equivalence-b}

::: info RULES OF EQUIVALENCE (B)
<div class="flex flex-wrap justify-between gap-4 my-4">
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(B.1) Associative Law</span>
      <Markdown>
         $P \vee (Q \vee R) \equiv Q \vee (P \vee R)$
      </Markdown>
      <Markdown>
         $P \wedge (Q \wedge R) \equiv Q \wedge (P \wedge R)$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(B.2) Commutative Law</span>
      <Markdown>
         $P \vee Q \equiv Q \vee P$
      </Markdown>
      <Markdown>
         $P \wedge Q \equiv Q \wedge P$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(B.3) Distributive Law</span>
      <Markdown>
         $P \wedge (Q \vee R) \equiv (P \wedge Q) \vee (P \wedge R)$
      </Markdown>
      <Markdown>
         $P \vee (Q \wedge R) \equiv (P \vee Q) \wedge (P \vee R)$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(B.4) De Morgan's Law</span>
      <Markdown>
         $\neg (P \wedge Q) \equiv \neg P \vee \neg Q$
      </Markdown>
      <Markdown>
         $\neg (P \vee Q) \equiv \neg P \wedge \neg Q$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(B.5) Contrapositive Law</span>
      <Markdown>
         $P \rightarrow Q \equiv \neg Q \rightarrow \neg P$
      </Markdown>
   </div>
</div>
:::

#### Group C - For transforming {#rules-of-equivalence-c}
::: info RULES OF EQUIVALENCE (C)
<div class="flex flex-wrap justify-between gap-4 my-4">
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(C.1) Material Implication</span>
      <Markdown>
         $P \rightarrow Q \equiv \neg P \vee Q$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(C.2) Material Equivalence</span>
      <Markdown>
         $P \leftrightarrow Q \equiv (P \rightarrow Q) \wedge (Q \rightarrow P)$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">(C.3) Equivalent of XOR</span>
      <Markdown>
         $P \oplus Q \equiv (P \wedge \neg Q) \vee (\neg P \wedge Q)$
      </Markdown>
   </div>
</div>
:::

---

### Rules of Inference {#rules-of-inference}
- List of all logically valid arguments.
- It allows us to combine 2 premises to produce a new proposition.
- **Inferencing** is the process of drawing out *(deriving)* the conclusion from the premises.

::: info RULES OF INFERENCE
<div class="flex flex-wrap justify-between gap-4 my-4">
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Modus Ponens</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \rightarrow Q \\
            & P \\
            \end{align*}
         }{
            \therefore Q
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Modus Tollens</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \rightarrow Q \\
            & \neg Q \\
            \end{align*}
         }{
            \therefore \neg P
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Hypothetical Syllogism</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \rightarrow Q \\
            & Q \rightarrow R \\
            \end{align*}
         }{
            \therefore P \rightarrow R
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Disjunctive Syllogism</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \vee Q \\
            & \neg P \\
            \end{align*}
         }{
            \therefore Q
         }
         $$
      </Markdown>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \vee Q \\
            & \neg Q \\
            \end{align*}
         }{
            \therefore P
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Simplification</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \wedge Q \\
            \end{align*}
         }{
            \therefore P
         }
         $$
      </Markdown>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \wedge Q \\
            \end{align*}
         }{
            \therefore Q
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Conjunction</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & P \\
            & Q \\
            \end{align*}
         }{
            \therefore P \wedge Q
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Addition</span>
      <Markdown class="w-fit">
         $$
         \frac{
            P
         }{
            \therefore P \vee Q
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Absorption</span>
      <Markdown class="w-fit">
         $$
         \frac{
            P \rightarrow Q
         }{
            \therefore P \rightarrow (P \wedge Q)
         }
         $$
      </Markdown>
   </div>
   <div class="flex flex-auto flex-col items-center min-w-[30%]">
      <span class="font-semibold">Constructive Dilemma</span>
      <Markdown class="w-fit">
         $$
         \frac{
            \begin{align*}
            & (P \rightarrow Q) \wedge (R \rightarrow S) \\
            & P \vee R \\
            \end{align*}
         }{
            \therefore Q \vee S
         }
         $$
      </Markdown>
   </div>
</div>
:::

---

### Inductive vs. Deductive Arguments {#inductive-vs-deductive}

#### Inductive Argument
- Argument that has probable conclusion.
  - If all premises are true, is the conclusion *probably* true?
    - No $\rightarrow$ It's a **weak** argument.
    - Yes $\rightarrow$ It's a **strong** argument.
      - Are the premises *actually* true?
        - No $\rightarrow$ It's an **uncogent** argument.
        - Yes $\rightarrow$ It's a **cogent** argument.

#### Deductive Argument
- Argument that has guaranteed conclusion.
  - If all premises are true, is the conclusion *guaranteed* to be true?
    - No $\rightarrow$ It's an **invalid** argument.
    - Yes $\rightarrow$ It's a **valid** argument.
      - Are the premises *actually* true?
        - No $\rightarrow$ It's an **unsound** argument.
        - Yes $\rightarrow$ It's a **sound** argument.

Better explanation in this video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/6Sg9zI-GNsI?si=gwv9AnSWO8IlhfLg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
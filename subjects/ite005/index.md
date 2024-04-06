# ITE 005 (Operating Systems)

## Prelim

> To be added.

## Midterm

A system typically consists of several (perhaps hundreds or even thousands) of threads running either concurrently or in parallel. Threads often share user data. Meanwhile, the operating system continuously updates various data structures to support multiple threads. A **race condition** exists when access to shared data is not controlled, possibly resulting in corrupt data values.

### Process Synchronization
- Involves using tools that control access to shared data to avoid race conditions.
- Must be used carefully or else they can result in poor system performance, and can even result in deadlocks.

### Cooperating Process
- One that can affect or be affected by other processes executing in the system.
- Can either directly share a logical address space or be allowed to share data only through shared memory or message passing.

> Concurrent access to shared data may result in data inconsistency.

### Race Condition
- A situation where several processes access and manipulate the same data concurrently and the outcome of the execution depends on the particular order in which the access takes place.
- Exists when access to shared data is not controlled, possibly resulting in corrupt data values.
- To guard against the race condition, we need to ensure that only one process at a time can be manipulating a variable.

### Critical-Section Problem
- Consider a list of $n$ processes — $\{p_{0}, p_{1}, \dots, p_{n-1}\}$
- Each process may be changing common variables, updating tables, writing files, etc.
- Each process has a critical section segment of code. For example:
```js
function process() {
   // Entry section
   lock();

   // Critical section
   manipulateData();
   
   // Exit section
   unlock();

   // Remainder section
   doStuff();
}
```
- When one process is in a critical section, no other processes is allowed to be in their critical sections.
- **Critical-Section Problem** is used to design a protocol to solve this.
- Each process must ask a permission to enter critical section in the **entry section**, may follow critical section with **exit section**, then the **remainder section**.

### Requirements to Solve the Critical-Section Problem
**Mutual Exclusion (Mutex)**
- If a process is executing in its critical section, then no other processes is allowed to execute in their critical sections.

**Progress**
- If no process is executing in its critical section, and some process wishes to execute their critical section, then the selection of the process that will enter the critical section next cannot be postponed indefinitely.

**Bounded Waiting**
- A bound must exist on the number of times that other processes are allowed to enter their critical sections after a process has made a request has made a request to enter its critical section and before that request is granted.
- Assume that each process executes at a nonzero speed
- No assumption concerning the relative speed of the $n$ processes

### Interrupt-Based Solution
- Entry section disables interrupts
- Exit section enables interrupts

### Sofware Solution
- 2-process solution
- Assumes that the **load** and **store** machine-language instructions are atomic (meaning they can't be interrupted).
- The 2 processes share 1 variable — `int turn`
- The variable `turn` indicates whose turn it is to enter the critical section.

::: details Pseudocode - Software Solution Algorithm
Initialize the `turn` variable to determine whose turn it is (1 or 2)
```java
int turn = 0;
```

Process 0
```java
// Busy wait: Wait until it's process 0's turn.
while (turn == 1);

// Process 0's turn...
// Critical section
doStuff();

// Exit
turn = 1; // Set to 1 to indicate that it's process 1's turn
```

Process 1
```java
// Busy wait: Wait until it's process 1's turn.
while (turn == 0);

// Process 1's turn...
// Critical section
doStuff();

// Exit
turn = 0; // Set to 0 to indicate that it's process 0's turn
```
:::


### Correctness of the Software Solution
- Mutual exclusion is preserved
  - $P_{i}$ enters critical section only if `turn == i`.
- `turn` cannot be both 1 and 2 at the same time.
- But what about Progress and Bounded-Waiting requirement?

### Peterson's Solution
- 2-process solution
- Assumes that the **load** and **store** machine-language instructions are atomic (meaning they can't be interrupted).
- The 2 process share 2 variables — `int turn` and `boolean flag[2]`.
- The variable `turn` indicates whose turn it is to enter the critical section.
- The variable `flag` is an array with only 2 values. This variable is used to indicate if a process is ready to enter the critical section.
- `flag[i] = true` implies that the process $P_{i}$ is ready.

::: details Pseudocode - Peterson's Solution Algorithm
Initialize the variables
```java
int turn = 0;
boolean[] flag = {false, false};
```

Process 0
```java
flag[0] = true; // Process 0 wants to enter so set flag to true

// Busy wait: Wait until it's process 0's turn.
while (flag[1] == true && turn == 1);

// Process 0's turn...
// Critical section
doStuff();

flag[0] = false; // Process 0 is done so set flag back to false
turn = 1; // Set to 1 to indicate that it's process 1's turn
```

Process 1
```java
flag[1] = true; // Process 1 wants to enter so set flag to true

// Busy wait: Wait until it's process 1's turn.
while (flag[0] == true && turn == 0);

// Process 1's turn...
// Critical section
doStuff();

flag[1] = false; // Process 1 is done so set flag back to false
turn = 0; // Set to 0 to indicate that it's process 0's turn
```
:::

### Correctness of Peterson's Solution
- Mutual exclusion is preserved
  - $P_{i}$ enters critical section only if `turn == i` or `flag[j] == false`.
- Progress and Bounded-Waiting requiremets are satisfied.

### Peterson's Solution and Modern Architecture
- Although useful for demonstrating an algorithm, Peterson’s Solution is not guaranteed to work on modern architectures.
- Understanding why it will not work is useful for better understanding race conditions.
- For single-threaded this is ok as the result will always be the same.
- For multithreaded the reordering may produce inconsistent or unexpected results.

### Memory Barrier
- To ensure that Peterson's Solution will work correctly on modern computer architecture, we must use **Memory Barrier**.
- It is an instruction that forces any change in memory to be propagated *(made visible)* to all other processors.

### Memory Model
- Memory-guarantees a computer architecture makes to application programs.
- May be either:
  - **Strongly Ordered** - Where memory modification of one processor is immediately visible to all other processors.
  - **Weakly Ordered** - Where memory modification of one processor may not be immediately visible to all other processors.

### Memory Barrier Instructions
- When a memory barrier instruction is performed, the system ensures that all loads and stores are completed before any subsequent load or store oparations are performed.
- Therefore, even if instructions were reordered, the memory barrier ensures that the store operations are completed in memory and visible to other processors before future load or store operations are performed.

### Synchronization Hardware
- Many systems provide hardware support for implementing the critical section code.
- We will look at 3 forms of hardware support:
   1. Memory Barrier
   2. Hardware Instructions
   3. Atomic Variables

### Hardware Instructions
- Special hardware instructions that allow us to either *test-and-modify* the content of a word, or to *swap* the contents of 2 words atomically *(uninterruptedly)*.
- **Test-and-Set** instruction
- **Compare-and-Swap** instruction

> Typically, instructions such as *compare-and-swap* are used as building blocks for other synchronization tools.

### Atomic Variables
- Provides uninterruptible updates on basic data types such as integers and booleans.

### Mutex Locks
- Previous solutions are complicated and generally inaccessible to application programmers.
- OS designers build software tools to solve critical section problem.
- Simplest is mutex lock.
- A boolean variable indicating if lock is available or not.
- Protects a critical section by
  - First `acquire()` a lock
  - Then `release()` the lock
- Calls to `acquire()` and `release()` must be atomic.
  - Usually implemented via hardware atomic instructions such as *compare-and-swap*.
- This solution requires **busy-waiting**
  - This lock is therefore called a **spinlock**

::: details Pseudocode - Mutex Lock Algorithm
```java
acquireLock();

// Critical section
doStuff();

releaseLock();
```
:::

### Semaphore
- Synchronization tool that provides more sophisticated ways *(than Mutex Locks)* for processes to synchronize their activies.
- Semaphore $S$ - integer variable
- Can only be accessed via 2 indivisible *(or atomic)* operations
  1. `wait()` - originally called `P()`
  2. `signal()` - originally called `V()`
- **Counting Sempahore** is an integer value that can range over an unrestricted domain.
- **Binary Semaphore** is an integer value the can range only between 0 and 1.
- Same as mutex lock.
- Can implement a counting semaphore $S$ as a binary semaphore.
- With semaphores, we can solve various synchronization problems.

::: details Pseudocode - Definition of the `wait()` operation
```js
function wait(S) {
   while (S <= 0); // busy-wait

   S--;
}
```
:::

::: details Pseudocode - Definition of the `signal()` operation
```js
function signal(S) {
   S++;
}
```
:::

### Semaphore Implementation
- Must guarantee that no 2 processes can execute the `wait()` and `signal()` on the same semaphore at the same time.
- Thus, the implementation becomes the critical section problem where the `wait()` and `signal()` code are placed in the critical section.
- Could now have busy-waiting in critical section implementation.
- Implementation code is short.
- Little busy-waiting if critical section is rarely occupied. 
  
> Note that applications may spend lots of time in critical sections and therefore this is not a good solution.

### Semaphore Implementation with no Busy-Waiting
- With each semaphore there is an associated waiting queue.
- Each entry in a waiting queue has 2 data items:
  1. Value (of type int)
  2. Pointer to next record in the list
- 2 Operations:
  1. **block** - place the process invoking the operation on the appropriate waiting queue.
  2. **wakeup** - remove one of processes in the waiting queue and place it in the ready queue.

### Monitors
- A high-level abstraction that provides a convenient and effective mechanism for process synchronization.
- Abstract data type, internal variables only accessible by code within the procedure.
- Only one process may be active within the monitor at a time.

::: details Pseudocode - Monitor
```
Monitor monitorName {
   sharedVariable1 = ...;
   sharedVariable2 = ...;

   function P_1(...) {...}
   function P_2(...) {...}
   function P_n(...) {...}
}
```
:::

### Single Resource allocation
- Allocate a single resource among competing processes using priority numbers that specify the maximum time a process plans to use the resource.

### Liveness
- Refers to a set of properties that a system must satisfy to ensure processes make progress.
Indefinite waiting is an example of a liveness failure.

> Processes may have to wait indefinitely while trying to acquire a synchronization tool such as a mutex lock or semaphore.

> Waiting indefinitely violates the progress and bounded-waiting criteria discussed at the beginning of this chapter.

### Deadlock
- When 2 or more processes are waiting indefinitely for an event that can be caused by only one of the waiting processes.

### Forms of Deadlock
- **Starvation** - Indefinite blocking. A process may never be removed from the semaphore queue in which it is suspended.
- **Priority Inversion** - Scheduling problem when lower-priority process hold a lock needed by higher-priority process. This is solved via **priority-inheritance protocol**.

### Classical Problems Used to Test Newly-Proposed Synchronization Schemes
- Bounded-Buffer Problem
- Readers and Writers Problem
- Dining-Philosophers Problem

### Bounded-Buffer Problem
- $n$ buffers, each can hold one item.
- Semaphore **mutex** initialized to the value 1.
- Semaphore **full** initialized to the value 0.
- Semaphore **empty** initialized to the value $n$.

### Readers-Writers Problem
- A data set is shared among a number of concurrent processes.
- **Readers** only read the data set and do not perform any updates.
- **Writers** can both read and write.
- Problem
  - Allow multiple readers to read at the same time.
  - Only one single writer can access the shared data at the same time.
- Several variation of how readers and writers are considered, and all involve some form of priorities.
- Shared Data:
  - Data set
  - Sempahore `rw_mutex` initialized to 1.
  - Semaphore `mutex` initialized to 1.
  - Integer `read_count` initialized to 0.

### Readers-Writers Problem Variations
- First reader-writer problem - A situation where a writer process never writes.
- Second reader-writer problem - Once a writer is ready to write, no *newly-arrived reader* is allowed to read.
- These variations may result in starvation.
- Although these problems can be solved on some systems by kernel providing reader-writer locks.


### Dining-Philosophers Problem
- $n$ philosophers' sit at a round table with a bowl of rice in the middle.
- They spend their lives alternating thinking and eating. 
- They do not interact with their neighbors. 
- Occasionally, they try to pick up 2 chopsticks (one at a time) to eat from bowl.
  - Need both 2 chopsticks to eat, then release both when done
- In the case of 5 philosophers, the shared data is:
  - Bowl of rice (data set)
  - Semaphore chopstick[5] initialized to 1

### Kernel Synchronization - Windows
- Uses interrupt masks to protect access to global resources on uniprocessor systems.
- Uses **spinlocks** on multiprocessor systems.
  - Spinlocking-thread will never be preempted *(prevented)*.
- Also provides dispatcher objects user-land which may act mutexes, semaphores, events, and timers.
  - An event acts much like a condition variable.
  - Timers notify one or more thread when time expires.
  - Dispatcher objects either **signaled-state** (object available) or **non-signaled-state** (thread will block).
- Mutex dispatcher object.

### Linux Synchronization
- Prior to kernel Version 2.6, disables interrupts to implement short critical sections
- Version 2.6 and later, fully preemptive
- Linux provides:
  - Semaphores
  - Atomic integers
  - Spinlocks
  - Reader-writer versions of both
- On single-CPU system, spinlocks replaced by enabling and disabling kernel preemption.

### POSIX Synchronization
- POSIX API provides
  - Mutex locks
  - Semaphores
  - Condition variable
- Widely used on UNIX, Linux, and macOS

### POSIX Semaphores
- POSIX provides two versions – **named** and **unnamed**.
- Named semaphores can be used by unrelated processes, unnamed cannot.

### Java Synchronization
- Java provides rich set of synchronization features:
  - Java monitors
  - Reentrant locks
  - Semaphores
  - Condition variables

### Java Monitors
- Every Java object has associated with it a single lock.
- If a method is declared as **synchronized**, a calling thread must own the lock for the object.
- If the lock is owned by another thread, the calling thread must wait for the lock until it is released.
- Locks are released when the owning thread exits the **synchronized** method.
- A thread that tries to acquire an unavailable lock is placed in the object’s **entry set**.
- Similarly, each object also has a **wait set**.
- When a thread calls `wait()`:
   1. It releases the lock for the object.
   2. The state of the thread is set to blocked.
   3. The thread is placed in the wait set for the object.
- A thread typically calls `wait()` when it is waiting for a condition to become true.
- When a thread calls `notify()`:
   1. An arbitrary thread $T$ is selected from the wait set.
   2. $T$ is moved from the wait set to the entry set.
   3. Set the state of $T$ from blocked to runnable.
   4. $T$ can now compete for the lock to check if the condition it was waiting for is now true.

### Alternative Approaches
- Transactional Memory
- OpenMP
- Functional Programming Languages

### Transactional Memory
- A **memory transaction** is a sequence of read-write operations
to memory that are performed atomically. A transaction can be
completed by adding $atomic_{S}$ which ensure statements in $S$
are executed atomically.

### Functional Programming Languages
- Offers different paradigm than procedural languages in that they do not maintain state.
- Variables are treated as immutable and cannot change state once they have been assigned a value.
- There is increasing interest in functional languages such as Erlang and Scala for their approach in handling data races.

### Deadlocks
In a multiprogramming environment, several threads may compete for a finite number of resources. A thread requests resources; if the resources are not available at that time, the thread enters a waiting state. Sometimes, a waiting thread can never again change state, because the resources it has requested are held by other waiting threads. This situation is called a **deadlock**.

In the previous module, we defined **Deadlock** as a situation in which every process in a set of processes is waiting for an event that can be caused only by another process in the set.


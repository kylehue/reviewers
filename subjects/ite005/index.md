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

### Software Solution
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
- Progress and Bounded-Waiting requirements are satisfied.

### Peterson's Solution and Modern Architecture
- Although useful for demonstrating an algorithm, Peterson's Solution is not guaranteed to work on modern architectures.
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
- When a memory barrier instruction is performed, the system ensures that all loads and stores are completed before any subsequent load or store operations are performed.
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
- Synchronization tool that provides more sophisticated ways *(than Mutex Locks)* for processes to synchronize their activities.
- Semaphore $S$ - integer variable
- Can only be accessed via 2 indivisible *(or atomic)* operations
  1. `wait()` - originally called `P()`
  2. `signal()` - originally called `V()`
- **Counting Semaphore** is an integer value that can range over an unrestricted domain.
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
  - Semaphore `rw_mutex` initialized to 1.
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
- POSIX provides two versions - **named** and **unnamed**.
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
- A thread that tries to acquire an unavailable lock is placed in the object's **entry set**.
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

We can define **Deadlock** as a situation in which every process in a set of processes is waiting for an event that can be caused only by another process in the set.

### System Model
- A system consists of resources.
- Resource types $R_{1}, R_{2}, \dots, R_{m}$
  - e.g. CPU cycles, memory space, I/O devices
- Each resource type $R_{i}$ has $W_{i}$ instances.
- Each process utilizes a resource as follows:
  - **request**
  - **use**
  - **release**

### Deadlock Characterization
Deadlock can arise if 4 conditions hold simultaneously:
- **Mutual exclusion**: only one process at a time can use a resource.
- **Hold and wait**: A process holding at least one resource is waiting to acquire additional resources held by other processes.
- **No preemption**: A resource can be released only voluntarily by the process holding it after that process has completed its task.
- **Circular wait**: There exists a set $\{P_{0}, P_{1}, \dots, P_{n}\}$ of waiting for processes such that $P_{0}$ is waiting for a resource that is held by $P_{1}$, $P_{1}$ is waiting for a resource that is held by $P_{2}$, $\dots$, $P_{n-1}$ is waiting for a resource that is held by $P_{n}$, and $P_{n}$ is waiting for a resource that is held by $P_{0}$.

### Resource-Allocation Graph
A set of vertices $V$ and a set of edges $E$.
- $V$ is partitioned into two types:
  - $P = \{P_{1}, P_{2}, \dots, P_{n}\}$, the set consisting of all the processes in the system.
  - $R = \{R{1}, R{2}, \dots, R_{m}\}$, the set consisting of all resource types in the system.
- **request edge** - directed edge $P_{i} \rightarrow R_{j}$ 
- **assignment edge** - directed edge $R_{j} \rightarrow P_{i}$ 

### Basic Facts
- If the graph contains no cycles $\rightarrow$ no deadlock
- If only one instance per resource type $\rightarrow$ deadlock
- If the graph contains a cycle $\rightarrow$ possibility of deadlock
- If several instances per resource type $\rightarrow$ possibility of deadlock

### Methods for Handling Deadlocks
- Ensure that the system will never enter a deadlock state:
  - Deadlock prevention
  - Deadlock avoidance
- Allow the system to enter a deadlock state and then recover.
- Ignore the problem and pretend that deadlocks never occur in the system.

### Deadlock Prevention
Invalidate one of the four necessary conditions for deadlock:

- **Mutual Exclusion**
  - Not required for sharable resources (e.g. read-only files).
  - Must hold for non-sharable resources.
- **Hold and Wait**
  - Must guarantee that whenever a process requests a resource, it does not hold any other resources.
  - Require process to request and be allocated all its resources before it begins execution, or allow the process to request resources only when the process has none allocated to it.
  - Low resource utilization; starvation possible.
- **No Preemption**
  - If a process that is holding some resources requests another resource that cannot be immediately allocated to it, then all resources currently being held are released.
  - Preempted resources are added to the list of resources for which the process is waiting.
  - The process will be restarted only when it can regain its old resources, as well as the new ones that it is requesting.
- **Circular Wait**
  - Impose a total ordering of all resource types, and require that each process requests resources in increasing order of enumeration.

### Memory Management — Background
- A program is permanently kept on the **backing store** (disk).
- For a program to be run it must be brought from the backing store into memory and placed within a process.
- Main memory and registers are the only storage devices the CPU can access directly.
- The memory unit only sees a stream of:
  - addresses + read requests, or
  - address + data and write requests
- Register access is done in one CPU clock (or less).
- Main memory can take many cycles, causing a **stall**.
- **Cache** sits between the main memory and CPU registers.
- Protection of memory is required to ensure correct operation.

### Memory Management — Protection
- Need to ensure that a process can access only access those addresses in its address space.
- We can provide this protection by using a pair of **base** and **limit registers** define the logical address space of a process.

### Hardware Address Protection
- CPU must check every memory access generated in user mode to be sure it is between base and limit for that user.
- The instructions for loading the base and limit registers are privileged.

### Address Binding
- Programs on disk, ready to be brought into memory to execute, are placed in an **input queue**.
  - Without support, must be loaded into address 0000.
- Inconvenient to have the first user process physical address always at 0000.
- Addresses represented in different ways at different stages of a program's life.
  - Source code addresses are usually symbolic.
  - Compiled code addresses **bind** to relocatable addresses.
    - i.e., "14 bytes from the beginning of this module"
  - The linker or loader will bind relocatable addresses to absolute addresses.
    - i.e., 74014
- Each binding maps one address space to another.

### Binding of Instructions and Data to Memory
Address binding of instructions and data to memory addresses can happen at three different stages:
1. **Compile-time**
   - If memory location known a priori, **absolute code** can be generated.
   - Must recompile code if starting location changes.
2. **Load time**
   - Must generate relocatable code if the memory location is not known at compile time.
3. **Execution time**
   - Binding delayed until run time if the process can be moved during its execution from one memory segment to another.

### Logical vs. Physical Address Space
- The concept of a **logical address space** that is bound to separate **physical address space** is central to proper memory management.
  - **Logical address** - generated by the CPU; also referred to as **virtual address**.
  - **Physical address** - address seen by the memory unit.
- Logical and physical addresses are the same in compile-time and load-time address-binding schemes; logical (virtual) and physical addresses differ in the execution-time address-binding scheme.
- **Logical address space** is the set of all logical addresses generated by a program.
- **Physical address space** is the set of all physical addresses generated by a program.

### Memory-Management Unit (MMU)
- Hardware device that at run time maps virtual to physical address.

### Relocation Register
- The value in the relocation register is added to every address generated by a user process at the time it is sent to memory.
- The user program deals with logical addresses and it never
sees the real physical addresses.
  - Execution-time binding occurs when reference is
  made to location in memory.
  - Logical address bound to physical addresses.

### Dynamic Loading
- The program consist of main part and a number of routines.
- The entire program does need to be in memory to execute.
- Routine is not loaded until it is called.
- Better memory-space utilization; unused routine is never loaded.
- All routines kept on disk in relocatable load format.
- Useful when large amounts of code are needed to handle
infrequently occurring cases.
- No special support from the operating system is required
  - Implemented through program design.
  - OS can help by providing libraries to implement dynamic loading.

### Dynamic Linking
- **Static linking** - System libraries and program code combined by the loader into the binary program image.
- **Dynamic linking** - Linking postponed until execution time.
- Small piece of code, called **stub**, is used to locate the appropriate memory-resident library routine.
- Stub replaces itself with the address of the routine, and executes the routine.
- Operating system checks if routine is in processes' memory address.
  - If not in address space, add to address space.
- Dynamic linking is particularly useful for libraries.
- System also known as **shared libraries**.
- Consider applicability to patching system libraries.
  - Versioning may be needed.

### Memory Allocation
- Main memory must support both OS and user processes.
- Limited resource, must allocate efficiently.
- **Contiguous allocation** is one early method.
- Main memory usually into two **partitions**:
  - Resident operating system, usually held in low memory with interrupt vector.
  - User processes then held in high memory.
  - Each process contained in single contiguous section of memory.

### Contiguous Allocation
- Relocation registers used to protect user processes from each other, and from changing operating-system code and data.
  - Base register contains value of smallest physical address.
  - Limit register contains range of logical addresses — each logical address  must be less than the limit register.
  - MMU maps logical address dynamically.
  - Can then allow actions such as kernel code being transient and kernel changing size.

### Variable Partition Allocation
- Degree of multiprogramming limited by number of partitions.
- **Variable-partition** sizes for efficiency (sized to a given process' needs).
- **Hole** - block of available memory; holes of various size are scattered throughout memory.
- When a process arrives, it is allocated memory from a hole large enough to accommodate it.
- Process exiting frees its partition, adjacent free partitions combined.
- Operating system maintains information about:
  - (a) allocated partitions    
  - (b) free partitions (hole)

### Dynamic Storage-Allocation Problem
- How to satisfy a request of size $n$ from a list of free holes?
  - **First-fit**
    - Allocate the **first hole** that is big enough.
  - **Best-fit**
    - Allocate the **smallest hole** that is big enough; must search entire list, unless ordered by size.
    - Produces the smallest leftover hole.
  - **Worst-fit**
    - Allocate the **largest hole**; must also search entire list.
    - Produces the largest leftover hole.
- First-fit and best-fit better than worst-fit in terms of speed and storage utilization.

### Fragmentation
- **External Fragmentation** - Total memory space exists to satisfy a request, but it is not contiguous.
- **Internal Fragmentation** - Allocated memory may be slightly larger than requested memory; this size difference is memory internal to a partition, but not being used.
- First fit analysis reveals that given $n$ blocks allocated, 0.5 $n$ blocks lost to fragmentation
  - $1/3$ may be unusable $\rightarrow$ **50-percent rule**
- Reduce external fragmentation by **compaction**.
  - Shuffle memory contents to place all free memory together in one large block.
  - Compaction is possible only if relocation is dynamic, and is done at execution time.
  - I/O problem
    - Latch job in memory while it is involved in I/O.
    - Do I/O only into OS buffers.

### Segmentation
- Memory-management scheme that supports user view of memory.
- A program is a collection of segments.
- A segment is a logical unit such as:
  - main program
  - procedure 
  - function
  - method
  - object
  - local variables, global variables
  - common block
  - stack
  - symbol table
  - arrays

### Segmentation Architecture
- Logical address consists of a two tuple:
  1. `segment-number`
  2. `offset`
- **Segment table** - Maps two-dimensional physical addresses; each table entry has:
  - **base** - contains the starting physical address where the segments reside in memory.
  - **limit** - specifies the length of the segment.
- **Segment-table base register (STBR)** points to the segment table's location in memory
- **Segment-table length register (STLR)** indicates number of segments used by a program
  - Segment number $s$ is legal if $s <$ STLR

### Paging
- Physical address space of a process can be noncontiguous; process is allocated physical memory whenever the latter is available.
  - Avoids external fragmentation.
  - Avoids problem of varying sized memory chunks.
- Divide physical memory into fixed-sized blocks called **frames**.
  - Size is power of 2, between 512 bytes and 16 Mbytes.
- Divide logical memory into blocks of same size called **pages**.
- Keep track of all free frames.
- To run a program of size $n$ pages, need to find $n$ free frames and load program.
- Set up a **page table** to translate logical to physical addresses.
- Backing store likewise split into pages.
- Still have Internal fragmentation.

### Paging — Calculating Internal Fragmentation
- Page size = 2,048 bytes
- Process size = 72,766 bytes
- 35 pages + 1,086 bytes
- Internal fragmentation of 2,048 - 1,086 = 962 bytes
- Worst case fragmentation = 1 frame - 1 byte
- On average fragmentation = 1 / 2 frame size
- So small frame sizes desirable?
- But each page table entry takes memory to track
- Page sizes growing over time
  - Solaris supports two page sizes - 8 KB and 4 MB

### Implementation of Page Table
- Page table is kept in main memory.
  - **Page-table base register (PTBR)** points to the page table.
  - **Page-table length register (PTLR)** indicates size of the page table.
- In this scheme every data/instruction access requires two memory accesses.
  - One for the page table and one for the data / instruction.
- The two-memory access problem can be solved by the use of a special fast-lookup hardware cache called **translation look-aside buffers (TLBs)** (also called **associative memory**).

### Translation Look-Aside Buffer
- TLBs typically small (64 to 1,024 entries).
- On a TLB miss, value is loaded into the TLB for faster access next time.
  - Replacement policies must be considered.
  - Some entries can be **wired down** for permanent fast access.
- Some TLBs store **address-space identifiers (ASIDs)** in each TLB entry - uniquely identifies each process to provide address-space protection for that process.
  - Otherwise need to flush the TLB at every context switch.

### Hardware
- Associative memory - parallel search
- Address translation $(p, d)$
  - If $p$ is in associative register, get frame # out.
  - Otherwise get frame # from page table in memory.

### Effective Access Time
- Hit ratio - percentage of times that a page number is found in the TLB.
- An 80% hit ratio means that we find the desired  page number in the TLB 80% of the time.
- Suppose that it takes 10 nanoseconds to access memory.  
  - If we find the desired page in TLB then a mapped-memory access take 10 nanoseconds
  - Otherwise we need two memory access so it is 20 nanoseconds
- **Effective Access Time (EAT)**
  - EAT = $0.80 * 10 + 0.20 * 20 = 12$  nanoseconds
  - implying 20% slowdown in access time
- Consider a more realistic hit ratio of 99%, 
  - EAT = $0.99 * 10 + 0.01 * 20 = 10.1$ nanoseconds
  - implying only 1% slowdown in access time.

### Memory Protection
- Memory protection implemented by associating protection bit with each frame to indicate if access is allowed.
- **Valid-invalid** bit attached to each entry in the page table:
  - "valid" indicates that the associated page is in the process' logical address space, and is thus a legal page
  - "invalid" indicates that the page is not in the process' logical address space
  - Or use **page-table length register (PTLR)**
- Any violations result in a trap to the kernel.
- Can also add more bits to indicate if read-only, read-write, execute-only is allowed.

### Shared Pages
- **Shared code**
  - One copy of read-only (**reentrant**) code shared among processes (i.e., text editors, compilers, window systems).
  - Similar to multiple threads sharing the same process space.
  - Also useful for interprocess communication if sharing of read-write pages is allowed.
- **Private code and data**
  - Each process keeps a separate copy of the code and data.
  - The pages for the private code and data can appear anywhere in the logical address space.

### Structure of the Page Table
- Memory structures for paging can get huge using straight-forward methods:
  - Consider a 32-bit logical address space as on modern computers
  - Page size of 1 KB ($2^{10}$)
  - Page table would have 1 million entries ($2^{32} / 2^{10}$)
  - If each entry is 4 bytes $\rightarrow$ each process requires 16 MB of physical address space for the page table alone.
    - Don't want to allocate that contiguously in main memory.
  - One simple solution is to divide the page table into smaller units:
    - Hierarchical Paging
    - Hashed Page Tables
    - Inverted Page Tables

### Hierarchical Page Tables
- Break up the logical address space into multiple page tables
- A simple technique is a two-level page table
- We then page the page table

### Two-Level Paging Example
- A logical address (on 32-bit machine with 1K page size) is divided into:
  - a page number consisting of 22 bits
  - a page offset consisting of 10 bits

- Since the page table is paged, the page number is further divided into:
  - a 12-bit page number 
  - a 10-bit page offset

- Thus, a logical address is as follows:

<table>
  <tr>
    <th colspan="2">Page number</th>
    <th colspan="1">Page offset</th>
  </tr>
  <tr>
    <th><Markdown class="*:!m-0">$p_{1}$</Markdown></th>
    <th><Markdown class="*:!m-0">$p_{2}$</Markdown></th>
    <th><Markdown class="*:!m-0">$d$</Markdown></th>
  </tr>
  <tr>
    <td>12</td>
    <td>10</td>
    <td>10</td>
  </tr>
</table>

- Where $p_{1}$ is an index into the outer page table, and $p_{2}$ is the displacement within the page of the inner page table
- Known as **forward-mapped page table**

### 64-bit Logical Address Space
- Even two-level paging scheme is not sufficient
- If page size is 4 KB ($2^{12}$)
  - Then page table has $2^{52}$ entries 
  - If two level scheme, inner page tables could be $2^{10}$ 4-byte entries
  - Address would look like

| outer page | inner page | offset |
| ---------- | ---------- | ------ |
| $p_{1}$    | $p_{2}$    | $d$    |
| 42         | 10         | 12     |

  - Outer page table has $2^{42}$ entries or $2^{44}$ bytes
  - One solution is to add a 2nd outer page table
  - But in the following example the 2nd outer page table is still $2^{34}$ bytes in size.
    - And possibly 4 memory access to get to one physical memory location.

### Hashed Page Tables
- Used in architecture with address spaces $>$ 32 bits.
- The virtual page number is hashed into a page table.
  - This page table contains a chain of elements hashing to the same location.
- Each element contains 
  1. The virtual page number 
  2. The value of the mapped page frame 
  3. A pointer to the next element
- Virtual page numbers are compared in this chain searching for a match
  - If a match is found, the corresponding physical frame is extracted.
- Variation for 64-bit addresses is **clustered page tables**
  - Similar to hashed but each entry refers to several pages (such as 16) rather than 1
  - Especially useful for **sparse** address spaces (where memory references are non-contiguous and scattered) 

### Inverted Page Table
- Rather than having each process keep a page table and track of all possible logical pages, track all physical pages.
- One entry for each real page of memory.
- Entry consists of the virtual address of the page stored in that real memory location, with information about the process that owns that page.
- Decreases memory needed to store each page table, but increases time needed to search the table when a page reference occurs.
- Use hash table to limit the search to one (or at most a few) page-table entries.
  - TLB can accelerate access
- But how to implement shared memory?
  - One mapping of a virtual address to the shared physical address

### Swapping
- A process can be **swapped** temporarily out of memory to a backing store, and then brought **back** into memory for continued execution.
  - Total physical memory space of processes can exceed physical memory.
- **Backing store** - Fast disk large enough to accommodate copies of all memory images for all users; must provide direct access to these memory images.
- **Roll out, roll in** - Swapping variant used for priority-based scheduling algorithms; lower-priority process is swapped out so higher-priority process can be loaded and executed.
- Major part of swap time is transfer time; total transfer time is directly proportional to the amount of memory swapped.
- System maintains a **ready queue** of ready-to-run processes which have memory images on disk.
- Does the swapped-out process need to swap back-in to same physical addresses?
- Depends on address binding method
  - Plus consider pending I/O to / from process memory space
- Modified versions of swapping are found on many systems (i.e., UNIX, Linux, and Windows)
  - Swapping normally disabled
  - Started if more than threshold amount of memory allocated
  - Disabled again once memory demand reduced below threshold
- Other constraints on swapping:
  - Pending I/O - can't swap out as I/O would occur to wrong process
    - Or always transfer I/O to kernel space, then to I/O device
    - Known as **double buffering**, adds overhead
- Standard swapping not used in modern operating systems
  - But modified version common
    - Swap only when free memory extremely low

### Context Switch Time including Swapping
- If next processes to be obtain CPU is not in memory, need to swap out a process and swap in target process
- Context switch time can then be very high
- 100MB process swapping to hard disk with transfer rate of 50MB/sec
  - Swap out time of 2000 milliseconds
  - Plus swap in of same sized process
  - Total context switch swapping component time of 4000 milliseconds  (4 seconds)

### Swapping on Mobile Systems
- Not typically supported
  - Flash memory based
    - Small amount of space
    - Limited number of write cycles
    - Poor throughput between flash memory and CPU on mobile platform
- Instead use other methods to free memory if low
  - iOS asks apps to voluntarily relinquish allocated memory
    - Read-only data thrown out and reloaded from flash if needed
    - Failure to free can result in termination
  - Android terminates apps if low free memory, but first writes **application state** to flash for fast restart
  - Both OSes support paging as discussed below

### Virtual Memory — Background
- Code needs to be in memory to execute, but entire program rarely used
  - Error code, unusual routines, large data structures
- Entire program code not needed at same time
- Consider ability to execute partially-loaded program
  - Program no longer constrained by limits of physical memory
  - Each program takes less memory while running $\rightarrow$ more programs run at the same time
    - Increased CPU utilization and throughput with no increase in response time or turnaround time
  - Less I/O needed to load or swap programs into memory $\rightarrow$ each user program runs faster

### Virtual Memory
- Separation of user logical memory from physical memory.
  - Only part of the program needs to be in memory for execution
  - Logical address space can therefore be much larger than physical address space
  - Allows address spaces to be shared by several processes
  - Allows for more efficient process creation
  - More programs running concurrently
  - Less I/O needed to load or swap processes
- **Virtual address space** - logical view of how process is stored in memory
  - Usually start at address 0, contiguous addresses until end of space
  - Meanwhile, physical memory organized in page frames
  - MMU must map logical to physical
- Virtual memory can be implemented via:
  - Demand paging 
  - Demand segmentation

### Virtual-address Space
- Usually design logical address space for the stack to start at Max logical address and grow "down" while heap grows "up"
  - Maximizes address space use.
  - Unused address space between the two is hole.
    - No physical memory needed until heap or stack grows to a given new page.
- Enables **sparse** address spaces with holes left for growth, dynamically linked libraries, etc.
- System libraries shared via mapping into virtual address space.
- Shared memory by mapping pages read-write into virtual address space.
- Pages can be shared during `fork()`, speeding process creation.

### Demand Paging
- Could bring entire process into memory at load time
- Or bring a page into memory only when it is needed
  - Less I/O needed, no unnecessary I/O
  - Less memory needed 
  - Faster response
  - More users
- Similar to paging system with swapping (diagram on right)
- Invalid reference $\rArr$ abort
  - Not-in-memory $\rArr$ bring to memory
- **Lazy swapper** - never swaps a page into memory unless page will be needed
  - Swapper that deals with pages is a **pager**

### Basic Concepts
- With swapping, the pager guesses which pages will be used before swapping them out again
- How to determine that set of pages?
- Need new MMU functionality to implement demand paging
- If pages needed are already **memory resident**
  - No difference from non demand-paging
- If page needed and not memory resident
  - Need to detect and load the page into memory from storage
    - Without changing program behavior
    - Without programmer needing to change code

### Page table with Valid-Invalid Bit
- With each page table entry a valid-invalid bit is associated ($v$ $\rArr$ in-memory, $i$ $\rArr$ not-in-memory)
- Initially, valid-invalid bit is set to $i$ on all entries.
- During MMU address translation, if valid-invalid bit in the page table entry is $i$ $\rArr$ page fault.

### Steps in Handling Page Fault
1. If there is a reference to a page, first reference to that page will trap to operating system 
   - Page fault
2. Operating system looks at another table to decide:
   - Invalid reference $\rArr$ abort
   - Just not in memory (go to step 3)
3. Find free frame (what if there is none?)
4. Swap page into frame via scheduled disk operation
5. Reset tables to indicate page now in memory
   - Set validation bit = $v$
6. Restart the instruction that caused the page fault

### Aspects of Demand Paging
- **Pure demand paging**: start process with no pages in memory
- OS sets instruction pointer to first instruction of process, non-memory-resident $\rightarrow$ page fault
- And for every other process pages on first access
- Actually, a given instruction could access multiple pages $\rightarrow$ multiple page faults
- Consider fetch and decode of instruction which adds 2 numbers from memory and stores result back to memory
- Hardware support needed for demand paging
  - Page table with valid / invalid bit
  - Secondary memory (swap device with **swap space**)
  - Instruction restart

### Instruction Restart
- Consider an instruction that could access several different locations
  - Block move
  - Auto increment/decrement location
  - Restart the whole operation?
    - What if source and destination overlap?

### Free-Frame List
- When a page fault occurs, the operating system must bring the desired page from secondary storage into main memory. 
- Most operating systems maintain a **free-frame list** — a pool of free frames for satisfying such requests.
- Operating system typically allocate free frames using a technique known as **zero-fill-on-demand** — the content of the frames zeroed-out before being allocated.
- When a system starts up, all available memory is placed on the free-frame list. 

### Stages in Demand Paging - Worse Case
1. Trap to the operating system.
2. Save the user registers and process state.
3. Determine that the interrupt was a page fault.
4. Check that the page reference was legal and determine the location of the page on the disk.
5. Issue a read from the disk to a free frame:
   - Wait in a queue for this device until the read request is serviced
   - Wait for the device seek and/or latency time
   - Begin the transfer of the page to a free frame
6. While waiting, allocate the CPU to some other user.
7. Receive an interrupt from the disk I/O subsystem (I/O completed).
8. Save the registers and process state for the other user.
9. Determine that the interrupt was from the disk.
10. Correct the page table and other tables to show page is now in memory.
11. Wait for the CPU to be allocated to this process again.
12. Restore the user registers, process state, and new page table, and then resume the interrupted instruction.

### Performance of Demand Paging
- Three major activities
  - Service the interrupt - careful coding means just several hundred instructions needed
  - Input the page from disk - lots of time
  - Restart the process - again just a small amount of time
- Page Fault Rate $0 \le p \le 1$
  - if p = 0 no page faults 
  - if p = 1, every reference is a fault
- Effective Access Time (EAT)
  - EAT = $(1 - p) * \text{memory access}$
  - $+$ $p$ (page fault overhead)
  - $+$ swap page out
  - $+$ swap page in

### Demand Paging Example
- $\text{Memory access time} = 200 \text{ nanoseconds}$
- $\text{Average page-fault service time} = 8 \text{ milliseconds}$
$$
\begin{align*}
\text{EAT} &= (1 - p) * 200 + p (8\text{ milliseconds}) \\
           &= (1 - p) * 200 + p * 8,000,000 \\
           &= 200 + p * 7,999,800
\end{align*}
$$
- If one access out of $1,000$ causes a page fault, then
$$
EAT = 8.2\text{ microseconds}. 
$$
  > This is a slowdown by a factor of 40!
- If want performance degradation $< 10$ percent
$$
\begin{align*}
  220 > 200 + 7,999,800 * p \\
  20 > 7,999,800 * p
\end{align*}
$$
  - $p < .0000025$
    - one page fault in every 400,000 memory accesses

### Demand Paging Optimizations
- Swap space I/O faster than file system I/O even if on the same device
  - Swap allocated in larger chunks; less management needed than file system
- Copy entire process image to swap space at process load time
  - Then page in and out of swap space
  - Used in older BSD Unix
- Demand page in from program binary on disk, but discard rather than paging out when freeing frame
  - Used in Solaris and current BSD
  - Still need to write to swap space
    - Pages not associated with a file (like stack and heap) - **anonymous memory**
    - Pages modified in memory but not yet written back to the file system
- Mobile systems
  - Typically don't support swapping
  - Instead, demand page from file system and reclaim read-only pages (such as code)

### Copy-on-Write
- **Copy-on-Write (COW)** allows both parent and child processes to initially share the same pages in memory
  - If either process modifies a shared page, only then is the page copied
- COW allows more efficient process creation as only modified pages are copied
- In general, free pages are allocated from a **pool** of **zero-fill-on-demand** pages
  - Pool should always have free frames for fast demand page execution
    - Don't want to have to free a frame as well as other processing on page fault
  - Why zero-out a page before allocating it?
- `vfork()` variation on `fork()` system call has parent suspend and child using copy-on-write address space of parent
  - Designed to have child call `exec()`
  - Very efficient

### What Happens if There is no Free Frame?
- Used up by process pages
- Also in demand from the kernel, I/O buffers, etc
- How much to allocate to each?
- Page replacement - find some page in memory, but not really in use, page it out
  - Algorithm - terminate? swap out? replace the page?
  - Performance - want an algorithm which will result in minimum number of page faults
- Same page may be brought into memory several times

### Page Replacement
- Prevent **over-allocation** of memory by modifying page-fault service routine to include page replacement
- Use **modify (dirty) bit** to reduce overhead of page transfers - only modified pages are written to disk
- Page replacement completes separation between logical memory and physical memory - large virtual memory can be provided on a smaller physical memory

### Basic Page Replacement
1. Find the location of the desired page on disk
2. Find a free frame:
   - If there is a free frame, use it
   - If there is no free frame, use a page replacement algorithm to select a **victim frame**
   - Write victim frame to disk if dirty
3. Bring  the desired page into the (newly) free frame; update the page and frame tables
4. Continue the process by restarting the instruction that caused the trap
 
> Now potentially 2 page transfers for page fault - increasing EAT

### Page and Frame Replacement Algorithms
- **Frame-allocation algorithm** determines 
  - How many frames to give each process
  - Which frames to replace
- Page-replacement algorithm
  - Want lowest page-fault rate on both first access and re-access
- Evaluate algorithm by running it on a particular string of memory references (reference string) and computing the number of page faults on that string
  - String is just page numbers, not full addresses
  - Repeated access to the same page does not cause a page fault
  - Results depend on number of frames available
- In all our examples, the reference string of referenced page numbers is:
$$
7,0,1,2,0,3,0,4,2,3,0,3,0,3,2,1,2,0,1,7,0,1
$$

### First-In-First-Out (FIFO) Algorithm
- Reference string: $7,0,1,2,0,3,0,4,2,3,0,3,0,3,2,1,2,0,1,7,0,1$
- 3 frames (3 pages can be in memory at a time per process)

<table>
  <tr>
    <th>7</th>
    <th>0</th>
    <th>1</th>
    <th>2</th>
    <th>0</th>
    <th>3</th>
    <th>0</th>
    <th>4</th>
    <th>2</th>
    <th>3</th>
    <th>0</th>
    <th>3</th>
    <th>2</th>
    <th>1</th>
    <th>2</th>
    <th>0</th>
    <th>1</th>
    <th>7</th>
    <th>0</th>
    <th>1</th>
  </tr>
  <tr>
    <td>7</td>
    <td>7</td>
    <td>7</td>
    <td>2</td>
    <td></td>
    <td>2</td>
    <td>2</td>
    <td>4</td>
    <td>4</td>
    <td>4</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td>0</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td>7</td>
    <td>7</td>
    <td>7</td>
  </tr>
  <tr>
    <td></td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td></td>
    <td>3</td>
    <td>3</td>
    <td>3</td>
    <td>2</td>
    <td>2</td>
    <td>2</td>
    <td></td>
    <td></td>
    <td>1</td>
    <td>1</td>
    <td></td>
    <td></td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>1</td>
    <td>1</td>
    <td></td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>3</td>
    <td>3</td>
    <td></td>
    <td></td>
    <td>3</td>
    <td>2</td>
    <td></td>
    <td></td>
    <td>2</td>
    <td>2</td>
    <td>1</td>
  </tr>
</table>

- 15 page faults
- How to track ages of pages? 
  - Just use a FIFO queue

### Belady's Anomaly
- Consider the string $1,2,3,4,1,2,5,1,2,3,4,5$
  > Adding more frames can cause more page faults!

### Optimal Algorithm
- Replace page that will not be used for longest period of time
  - 9 is optimal for the example
- How do you know this?
  - Can't read the future
- Used for measuring how well your algorithm performs
- Optimal is an example of stack algorithms that don't suffer from  Belady's Anomaly.

### Least Recently Used (LRU) Algorithm
- Use past knowledge rather than future
- Replace page that has not been used in the most amount of time
- Associate time of last use with each page
- 12 faults - better than FIFO but worse than OPT
- Generally good algorithm and frequently used
- LRU is another example of stack algorithms; thus it does not suffer from Belady's Anomaly

### LRU Algorithm Implementation
- Time-counter implementation
  - Every page entry has a time-counter variable; every time a page is referenced through this entry, copy the value of the clock into the time-counter
  - When a page needs to be changed, look at the time-counters to find smallest value
    - Search through a table is needed
- Stack implementation
  - Keep a stack of page numbers in a double link form:
  - Page referenced:
    - Move it to the top
    - Requires 6 pointers to be changed
  - But each update more expensive
  - No search for replacement

### LRU Approximation Algorithms
- Needs special hardware
- **Reference bit**
  - With each page associate a bit, initially = 0
  - When page is referenced bit set to 1
- Replace any with reference bit = 0 (if one exists)
  - We do not know the order, however
- **Second-chance algorithm**
  - Generally FIFO, plus hardware-provided reference bit
- Clock replacement
  - If page to be replaced has 
    - Reference bit = 0 $\rightarrow$ replace it
    - Reference bit = 1 then:
      - Set reference bit 0, leave page in memory
      - Replace next page, subject to same rules

### Enhanced Second-Chance Algorithm
- Improve algorithm by using reference bit and modify bit (if available) in concert
- Take ordered pair (reference, modify):
  - (0, 0) neither recently used not modified - best page to replace
  - (0, 1) not recently used but modified - not quite as good, must write out before replacement
  - (1, 0) recently used but clean - probably will be used again soon
  - (1, 1) recently used and modified - probably will be used again soon and need to write out before replacement
- When page replacement called for, use the clock scheme  but use the four classes replace page in lowest non-empty class
  - Might need to search circular queue several times

### Counting Algorithms
- Keep a counter of the number of references that have been made to each page
  - Not common
- **Lease Frequently Used (LFU) Algorithm**:
  - Replaces page with smallest count
- **Most Frequently Used (MFU) Algorithm**: 
  - Based on the argument that the page with the smallest count was probably just brought in and has yet to be used

### Page-Buffering Algorithms
- Keep a pool of free frames, always
  - Then frame available when needed, not found at fault time
  - Read page into free frame and select victim to evict and add to free pool
  - When convenient, evict victim
- Possibly, keep list of modified pages
  - When backing store otherwise idle, write pages there and set to non-dirty
- Possibly, keep free frame contents intact and note what is in them
  - If referenced again before reused, no need to load contents again from disk
  - Generally useful to reduce penalty if wrong victim frame selected  

### Applications and Page Replacement
- All of these algorithms have OS guessing about future page access
- Some applications have better knowledge - i.e., databases
- Memory intensive applications can cause double buffering
  - OS keeps copy of page in memory as I/O buffer
  - Application keeps page in memory for its own work
- Operating system can provide direct access to the disk, getting out of the way of the applications
  - **Raw disk** mode
- Bypasses buffering, locking, etc.

### Allocation of Frames
- Each process needs **minimum** number of frames
- Example:  IBM 370 - 6 pages to handle SS MOVE instruction:
  - Instruction is 6 bytes, might span 2 pages
  - 2 pages to handle from
  - 2 pages to handle to
- **Maximum** of course is total frames in the system
- Two major allocation schemes
  - Fixed allocation
  - Priority allocation
- Many variations

### Fixed Allocation
- Equal allocation - For example, if there are 100 frames (after allocating frames for the OS) and 5 processes, give each process 20 frames
  - Keep some as free frame buffer pool
- Proportional allocation - Allocate according to the size of process
  - Dynamic as degree of multiprogramming, process sizes change

$$
\begin{align*}
s_{i} &= \text{size of process } p_{i} \\
S &= \sum s_{i} \\
m &= \text{total number of frames} \\
a_{i} &= \text{allocation for } p_{i} = \frac{s_{i}}{S} * m
\end{align*}
$$

$$
\begin{align*}
m &= 64 \\
s_{1} &= 10 \\
s_{2} &= 127 \\
a_{1} &= \frac{10}{137}*62 \approx 4 \\
a_{2} &= \frac{127}{137}*62 \approx 57 \\
\end{align*}
$$

### Global vs. Local Allocation
- **Global replacement** - process selects a replacement frame from the set of all frames; one process can take a frame from another
  - Process execution time can vary greatly
  - Greater throughput so more commonly used
- **Local replacement** - each process selects from only its own set of allocated frames
  - More consistent per-process performance
  - But possibly underutilized memory
  - What if a process does not have enough frames?

### Reclaiming Pages
- A strategy to implement global page-replacement policy 
- All memory requests  are satisfied from the free-frame list,  rather than waiting for the list to drop to zero before we begin selecting pages for replacement, 
- Page replacement  is triggered when the list falls below a certain threshold. 
- This strategy attempts to ensure there is always sufficient free memory to satisfy new requests.

### Non-Uniform Memory Access
- So far, we assumed that all memory accessed equally
- Many systems are **NUMA** - speed of access to memory varies
- Consider system boards containing CPUs and memory, interconnected over a system bus
- NUMA multiprocessing architecture
- Optimal performance comes from allocating memory "close to" the CPU on which the thread is scheduled
  - And modifying the scheduler to schedule the thread on the same system board when possible
  - Solved by Solaris by creating **lgroups** 
    - Structure to track CPU / Memory low latency groups
    - Used my schedule and pager
    - When possible schedule all threads of a process and allocate all memory for that process within the lgroup

### Thrashing
- If a process does not have "enough" pages, the page-fault rate is very high
  - Page fault to get page
  - Replace existing frame
  - But quickly need the replaced frame back
- This leads to:
  - Low CPU utilization
  - Operating system thinking that it needs to increase the degree of multiprogramming
  - Another process added to the system

### Demand Paging and Thrashing 
- Why does demand paging work?
  - **Locality model**
    - Process migrates from one locality to another
    - Localities may overlap
- Why does thrashing occur?
$$
\text{size of locality} > \text{total memory size}
$$

- To avoid trashing:
  - Calculate the $\sum$ size of locality 
  - Policy: 
    - if $\sum$ size of locality $>$ total memory size $\rightarrow$ suspend or swap out one of the processes
- Issue: how to calculate "$\sum$ size of locality" 

### Working-Set Model
- $\Delta$ $\equiv$ working-set window $\equiv$ a fixed number of page
- Example: 10,000 instructions
- $\text{WSS}_{i}$ (working set of Process $P_{i}$) $=$  total number of pages referenced in the most recent $\Delta$ (varies in time)
  - if $\Delta$ too small will not encompass the entire locality
  - if $\Delta$ too large will encompass several localities
  - if $\Delta = \infin \rArr$ will encompass entire program
- $D = \sum \text{WSS}_{i} \equiv$ total demand frames 
  - Approximation of locality
- $m =$ total number of frames
- If $D > m \rArr$ Thrashing
- Policy if $D > m$, then suspend or swap out one of the processes 

### Keeping Track of the Working Set
- Approximate with interval timer + a reference bit
- Example: $\Delta = 10,000$
  - Timer interrupts after every 5000 time units
  - Keep in memory 2 bits for each page $i - \text{B1}_{i}$  and $\text{B2}_{i}$ 
  - Whenever a timer interrupts copy the reference to one of the $B_{j}$ and sets the values of all reference bits to $0$.
  - If  either $\text{B1}_{i}$ or $\text{B2}_{i} = 1$, it implies that Page $i$ is in the working set
- Why is this not completely accurate?
- Improvement = 10 bits and interrupt every 1000 time units

### Working Sets and Page Fault Rates
- Direct relationship between working set of a process and its page-fault rate
- Working set changes over time
- Peaks and valleys over time

### Page-Fault Frequency Algorithm
- More direct approach than WSS
- Establish "acceptable" **page-fault frequency (PFF)** rate and use local replacement policy
  - If actual rate too low, process loses frame
  - If actual rate too high, process gains frame

### Allocating Kernel Memory
- Treated differently from user memory
- Often allocated from a free-memory pool
  - Kernel requests memory for structures of varying sizes
  - Some kernel memory needs to be contiguous
    - i.e., for device I/O
- Two schemes:
  - Buddy System
  - Slab Allocator

### Buddy System
- Allocates memory from fixed-size segment consisting of physically-contiguous pages
- Memory allocated using **power-of-2 allocator**
  - Satisfies requests in units sized as power of 2
  - Request rounded up to next highest power of 2
  - When smaller allocation needed than is available, current chunk split into two buddies of next-lower power of 2
    - Continue until appropriate sized chunk available

### Buddy System Example
- Assume 256KB chunk available, kernel requests 21KB
  - Split into $A_{L}$ and $A_{R}$ of 128KB each
    - One further divided into $B_{L}$ and $B_{L}$ of 64KB
      - One further into $C_{L}$ and $C_{L}$ of 32KB each - one used to satisfy request
- Advantage - quickly **coalesce** unused chunks into larger chunk
- Disadvantage - fragmentation

### Slab Allocator
- Alternate strategy
- **Slab** is one or more physically contiguous pages
- **Cache** consists of one or more slabs
- Single cache for each unique kernel data structure
  - Each cache filled with **objects** - instantiations of the data structure
- When cache created, filled with objects marked as `free`
- When structures stored, objects marked as `used`
- If slab is full of used objects, next object allocated from empty slab
  - If no empty slabs, new slab allocated
- Benefits include no fragmentation, fast memory request satisfaction

### Slab Allocator in Linux
- For example, process descriptor is of type `struct task_struct`
- Approximately 1.7 KB of memory
- New task $\rightarrow$ allocate new struct from cache
  - Will use existing free `struct task_struct`
- Slab can be in three possible states
  1. Full - all used
  2. Empty - all free
  3. Partial - mix of free and used
- Upon request, slab allocator
  1. Uses free struct in partial slab
  2. If none, takes one from empty slab
  3. If no empty slab, create new empty
- Slab started in Solaris, now wide-spread for both kernel mode and user memory in various OSes
- Linux  2.2 had SLAB, now has both SLOB and SLUB allocators
  - SLOB for systems with limited memory
    - Simple List of Blocks - maintains 3 list objects for small, medium, large objects
  - SLUB is performance-optimized SLAB removes per-CPU queues, metadata stored in page structure

### Other Considerations
- Prepaging 
- Page size
- TLB reach
- Inverted page table
- Program structure
- I/O interlock and page locking

### Paging
- To reduce the large number of page faults that occurs at process startup
- Prepage all or some of the pages a process will need, before they are referenced
- But if prepaged pages are unused, I/O and memory was wasted
- Assume $s$ pages are prepaged and $a$ of the pages is used
  - Question: is the cost of $s * a$  save pages faults is greater or less than the cost of prepaging  $s * (1 - a)$ unnecessary pages?  
  - If $a$ is close to $0 \rArr$ prepaging loses 
  - If $a$ is close to $1 \rArr$ prepaging wins 

### Page Size
- Sometimes OS designers have a choice
  - Especially if running on custom-built CPU
- Page size selection must take into consideration:
  - Fragmentation
  - Page table size 
  - Resolution
  - I/O overhead
  - Number of page faults
  - Locality
  - TLB size and effectiveness
- Always power of $2$, usually in the range $2^{12}$ (4,096 bytes) to $2^{22}$ (4,194,304 bytes)
- On average, growing over time

### TLB Reach 
- TLB Reach - The amount of memory accessible from the TLB
- TLB Reach = $\text{TLB Size} * \text{Page Size}$
- Ideally, the working set of each process is stored in the TLB
  - Otherwise there is a high degree of page faults
- Increase the Page Size
  - This may lead to an increase in fragmentation as not all applications require a large page size
- Provide Multiple Page Sizes
  - This allows applications that require larger page sizes the opportunity to use them without an increase in fragmentation

### I/O Interlock
- **I/O Interlock** - Pages must sometimes be locked into memory
- Consider I/O - Pages that are used for copying a file from a device must be locked from being selected for eviction by a page replacement algorithm
- **Pinning** of pages to lock into memory

### OS Examples — Windows
- Uses demand paging with **clustering**. Clustering brings in pages surrounding the faulting page
- Processes are assigned **working set minimum** and **working set maximum**
Working set minimum is the minimum number of pages the process is guaranteed to have in memory
- A process may be assigned as many pages up to its working set maximum
When the amount of free memory in the system falls below a threshold, **automatic working set trimming** is performed to restore the amount of free memory
- Working set trimming removes pages from processes that have pages in excess of their working set minimum

### OS Examples — Solaris
- Maintains a list of free pages to assign faulting processes
- `Lotsfree` - threshold parameter (amount of free memory) to begin paging
- `Desfree` - threshold parameter to increasing paging
- `Minfree` - threshold parameter to being swapping
- Paging is performed by `pageout` process
- `Pageout` scans pages using modified clock algorithm
- `Scanrate` is the rate at which pages are scanned. This ranges from `slowscan` to `fastscan`
- `Pageout` is called more frequently depending upon the amount of free memory available
- **Priority paging** gives priority to process code pages

### Stages in Demand Paging (Worst Case)
1. Trap to the operating system
2. Save the user registers and process state
3. Determine that the interrupt was a page fault
4. Check that the page reference was legal and determine the location of the page on the disk
5. Issue a read from the disk to a free frame:
   1. Wait in a queue for this device until the read request is serviced
   2. Wait for the device seek and/or latency time
   3. Begin the transfer of the page to a free frame
6. While waiting, allocate the CPU to some other user
7.  Receive an interrupt from the disk I/O subsystem (I/O completed)
8.  Save the registers and process state for the other user
9.  Determine that the interrupt was from the disk
10. Correct the page table and other tables to show page is now in memory
11. Wait for the CPU to be allocated to this process again
12. Restore the user registers, process state, and new page table, and then resume the interrupted instruction

### Priority Allocation
- Use a proportional allocation scheme using priorities rather than size
- If process $P_{i}$ generates a page fault,
  - select for replacement one of its frames
  - select for replacement a frame from a process with lower priority number

### Memory Compression
- An alternative to paging.
- Rather than paging out modified frames to swap space, we compress several frames into a single frame, enabling the system to reduce memory usage without resorting to swapping pages.
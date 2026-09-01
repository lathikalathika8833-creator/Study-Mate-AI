export const initialUserData = {
  id: "usr_101",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  college: "Stanford University",
  major: "Computer Science & Data",
  year: "Junior (3rd Year)",
  joinedDate: "January 2026",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  streak: 7,
  topicsCompleted: 24,
  quizAverage: 89,
  studyHoursThisWeek: 16.5,
  dailyGoalHours: 3.5,
  todayStudiedHours: 2.75,
  preferences: {
    tutorStyle: "Socratic & Step-by-Step",
    notifications: true,
    darkMode: true,
    difficulty: "Medium",
    dailyReminder: "18:00"
  }
};

export const initialNotes = [
  {
    id: "note_1",
    title: "Java Object-Oriented Programming Core Concepts",
    subject: "Computer Science",
    tags: ["Java", "OOP", "Polymorphism", "Inheritance"],
    updatedAt: "2026-08-30T14:30:00Z",
    content: `# Java OOP Principles

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields, and code in the form of procedures (methods).

### The Four Pillars of OOP:
1. **Encapsulation**: Bundling the data (variables) and methods that operate on the data into a single unit (class). We restrict direct access to some of an object's components using private access modifiers and provide public getters and setters.
2. **Inheritance**: A mechanism wherein a new class is derived from an existing class to reuse properties and behaviors (\`extends\` keyword in Java).
3. **Polymorphism**: The ability of a message or method to be displayed in more than one form.
   - *Compile-time (Method Overloading)*: Same method name with different parameter signatures.
   - *Runtime (Method Overriding)*: Subclass provides a specific implementation of a method defined in its superclass using \`@Override\`.
4. **Abstraction**: Hiding internal implementation details and showing only essential features to the user using \`abstract\` classes and \`interface\` declarations.

### Example Code:
\`\`\`java
public abstract class Animal {
    private String name;
    public Animal(String name) { this.name = name; }
    public abstract void makeSound();
    public String getName() { return name; }
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }
    @Override
    public void makeSound() {
        System.out.println("Woof! Woof!");
    }
}
\`\`\`
`,
    summary: "Comprehensive guide covering the 4 pillars of Java OOP: Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (overloading/overriding), and Abstraction (interfaces/abstract classes).",
    keyPoints: [
      "Encapsulation protects internal object state with private fields and getter/setter accessors.",
      "Inheritance promotes DRY (Don't Repeat Yourself) code using the extends keyword.",
      "Method Overriding represents runtime dynamic polymorphism; Overloading is compile-time.",
      "Java does not support multiple inheritance with classes, but enables it through interfaces."
    ],
    keyDefinitions: [
      { term: "Encapsulation", definition: "Hiding internal data using private modifiers and exposing safe access via public methods." },
      { term: "Polymorphism", definition: "Enabling one interface or method call to execute different behaviors depending on the runtime object type." },
      { term: "Abstraction", definition: "Exposing what an object does while hiding how it achieves it under the hood." }
    ],
    examPoints: [
      "Distinguish between Abstract Classes (can have instance state and constructors) vs Interfaces (pure contracts, default methods since Java 8).",
      "Explain the diamond problem and why Java restricts multiple class inheritance.",
      "Be prepared to write code demonstrating dynamic method dispatch."
    ]
  },
  {
    id: "note_2",
    title: "Operating Systems: Process Synchronization & Deadlocks",
    subject: "Computer Science",
    tags: ["OS", "Deadlock", "Semaphores", "Concurrency"],
    updatedAt: "2026-08-29T18:15:00Z",
    content: `# Process Synchronization & Deadlocks

In modern multitasking operating systems, concurrent processes often share resources such as memory, files, and CPU cycles. Without proper coordination, race conditions occur.

### Critical Section Problem:
A critical section is a piece of code that accesses shared resources. A valid synchronization solution must satisfy:
1. **Mutual Exclusion**: If process Pi is executing in its critical section, no other process can be.
2. **Progress**: If no process is in critical section, only processes wishing to enter can participate in deciding who enters next.
3. **Bounded Waiting**: There must be a bound on the number of times other processes can enter their critical sections after a process has requested entry.

### Deadlocks & Coffman Conditions:
A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.

**The 4 Necessary Conditions for Deadlock:**
1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2. **Hold and Wait**: A process must be holding at least one resource and waiting to acquire additional resources.
3. **No Preemption**: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it.
4. **Circular Wait**: A closed chain of processes exists such that each process holds at least one resource needed by the next.
`,
    summary: "Covers process synchronization fundamentals, the critical section problem requirements, and the four Coffman conditions necessary for deadlock to occur.",
    keyPoints: [
      "Race conditions happen when multiple threads access shared state concurrently without synchronization.",
      "Semaphores (counting and binary) and Mutexes are standard primitives for mutual exclusion.",
      "All four Coffman conditions must hold simultaneously for a system deadlock to happen."
    ],
    keyDefinitions: [
      { term: "Critical Section", definition: "Segment of code where shared resources are accessed and must be executed atomically relative to other processes." },
      { term: "Deadlock", definition: "A state where a group of processes are permanently blocked because each is holding resources needed by another." },
      { term: "Banker's Algorithm", definition: "A deadlock avoidance algorithm that tests for safety by simulating resource allocation for maximum possible predetermined demands." }
    ],
    examPoints: [
      "Memorize all 4 Coffman conditions word for word for multiple-choice and short-answer questions.",
      "Be prepared to calculate safe sequences using the Banker's Algorithm matrix table."
    ]
  },
  {
    id: "note_3",
    title: "Calculus III: Multivariable Optimization & Lagrange Multipliers",
    subject: "Mathematics",
    tags: ["Calculus", "Optimization", "Gradients", "Lagrange"],
    updatedAt: "2026-08-28T11:00:00Z",
    content: `# Multivariable Optimization

Finding extreme values (local maxima and minima) for functions of multiple variables $f(x, y)$.

### Critical Points & Second Derivative Test:
1. Compute the gradient $\\nabla f(x, y) = \\langle f_x, f_y \\rangle$.
2. Set $\\nabla f(x, y) = \\mathbf{0}$ to find critical points $(a, b)$.
3. Compute the Hessian determinant $D(a, b) = f_{xx}f_{yy} - (f_{xy})^2$.
   - If $D > 0$ and $f_{xx} > 0$: **Local Minimum**
   - If $D > 0$ and $f_{xx} < 0$: **Local Maximum**
   - If $D < 0$: **Saddle Point**
   - If $D = 0$: **Inconclusive**

### Constrained Optimization (Lagrange Multipliers):
To optimize $f(x, y, z)$ subject to constraint $g(x, y, z) = k$:
$$\\nabla f = \\lambda \\nabla g$$
Along with the constraint equation $g(x, y, z) = k$.
`,
    summary: "Outlines multivariable optimization techniques, including gradient calculation, the Hessian determinant test for extrema classification, and constrained optimization using Lagrange Multipliers.",
    keyPoints: [
      "Critical points occur where gradient equals zero or partial derivatives do not exist.",
      "The Discriminant D (Hessian determinant) distinguishes extrema from saddle points.",
      "Lagrange multipliers equate the gradient vectors of the objective function and constraint."
    ],
    keyDefinitions: [
      { term: "Gradient Vector", definition: "Vector of first-order partial derivatives pointing in the direction of greatest rate of increase." },
      { term: "Saddle Point", definition: "A critical point that is a local minimum along one cross-section and a local maximum along another." }
    ],
    examPoints: [
      "Always verify if the domain is closed and bounded (Extreme Value Theorem) when searching for absolute extrema.",
      "Solve the system of equations for $\\lambda$ carefully without dividing by zero."
    ]
  }
];

export const initialQuizzes = [
  {
    id: "quiz_1",
    title: "Java OOP & Design Patterns Mastery",
    subject: "Computer Science",
    topic: "Object Oriented Programming",
    difficulty: "Medium",
    questionCount: 5,
    lastScore: 80,
    questions: [
      {
        id: "q1",
        question: "Which OOP concept is primarily demonstrated when a subclass provides its own specific implementation of a method defined in its superclass?",
        options: [
          "Method Overloading",
          "Method Overriding (Runtime Polymorphism)",
          "Data Encapsulation",
          "Static Abstraction"
        ],
        correctAnswer: 1,
        explanation: "Method Overriding happens when a subclass defines a method with the same name, return type, and parameters as a method in its superclass, allowing dynamic dispatch at runtime."
      },
      {
        id: "q2",
        question: "Why does Java not support multiple inheritance with classes?",
        options: [
          "To reduce JVM bytecode execution size",
          "To avoid the ambiguity caused by the Diamond Problem",
          "Because classes cannot hold constructors",
          "It does support multiple class inheritance using the 'with' keyword"
        ],
        correctAnswer: 1,
        explanation: "If two parent classes have a method with the same signature, a child inheriting from both would create ambiguity on which method to invoke (the Diamond Problem). Java solves this via Interfaces."
      },
      {
        id: "q3",
        question: "What is the key difference between an abstract class and an interface in modern Java (Java 8+)?",
        options: [
          "Interfaces cannot have any method bodies, while abstract classes can",
          "Abstract classes can maintain instance state (instance fields), whereas interfaces cannot",
          "An interface can be instantiated with 'new', abstract classes cannot",
          "Abstract classes cannot contain static methods"
        ],
        correctAnswer: 1,
        explanation: "While interfaces can have default and static methods with implementations since Java 8, they cannot maintain state (instance variables). Abstract classes can have instance variables and constructors."
      },
      {
        id: "q4",
        question: "Which access modifier provides the most restrictive level of access in Java?",
        options: [
          "protected",
          "default (package-private)",
          "private",
          "public"
        ],
        correctAnswer: 2,
        explanation: "'private' restricts visibility strictly to within the declaring class body only."
      },
      {
        id: "q5",
        question: "Which keyword in Java prevents a class from being subclassed (inherited)?",
        options: [
          "static",
          "final",
          "sealed",
          "const"
        ],
        correctAnswer: 1,
        explanation: "Applying the 'final' keyword to a class declaration (e.g. public final class String) prevents any other class from extending it."
      }
    ]
  },
  {
    id: "quiz_2",
    title: "Operating Systems: Deadlocks & CPU Scheduling",
    subject: "Computer Science",
    topic: "Operating Systems",
    difficulty: "Hard",
    questionCount: 4,
    lastScore: 100,
    questions: [
      {
        id: "os_q1",
        question: "Which of the following is NOT one of the four necessary Coffman conditions for a deadlock?",
        options: [
          "Mutual Exclusion",
          "Circular Wait",
          "Preemptive Scheduling",
          "Hold and Wait"
        ],
        correctAnswer: 2,
        explanation: "The condition is 'No Preemption', meaning resources cannot be taken away forcefully. 'Preemptive Scheduling' actually breaks the condition and prevents deadlock."
      },
      {
        id: "os_q2",
        question: "Which algorithm is used by an Operating System to avoid deadlocks by verifying system safety before granting resource requests?",
        options: [
          "Dijkstra's Shortest Path",
          "Banker's Algorithm",
          "Round Robin Scheduler",
          "Kruskal's Algorithm"
        ],
        correctAnswer: 1,
        explanation: "The Banker's Algorithm simulates resource allocation for maximum possible claims to ensure the system remains in a safe state before granting requests."
      },
      {
        id: "os_q3",
        question: "What is the phenomenon where a low priority process holds a lock required by a high priority process, leading to inverted execution priorities?",
        options: [
          "Starvation",
          "Priority Inversion",
          "Convoy Effect",
          "Thrashing"
        ],
        correctAnswer: 1,
        explanation: "Priority Inversion occurs when a lower-priority task holds a shared lock that blocks a higher-priority task, often solved using Priority Inheritance protocol."
      },
      {
        id: "os_q4",
        question: "Which CPU scheduling algorithm can potentially lead to starvation of longer processes?",
        options: [
          "Shortest Job First (SJF / SRTF)",
          "Round Robin with small quantum",
          "First-Come First-Served (FCFS)",
          "FIFO"
        ],
        correctAnswer: 0,
        explanation: "In SJF/SRTF, if short jobs continuously arrive in the ready queue, longer processes will continually be bypassed and suffer starvation."
      }
    ]
  }
];

export const initialDecks = [
  {
    id: "deck_1",
    title: "Data Structures & Algorithms Core Flashcards",
    subject: "Computer Science",
    cardsCount: 6,
    masteredCount: 4,
    cards: [
      {
        id: "fc_1",
        question: "What is the worst-case time complexity of QuickSort and when does it occur?",
        answer: "O(n²). It occurs when the pivot chosen is always the smallest or largest element (such as an already sorted array with naive pivot selection).",
        category: "Algorithms",
        mastered: true
      },
      {
        id: "fc_2",
        question: "What is the difference between a Tree and a Graph in Data Structures?",
        answer: "A Tree is a connected, undirected acyclic graph with N nodes and exactly N-1 edges, having a single root. A Graph can contain cycles and disconnected components.",
        category: "Data Structures",
        mastered: true
      },
      {
        id: "fc_3",
        question: "How does HashMap handle hash collisions in Java 8+?",
        answer: "Java 8+ uses separate chaining with Linked Lists. When the number of elements in a bucket exceeds threshold 8 and total capacity >= 64, it converts the list into a Red-Black Tree (O(log n) lookup).",
        category: "Java / DS",
        mastered: false
      },
      {
        id: "fc_4",
        question: "What is the space complexity of Breadth-First Search (BFS) on a balanced binary tree of height h?",
        answer: "O(w) where w is the maximum width of the tree (at leaf level, w = 2^h = O(N)). BFS stores entire levels in a queue.",
        category: "Algorithms",
        mastered: true
      },
      {
        id: "fc_5",
        question: "What is the amortized time complexity of inserting into a Dynamic Array (e.g. ArrayList / vector)?",
        answer: "Amortized O(1). While resizing takes O(n), it happens infrequently (doubling strategy), distributing the cost evenly across insertions.",
        category: "Data Structures",
        mastered: true
      },
      {
        id: "fc_6",
        question: "What is Dijkstra's algorithm's time complexity using a Min-Heap (Priority Queue)?",
        answer: "O((V + E) log V), where V is the number of vertices and E is the number of edges.",
        category: "Graph Algorithms",
        mastered: false
      }
    ]
  },
  {
    id: "deck_2",
    title: "Organic Chemistry Reaction Mechanisms",
    subject: "Chemistry",
    cardsCount: 4,
    masteredCount: 2,
    cards: [
      {
        id: "fc_chem_1",
        question: "What is the difference between SN1 and SN2 reaction mechanisms?",
        answer: "SN1 is unimolecular (two steps via carbocation intermediate, racemization). SN2 is bimolecular (concerted one step, backside attack with stereochemical inversion).",
        category: "Mechanisms",
        mastered: true
      },
      {
        id: "fc_chem_2",
        question: "What does Markovnikov's Rule state for electrophilic additions to alkenes?",
        answer: "The hydrogen atom adds to the carbon with more hydrogen atoms already attached, creating the more stable carbocation intermediate (tertiary > secondary > primary).",
        category: "Reactions",
        mastered: true
      },
      {
        id: "fc_chem_3",
        question: "What are the reagents for Jones Oxidation and what product is formed from a primary alcohol?",
        answer: "CrO3 / H2SO4 in acetone. Converts primary alcohols to carboxylic acids.",
        category: "Oxidation",
        mastered: false
      },
      {
        id: "fc_chem_4",
        question: "Explain what Zaitsev's Rule predicts in elimination reactions (E1 / E2).",
        answer: "The major product is the more substituted, thermodynamically more stable alkene.",
        category: "Elimination",
        mastered: false
      }
    ]
  }
];

export const initialStudyPlans = [
  {
    id: "plan_1",
    title: "Midterm Exam Intensive Mastery Plan",
    examDate: "2026-09-15",
    dailyHours: 3.5,
    subjects: ["Java OOP", "Operating Systems", "Calculus III"],
    targetScore: "95%+",
    createdAt: "2026-08-30T09:00:00Z",
    days: [
      {
        dayName: "Monday",
        date: "Sep 1",
        blocks: [
          { id: "b1", time: "09:00 - 10:00 AM", subject: "Java OOP", topic: "Inheritance & Polymorphism", type: "Study", duration: "60 mins", completed: true },
          { id: "b2", time: "10:15 - 11:00 AM", subject: "Operating Systems", topic: "Process Synchronization & Semaphores", type: "Study", duration: "45 mins", completed: true },
          { id: "b3", time: "11:00 - 11:20 AM", subject: "Break", topic: "Hydration & Walk", type: "Break", duration: "20 mins", completed: true },
          { id: "b4", time: "11:20 - 12:05 PM", subject: "Calculus III", topic: "Gradient Vectors & Tangent Planes", type: "Practice", duration: "45 mins", completed: false }
        ]
      },
      {
        dayName: "Tuesday",
        date: "Sep 2",
        blocks: [
          { id: "b5", time: "09:00 - 09:45 AM", subject: "Operating Systems", topic: "Banker's Algorithm & Deadlock Avoidance", type: "Study", duration: "45 mins", completed: false },
          { id: "b6", time: "10:00 - 11:00 AM", subject: "Java OOP", topic: "Design Patterns (Factory, Singleton)", type: "Study", duration: "60 mins", completed: false },
          { id: "b7", time: "11:15 - 12:00 PM", subject: "Calculus III", topic: "Lagrange Multipliers Problem Set", type: "Practice", duration: "45 mins", completed: false }
        ]
      },
      {
        dayName: "Wednesday",
        date: "Sep 3",
        blocks: [
          { id: "b8", time: "09:00 - 10:00 AM", subject: "Java OOP", topic: "Comprehensive Timed Mock Quiz", type: "Quiz / Exam Prep", duration: "60 mins", completed: false },
          { id: "b9", time: "10:15 - 11:15 AM", subject: "Operating Systems", topic: "CPU Scheduling Algorithms Drill", type: "Practice", duration: "60 mins", completed: false },
          { id: "b10", time: "11:30 - 12:15 PM", subject: "All Subjects", topic: "Flashcard Active Recall Session", type: "Revision", duration: "45 mins", completed: false }
        ]
      }
    ]
  }
];

export const initialChatSessions = [
  {
    id: "session_1",
    title: "Binary Search Trees vs Red-Black Trees",
    createdAt: "2026-08-30T16:00:00Z",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Can you explain why we need Red-Black Trees if we already have normal Binary Search Trees? Explain it simply."
      },
      {
        id: "m2",
        sender: "ai",
        text: `### Great question! Let's understand this with a real scenario 🚀

Imagine inserting already sorted numbers \`[1, 2, 3, 4, 5]\` into a standard Binary Search Tree (BST):

1. \`1\` becomes the root.
2. \`2\` goes to the right of \`1\`.
3. \`3\` goes to the right of \`2\`...
4. The tree degenerates into a **straight linked list**! 

When that happens:
- Search time degrades from **$O(\\log n)$** to **$O(n)$** (terrible for millions of records).

---

### Enter Self-Balancing Trees (Red-Black Trees 🛡️):
A **Red-Black Tree** is a special BST that enforces color rules (nodes are either Red or Black) and performs **tree rotations** whenever the tree gets lopsided.

**The Golden Guarantee:**
- No path from the root to any leaf is more than **twice as long** as any other path.
- Lookups, insertions, and deletions are **guaranteed $O(\\log n)$**, even in the absolute worst-case!

> 💡 **Quick Check**: Would you like to see how a Left-Rotation works, or do a quick 2-minute quiz on tree properties?`
      }
    ]
  }
];

export const progressAnalyticsData = {
  quizHistory: [
    { date: "Aug 24", score: 72, subject: "Calculus" },
    { date: "Aug 25", score: 80, subject: "Java OOP" },
    { date: "Aug 26", score: 85, subject: "Data Structures" },
    { date: "Aug 27", score: 78, subject: "Operating Systems" },
    { date: "Aug 28", score: 92, subject: "Java OOP" },
    { date: "Aug 29", score: 95, subject: "Algorithms" },
    { date: "Aug 30", score: 89, subject: "Operating Systems" }
  ],
  weeklyStudyHours: [
    { day: "Mon", hours: 2.8, target: 3.5 },
    { day: "Tue", hours: 3.6, target: 3.5 },
    { day: "Wed", hours: 4.1, target: 3.5 },
    { day: "Thu", hours: 2.5, target: 3.5 },
    { day: "Fri", hours: 3.9, target: 3.5 },
    { day: "Sat", hours: 4.5, target: 3.5 },
    { day: "Sun", hours: 3.2, target: 3.5 }
  ],
  topicMastery: [
    { topic: "Java OOP", score: 94, level: "Mastered", color: "#10b981" },
    { topic: "Data Structures", score: 88, level: "Strong", color: "#6366f1" },
    { topic: "Algorithms", score: 82, level: "Proficient", color: "#8b5cf6" },
    { topic: "Operating Systems", score: 74, level: "Improving", color: "#f59e0b" },
    { topic: "Calculus III", score: 68, level: "Needs Practice", color: "#ef4444" }
  ],
  weakTopics: [
    {
      topic: "Multivariable Lagrange Multipliers",
      subject: "Calculus III",
      accuracy: "58%",
      recommendation: "Review gradient vectors and constraint equations."
    },
    {
      topic: "Banker's Algorithm Resource Matrices",
      subject: "Operating Systems",
      accuracy: "64%",
      recommendation: "Practice safety sequence allocation tables."
    },
    {
      topic: "Red-Black Tree Rotations",
      subject: "Data Structures",
      accuracy: "69%",
      recommendation: "Work through visual recoloring and double-rotation test cases."
    }
  ],
  badges: [
    { id: "b1", title: "7-Day Streak Scholar", icon: "🔥", desc: "Studied 7 days in a row without breaking streak", earned: true, date: "Aug 30, 2026" },
    { id: "b2", title: "Quiz Whiz", icon: "⚡", desc: "Scored 90%+ on 5 consecutive quizzes", earned: true, date: "Aug 29, 2026" },
    { id: "b3", title: "Night Owl Master", icon: "🦉", desc: "Completed 10 active recall sessions after 8 PM", earned: true, date: "Aug 27, 2026" },
    { id: "b4", title: "Study Marathon", icon: "🏆", desc: "Studied for 4+ hours in a single day", earned: true, date: "Aug 26, 2026" },
    { id: "b5", title: "Flashcard Champion", icon: "🃏", desc: "Mastered 50 active recall flashcards", earned: false, progress: "32/50" },
    { id: "b6", title: "AI Study Prodigy", icon: "✨", desc: "Engaged in 25 deep tutor conversations", earned: false, progress: "18/25" }
  ]
};

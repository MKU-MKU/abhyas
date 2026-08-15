# Abhyas V2 Design & UX System

## Product experience

Abhyas should feel like a focused study instrument, not a generic dashboard. Every screen should answer the student's next useful question: **what should I study, what should I practice, or what should I improve?**

## Information architecture

```text
Home
├── Continue studying
├── Daily Challenge
├── Recommended practice
├── Weak areas
└── Recent activity

Study
├── Level
├── Subject/Chapter
├── Book/Source
└── Topic/Subtopic

Practice
├── Quick Practice
├── Flashcards
├── Psycho Mode
└── Custom Practice

Exams
├── Mock Exams
├── Previous Questions
└── Results

Review
├── Wrong answers
├── Bookmarks
├── Flagged questions
└── Weak topics

Progress
├── Accuracy
├── Mastery
├── Streak
├── Study time
└── Exam performance

Profile
├── Account
├── Subscription/access
├── Preferences
└── Settings
```

## UX principles

### 1. Progressive disclosure

Do not expose the entire content hierarchy at once. Reveal level → subject/chapter → source → topic as the student moves deeper.

### 2. One primary action

Every important screen has one visually dominant next action. Secondary actions remain available without competing with it.

### 3. Exam focus

Timed examination screens minimize navigation, animation and unrelated information. Practice screens may show explanations and learning context.

### 4. Continuity

The home screen remembers where the student stopped and makes resumption a one-action operation.

### 5. Feedback

Correct/incorrect states are immediate, accessible and useful. Feedback explains the answer rather than merely changing the option color.

### 6. Error prevention

Destructive administrative actions require confirmation and clear consequences. Payment and access state transitions are explicit.

## Responsive behavior

Mobile is the primary design constraint; tablet and desktop should expand the layout rather than simply scale it.

- Mobile: bottom navigation, single-column study flow.
- Tablet: adaptive two-column discovery and review.
- Desktop: persistent navigation and richer dashboard density.
- Exam: stable question viewport at every breakpoint.

## Component taxonomy

### Foundation

- Button
- IconButton
- Input
- Select
- Checkbox
- Radio
- Switch
- Tooltip
- Badge
- Avatar

### Layout

- PageShell
- Section
- Card
- Stack
- Grid
- Sheet
- Dialog
- Drawer
- Tabs

### Learning

- QuestionCard
- AnswerOption
- ExplanationPanel
- QuizProgress
- QuizTimer
- QuestionNavigator
- ResultSummary
- MasteryBar
- StreakCard
- StudyRecommendation

### Content

- LevelCard
- ChapterCard
- SourceCard
- TopicList
- SearchResults
- FilterBar

### Admin

- DataTable
- StatusBadge
- PaymentReviewCard
- AuditTimeline
- MetricCard
- BulkActionBar

## Visual system

Use semantic design tokens instead of page-specific values:

```text
color.background
color.surface
color.surfaceElevated
color.text
color.textMuted
color.border
color.primary
color.success
color.warning
color.danger

space.1 ... space.8
radius.sm / md / lg / xl
shadow.sm / md / lg
motion.fast / normal / slow
```

The exact visual palette can evolve during UI prototyping without changing component APIs.

## Accessibility baseline

- Semantic HTML first.
- Visible keyboard focus.
- Minimum comfortable touch targets.
- WCAG-compliant contrast.
- Labels for controls and icons.
- Error states communicated in text.
- Reduced-motion support.
- Screen-reader friendly question navigation.

## Performance UX

Loading states must be intentional. Use skeletons for predictable content, optimistic UI only where state transitions are safe, and explicit offline indicators when network-dependent actions are queued.

## Dark mode

Dark mode is a first-class theme. It uses semantic tokens rather than color inversion and respects system preference while allowing an explicit user preference.

## Motion

Motion communicates state, hierarchy and continuity. It must never delay the student's next action or interfere with examination timing. Reduced-motion preferences disable nonessential transitions.

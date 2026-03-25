# Project Tracker

This is a small task management app with three views: Kanban, List, and Timeline. I built it with React, TypeScript, Vite, and Tailwind. The app includes filtering, drag and drop in the Kanban board, virtual scrolling in the list view, and seeded data so the UI can be tested with a larger dataset.

## Setup

1. Open the project folder:

```bash
cd project-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. For a production build:

```bash
npm run build
```

## State Management Decision

I chose React Context for this project instead of bringing in Zustand.

The main reason was scope. This app has one central piece of shared state: the task list, plus a few task-related interactions like filtering and drag state. Context kept that easy to follow and made the code feel direct. For this size of app, adding another state library felt like extra setup without much real benefit.

I know the prompt mentions `React Context + useReducer`. In my current code, I used React Context with `useState` and memoized derived state because it was enough for the amount of state being handled. If this app kept growing, I would probably refactor the task updates into a reducer next, mainly to make drag/drop transitions and future task actions more structured.

## Virtual Scrolling

The virtual scrolling is implemented in the List view. Instead of rendering every row at once, I only render the slice of tasks that should be visible based on the current scroll position.

The basic flow is:

- I keep track of the container scroll position.
- I use a fixed row height.
- I calculate the visible start and end indexes.
- I render only that range plus a small buffer.
- Each visible row is absolutely positioned inside a container that still has the full calculated height.

This keeps the list responsive even with a few hundred tasks because the DOM stays much smaller than the full dataset.

## Drag and Drop Approach

For drag and drop, I used the browser's native HTML drag events for the Kanban board.

Each card sets its task id in `dataTransfer` on drag start. Each column listens for drag over and drop. While dragging, I insert a temporary task with the id `dragging-task` into the current hovered column. That fake task acts like a placeholder so the column shows where the card is about to land. On drop, I remove the placeholder and update the real task status.

I liked this approach because it stayed lightweight and did not require another library.

## Lighthouse Screenshot

To be added.

## Explanation

The hardest UI problem for me was making the Kanban drag interaction feel stable without the column jumping around. The tricky part was that once a card leaves its original place, the layout wants to collapse immediately, which makes the board feel shaky. I handled that by creating a temporary placeholder task called `dragging-task` and inserting it into the hovered column during drag over. That gave the board something to render in that space, so the layout stayed predictable and the user could still understand where the card would land. I also added a visual overlay on the active card so the drag state stayed obvious.

Another part I had to think through was keeping this simple enough to maintain. I avoided a heavy drag-and-drop library and used native drag events, which made the flow easier to control for this project size. If I had more time, the first thing I would refactor is state updates around drag behavior into a reducer. Right now the logic works, but a reducer would make the transitions easier to read, test, and extend if features like reordering within a column or optimistic persistence were added later.

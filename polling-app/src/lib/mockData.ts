export const mockPolls = [
  {
    id: "mock-poll-1",
    title: "What's your favorite programming language?",
    description: "Choose the programming language you enjoy working with the most.",
    options: [
      { id: "opt-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "opt-2", text: "Python", votes: 38 },
      { id: "opt-3", text: "Java", votes: 22 },
      { id: "opt-4", text: "C++", votes: 15 },
      { id: "opt-5", text: "Go", votes: 12 }
    ],
    createdAt: "2024-01-15T10:30:00Z",
    totalVotes: 132
  },
  {
    id: "mock-poll-2", 
    title: "Which framework do you prefer for web development?",
    description: "Select your go-to framework for building web applications.",
    options: [
      { id: "opt-1", text: "React", votes: 67 },
      { id: "opt-2", text: "Vue.js", votes: 28 },
      { id: "opt-3", text: "Angular", votes: 19 },
      { id: "opt-4", text: "Svelte", votes: 14 }
    ],
    createdAt: "2024-01-20T14:15:00Z",
    totalVotes: 128
  }
];

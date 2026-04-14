const nonFictionCovers = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    image: {
      url: "https://covers.openlibrary.org/b/id/15108516-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: {
      url: "https://covers.openlibrary.org/b/id/15121528-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "A Little Life",
    author: "Hanya Yanagihara",
    image: {
      url: "https://covers.openlibrary.org/b/id/14841606-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Man’s Search for Meaning",
    author: "Viktor E. Frankl",
    image: {
      url: "https://covers.openlibrary.org/b/id/12389635-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: {
      url: "https://covers.openlibrary.org/b/id/15137999-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    image: { url: "https://covers.openlibrary.org/b/id/15163992-M.jpg" },
  },
  { title: "Think and Grow Rich", author: "Napoleon Hill", image: { url: "https://covers.openlibrary.org/b/id/15175095-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png" } },
  {
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    image: { url: "https://covers.openlibrary.org/b/id/15160935-M.jpg" },
  },

  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    image: {
      url: "https://covers.openlibrary.org/b/id/15161037-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Everything Is F*cked",
    author: "Mark Manson",
    image: {
      url: "https://covers.openlibrary.org/b/id/13315500-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },

  {
    title: "Deep Work",
    author: "Cal Newport",
    image: {
      url: "https://covers.openlibrary.org/b/id/15150797-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Can’t Hurt Me",
    author: "David Goggins",
    image: {
      url: "https://covers.openlibrary.org/b/id/14606379-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Never Finished",
    author: "David Goggins",
    image: {
      url: "https://covers.openlibrary.org/b/id/15094935-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },

  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    image: {
      url: "https://covers.openlibrary.org/b/id/15177890-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "The Laws of Human Nature",
    author: "Robert Greene",
    image: {
      url: "https://covers.openlibrary.org/b/id/12786526-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },

  {
    title: "Start With Why",
    author: "Simon Sinek",
    image: {
      url: "https://covers.openlibrary.org/b/id/6395237-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    image: {
      url: "https://covers.openlibrary.org/b/id/15207567-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "A New Earth",
    author: "Eckhart Tolle",
    image: { url: "https://covers.openlibrary.org/b/id/7147988-M.jpg" },
  },

  {
    title: "Think Like a Monk",
    author: "Jay Shetty",
    image: { url: "https://covers.openlibrary.org/b/id/10434513-M.jpg" },
  },
  {
    title: "Do Epic Shit",
    author: "Ankur Warikoo",
    image: {
      url: "https://covers.openlibrary.org/b/id/12550538-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "You Can Win",
    author: "Shiv Khera",
    image: {
      url: "https://covers.openlibrary.org/b/id/13152996-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },

  {
    title: "Outliers",
    author: "Malcolm Gladwell",
    image: { url: "https://covers.openlibrary.org/b/id/6422007-M.jpg" },
  },
  {
    title: "Blink",
    author: "Malcolm Gladwell",
    image: { url: "https://covers.openlibrary.org/b/id/6406649-M.jpg" },
  },
  {
    title: "Freakonomics",
    author: "Steven D. Levitt & Stephen J. Dubner",
    image: { url: "https://covers.openlibrary.org/b/id/11183900-M.jpg" },
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    image: { url: "https://covers.openlibrary.org/b/id/15129456-M.jpg" },
  },

  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    image: { url: "https://covers.openlibrary.org/b/id/15089889-M.jpg" },
  },
  {
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    image: {
      url: "https://covers.openlibrary.org/b/id/14589694-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    image: {
      url: "https://covers.openlibrary.org/b/id/12680694-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
];

module.exports = nonFictionCovers;

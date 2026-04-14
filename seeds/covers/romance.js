const romanceCovers = [
  {
    title: "It Ends With Us",
    author: "Colleen Hoover",
    image: { url: "https://covers.openlibrary.org/b/id/15123232-L.jpg" },
  },
  {
    title: "The Love Hypothesis",
    author: "Ali Hazelwood",
    image: { url: "https://covers.openlibrary.org/b/id/15161033-L.jpg" },
  },

  {
    title: "Twisted Love",
    author: "Ana Huang",
    image: { url: "https://covers.openlibrary.org/b/id/15113434-M.jpg" },
  },
  {
    title: "The Spanish Love Deception",
    author: "Elena Armas",
    image: { url: "https://covers.openlibrary.org/b/id/12649413-L.jpg" },
  },
  {
    title: "Love on the Brain",
    author: "Ali Hazelwood",
    image: { url: "https://covers.openlibrary.org/b/id/12856642-L.jpg" },
  },
  {
    title: "The Fine Print",
    author: "Lauren Asher",
    image: { url: "https://covers.openlibrary.org/b/id/12713595-L.jpg" },
  },
  {
    title: "People We Meet on Vacation",
    author: "Emily Henry",
    image: { url: "https://covers.openlibrary.org/b/id/14567102-L.jpg" },
  },
  {
    title: "Better Than the Movies",
    author: "Lynn Painter",
    image: { url: "https://covers.openlibrary.org/b/id/14357862-L.jpg" },
  },
  {
    title: "Rewind It Back",
    author: "Liz Tomforde",
    image: { url: "https://covers.openlibrary.org/b/id/15115325-L.jpg" },
  },
  {
    title: "Heartless Hunter",
    author: "Kristen Ciccarelli",
    image: { url: "https://covers.openlibrary.org/b/id/14725180-L.jpg" },
  },
  {
    title: "Binding 13",
    author: "Chloe Walsh",
    image: { url: "https://covers.openlibrary.org/b/id/15091988-L.jpg" },
  },
  {
    title: "Deep End",
    author: "Ali Hazelwood",
    image: { url: "https://covers.openlibrary.org/b/id/14840882-L.jpg" },
  },
  {
    title: "Behind the Net",
    author: "Stephanie Archer",
    image: { url: "https://covers.openlibrary.org/b/id/15129866-L.jpg" },
  },
  {
    title: "The Summer of Broken Rules",
    author: "K.L. Walther",
    image: { url: "https://covers.openlibrary.org/b/id/12410810-L.jpg" },
  },
  {
    title: "The Fake Mate",
    author: "Lana Ferguson",
    image: { url: "https://covers.openlibrary.org/b/id/14715481-L.jpg" },
  },
  {
    title: "Just for the Summer",
    author: "Abby Jimenez",
    image: { url: "https://covers.openlibrary.org/b/id/14602781-L.jpg" },
  },
  {
    title: "Love Story",
    author: "Erich Segal",
    image: {
      url: "https://covers.openlibrary.org/b/id/368925-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png",
    },
  },
  {
    title: "The Pumpkin Spice Cafe",
    author: "Laurie Gilmore",
    image: { url: "https://covers.openlibrary.org/b/id/14823180-L.jpg" },
  },
  {
    title: "Book Lovers",
    author: "Emily Henry",
    image: { url: "https://covers.openlibrary.org/b/id/15088975-M.jpg" },
  },
  {
    title: "Twisted Hate",
    author: "Ana Huang",
    image: { url: "https://covers.openlibrary.org/b/id/13870257-M.jpg" },
  },
  {
    title: "Things We Never Got Over",
    author: "Lucy Score",
    image: { url: "https://covers.openlibrary.org/b/id/15134455-L.jpg" },
  },
  {
    title: "Archer’s Voice",
    author: "Mia Sheridan",
    image: { url: "https://covers.openlibrary.org/b/id/15099842-L.jpg" },
  },

  {
    title: "Happy Place",
    author: "Emily Henry",
    image: { url: "https://covers.openlibrary.org/b/id/13757783-L.jpg" },
  },
  {
    title: "The Unhoneymooners",
    author: "Christina Lauren",
    image: { url: "https://covers.openlibrary.org/b/id/15154162-L.jpg" },
  },

  {
    title: "The Hating Game",
    author: "Sally Thorne",
    image: { url: "https://covers.openlibrary.org/b/id/15206889-L.jpg" },
  },
  {
    title: "Every Summer After",
    author: "Carley Fortune",
    image: { url: "https://covers.openlibrary.org/b/id/15105890-L.jpg" },
  },
  {
    title: "Before We Were Strangers",
    author: "Renée Carlino",
    image: { url: "https://covers.openlibrary.org/b/id/14851813-L.jpg" },
  },
  {
    title: "The Kiss Quotient",
    author: "Helen Hoang",
    image: { url: "https://covers.openlibrary.org/b/id/14635947-L.jpg" },
  },
  {
    title: "Icebreaker",
    author: "Hannah Grace",
    image: { url: "https://covers.openlibrary.org/b/id/14632721-L.jpg" },
  },
  {
    title: "Terms and Conditions",
    author: "Lauren Asher",
    image: { url: "https://covers.openlibrary.org/b/id/13141007-L.jpg" },
  },
  {
    title: "King of Pride",
    author: "Ana Huang",
    image: { url: "https://covers.openlibrary.org/b/id/15132867-L.jpg" },
  },
  {
    title: "Me Before You",
    author: "Jojo Moyes",
    image: { url: "https://covers.openlibrary.org/b/id/15163093-L.jpg" },
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    image: { url: "https://covers.openlibrary.org/b/id/285902-L.jpg" },
  },
  
  {
    title: "Flawless",
    author: "Elsie Silver",
    image: { url: "https://covers.openlibrary.org/b/id/13735432-M.jpg" },
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: { url: "https://covers.openlibrary.org/b/id/8090214-L.jpg" },
  },
];

module.exports = romanceCovers;

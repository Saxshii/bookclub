const mysteryCovers = [
  // CLASSIC MYSTERY
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    image: {
      url: 'https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_83.zip&file=0012836855-L.jpg',
    },
  },
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    image: {
      url: 'https://m.media-amazon.com/images/I/71ihbKf67RL._AC_UF1000,1000_QL80_.jpg',
    },
  },
  {title: 'The ABC Murders', author: 'Agatha Christie', image: {url: 'https://ia803201.us.archive.org/BookReader/BookReaderPreview.php?id=abcmurdersabc0000agat&itemPath=%2F18%2Fitems%2Fabcmurdersabc0000agat&server=ia803201.us.archive.org&page=cover_w500_h500.jpg'}},
  {
    title: 'The Murder of Roger Ackroyd',
    author: 'Agatha Christie',
    image: {
      url: 'https://covers.openlibrary.org/b/id/15144476-L.jpg',
    },
  },
  {title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', image: {url: 'https://ia800703.us.archive.org/view_archive.php?archive=/4/items/m_covers_0008/m_covers_0008_24.zip&file=0008242351-M.jpg'}},

  // MODERN POPULAR
  {
    title: "A Good Girl's Guide to Murder",
    author: 'Holly Jackson',
    image: {url: 'https://covers.openlibrary.org/b/id/14839805-L.jpg'},
  },
  {
    title: 'The Reappearance of Rachel Price',
    author: 'Holly Jackson',
    image: {url: 'https://covers.openlibrary.org/b/id/14850193-L.jpg'},
  },
  {title: 'One of Us Is Lying', author: 'Karen M. McManus', image: {url: 'https://ia800502.us.archive.org/view_archive.php?archive=/31/items/m_covers_0013/m_covers_0013_66.zip&file=0013669622-M.jpg'}},

  {title: 'One of Us Is Next', author: 'Karen M. McManus', image: {url: 'https://covers.openlibrary.org/b/id/14848836-L.jpg'}},

  {title: 'Truly Devious', author: 'Maureen Johnson', image: {url: 'https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_78.zip&file=0012786408-L.jpg'}},

  // DETECTIVE / INVESTIGATION
  {
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    image: {url: 'https://covers.openlibrary.org/b/id/12432819-L.jpg'},
  },
  {title: 'The Man Who Died Twice', author: 'Richard Osman', image: {url: 'https://covers.openlibrary.org/b/id/14322257-L.jpg'}},
  {title: 'Magpie Murders', author: 'Anthony Horowitz', image: {url: 'https://m.media-amazon.com/images/I/71VksxQMBUL._AC_UF1000,1000_QL80_.jpg'}},
  
  {title: 'The Appeal', author: 'Janice Hallett', image: {url: 'https://m.media-amazon.com/images/I/71m3fu2NckL._UF1000,1000_QL80_.jpg'}},

  //{title: "The Cuckoo's Calling", author: 'Robert Galbraith', image: {url: ''}},

  // DARK / ATMOSPHERIC MYSTERY
  {title: 'In the Woods', author: 'Tana French', image: {url: 'https://covers.openlibrary.org/b/id/11398671-L.jpg'}},
  //{title: 'The Likeness', author: 'Tana French', image: {url: ''}},

  //{title: 'The Dry', author: 'Jane Harper', image: {url: ''}},

  {title: 'Still Life', author: 'Louise Penny', image: {url: 'https://covers.openlibrary.org/b/id/10809798-L.jpg'}},
  {title: 'The Sun Down Motel', author: 'Simone St. James', image: {url: 'https://m.media-amazon.com/images/I/816VcnZVE4L._UF1000,1000_QL80_.jpg'}},

  // LITERARY / CROSSOVER
  {title: 'Big Little Lies', author: 'Liane Moriarty', image: {url: 'https://covers.openlibrary.org/b/id/10165945-L.jpg'}},
  {title: 'The Secret History', author: 'Donna Tartt', image: {url: 'https://covers.openlibrary.org/b/id/14826536-L.jpg'}},
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    image: {url: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSvRW9ZOrySwe1_bToLkHPiq-n72ir-NALtplFZFHE0tm0i0sve9uMtv6VHB6dZ4vYgWQE-3RgNZrJzO1qe9DCIn-0qwez2eix8zKnaJ5lG&usqp=CAc'},
  },
  {title: 'The Name of the Rose', author: 'Umberto Eco', image: {url: 'https://covers.openlibrary.org/b/id/6296161-L.jpg'}},

  // CLASSIC ROOTS
  {title: 'The Woman in White', author: 'Wilkie Collins', image: {url: 'https://covers.openlibrary.org/b/id/12752191-L.jpg'}},
  {title: 'The Moonstone', author: 'Wilkie Collins', image: {url: 'https://covers.openlibrary.org/b/id/15098746-L.jpg'}},

  // EXTRA STRONG PICKS
  {title: 'Bluebird, Bluebird', author: 'Attica Locke', image: {url: 'https://m.media-amazon.com/images/I/81fR1jxLMeL._AC_UF1000,1000_QL80_.jpg'}},
  {
    title: "The No. 1 Ladies' Detective Agency",
    author: 'Alexander McCall Smith',
    image: {url: 'https://covers.openlibrary.org/b/id/9790145-L.jpg'},
  },
  //{title: 'The Turn of the Key', author: 'Ruth Ware', image: {url: ''}},
  {title: 'The Death of Mrs Westaway', author: 'Ruth Ware', image: {url: 'https://m.media-amazon.com/images/I/81LdhWqVoyL._AC_UF1000,1000_QL80_.jpg'}},
];

module.exports = mysteryCovers;

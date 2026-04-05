<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/output.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes scrollLeft {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-fade-up   { animation: fadeInUp 0.7s ease forwards; }
    .animate-float     { animation: float 3s ease-in-out infinite; }
    .carousel-track    { animation: scrollLeft 35s linear infinite; }
    .carousel-track:hover { animation-play-state: paused; }

    .hero-bg {
      background: linear-gradient(135deg, #2c1810 0%, #5c3317 40%, #8b6914 100%);
    }
    .section-divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #c9a96e, transparent);
    }
  </style>
</head>
<body class="bg-cream min-h-screen">

  <%- include('../partials/navbar') %>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- HERO SECTION                                                            -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <section class="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-16">

    <!-- Floating book decorations -->
    <div class="absolute top-20 left-10 text-6xl opacity-20 animate-float" style="animation-delay:0s">📚</div>
    <div class="absolute top-40 right-16 text-4xl opacity-15 animate-float" style="animation-delay:1s">📖</div>
    <div class="absolute bottom-32 left-20 text-5xl opacity-10 animate-float" style="animation-delay:2s">🕯️</div>
    <div class="absolute bottom-20 right-10 text-3xl opacity-20 animate-float" style="animation-delay:0.5s">✨</div>

    <!-- Hero content -->
    <div class="text-center px-4 max-w-4xl mx-auto relative z-10">
      <p class="text-amber-400 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-up"
         style="animation-delay:0.1s">
        Welcome to your virtual library
      </p>
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-up leading-tight"
          style="animation-delay:0.2s">
        Where Every Story<br/>
        <span class="text-amber-400 italic">Finds Its Reader</span>
      </h1>
      <p class="text-amber-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-up leading-relaxed"
         style="animation-delay:0.3s">
        Explore genres, build your personal bookshelf, discover reading communities,
        and dive into worlds crafted from words.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
           style="animation-delay:0.4s">
        <a href="/explore" class="btn-primary text-base py-3 px-8">
          Explore Library
        </a>
        <% if (!currentUser) { %>
          <a href="/auth/signup" class="btn-secondary text-base py-3 px-8
             border-white text-white hover:bg-white hover:text-amber-900">
            Join Free
          </a>
        <% } else { %>
          <a href="/books/bookshelf" class="btn-secondary text-base py-3 px-8
             border-white text-white hover:bg-white hover:text-amber-900">
            My Bookshelf
          </a>
        <% } %>
      </div>

      <!-- Stats row -->
      <div class="flex flex-wrap justify-center gap-8 mt-16 animate-fade-up"
           style="animation-delay:0.5s">
        <div class="text-center">
          <p class="font-serif text-3xl font-bold text-amber-400">10M+</p>
          <p class="text-amber-300 text-sm">Books Available</p>
        </div>
        <div class="w-px bg-amber-700"></div>
        <div class="text-center">
          <p class="font-serif text-3xl font-bold text-amber-400">8</p>
          <p class="text-amber-300 text-sm">Genres</p>
        </div>
        <div class="w-px bg-amber-700"></div>
        <div class="text-center">
          <p class="font-serif text-3xl font-bold text-amber-400">Free</p>
          <p class="text-amber-300 text-sm">Always</p>
        </div>
      </div>
    </div>

    <!-- Bottom wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#faf7f2"/>
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- BOOK CAROUSEL                                                           -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <section class="py-16 bg-cream overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 mb-8">
      <p class="text-amber-500 text-xs tracking-widest uppercase text-center mb-2">Trending now</p>
      <h2 class="section-heading text-center">Popular This Week</h2>
    </div>

    <!-- Infinite scroll carousel — duplicated for seamless loop -->
    <div class="relative overflow-hidden">
      <div class="carousel-track flex gap-4 w-max">
        <% const allBooks = [...carouselBooks, ...carouselBooks]; %>
        <% allBooks.forEach(book => { %>
          <div class="flex-shrink-0 w-32 group cursor-pointer">
            <div class="relative overflow-hidden rounded-lg shadow-md
                        group-hover:shadow-xl transition-all duration-300
                        group-hover:-translate-y-2" style="height:192px">
              <img
                src="https://covers.openlibrary.org/b/id/<%= book.coverId %>-M.jpg"
                alt="<%= book.title %>"
                class="w-full h-full object-cover"
                onerror="this.src='/images/fallback-cover.jpg'"
              />
              <!-- Tooltip on hover -->
              <div class="absolute inset-0 bg-amber-900/80 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300 flex flex-col justify-end p-2">
                <p class="text-white text-xs font-semibold line-clamp-2 leading-tight">
                  <%= book.title %>
                </p>
                <p class="text-amber-300 text-xs"><%= book.author %></p>
              </div>
            </div>
          </div>
        <% }) %>
      </div>
    </div>
  </section>

  <div class="section-divider max-w-4xl mx-auto"></div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- EXPLORE GENRES                                                          -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <section class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-amber-500 text-xs tracking-widest uppercase mb-2">Find your next obsession</p>
        <h2 class="section-heading">Explore Different Genres</h2>
        <p class="text-amber-700 mt-2 max-w-xl mx-auto">
          From dragons and magic to dark mysteries — every mood has a genre waiting for you.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <% genres.forEach(genre => { %>
          <%- include('../partials/genreCard', { genre }) %>
        <% }) %>
      </div>

      <div class="text-center mt-8">
        <a href="/explore" class="btn-secondary">View All Genres →</a>
      </div>
    </div>
  </section>

  <div class="section-divider max-w-4xl mx-auto"></div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- YOUR LIBRARY CTA                                                        -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <section class="py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="bg-amber-900 rounded-3xl overflow-hidden shadow-warm-lg">
        <div class="flex flex-col md:flex-row items-center">

          <!-- Text side -->
          <div class="flex-1 p-10 md:p-14">
            <p class="text-amber-400 text-xs tracking-widest uppercase mb-3">Your personal space</p>
            <h2 class="font-serif text-4xl font-bold text-white mb-4">
              Build Your<br/>Dream Bookshelf
            </h2>
            <p class="text-amber-200 leading-relaxed mb-8 max-w-md">
              Save books you love, track what you're reading, write private notes and reviews,
              save your favourite quotes — all in one cozy digital shelf.
            </p>
            <% if (currentUser) { %>
              <a href="/books/bookshelf" class="inline-block bg-amber-400 hover:bg-amber-300
                 text-amber-900 font-bold py-3 px-8 rounded-full transition-all duration-200
                 hover:-translate-y-0.5 shadow-lg">
                Open My Shelf 📚
              </a>
            <% } else { %>
              <div class="flex gap-4 flex-wrap">
                <a href="/auth/signup" class="inline-block bg-amber-400 hover:bg-amber-300
                   text-amber-900 font-bold py-3 px-8 rounded-full transition-all duration-200
                   hover:-translate-y-0.5 shadow-lg">
                  Start My Shelf Free
                </a>
                <a href="/auth/login" class="inline-block border-2 border-amber-400
                   text-amber-400 hover:bg-amber-400 hover:text-amber-900
                   font-semibold py-3 px-8 rounded-full transition-all duration-200">
                  Login
                </a>
              </div>
            <% } %>
          </div>

          <!-- Visual side -->
          <div class="flex-1 p-10 flex justify-center items-center">
            <div class="grid grid-cols-3 gap-3 max-w-xs">
              <% const shelfBooks = carouselBooks.slice(0,6); %>
              <% shelfBooks.forEach((book, i) => { %>
                <div class="rounded-lg overflow-hidden shadow-lg transform
                            <%= i % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]' %>
                            hover:rotate-0 hover:scale-110 transition-all duration-300"
                     style="height: 100px;">
                  <img
                    src="https://covers.openlibrary.org/b/id/<%= book.coverId %>-M.jpg"
                    alt="<%= book.title %>"
                    class="w-full h-full object-cover"
                    onerror="this.src='/images/fallback-cover.jpg'"
                  />
                </div>
              <% }) %>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <div class="section-divider max-w-4xl mx-auto"></div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- COMMUNITIES                                                             -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <section class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-amber-500 text-xs tracking-widest uppercase mb-2">Read together</p>
        <h2 class="section-heading">Reading Communities</h2>
        <p class="text-amber-700 mt-2">
          Find your people. Join communities that match your reading taste.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <% featuredCommunities.forEach(community => { %>
          <div class="bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg
                      transition-all duration-300 hover:-translate-y-1 border border-amber-50">
            <div class="text-4xl mb-3"><%= community.emoji %></div>
            <h3 class="font-serif text-lg font-semibold text-amber-900 mb-1">
              <%= community.name %>
            </h3>
            <p class="text-xs text-amber-500 mb-3">
              <%= community.members.toLocaleString() %> members · <%= community.genre %>
            </p>
            <p class="text-amber-700 text-sm leading-relaxed mb-5">
              <%= community.description %>
            </p>
            <a href="/communities"
               class="block text-center btn-secondary text-sm py-2">
              Join Community
            </a>
          </div>
        <% }) %>
      </div>

      <div class="text-center mt-10">
        <a href="/communities" class="btn-primary">See All Communities →</a>
      </div>
    </div>
  </section>

  <%- include('../partials/footer') %>

</body>
</html>
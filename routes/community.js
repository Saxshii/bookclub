const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const { isAuth } = require('../middleware/isAuth');

router.get('/', async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('createdBy', 'name')  
      .sort({ createdAt: -1 });

    if (communities.length === 0) {
      await seedCommunities();
      return res.redirect('/communities');
    }

    const joinedIds = req.user
      ? req.user.joinedCommunities.map(id => id.toString())
      : [];

    const communitiesWithStatus = communities.map(c => ({
      ...c.toObject(),
      memberCount: c.members.length,
      isJoined: joinedIds.includes(c._id.toString()),
      coverImage: c.getCover()
    }));

    res.render('pages/community', {
      title: 'Communities — BookClub',
      communities: communitiesWithStatus
    });

  } catch (err) {
    console.error('Communities error:', err);
    req.flash('error', 'Could not load communities.');
    res.redirect('/');
  }
});

router.post('/join/:id', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      req.flash('error', 'Community not found.');
      return res.redirect('/communities');
    }

    const userId = req.user._id;
    const alreadyMember = community.members.includes(userId);

    if (alreadyMember) {

      community.members.pull(userId);
      req.user.joinedCommunities.pull(community._id);
      req.flash('success', `Left "${community.name}".`);
    } else {
 
      community.members.push(userId);
      req.user.joinedCommunities.push(community._id);
      req.flash('success', `Joined "${community.name}"! Welcome 🎉`);
    }

    await community.save();
    await req.user.save();
    res.redirect('/communities');

  } catch (err) {
    console.error('Join community error:', err);
    req.flash('error', 'Could not join community.');
    res.redirect('/communities');
  }
});

router.post('/create', isAuth, async (req, res) => {
  const { name, description, genre } = req.body;

  if (!name || !description || !genre) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/communities');
  }

  try {
    const community = await Community.create({
      name,
      description,
      genre,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    req.user.joinedCommunities.push(community._id);
    await req.user.save();

    req.flash('success', `Community "${name}" created!`);
    res.redirect('/communities');

  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'A community with that name already exists.');
    } else {
      req.flash('error', 'Could not create community.');
    }
    res.redirect('/communities');
  }
});

async function seedCommunities() {

  const mongoose = require('mongoose');
  const fakeId = new mongoose.Types.ObjectId();

  const defaults = [
    { name: 'Dragon Readers',     genre: 'Fantasy',     description: 'For those who live and breathe fantasy worlds. Dragons, magic, and epic quests await.',        members: [], createdBy: fakeId },
    { name: 'Midnight Thrillers', genre: 'Thriller',    description: 'We read thrillers so you don\'t have to sleep. Heart-pounding picks every week.',               members: [], createdBy: fakeId },
    { name: 'Hopeless Romantics', genre: 'Romance',     description: 'Love stories, book recs, and lots of feelings. Grab a tissue before you join.',                 members: [], createdBy: fakeId },
    { name: 'The Mystery Circle', genre: 'Mystery',     description: 'Solving fictional crimes since 2020. No spoilers in the first 24 hours.',                       members: [], createdBy: fakeId },
    { name: 'Starship Readers',   genre: 'Sci-Fi',      description: 'Exploring galaxies one page at a time. Hard sci-fi, space opera — we read it all.',             members: [], createdBy: fakeId },
    { name: 'Pages of the Past',  genre: 'Historical',  description: 'History brought to life through fiction. From ancient Rome to Victorian England.',              members: [], createdBy: fakeId },
    { name: 'Fear & Folio',       genre: 'Horror',      description: 'Reading in the dark so you don\'t have to. Horror, gothic, and psychological terror.',          members: [], createdBy: fakeId },
    { name: 'Mind & Meaning',     genre: 'Non-Fiction', description: 'Real stories, real ideas, real change. Biographies, science, self-help, and more.',             members: [], createdBy: fakeId }
  ];

  await Community.insertMany(defaults);
  console.log('Communities seeded!');
}

module.exports = router;
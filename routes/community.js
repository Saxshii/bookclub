const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const path      = require('path');
const fs        = require('fs');
const Community = require('../models/Community');
let User;
try { User = require('../models/User'); } catch(e) { User = require('../models/user'); }
const { isAuth } = require('../middleware/isAuth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/images/community-covers');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `community-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

function idEq(a, b) {
  if (!a || !b) return false;
  const sa = a._id ? a._id.toString() : a.toString();
  const sb = b._id ? b._id.toString() : b.toString();
  return sa === sb;
}

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim()) {
      const s = search.trim();
      query = { $or: [{ name: { $regex: s, $options: 'i' } }, { genre: { $regex: s, $options: 'i' } }] };
    }

    const communities = await Community.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });

    if (!search && communities.length === 0) {
      await seedCommunities();
      return res.redirect('/communities');
    }

    const joinedIds = req.user ? req.user.joinedCommunities.map(id => id.toString()) : [];
    const userId = req.user ? req.user._id.toString() : null;

    const communitiesWithStatus = communities.map(c => ({
      ...c.toObject(),
      memberCount: c.members.length,
      isJoined: joinedIds.includes(c._id.toString()),
      isAdmin: userId && (idEq(c.createdBy, userId) || (c.admins || []).some(a => idEq(a, userId))),
      coverImage: c.getCover()
    }));

    res.render('pages/community', {
      title: 'Communities — BookClub',
      communities: communitiesWithStatus,
      search: search || ''
    });
  } catch (err) {
    console.error('Communities error:', err);
    req.flash('error', 'Could not load communities.');
    res.redirect('/');
  }
});

router.post('/create', isAuth, upload.single('coverImage'), async (req, res) => {
  const { name, description, genre } = req.body;
  if (!name || !description || !genre) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/communities');
  }
  let coverImage = '';
  if (req.file) coverImage = `/images/community-covers/${req.file.filename}`;
  try {
    const community = await Community.create({
      name, description, genre, coverImage,
      createdBy: req.user._id,
      admins: [req.user._id],
      members: [req.user._id]
    });
    req.user.joinedCommunities.push(community._id);
    await req.user.save();
    req.flash('success', `Community "${name}" created! 🎉`);
    res.redirect('/communities');
  } catch (err) {
    req.flash('error', err.code === 11000 ? 'A community with that name already exists.' : 'Could not create community.');
    res.redirect('/communities');
  }
});

router.post('/join/:id', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) { req.flash('error', 'Community not found.'); return res.redirect('/communities'); }

    const userId = req.user._id;
    const alreadyMember = community.members.some(m => idEq(m, userId));

    if (alreadyMember) {
      if (idEq(community.createdBy, userId)) {
        req.flash('error', 'You are the owner. Delete the community instead.');
        return res.redirect('/communities');
      }
      community.members.pull(userId);
      community.admins.pull(userId);
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
    console.error('Join error:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/communities');
  }
});

router.get('/:id/chat', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('admins', 'name')
      .populate('members', 'name')
      .populate('messages.author', 'name');

    if (!community) {
      req.flash('error', 'Community not found.');
      return res.redirect('/communities');
    }

    const userId = req.user._id.toString();

    // Check membership — also check joinedCommunities on user as fallback
    const isMemberInList = community.members.some(m => {
      const mid = m._id ? m._id.toString() : m.toString();
      return mid === userId;
    });
    const isMemberInUser = req.user.joinedCommunities.some(id => id.toString() === community._id.toString());
    const isMember = isMemberInList || isMemberInUser;

    if (!isMember) {
      req.flash('error', 'Join the community first.');
      return res.redirect('/communities');
    }

    // Safe isAdmin check — createdBy may be null if it was a seeded fake user
    let isAdmin = false;
    if (community.createdBy && community.createdBy._id) {
      isAdmin = community.createdBy._id.toString() === userId;
    } else if (community.createdBy) {
      isAdmin = community.createdBy.toString() === userId;
    }
    if (!isAdmin) {
      isAdmin = (community.admins || []).some(a => {
        const aid = a._id ? a._id.toString() : a.toString();
        return aid === userId;
      });
    }

    res.render('pages/community-chat', {
      title: `${community.name} — Chat`,
      community,
      isAdmin,
      userId
    });
  } catch (err) {
    console.error('Chat page error FULL:', err.message, err.stack);
    req.flash('error', 'Could not load chat.');
    res.redirect('/communities');
  }
});

router.post('/:id/chat', isAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.redirect(`/communities/${req.params.id}/chat`);

    const community = await Community.findById(req.params.id);
    if (!community) return res.redirect('/communities');

    const isMember = community.members.some(m => idEq(m, req.user._id));
    if (!isMember) { req.flash('error', 'Join to send messages.'); return res.redirect('/communities'); }

    community.messages.push({ author: req.user._id, content: content.trim().slice(0, 1000) });
    if (community.messages.length > 500) community.messages = community.messages.slice(-500);
    await community.save();
    res.redirect(`/communities/${req.params.id}/chat`);
  } catch (err) {
    console.error('Send message error:', err);
    res.redirect(`/communities/${req.params.id}/chat`);
  }
});

router.post('/:id/remove-member', isAuth, async (req, res) => {
  try {
    const { memberId } = req.body;
    const community = await Community.findById(req.params.id);
    if (!community) return res.redirect('/communities');

    const userId = req.user._id.toString();
    const isAdmin = idEq(community.createdBy, userId) || community.admins.some(a => idEq(a, userId));

    if (!isAdmin) { req.flash('error', 'Only admins can remove members.'); return res.redirect(`/communities/${req.params.id}/chat`); }
    if (idEq(community.createdBy, memberId)) { req.flash('error', 'Cannot remove the creator.'); return res.redirect(`/communities/${req.params.id}/chat`); }

    community.members.pull(memberId);
    community.admins.pull(memberId);
    await community.save();

    await User.findByIdAndUpdate(memberId, { $pull: { joinedCommunities: community._id } });

    req.flash('success', 'Member removed.');
    res.redirect(`/communities/${req.params.id}/chat`);
  } catch (err) {
    console.error('Remove member error:', err);
    res.redirect(`/communities/${req.params.id}/chat`);
  }
});

router.post('/:id/delete', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      req.flash('error', 'Community not found.');
      return res.redirect('/communities');
    }

    const userId    = req.user._id.toString();
    const creatorId = community.createdBy._id
      ? community.createdBy._id.toString()
      : community.createdBy.toString();
    const adminIds  = (community.admins || []).map(a => (a._id ? a._id : a).toString());
    const isAdmin   = creatorId === userId || adminIds.includes(userId);

    if (!isAdmin) {
      req.flash('error', 'Only the community owner can delete it.');
      return res.redirect('/communities');
    }

    const communityName = community.name;
    await User.updateMany({ joinedCommunities: community._id }, { $pull: { joinedCommunities: community._id } });
    await Community.findByIdAndDelete(req.params.id);

    req.flash('success', `"${communityName}" has been deleted.`);
    res.redirect('/communities');
  } catch (err) {
    console.error('Delete community error FULL:', err.message, err.stack);
    req.flash('error', 'Could not delete community.');
    res.redirect('/communities');
  }
});

// ── GET /communities/:id/edit ─────────────────────────────────────────────────
router.get('/:id/edit', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('createdBy', 'name');
    if (!community) { req.flash('error', 'Community not found.'); return res.redirect('/communities'); }

    const userId  = req.user._id.toString();
    const creatorId = (community.createdBy._id || community.createdBy).toString();
    const adminIds  = (community.admins || []).map(a => (a._id ? a._id : a).toString());
    const isAdmin   = creatorId === userId || adminIds.includes(userId);

    if (!isAdmin) { req.flash('error', 'Only admins can edit this community.'); return res.redirect('/communities'); }

    res.render('pages/community-edit', {
      title: `Edit ${community.name} — BookClub`,
      community
    });
  } catch (err) {
    console.error('Edit page error:', err);
    res.redirect('/communities');
  }
});

// ── POST /communities/:id/edit ────────────────────────────────────────────────
router.post('/:id/edit', isAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) { req.flash('error', 'Community not found.'); return res.redirect('/communities'); }

    const userId    = req.user._id.toString();
    const creatorId = (community.createdBy._id || community.createdBy).toString();
    const adminIds  = (community.admins || []).map(a => (a._id ? a._id : a).toString());
    const isAdmin   = creatorId === userId || adminIds.includes(userId);

    if (!isAdmin) { req.flash('error', 'Only admins can edit this community.'); return res.redirect('/communities'); }

    const { name, description, genre } = req.body;
    if (!name || !description || !genre) {
      req.flash('error', 'All fields are required.');
      return res.redirect(`/communities/${req.params.id}/edit`);
    }

    community.name        = name.trim().slice(0, 80);
    community.description = description.trim().slice(0, 500);
    community.genre       = genre;

    if (req.file) {
      community.coverImage = `/images/community-covers/${req.file.filename}`;
    }

    await community.save();
    req.flash('success', 'Community updated successfully!');
    res.redirect(`/communities/${req.params.id}/edit`);
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'A community with that name already exists.');
    } else {
      console.error('Edit community error:', err);
      req.flash('error', 'Could not save changes.');
    }
    res.redirect(`/communities/${req.params.id}/edit`);
  }
});

async function seedCommunities() {
  const mongoose = require('mongoose');
  const fakeId = new mongoose.Types.ObjectId();
  const defaults = [
    { name: 'Dragon Readers',     genre: 'Fantasy',     description: 'For those who live and breathe fantasy worlds.' },
    { name: 'Midnight Thrillers', genre: 'Thriller',    description: "We read thrillers so you don't have to sleep." },
    { name: 'Hopeless Romantics', genre: 'Romance',     description: 'Love stories, book recs, and lots of feelings.' },
    { name: 'Starship Readers',   genre: 'Sci-Fi',      description: 'Exploring galaxies one page at a time.' },
    { name: 'Pages of the Past',  genre: 'Historical',  description: 'History brought to life through fiction.' },
    { name: 'Fear & Folio',       genre: 'Horror',      description: "Reading in the dark so you don't have to." },
    { name: 'Mind & Meaning',     genre: 'Non-Fiction', description: 'Real stories, real ideas, real change.' },
    { name: 'The Mystery Circle', genre: 'Mystery',     description: 'Solving fictional crimes since 2020.' }
  ];
  await Community.insertMany(defaults.map(d => ({ ...d, members: [], admins: [], createdBy: fakeId })));
  console.log('✅ Communities seeded!');
}

module.exports = router;

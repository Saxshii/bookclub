const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const Community = require('../models/Community');
const { isAuth } = require('../middleware/isAuth');

// ── Multer setup for cover image uploads ─────────────────────────────────────
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ── GET /communities ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim()) {
      const s = search.trim();
      query = {
        $or: [
          { name:  { $regex: s, $options: 'i' } },
          { genre: { $regex: s, $options: 'i' } }
        ]
      };
    }

    const communities = await Community.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    if (!search && communities.length === 0) {
      await seedCommunities();
      return res.redirect('/communities');
    }

    const joinedIds = req.user
      ? req.user.joinedCommunities.map(id => id.toString())
      : [];

    const userId = req.user ? req.user._id.toString() : null;

    const communitiesWithStatus = communities.map(c => ({
      ...c.toObject(),
      memberCount: c.members.length,
      isJoined: joinedIds.includes(c._id.toString()),
      isAdmin:  userId && (
        c.createdBy?._id?.toString() === userId ||
        c.admins?.some(a => a.toString() === userId)
      ),
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

// ── POST /communities/create ──────────────────────────────────────────────────
router.post('/create', isAuth, upload.single('coverImage'), async (req, res) => {
  const { name, description, genre } = req.body;

  if (!name || !description || !genre) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/communities');
  }

  let coverImage = '';
  if (req.file) {
    coverImage = `/images/community-covers/${req.file.filename}`;
  }

  try {
    const community = await Community.create({
      name,
      description,
      genre,
      coverImage,
      createdBy: req.user._id,
      admins:    [req.user._id],
      members:   [req.user._id]
    });

    req.user.joinedCommunities.push(community._id);
    await req.user.save();

    req.flash('success', `Community "${name}" created! 🎉`);
    res.redirect('/communities');

  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'A community with that name already exists.');
    } else {
      console.error('Create community error:', err);
      req.flash('error', 'Could not create community.');
    }
    res.redirect('/communities');
  }
});

// ── POST /communities/join/:id ────────────────────────────────────────────────
router.post('/join/:id', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      req.flash('error', 'Community not found.');
      return res.redirect('/communities');
    }

    const userId       = req.user._id;
    const alreadyMember = community.members.some(m => m.toString() === userId.toString());

    if (alreadyMember) {
      // Prevent creator from leaving
      if (community.createdBy.toString() === userId.toString()) {
        req.flash('error', 'You are the admin. Delete the community instead of leaving.');
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
    console.error('Join community error:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/communities');
  }
});

// ── GET /communities/:id/messages (JSON API for polling) ─────────────────────
router.get('/:id/messages', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members', 'name')
      .populate('admins',  'name')
      .populate('createdBy', 'name')
      .populate('messages.author', 'name');

    if (!community) return res.json({ ok: false });

    const isMember = community.members.some(m => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.json({ ok: false, error: 'not a member' });

    res.json({
      ok: true,
      messages: community.messages.slice(-200).map(msg => ({
        id:         msg._id,
        authorId:   msg.author?._id?.toString() || '',
        authorName: msg.author?.name || 'Unknown',
        content:    msg.content,
        createdAt:  msg.createdAt
      })),
      members: community.members.map(m => ({
        id:   m._id.toString(),
        name: m.name
      })),
      admins:    community.admins.map(a => a._id?.toString() || a.toString()),
      creatorId: community.createdBy?._id?.toString() || ''
    });
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.json({ ok: false });
  }
});

// ── POST /communities/:id/chat ────────────────────────────────────────────────
router.post('/:id/chat', isAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.redirect(`/communities/${req.params.id}/chat`);
    }

    const community = await Community.findById(req.params.id);
    if (!community) return res.redirect('/communities');

    const isMember = community.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) {
      req.flash('error', 'Join the community to send messages.');
      return res.redirect('/communities');
    }

    community.messages.push({
      author:  req.user._id,
      content: content.trim().slice(0, 1000)
    });

    // Keep last 500 messages only
    if (community.messages.length > 500) {
      community.messages = community.messages.slice(-500);
    }

    await community.save();

    // Reload with populated authors for response
    const populated = await Community.findById(community._id)
      .populate('messages.author', 'name');

    res.json({
      ok: true,
      messages: populated.messages.slice(-200).map(msg => ({
        id:         msg._id,
        authorId:   msg.author?._id?.toString() || '',
        authorName: msg.author?.name || 'Unknown',
        content:    msg.content,
        createdAt:  msg.createdAt
      }))
    });

  } catch (err) {
    console.error('Send message error:', err);
    res.json({ ok: false });
  }
});

// ── POST /communities/:id/remove-member ──────────────────────────────────────
// Admin only: remove a member
router.post('/:id/remove-member', isAuth, async (req, res) => {
  try {
    const { memberId } = req.body;
    const community = await Community.findById(req.params.id)
      .populate('members', 'joinedCommunities');

    if (!community) return res.redirect('/communities');

    const userId  = req.user._id.toString();
    const isAdmin = community.createdBy.toString() === userId ||
                    community.admins.some(a => a.toString() === userId);

    if (!isAdmin) {
      req.flash('error', 'Only admins can remove members.');
      return res.redirect(`/communities/${req.params.id}/chat`);
    }

    // Cannot remove the creator
    if (community.createdBy.toString() === memberId) {
      req.flash('error', 'Cannot remove the community creator.');
      return res.redirect(`/communities/${req.params.id}/chat`);
    }

    community.members.pull(memberId);
    community.admins.pull(memberId);
    await community.save();

    // Also remove from user's joinedCommunities
    const User = require('../models/User');
    await User.findByIdAndUpdate(memberId, {
      $pull: { joinedCommunities: community._id }
    });

    req.flash('success', 'Member removed.');
    res.redirect(`/communities/${req.params.id}/chat`);

  } catch (err) {
    console.error('Remove member error:', err);
    res.redirect(`/communities/${req.params.id}/chat`);
  }
});

// ── POST /communities/:id/delete ──────────────────────────────────────────────
// Admin/creator only: delete community
router.post('/:id/delete', isAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.redirect('/communities');

    const userId  = req.user._id.toString();
    const isAdmin = community.createdBy.toString() === userId ||
                    community.admins.some(a => a.toString() === userId);

    if (!isAdmin) {
      req.flash('error', 'Only the community admin can delete it.');
      return res.redirect('/communities');
    }

    // Remove from all members' joinedCommunities
    const User = require('../models/User');
    await User.updateMany(
      { joinedCommunities: community._id },
      { $pull: { joinedCommunities: community._id } }
    );

    await Community.findByIdAndDelete(req.params.id);
    req.flash('success', `"${community.name}" has been deleted.`);
    res.redirect('/communities');

  } catch (err) {
    console.error('Delete community error:', err);
    req.flash('error', 'Could not delete community.');
    res.redirect('/communities');
  }
});

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seedCommunities() {
  const mongoose = require('mongoose');
  const fakeId   = new mongoose.Types.ObjectId();

  const defaults = [
    { name: 'Dragon Readers',     genre: 'Fantasy',     description: 'For those who live and breathe fantasy worlds. Dragons, magic, and epic quests await.' },
    { name: 'Midnight Thrillers', genre: 'Thriller',    description: "We read thrillers so you don't have to sleep. Heart-pounding picks every week." },
    { name: 'Hopeless Romantics', genre: 'Romance',     description: 'Love stories, book recs, and lots of feelings. Grab a tissue before you join.' },
    { name: 'Starship Readers',   genre: 'Sci-Fi',      description: 'Exploring galaxies one page at a time. Hard sci-fi, space opera — we read it all.' },
    { name: 'Pages of the Past',  genre: 'Historical',  description: 'History brought to life through fiction. From ancient Rome to Victorian England.' },
    { name: 'Fear & Folio',       genre: 'Horror',      description: "Reading in the dark so you don't have to. Horror, gothic, and psychological terror." },
    { name: 'Mind & Meaning',     genre: 'Non-Fiction', description: 'Real stories, real ideas, real change. Biographies, science, self-help, and more.' },
    { name: 'The Mystery Circle', genre: 'Mystery',     description: 'Solving fictional crimes since 2020. No spoilers in the first 24 hours.' }
  ];

  await Community.insertMany(
    defaults.map(d => ({ ...d, members: [], admins: [], createdBy: fakeId }))
  );
  console.log('✅ Communities seeded!');
}

module.exports = router;
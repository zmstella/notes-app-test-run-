module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100);
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // hardcode the limit to 10 items
    const limit = 10;
    // set the default hasNextPage = false
    let hasNextPage = false;
    // if not cursor is passed the default query will be empty
    // This will pull the newest notes from the database
    let cursorQuery = {};

    // If there is a cursor
    // Our query will look for notes with an ObjectID less than that of the cursor
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    // If the number of notes we find exceeds our limit
    // set hasNextPage to true and trim the notes to the limit
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    // The new cursor will be the Mongo object ID of the last item in the feed array
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    };
  },
};

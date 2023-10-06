import Game from "../models/Game.js";
import RatedGame from "../models/RatedGame.js";
import User from "../models/User.js";

/* CREATE GAME */

export const addGameScores = async (req, res) => {
  try {
    const { _id } = req.query;
    const { graphics, gameplay, sound, storyLine, slug } = req.body;

    const game = await Game.findOne({ slug: slug });

    if (!game) {
      const addNewGame = new Game({
        slug,
        graphics,
        gameplay,
        sound,
        storyLine,
        reviewCount: 1,
      });
      
      const addRatedGame = new RatedGame({
          slug: slug,
          graphics: graphics,
          gameplay: gameplay,
          sound: sound,
          storyLine: storyLine,
      })

      await addRatedGame.save()

      await User.updateOne(
        { _id: _id },
        {
          $push: {
            ratedGames: addRatedGame._id
          },
        }
      );

      await addNewGame.save();

      return res.status(201).json();
    }

    const userRatingExist = await User.findOne({
      _id: _id
    }).populate({path: 'ratedGames', select: 'slug', match: { slug: slug }})

    if (userRatingExist.ratedGames.length > 0) {
      const gameId = userRatingExist.ratedGames[0].id

      await RatedGame.updateOne(
        { _id: gameId},
        {
          $set: {
            graphics: graphics,
            gameplay: gameplay,
            sound: sound,
            storyLine: storyLine,
          }
        }
      )
    } else {
      const addRatedGame = new RatedGame({
        slug: slug,
        graphics: graphics,
        gameplay: gameplay,
        sound: sound,
        storyLine: storyLine,
      })

      await addRatedGame.save()

      await User.updateOne(
        { _id: _id },
        {
          $push: {
            ratedGames: addRatedGame._id
          },
        }
      );
    }

    const allUsersRating = await RatedGame.find({slug: slug})

    const countRating = (type) => {
      return allUsersRating.reduce((acc, item) => {
        return acc + item[type];
      }, 0);
    };

    await Game.updateOne(
      { slug: slug },
      {
        $set: {
          graphics: countRating("graphics") / allUsersRating.length,
          gameplay: countRating("gameplay") / allUsersRating.length,
          sound: countRating("sound") / allUsersRating.length,
          storyLine: countRating("storyLine") / allUsersRating.length,
          reviewCount: allUsersRating.length,
        }
      }
    );

    return res.status(201).json();
  } catch (err) {
    return res.status(501).json({ err: err });
  }
};

/* GET GAME */

export const getGameScores = async (req, res) => {
  try {
    const { slug } = req.query;

    const game = await Game.findOne({ slug: slug });

    return res.status(201).json({ gameScores: game });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

export const getUserGames = async (req, res) => {
  try {
    const { _id } = req.query

    const user = await User.findOne({_id: _id}).populate('ratedGames')

    return res.status(200).json({data: user.ratedGames})

  } catch (err) {
    return res.status(500).json({ err: err})
  }
}

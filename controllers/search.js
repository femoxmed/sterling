const { Fixtures } = require("../models/Fixtures");
const { Team } = require("../models/Team");

const searchFixture = async (req, res) => {
  const ALLF = await Fixtures.find().populate("teamA teamB");
  const team = await Team.find({ name: { $regex: req.body.name } });
  if (team.length === 0) {
    res.send([]);
    return;
  }
  let filteredSearch = ALLF.filter(f => {
    return team.find(t => {
      console.log(f);
      let b = t._id;
      return (
        JSON.stringify(f.teamA._id) === JSON.stringify(b) ||
        JSON.stringify(f.teamB._id) === JSON.stringify(b)
      );
    });
  });

  res.send(filteredSearch);
};

const searchTeam = async (req, res) => {
  const team = await Team.find({ name: { $regex: req.body.name } });

  res.send(team);
};

module.exports = {
  searchFixture,
  searchTeam
};

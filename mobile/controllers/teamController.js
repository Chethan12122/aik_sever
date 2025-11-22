const teamService = require("../services/teamService");

async function createTeam(req, res) {
  const { img, team_name, sport, description, email, trainers, athletes } =
    req.body;

  if (!team_name || !sport || !email) {
    return res
      .status(400)
      .json({ message: "team_name, sport, and email are required" });
  }
  if (!Array.isArray(trainers) || !Array.isArray(athletes)) {
    return res
      .status(400)
      .json({ message: "trainers and athletes must be arrays of emails" });
  }
 
  try { 
    const { team_id } = await teamService.createTeam({
      img,
      team_name,
      sport,
      description,
      email,
      trainers,
      athletes,
    });
    res.status(201).json({ message: "Team created successfully", team_id });
  } catch (err) {
    console.error("Error creating team:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function getTeamById(req, res) {
  const team_id = req.params.id;

  try {
    const team = await teamService.getTeamById(team_id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function getAllTeams(req, res) {
  try {
    const teams = await teamService.getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function updateTeam(req, res) {
  const team_id = req.params.id;
  const { img, team_name, sport, description, trainers, athletes } = req.body;

  if (trainers && !Array.isArray(trainers)) {
    return res
      .status(400)
      .json({ message: "trainers must be an array of emails" });
  }
  if (athletes && !Array.isArray(athletes)) {
    return res
      .status(400)
      .json({ message: "athletes must be an array of emails" });
  }

  try {
    await teamService.updateTeam(team_id, {
      img,
      team_name,
      sport,
      description,
      trainers,
      athletes,
    });
    res.json({ message: "Team updated successfully" });
  } catch (err) {
    console.error("Error updating team:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function deleteTeam(req, res) {
  const team_id = req.params.id;

  try {
    const deleted = await teamService.deleteTeam(team_id);
    if (!deleted) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Error deleting team:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function getTeamsByEmail(req, res) {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ message: "Email is required in request body" });

  try {
    const teamNames = await teamService.getTeamsByEmail(email);
    res.json(teamNames);
  } catch (err) {
    console.error("Error fetching teams by email:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function getTrainers(req, res) {
  const teamId = parseInt(req.params.teamId);

  try {
    if (isNaN(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const trainers = await teamService.fetchTrainers(teamId);
    if (trainers.length === 0) {
      return res
        .status(404)
        .json({ message: "No trainers found for this team" });
    }

    res.json({
      teamId,
      trainers,
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAthletes(req, res) {
  const teamId = parseInt(req.params.teamId);

  try {
    if (isNaN(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const athletes = await teamService.fetchAthletes(teamId);
    if (athletes.length === 0) {
      return res
        .status(404)
        .json({ message: "No athletes found for this team" });
    }

    res.json({
      teamId,
      athletes,
    });
  } catch (error) {
    console.error("Error fetching athletes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function editTeam(req, res) {
  const teamId = parseInt(req.params.id);
  const { img, team_name, sport, description, owner, trainers, athletes } = req.body;

  if (!team_name || !sport || !owner) {
    return res.status(400).json({
      message: "team_name, sport, and owner are required",
    });
  }

  if (!Array.isArray(trainers) || !Array.isArray(athletes)) {
    return res.status(400).json({
      message: "trainers and athletes must be arrays of emails",
    });
  }

  try {
    const updatedTeam = await teamService.editTeam({
      teamId,
      img,
      team_name,
      sport,
      description,
      owner,
      trainers,
      athletes,
    });

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (err) {
    console.error("Error editing team:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
}





async function exitTeam(req, res) {
  const teamId = parseInt(req.params.id);
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ message: 'userEmail is required' });
  }

  try {
    const result = await teamService.exitTeam({ teamId, userEmail });
    res.json({ message: result });
  } catch (err) {
    console.error('Error exiting team:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
}

async function getTeamsWithDetailsByEmail(req, res) {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required in URL params" });
  }

  try {
    const teams = await teamService.getTeamsWithDetailsByEmail(email);

    if (!teams || teams.length === 0) {
      return res.status(404).json({ message: "No teams found for this email" });
    }

    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams with details:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}




module.exports = {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeam,
  deleteTeam,
  getTeamsByEmail,
  getAthletes,
  getTrainers, 
  editTeam,      
  exitTeam, 
  getTeamsWithDetailsByEmail,
};

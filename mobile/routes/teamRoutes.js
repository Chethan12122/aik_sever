const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/teams', teamController.createTeam);
router.get('/teams/:id', teamController.getTeamById);
router.get('/teams', teamController.getAllTeams);
router.put('/teams/:id', teamController.updateTeam);
router.delete('/teams/:id', teamController.deleteTeam);
router.post('/teams/by-email', teamController.getTeamsByEmail);
router.get('/:teamId/athletes', teamController.getAthletes);
router.get('/:teamId/trainers', teamController.getTrainers);
  
router.patch('/teams/:id/edit', teamController.editTeam);
router.post('/teams/:id/exit', teamController.exitTeam);

router.get('/teams/details/:email', teamController.getTeamsWithDetailsByEmail);


module.exports = router;

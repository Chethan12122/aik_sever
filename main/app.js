const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('../mobile/routes/otpRoutes');
const logger = require('../mobile/middleware/logger');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check
app.get('/health', (req, res) => res.status(200).send('OK it is Super ss !!!!!'));

// Serve static index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../presentation/index.html'));
});

// Mount routes

// ***********************************************
// Admin routes
const adminOtp = require('../admin/sendOtp');
app.use('/admin', adminOtp.router);

const adminSignin = require('../admin/signin');
app.use('/admin', adminSignin);

const adminMeeting = require('../admin/adminMeeting');
app.use('/admin', adminMeeting);

const blogDetails = require('../admin/blogs/blogsDetails');
app.use('/admin',blogDetails);

// Mobile APIs
const userRoutes = require('../admin/userRoutes');  
app.use('/api', userRoutes);

// Delete user route
const deleteUser = require('../admin/deleteUser');
// console.log('Mounting deleteUser route at /api/users/delete');
app.use('/api', deleteUser);
// **************************************************

// This is for the Mobile 
// ######################################################################
app.use('/api', authRoutes); //sendOtp & verifyOtp//

const reset = require('../mobile/routes/resetPasswordRoutes');//
app.use('/api',reset);

const auth_login = require('../mobile/routes/auth');
app.use('/api',auth_login);//

const workout = require('../mobile/routes/workoutRoutes');
app.use('/api',workout);

const team = require('../mobile/routes/teamRoutes');
app.use('/api', team);

const feeddata = require('../mobile/routes/feeds');//
app.use('/api', feeddata);

const role = require('../mobile/routes/roleRoutes');//
app.use('/api',role)

const usersRoutes = require('../mobile/routes/userRoutes');//
const detailsRoutes = require('../mobile/routes/detailsRoutes');//
const profileRoutes = require('../mobile/routes/profileRoutes');//
const achievementRoutes = require('../mobile/routes/achievementRoutes');
const couponRoutes = require("../mobile/routes/couponRoutes");
const followRoutes = require("../mobile/routes/followRoutes");
const rastRoutes = require("../mobile/routes/rastRoutes");
const jumpRoutes = require("../mobile/routes/jumpRoutes");
const sprintRoutes = require("../mobile/routes/sprintRoutes");
const agilityRoutes = require('../mobile/routes/agilityRoutes');
const velocityRoutes = require('../mobile/routes/velocityRoutes');

app.use("/api", couponRoutes);

app.use('/api', usersRoutes);
app.use('/api', detailsRoutes);
app.use('/api', profileRoutes);

app.use('/api', achievementRoutes);
app.use('/api', followRoutes);

app.use('/api',rastRoutes);
app.use('/api',jumpRoutes);
app.use('/api',sprintRoutes);
app.use('/api',agilityRoutes);
app.use('/api', velocityRoutes);

require("../mobile/utils/couponExpiryCron");

const wellnessRoutes = require('../mobile/routes/wellnessRoutes');
app.use('/api', wellnessRoutes);


const loadMonitoringRoutes = require('../mobile/routes/loadMonitoringRoutes');
app.use('/api', loadMonitoringRoutes);

const orgRoutes = require('../mobile/routes/organizationRoutes');
app.use('/api', orgRoutes);

// #########################################################################

module.exports = app;

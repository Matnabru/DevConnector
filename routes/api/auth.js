// Creating JWT for auth
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/',
    [
      check('email', 'Include valid email').isEmail(),
      check('password', 'Password is required').exists({
        min: 6,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Return bad request
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {email, password } = req.body;
      try {
        // See if user exist
        let user = await User.findOne({ email });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Return JWT
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          {expiresIn: 36000},
          (err, token) => {
            if(err){
              throw err;
            }
            res.json({token});
        });
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;

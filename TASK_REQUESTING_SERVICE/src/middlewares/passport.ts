import Passport from "passport";
import dotenv from "dotenv";
import User from "../models/User";
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

dotenv.config();
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

Passport.use(
  new JwtStrategy(opts, async function (jwt_payload: any, done: any) {
    console.log(jwt_payload);
    try {
      const user = await User.findOne({ _id: jwt_payload.id });
      if (user) {
        // console.log(user);
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

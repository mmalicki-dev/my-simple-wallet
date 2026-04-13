import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import UserModel from '../models/User'
import env from './env'

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
}

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.userId).select('-password')
      if (!user) return done(null, false)
      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }),
)

export default passport

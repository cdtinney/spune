export default function serializeUser(
  user: Express.User,
  done: (err: Error | null, id?: string) => void,
): void {
  done(null, user.spotifyId);
}

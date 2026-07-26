// Module augmentation: teaches Express's Request type about the field
// our auth middleware attaches. Without this, every `req.userId` read
// would be a type error or need a cast.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};

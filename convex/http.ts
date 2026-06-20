import { httpRouter } from 'convex/server';
import { auth } from './auth';

const http = httpRouter();

// Registers /api/auth/* routes used by the OAuth sign-in flow.
auth.addHttpRoutes(http);

export default http;

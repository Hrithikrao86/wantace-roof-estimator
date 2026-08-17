# AI Log

I used ChatGPT as a development assistant throughout this project. I used it
primarily to understand unfamiliar concepts, reason about the architecture,
debug errors, review code, and verify deployment behavior. I did not use AI as
a substitute for understanding the application; I asked for explanations of
the code and then tested the behavior locally and in production.

One specific example was the MongoDB setup. The initial application failed
because `MONGODB_URI` was not being loaded. After fixing the environment
variable, the application produced a DNS/SRV connection error. I investigated
the MongoDB connection string and verified the SRV records with `nslookup`.
I eventually switched to the standard MongoDB connection string and verified
that the server successfully connected to MongoDB and started listening on
port 5000.

Another issue occurred during deployment. The frontend initially failed with
a CORS error because the Render backend was still using
`http://localhost:5173` as its allowed origin. I identified that the
production `CLIENT_ORIGIN` needed to be changed to the Vercel deployment URL.
The application also exposed a Vercel SPA routing issue when directly opening
`/admin/login`, which required a Vercel rewrite so React Router could handle
the route.

I substantially worked through the application behavior myself, including
understanding the separation between frontend configuration and backend
MongoDB configuration, React state updates, API requests, validation,
authentication, and the estimator flow. I also manually tested the MongoDB
connection, estimator calculation, authentication, and deployment rather than
assuming generated code was correct.

AI was therefore used mainly as a reasoning, explanation, and debugging tool,
while implementation decisions and verification were made through my own
testing and iteration.
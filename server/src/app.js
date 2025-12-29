import express from "express";
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app=express();

// middlewares

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors({ origin: true, credentials: true }))

app.use(clerkMiddleware())


// routes
import test from "./routes/test.route.js";
import casts from "./routes/casts.route.js"
import shows from "./routes/shows.routes.js"
import trailers from "./routes/trailers.routes.js"
app.use('/v1/test', test );
app.use('/v1/casts', casts);    
app.use('/v1/shows', shows);
app.use('/v1/trailers', trailers);


app.get('/', (req,res)=>{
    res.send('Hello World');
})


// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));





import { errorConverter, errorHandler } from "./middlewares/error.js";
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
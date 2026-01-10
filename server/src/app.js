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
import show from "./routes/show.route.js";
import booking from "./routes/booking.route.js"
import admin from "./routes/admin.route.js"
import user from "./routes/user.route.js";

app.use('/v1/test', test );
app.use('/v1/show', show);
app.use('/v1/booking', booking);
app.use('/v1/admin', admin);
app.use('/v1/user', user);

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
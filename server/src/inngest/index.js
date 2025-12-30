import { Inngest } from "inngest";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "book-show" });

/* ---------------- USER CREATED ---------------- */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) return;

    await User.findByIdAndUpdate(
      id,
      {
        _id: id,
        email,
        username: `${first_name ?? ""} ${last_name ?? ""}`.trim() || email,
        image: image_url
      },
      { upsert: true, new: true }
    );
  }
);

/* ---------------- USER UPDATED ---------------- */
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) return;

    await User.findByIdAndUpdate(id, {
      email,
      username: `${first_name ?? ""} ${last_name ?? ""}`.trim() || email,
      image: image_url
    });
  }
);

/* ---------------- USER DELETED ---------------- */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

/* ---------------- SESSION CREATED ---------------- */
const handleUserLogin = inngest.createFunction(
  { id: "welcome-user-on-login" },
  { event: "clerk/session.created" },
  async ({ event }) => {
    console.log(`Welcome! User ${event.data.user_id} logged in.`);
  }
);

/* ---------------- TEST ---------------- */
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
  handleUserLogin,
  helloWorld
];

import { Inngest } from "inngest";
import {User} from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "book-show" });

//inngest function to save user data from clerk to mongodb
const syncUserCreation= inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({ event, step }) => {
        const {id, first_name, last_name, email_addresses, image_url}=event.data;
        const userData={
            _id:id,
            email: email_addresses[0].email_address,
            username: `${first_name} ${last_name}`,
            image:image_url
        }
        await User.create(userData);
    },
)


const syncUserDeletion= inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event, step }) => {
        const {id}=event.data;
        await User.findByIdAndDelete(id);
    },
) 

const syncUserUpdate=inngest.createFunction(
    {id: "update-user-from-clerk"},
    {event:"clerk/user.updated"},
    async({event, step})=>{
        const {id, first_name, last_name, email_addresses, image_url}=event.data;
        const userData={
            _id:id,
            email: email_addresses[0].email_address,
            username: `${first_name} ${last_name}`,
            image:image_url
        }
        await User.findByIdAndUpdate(id, userData);
    }
)


const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate,
    helloWorld
];
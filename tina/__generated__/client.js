import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '7b0c095a04c45d53d0b465d4c5d91042f93445fd', queries });
export default client;
  
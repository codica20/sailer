import "dotenv/config";

if(!process.env.SAILER_PASSWORD)
  throw new Error("Please set environment variable SAILER_PASSWORD!")
export const sailerPassword=process.env.SAILER_PASSWORD;
if(!process.env.SAILER_USER)
  throw new Error("Please set environment variable SAILER_USER!")
export const sailerUser=process.env.SAILER_USER;
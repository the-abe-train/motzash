import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/lib/database.types";
import nodemailer from "nodemailer";

const handler: Handler = async (event, context) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY || "";

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { friendEmail, username } = JSON.parse(event.body || "{}");

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      friendEmail
    );
    if (!error) {
      console.log("Invite email sent to:", friendEmail);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent successfully" }),
      };
    }
    if (error.name === "AuthApiError") {
      const subject = "You have a new Motzash friend request!";
      const link = (await supabase.auth.admin.generateLink(
        "magiclink",
        friendEmail
      )) as any;
      console.log(friendEmail, link);
      const emailBody = `<p>Hello!</p>

<p>${username} has sent you a friend request in Motzash!</p>

<p><a href="${link.data?.action_link}">Click here</a> below to log-in and accept the request.</p>

<p>Thank you!</p>

      - The Motzash Team`;

      await sendEmail({ emailBody, emailTo: friendEmail, subject });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent successfully" }),
      };
    }

    throw error;
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", details: e }),
    };
  }
};

function sendEmail({ emailBody, emailTo, subject }: Record<string, string>) {
  console.log("Sending email...");
  const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.porkbun.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.ADMIN_EMAIL,
    to: emailTo,
    subject,
    html: emailBody,
  };

  return new Promise<number>((res, rej) => {
    // Setting a timeout to return a good response because it takes more than
    // 10 seconds to return when there is no error, and hopefully errors out
    // right away.
    setTimeout(() => {
      console.log("Timing out with no error.");
      res(200);
    }, 5000);
    transporter.sendMail(options, (err, info) => {
      console.log("Info", info);
      if (err) {
        console.log(err.message);
        console.error(err);
        return rej(err);
      }
      res(200);
    });
  });
}

export { handler };

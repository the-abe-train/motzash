import { Component } from "solid-js";
import Logo from "../assets/icons/Havdalah Dynamic.svg";

const About: Component = () => {
  return (
    <>
      <div class="col-span-6 lg:col-span-4 p-12 lg:p-16 row-start-2 lg:row-start-1">
        <object data={Logo}></object>
      </div>
      <div class="col-span-6 md:col-span-12 lg:col-span-8 space-y-3 my-4">
        <h1 class="font-header text-3xl">What is Motzash?</h1>
        <p>Motzash is a dashboard to help you keep shabbat!</p>
        <p>
          Every Saturday, Jews around the world observe a day of rest called
          Shabbat. Although the day itself might be restful, there is usually a
          great deal of planing before and after! What to cook, where to go for
          prayers, which board games to play, and which house to hang out at,
          etc. Motzash helps to get those plans in order before the Holy day
          arrives.
        </p>
        <p>
          The name Motzash is a short form of *motzei shabbat*, which refers to
          the end of Shabbat. The first thing you notice when you open the
          dashboard is the most important bit of information: when Shabbat
          starts (candles) and when it ends (Havdalah). Make sure to allow the
          dashboard access to your location so that it correct information can
          be displayed regardless of where you are!
        </p>
        <p>
          Sign-in to Motzash to make the most of its features. You can make a
          cookbook or to-do list to plan around the day. Or, if your friends are
          on the platform, you can connect with them to share a status update,
          or make a poll to decide collectively which board games you want to
          play together. All to-do lists and polls refresh Sunday morning, so
          you can start the new week with a blank slate.
        </p>
        <p>
          All information associated with your account is stored in an encrypted
          database and is not used for analytics or shared with third parties.
          If you have any questions, concerns, or feedback, reach out to me on{" "}
          <a class="underline" href="https://twitter.com/theAbeTrain">
            Twitter
          </a>{" "}
          or via the form on my{" "}
          <a class="underline" href="https://the-abe-train.com">
            personal website
          </a>
          . The privacy policy is available{" "}
          <a class="underline" href="/privacy-policy">
            here
          </a>
          .
        </p>
        <p>Thank you, and Shabbat Shalom!</p>
      </div>
    </>
  );
};

export default About;

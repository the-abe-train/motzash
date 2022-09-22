import { Component } from "solid-js";
import Logo from "../assets/icons/Havdalah Dynamic.svg";

const About: Component = () => {
  return (
    <>
      <div
        class="row-start-2 col-span-6 p-12 mx-auto
        md:col-span-12 lg:row-start-1 lg:col-span-4 lg:p-16"
      >
        <object class="w-full" data={Logo}></object>
      </div>
      <div class="col-span-6 md:col-span-12 lg:col-span-8 space-y-5 my-4">
        <section>
          <h2 class="font-header text-2xl">What is Motzash?</h2>
          <p>Motzash is a dashboard to help you keep shabbat!</p>
          <p>
            Every Saturday, Jews around the world observe a day of rest called
            Shabbat. Although the day itself might be restful, there is usually
            a great deal of planing before and after! What to cook, where to go
            for prayers, which board games to play, and which house to hang out
            at, etc. Motzash helps to get those plans in order before the Holy
            day arrives.
          </p>
        </section>
        <section>
          <h2 class="font-header text-2xl">What does "Motzash" mean?</h2>
          <p>
            The name Motzash is a short form of <i>motzei shabbat</i>, which
            refers to the end of Shabbat. The first thing you notice when you
            open the dashboard is the most important bit of information: when
            Shabbat starts (candles) and when it ends (Havdalah). Make sure to
            allow the dashboard access to your location so that it correct
            information can be displayed regardless of where you are!
          </p>
        </section>

        <section>
          <h2 class="font-header text-2xl">
            What happens when I make an account on Motzash?
          </h2>
          <p>
            Sign-in to Motzash to make the most of its features. You can make a
            cookbook or to-do list to plan around the day. Or, if your friends
            are on the platform, you can connect with them to share a status
            update, or make a poll to decide collectively which board games you
            want to play together.
          </p>
        </section>
        <section>
          <h2 class="font-header text-2xl">
            What makes Motzash different from any other app?
          </h2>
          <p>
            Motzash was designed with life surrounding the Jewish holidays in
            mind. That's why all statuses, to-do lists, and polls refresh Sunday
            morning: you're going to be starting each new week refreshed, and so
            will Motzash!
          </p>
        </section>
        <section>
          <h2 class="font-header text-2xl">Is my data secure?</h2>
          <p>
            All information associated with your account is stored in an
            encrypted database and is not used for analytics or shared with
            third parties. If you have any questions, concerns, or feedback,
            reach out to me on{" "}
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
        </section>
        <p>Thank you, and Shabbat Shalom!</p>
      </div>
    </>
  );
};

export default About;

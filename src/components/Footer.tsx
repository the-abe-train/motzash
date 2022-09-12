import Logo from "../assets/icons/Havdalah Static.svg";
import Twitter from "../assets/icons/Twitter.svg";
import Github from "../assets/icons/Github.svg";
import { Link } from "@solidjs/router";

export default () => {
  return (
    <footer class="bg-black text-yellow2 h-fit w-full mt-6 py-4">
      <div
        class="flex flex-col px-4 space-x-4 flex-wrap container 
        md:flex-row justify-between max-w-4xl 
          md:px-4 w-full mx-auto items-center space-y-3 md:space-y-0"
      >
        <section
          class="flex md:flex-col justify-center items-end 
            md:items-center space-x-4 md:space-x-0 w-full md:w-max"
        >
          <div class="font-header text-xl space-x-1 flex items-center">
            <img class="inline" height={20} width={20} src={Logo} alt="logo" />
            <span>Motzash</span>
          </div>
          <p>© Motzash {new Date().getFullYear()}</p>
        </section>
        <section class="flex justify-center w-full md:w-max space-x-6 items-center">
          <p>
            Motzash was created by{" "}
            <a class="underline" href="https://the-abe-train.com">
              The Abe Train
            </a>{" "}
            <a href="https://twitter.com/theAbeTrain">
              <img
                class="inline mx-1"
                src={Twitter}
                width={20}
                height={20}
                alt="Twitter"
              />
            </a>
            <a href="https://github.com/the-abe-train/Motzash">
              <img
                class="inline mx-1"
                src={Github}
                width={20}
                height={20}
                alt="GitHub"
              />
            </a>
          </p>
        </section>
        <section>
          <ul class="flex space-x-8 justify-items-center">
            <li>
              <Link class="hover:font-bold" href="/">
                Dashboard
              </Link>
            </li>
            <li>
              <Link class="hover:font-bold" href="/friends">
                Friends
              </Link>
            </li>
            <li>
              <Link class="hover:font-bold" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link class="hover:font-bold" href="/profile">
                Profile
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
};

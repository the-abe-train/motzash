import { Link } from "@solidjs/router";
import { Component, Setter } from "solid-js";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: Setter<boolean>;
};

const Sidebar: Component<Props> = (props) => {
  return (
    <div
      class="bg-yellow1 h-full w-full absolute top-0 left-0 transition-all z-10
      md:hidden"
      style={{
        transform: props.sidebarOpen ? "translate(0, 0)" : "translate(100%, 0)",
        // width: props.sidebarOpen ? "100%" : "0",
        // display: props.sidebarOpen ? "inherit" : "none",
      }}
    >
      <div class="text-3xl flex flex-col space-y-10 m-8">
        <Link
          onClick={() => props.setSidebarOpen(false)}
          class="hover:font-bold"
          href="/"
        >
          Dashboard
        </Link>
        <Link
          onClick={() => props.setSidebarOpen(false)}
          class="hover:font-bold"
          href="/friends"
        >
          Friends
        </Link>
        <Link
          onClick={() => props.setSidebarOpen(false)}
          class="hover:font-bold"
          href="/about"
        >
          About
        </Link>
        <Link
          onClick={() => props.setSidebarOpen(false)}
          class="hover:font-bold"
          href="/profile"
        >
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

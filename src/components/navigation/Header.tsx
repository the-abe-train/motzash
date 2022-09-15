import { Link } from "@solidjs/router";
import { Component, Setter } from "solid-js";
import Logo from "../../assets/icons/Havdalah Dynamic.svg";

type Props = {
  setActiveWidget: Setter<Widget | null>;
  setActiveMacro: Setter<WidgetMacro | null>;
  sidebarOpen: boolean;
  setSidebarOpen: Setter<boolean>;
};

const Header: Component<Props> = (props) => {
  function resetDashboard() {
    props.setActiveWidget(null);
    props.setActiveMacro(null);
  }

  return (
    <header class="w-full h-fit border-b-2 border-black bg-yellow1">
      <nav
        class="flex justify-between items-center h-14 
  container w-full px-2 md:px-4 lg:px-6 mx-auto"
      >
        <Link href="/" data-cy="header-logo">
          <div class="flex space-x-2 items-center" onClick={resetDashboard}>
            <object data={Logo} width={25} aria-label="Motzash Logo"></object>
            <span class="font-header text-3xl">Motzash</span>
          </div>
        </Link>
        <div class="md:flex space-x-10 text-lg hidden" onClick={resetDashboard}>
          <Link class="hover:font-bold" href="/" data-cy="header-dashboard">
            Dashboard
          </Link>
          <Link
            class="hover:font-bold"
            href="/friends"
            data-cy="header-friends"
          >
            Friends
          </Link>
          <Link class="hover:font-bold" href="/about" data-cy="header-about">
            About
          </Link>
          <Link
            class="hover:font-bold"
            href="/profile"
            data-cy="header-profile"
          >
            Profile
          </Link>
        </div>
        <button
          class="w-10 h-9 relative md:hidden"
          onClick={() => props.setSidebarOpen((prev) => !prev)}
          aria-label="hamburger"
        >
          <span
            class="left-1/2 top-2 block absolute h-[2px] bg-black rounded 
        transition-all"
            style={{
              width: props.sidebarOpen ? 0 : "50%",
              transform: "translate(-50%, 0)",
            }}
          ></span>
          <span
            class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black 
        rounded transition-all"
            style={{ rotate: props.sidebarOpen ? "45deg" : "inherit" }}
          ></span>
          <span
            class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black 
        rounded transition-all"
            style={{ rotate: props.sidebarOpen ? "-45deg" : "inherit" }}
          ></span>
          <span
            class="left-1/2 top-6 block absolute h-[2px] bg-black rounded 
        transition-all"
            style={{
              width: props.sidebarOpen ? 0 : "50%",
              transform: "translate(-50%, 0)",
            }}
          ></span>
        </button>
      </nav>
    </header>
  );
};

export default Header;

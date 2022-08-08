import type { Component } from "solid-js";

const Home: Component = () => {
  const timeToShabbos = "2h 43m";
  const nextCandleLighting = "8:17 PM";
  const nextMotzash = "9:22 PM";
  return (
    <>
      <div class="flex flex-col h-full">
        <main class="grid grid-cols-12 gap-4 h-full">
          <aside class="col-span-3 border-r">
            <h1 class="text-xl">Candle Lighting</h1>
            <p>Get ready! Shabbos starts in {timeToShabbos}</p>
            <div class="flex p-2 justify-around">
              <div class="flex flex-col items-center">
                <span>Candle Lighting</span>
                <span>{nextCandleLighting}</span>
              </div>
              <div class="flex flex-col items-center">
                <span>Motzash</span>
                <span>{nextMotzash}</span>
              </div>
              <div></div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default Home;

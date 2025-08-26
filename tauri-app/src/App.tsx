import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Grid from "./cell";
import { TypographyH1 } from "./home";

function App() {
  return (
    <main className="mt-4 flex flex-col items-center">
      <title>Cody's MultMines</title>
      <TypographyH1/>
      <Grid className="mt-6" gameId={0} R={9} C={9} mineNum={15}></Grid>
    </main>
  )
}

export default App;

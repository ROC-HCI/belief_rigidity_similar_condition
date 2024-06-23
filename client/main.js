import Empirica from "meteor/empirica:core";
import { render } from "react-dom";
import ExitSurvey from "./exit/ExitSurvey";
import Thanks from "./exit/Thanks";
import Sorry from "./exit/Sorry";
import About from "./game/About";
import Round from "./game/Round";
import Consent from "./intro/Consent";
import InstructionStepOne from "./intro/InstructionStepOne";
import InstructionStepTwo from "./intro/InstructionStepTwo";
import Quiz from "./intro/Quiz";
import NewPlayer from "./intro/NewPlayer";
import { Mongo } from "meteor/mongo";

// Set the About Component you want to use for the About dialog (optional).
// Empirica.init({
//   // Other configuration options...
//   // aboutButtonLabel: "Custom About",
// });

Empirica.about(About);

// Set the Consent Component you want to present players (optional).
Empirica.consent(Consent);

// SignUp Component
// Set the component for getting the player id (optional)
console.log("signing up new player. In main.js");
Empirica.newPlayer(NewPlayer);

// LogIn Component
// Empirica.newPlayer(NewPlayer);

// Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.
Empirica.introSteps((game, treatment) => {
  const steps = [InstructionStepOne];
  // if (treatment.playerCount > 1) {
  //   steps.push(InstructionStepTwo);
  // }
  steps.push(Quiz);
  return steps;
});

// The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.
Empirica.round(Round);

// End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.
Empirica.exitSteps((game, player) => {
  if (
    !game ||
    (player.exitStatus &&
      player.exitStatus !== "finished" &&
      player.exitReason !== "playerQuit")
  ) {
    return [Sorry];
  }
  return [ExitSurvey, Thanks];
});

// Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.
// const PlayersCollection = Mongo.Collection("players");

// const userCollection = new Mongo.Collection("test.players");

Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
  // Meteor.call("printAllPlayers", (error) => {
  //   if (error) {
  //     console.error("Error printing players:", error);
  //   }
  // });

  // Meteor.call("printPlayerName", "akbsc8y3uyjQZfTsh", (error) => {
  //   if (error) {
  //     console.error("Error printing player name:", error);
  //   }
  // });

  // Meteor.call("testCallMethod");
});

// testing database accessibility method
// Meteor.methods({
//   printAllPlayers() {
//     const players = Mongo.Collection("players").findOne();
//     console.log("this is Players:", players);
//   },
//   printPlayerName(playerId) {
//     const player = PlayersCollection.findOne(playerId);
//     if (player) {
//       console.log("Player Name:", player.id);
//     } else {
//       console.log("Player not found.");
//     }
//   },
// });

// Meteor.methods({
//   testCallMethod() {
//     console.log("hello, this is from main");
//   },
//   gettingPlayer() {
//     console.log(userCollection.find().fetch());
//   },
// });

import { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);

  setTimeout(() => setCounter(counter + 1), 1000);

  return <div>{counter}</div>;
};

export default App;

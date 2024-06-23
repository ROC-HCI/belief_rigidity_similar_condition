import Empirica from "meteor/empirica:core";
import "./bots.js";
import "./callbacks.js";
import "./connections.js";
import { taskData_statements } from "./constants";
import { Meteor } from "meteor/meteor";
import { varTest } from "/api/links";
import { PlayerInfor } from "/api/links.js";
import { Email } from "meteor/email";
import { check } from "meteor/check";

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.

Meteor.methods({
  testCallMethod() {
    console.log("This is from main from the server methods");
  },
  gettingPlayer() {
    // console.log(userCollection.find().fetch());
    // console.log(mainCollection.find().fetch());
  },
  testConst() {
    console.log(varTest);
  },
  insertion(generatedID, gID, mID) {
    PlayerInfor.insert({ generatedID: generatedID, gameID: gID, MTurkID: mID });
  },
  sendEmail(to, from, subject, text) {
    // Make sure that all arguments are strings.
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    Email.send({ to, from, subject, text });
  },
});

Empirica.gameInit((game) => {
  console.log("Initializing new game. In server main.js");
  // Establish node list
  const nodes = [];
  for (let i = 0; i < game.players.length; i++) {
    nodes.push(i);
  }

  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    // Give each player a nodeId based on their position
    player.set("nodeId", i);

    // Assign all nodes as a neighbor
    const networkNeighbors = nodes.filter((node) => node !== i);
    player.set("neighbors", networkNeighbors);
  });

  // add an extra stage here in the last round?
  _.times(5, (i) => {
    // 5 is the number of rounds
    const round = game.addRound();
    round.set("taskData_statements", taskData_statements[i]);
    //round.set("round_number", i);

    round.addStage({
      name: "response",
      displayName: "Response",
      //durationInSeconds: 600, a little over 10 mins in seconds
      durationInSeconds: 210 
    });

    round.addStage({
      name: "revision",
      displayName: "Revision",
      durationInSeconds: 180 // a little over 10 mins in seconds
    }); // Added another stage for editing response based on friends response

    round.addStage({
      name: "reaction",
      displayName: "Reaction",
      durationInSeconds: 180 // a little over 10 mins in seconds
    }); // Added another stage for reaction
  });
});

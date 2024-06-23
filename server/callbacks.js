import Empirica from "meteor/empirica:core";
import { main_work, randomAssignment } from "./connections";
import { Log } from "meteor/logging";
import { helper } from "./makeRecommendation";
import { baseHelper } from "./makeBaseConnections";
import { end_of_round_report } from "./updatePrinting";
const { performance } = require("perf_hooks");

// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game) => {
  Log("Game Started");
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  Log("Round " + (round.index + 1) + " started. Round Index:" + round.index);
  round.set("round_number", round.index);

  // if not the first round, set their connections to InitialConnections
  // which is assigned from onRoundEnd from previous round,
  //  player.set(
  //   "InitialConnectionsForThisRound",
  //   player.round.get("followedPlayers")
  // );

  // other than round 1, all the connections being displayed in respective
  // rounds are set at the start of the round

  // for round 1 or round.index == 0, it will be set at the end of its stage 1
  // the round.index == 0 version cannot be done here. We do that in 
  if (round.index > 0) {
    game.players.forEach((player) => {
      //
      var followed_last_round = player.get("InitialConnectionsForThisRound");

      // Used to display in second stage. And used to list out who was shown in
      // second stage in later report
      player.round.set("connections", followed_last_round);

      player.round.set("followedPlayers", followed_last_round);

      // making sure followed player is set correctly, we can also do that here
      // followed player is used for third stage, when we render followed or not
      // within ReactionResponse, for displaying the correct button text
      // AND also we need it for rendering currently following at end of round report.
      // since followedPlayers can be updated in third stage. If second stage not rendered
      // followedPlayers will be null for button text rendering and also null for
      // displaying in backend.
      //

      //player.round.set("round_number", round.index);

      //const reaction_value = player.round.get("reaction_value") || 100;
      // player.set("reason", reason);
      // player.set("reason_update", reason);
      // player.set("value_update", value);
      // player.set("Likert", value);
      //player.set("reaction_value", reaction_value);
    });
  }
  // else {
  //   game.players.forEach((player) => {
  //     //player.round.set("round_number", round.index);
  //   });
  // }
});

// onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  Log(
    "Stage " + ((stage.index % 3) + 1) + " STARTED. Stage Index: " + stage.index
  );
  const all_nodeIds_ = [];
  const corresponding_likert_ = [];

  // At second stage, it pushes all the value from previous round
  // into sortedLikert array and then set round's value to that array
  if (
    stage.index == 1 ||
    stage.index == 4 ||
    stage.index == 7 ||
    stage.index == 10 ||
    stage.index == 13
  ) {
    // console.log("we are start of 2nd stage stage of round", round.index);

    game.players.forEach((player) => {
      all_nodeIds_.push(player.get("nodeId"));
      corresponding_likert_.push(player.round.get("value"));
    });

    // console.log("all_nodeIds", all_nodeIds_);
    // console.log("corresponding_likert", corresponding_likert_);

    const indices = corresponding_likert_
      .map((_, i) => i)
      .sort((i, j) => corresponding_likert_[i] - corresponding_likert_[j]);

    const sorted_all_nodeIds = indices.map((i) => all_nodeIds_[i]);
    const sorted_corresponding_likert_ = indices.map(
      (i) => corresponding_likert_[i]
    );

    // console.log("sortedall_nodeIds", sorted_all_nodeIds);
    // console.log("sortedcorresponding_likert", sorted_corresponding_likert_);
    // we can use this in the client side to show the values in stage 3 (reaction)
    round.set("list_sortedall_nodeIds", sorted_all_nodeIds);
    round.set("list_sortedcorresponding_likert", sorted_corresponding_likert_);
  }
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) => {
  Log(
    "Stage " + ((stage.index % 3) + 1) + " ENDED. Stage Index: " + stage.index
  );

  //testing purpose
  // const corresponding_likert = [];
  // // other rounds we just rely on onRoundEnd to set "initialConnection"
  // // from current round and pass it to next round's
  // // onRoundStart and set it as "connections"
  // if (stage.index == 3) {
  //   game.players.forEach((player) => {
  //     // all_nodeIds.push(player.get("nodeId"));
  //     corresponding_likert.push(player.round.get("value"));
  //   });

  //   console.log(
  //     "This is CHECKKKK corre but not in round 1" + corresponding_likert
  //   );
  // }

  // **END of Stage 1
  if (stage.index == 0) {
    // keep this for performance evaluation
    const startTime = performance.now();
    console.log("This is the end of stage1, here we call baseHelper()");

    //**Base connection assignment
    baseHelper(game, round);

    // for calculating execution time
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    Log(`Execution time: ${executionTime} milliseconds`);
    Log("Finished assignment for each player ");
  }

  // **END of Stage 2, we call helper to get recommendation ready for Stage3
  // Then when frontend of stage3 loads, it will get the respective needed
  // information
  if (stage.index % 3 == 1) {
    console.log("This is the end of stage2, here we call helper()");
    helper(game, round);
  }
});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round) => {
  Log("Round " + (round.index + 1) + " ENDED. Index:" + round.index);
  Log("This is the end of round report:");

  // console.log("this is what is recommended for each player at third stage");

  // TODO, CLEAN THESE PRINT STATEMENTS TOO
  end_of_round_report(game, round);

  // "player_specific_recommendation_without_connections_list"
  // game.players.forEach((player) => {
  //   player.round.get("player_specific_recommendation_without_connections_list");
  // });
});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game) => {
  Log("Game ended");
});

// ===========================================================================
// => onSet, onAppend and onChange ==========================================
// ===========================================================================

// onSet, onAppend and onChange are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
Empirica.onSet(
  (
    game,
    round,
    stage,
    player, // Player who made the change
    target, // Object on which the change was made (eg. player.set() => player)
    targetType, // Type of object on which the change was made (eg. player.set() => "player")
    key, // Key of changed value (e.g. player.set("score", 1) => "score")
    value, // New value
    prevValue // Previous value
  ) => {
    //   // // Example filtering
    //if (key !== "value") {
    //  return;
    // }
  }
);

// // onAppend is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
//    Game.set("lastChangeAt", new Date().toString())
// });

// // onSubmit is called when the player submits a stage.
// Empirica.onSubmit((
//   game,
//   round,
//   stage,
//   player // Player who submitted
// ) => {
// });

function end_of_round_report(game, round) {
  game.players.forEach((player) => {
    player.set(
      "InitialConnectionsForThisRound",
      player.round.get("followedPlayers")
    );

    // end of round print statements for each player:
    console.log(
      "player nodeID: " +
        player.get("nodeId") +
        ", scale value: " +
        player.round.get("value") +
        ", name: " +
        player.id
    );

    if (round.index > 0) {
      console.log(
        "Shown in second stage:                  " +
          player.round.get("connections")
      );
      // console.log(player.round.get("connections"));

      console.log(
        "What's recommended in third stage:      " +
          player.round.get(
            "player_specific_recommendation_without_connections_list"
          )
      );

      console.log(
        "Currently Following:                    " +
          player.round.get("followedPlayers")
      );
      // console.log(player.round.get("followedPlayers"));

      // console.log(
      //   player.round.get(
      //     "player_specific_recommendation_without_connections_list"
      //   )
      // );
    } else {
      console.log(
        "Shown in second stage(Base_connection): " +
          player.get("base_connections")
      );
// not 
      console.log(
        "What's recommended in third stage:      " +
          player.round.get(
            "player_specific_recommendation_without_connections_list"
          )
      );

      console.log(
        "Currently Following:                    " +
          player.round.get("followedPlayers")
      );
    }
    console.log("");

    // player.round.get("player_specific_recommendation_without_connections_list");
  });
}

export { end_of_round_report };

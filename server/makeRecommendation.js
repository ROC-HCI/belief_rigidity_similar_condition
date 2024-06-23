function makeRecommendationArray(
  connection_IDs,
  number_of_recommendation,
  round,
  player
) {
  const sorted_all_players_ID = round.get("list_sortedall_nodeIds");
  const playerNodeId = player.get("nodeId");

  // We only want the value that is NOT in connection_IDs. Meaning,
  // for non_connection_sorted_all_players_ID, there can only exists
  // playerIDs that are not within connection_IDs (base_connection | connection)
  const non_connection_sorted_all_players_ID = sorted_all_players_ID.filter(
    (value) => !connection_IDs.includes(value)
  );
  // filter again.

  // console.log(
  //   "In ReactionResponse. In makeRecommendationArray. non_connection_sorted_all_players_ID: ",
  //   non_connection_sorted_all_players_ID
  // );
  // find position of player nodeID in non_connection_sorted_all_players_ID
  const player_position =
    non_connection_sorted_all_players_ID.indexOf(playerNodeId);

  const small_subarr_size = Math.floor(number_of_recommendation / 2);
  const large_subarr_size = number_of_recommendation - small_subarr_size;

  const arr1 = non_connection_sorted_all_players_ID.slice(0, player_position); // subarray before player position
  const arr2 = non_connection_sorted_all_players_ID.slice(player_position + 1); // subarray after player position

  let arr1_sub;
  let arr2_sub;
  let recommendation_array_without_connections;


  if (player_position <= small_subarr_size) {
    // i.e less values in LHS
    //we take all of the left
    //we take the remaining from the right
    arr1_sub = arr1;
    const remaining = number_of_recommendation - arr1_sub.length;
    arr2_sub = arr2.slice(0, remaining);
  } else if (arr2.length < small_subarr_size) {
    // less value in RHS
    // take all of the right
    arr2_sub = arr2;
    // take remaining from the left
    const remaining = number_of_recommendation - arr2_sub.length;
    arr1_sub = arr1.slice(-remaining);
  } else {
    //take randomly in any direction for small size array, and the other goes to big size array
    const randomdirection = Math.random() < 0.5 ? -1 : 1; // -1 is small array will get 4, and the larger array will get 3
    if (randomdirection === -1) {
      //arr1 will be the smaller array
      arr1_sub = arr1.slice(-small_subarr_size);
      arr2_sub = arr2.slice(0, large_subarr_size);
    } else {
      //arr1 is the larger array
      arr1_sub = arr1.slice(-large_subarr_size);
      arr2_sub = arr2.slice(0, small_subarr_size);
    }
  }
  recommendation_array_without_connections = arr1_sub.concat(arr2_sub);
  player.round.set(
    "player_specific_recommendation_without_connections_list",
    recommendation_array_without_connections
  );
  //console.log("recommendation_array_without_connections length", recommendation_array_without_connections.length)
  //console.log("recommendation_array_without_connections", recommendation_array_without_connections );

  // this is total, (without connections) + (connections)
  // but also, we will print out the without connection list in report just to see who got recommended
  let total_recommendation_array =
    recommendation_array_without_connections.concat(connection_IDs);
  //console.log("total_recommendation_array", total_recommendation_array);

  //shuffling randomly
  total_recommendation_array = total_recommendation_array.sort(
    () => Math.random() - 0.5
  );
  return total_recommendation_array;
}

function helper(game, round) {
  // gather all player's information

  // for loop, for each player, make recommendation and assign it to player
  game.players.forEach((player) => {
    // base_connection if round.index == 0
    // or connection if round.index > 0
    var connection_IDs;

    // the number of recommendation we are looking for
    var numberOfRec;

    if (round.index > 0) {
      connection_IDs = player.round.get("connections");
    } else {
      connection_IDs = player.get("base_connections");
    }

    // pass in # of recommendations in order to fill up 6 people in third stage
    numberOfRec = 6 - connection_IDs.length;

    const recommendation_list = makeRecommendationArray(
      connection_IDs,
      numberOfRec,
      round,
      player
    );
    
    player.round.set(
      "player_specific_total_recommendation_list",
      recommendation_list
    );

  });  //end of player for loop recommendation for third stage setting

}

export { helper };

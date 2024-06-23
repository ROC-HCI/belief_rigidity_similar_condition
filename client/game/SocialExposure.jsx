import React from "react";

//for colors
getButtonClassName = (value) => {
  switch (value) {
    case 0:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-red-600 bg-red-600";
    case 1:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-red-400 bg-red-400";
    case 2:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-400 bg-orange-400";
    case 3:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-yellow-400 bg-yellow-400";
    case 4:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-green-400 bg-green-400";
    case 5:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-green-600 bg-green-600";
    case 6:
      return "first:ml-0 text-xs font-semibold flex w-[30px] h-[30px] mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-green-900 bg-green-900";
    default:
      return "default-classname";
  }
};

class LikertScale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: "NoRating",
      value: this.props,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value === 0) {
      this.setState({ rating: "Strongly Disagree" });
    } else if (value === 1) {
      this.setState({ rating: "Disagree" });
    } else if (value === 2) {
      this.setState({ rating: "Somewhat Disagree" });
    } else if (value === 3) {
      this.setState({ rating: "Neutral" });
    } else if (value === 4) {
      this.setState({ rating: "Somewhat Agree" });
    } else if (value === 5) {
      this.setState({ rating: "Agree" });
    } else if (value === 6) {
      this.setState({ rating: "Strongly Agree" });
    }
  }

  render() {
    const { rating } = this.state;
    const { value } = this.props;
    return (
      <div id="iconAndRating" class="flex flex-col items-center">
        <p class="font-bold text-xl">{rating}</p>
        <a className={getButtonClassName(value)}></a>
      </div>
    );
  }
}

export default class SocialExposure extends React.Component {
  //shows top N given number.
  constructor(props) {
    super(props);
    const { player, connections } = props;
    this.state = {
      content: null,
    };
  }

  //this is redundant code at this point
  // this is useless
  renderTopN(otherPlayer_difference, nodeID_Array, number) {
    const { game, round, player } = this.props;
    //adding the top connections as a property
    player.round.set("connections", nodeID_Array.slice(0, number));
    player.round.set("followedPlayers", nodeID_Array.slice(0, number));
    //console.log(player.round.get("connections"));
    const elements = [];

    //  special case where there is just one other player.
    if (nodeID_Array.length === 1) {
      const otherPlayer_nodeID = nodeID_Array[0];
      const otherPlayer_diff = otherPlayer_difference[0];
      const targetPlayer = game.players.filter(
        (player) => player.get("nodeId") === otherPlayer_nodeID
      );
      const value = targetPlayer[0].round.get("value") ?? "NA";
      const reason = targetPlayer[0].round.get("reason") ?? "NA";
      const nodeID = targetPlayer[0].get("id") ?? "NA";

      elements.push(
        <div id="boxContainer" className="">
          <div id="profileContainer" className="mb-[5px]">
            <h3 className="font-bold text-2xl">Player {nodeID}</h3>
            {/* <p> The nodeID of the player is: {nodeID} </p> */}
          </div>

          <div
            id="scaleAndReasonContainer"
            className="flex flex-col border-2 border-[#959595] rounded-[10px] w-[340px] h-[250px]"
            key={nodeID}
          >
            <div className="my-[8px] ml-[-200px]">
              <LikertScale value={value}></LikertScale>
            </div>
            {/* color circle with level of agreement */}

            <p className="font-bold text-lg mx-[20px]">
              {" "}
              The reason provided by the player is: {reason}{" "}
            </p>
          </div>
        </div>
      );
    } else {
      // **for all the other cases
      // *Work on this - Chris
      for (let i = 0; i < number; i++) {
        const otherPlayer_nodeID = nodeID_Array[i];
        const otherPlayer_diff = otherPlayer_difference[i];
        // find player Object using nodeID
        const targetPlayer = game.players.filter(
          (player) => player.get("nodeId") === otherPlayer_nodeID
        ); // this is an array
        // value of the player is stored in targetPlayer[0]
        //console.log("still in rendertop")
        //console.log(targetPlayer[0])
        const value = targetPlayer[0].round.get("value") ?? "NA";
        const reason = targetPlayer[0].round.get("reason") ?? "NA";
        const nodeID = targetPlayer[0].get("nodeId") ?? "NA";
        elements.push(
          <div id="boxContainer" className="">
            <div id="profileContainer" className="mb-[5px]">
              <h3 className="font-bold text-2xl">Player {nodeID}</h3>
              {/* <p> The nodeID of the player is: {nodeID} </p> */}
            </div>

            <div
              id="scaleAndReasonContainer"
              className="flex flex-col border-2 border-[#959595] rounded-[10px] w-[340px] h-[250px]"
              key={nodeID}
            >
              <div className="my-[8px] ml-[-200px]">
                <LikertScale value={value}></LikertScale>
              </div>
              {/* color circle with level of agreement */}

              <p class="font-bold text-lg mx-[20px]">
                {" "}
                The reason provided by the player is: {reason}{" "}
              </p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="grid grid-cols-2 gap-[40px] ml-[28px]">{elements}</div>
    );
  }

  renderPrevFollowedPlayers(nodeID_Array) {
    console.log("In SocialExposure. In renderPrevFollowedPlayers.");
    const { game, round, player } = this.props;
    //adding the top connections as a property

    // setting followedPlayers for next stage, Reaction ??? Should NOT DO THAT HERE
    // do that in backend, 
    // player.round.set("followedPlayers", nodeID_Array);
    //console.log(player.round.get("connections"));
    const elements = [];

    //special case where there is just one other player.
    if (nodeID_Array.length === 1) {
      const otherPlayer_nodeID = nodeID_Array[0];
      const targetPlayer = game.players.filter(
        (player) => player.get("nodeId") === otherPlayer_nodeID
      );
      const value = targetPlayer[0].round.get("value") ?? "NA";
      const reason = targetPlayer[0].round.get("reason") ?? "NA";
      const nodeID = targetPlayer[0].get("nodeId") ?? "NA";
      elements.push(
        <div id="boxContainer" className="">
          <div id="profileContainer" className="mb-[5px]">
            <h3 className="font-bold text-2xl">Player {nodeID}</h3>
            {/* <p> The nodeID of the player is: {nodeID} </p> */}
          </div>

          <div
            id="scaleAndReasonContainer"
            className="flex flex-col border-2 border-[#959595] rounded-[10px] w-[340px] h-[250px]"
            key={nodeID}
          >
            <div className="my-[8px] ml-[-200px]">
              <LikertScale value={value}></LikertScale>
            </div>
            {/* color circle with level of agreement */}

            <p className="font-bold text-lg mx-[20px]">{reason}</p>
          </div>
        </div>
      );
    } else {
      // for all the other cases
      for (let i = 0; i < nodeID_Array.length; i++) {
        const otherPlayer_nodeID = nodeID_Array[i];
        // find player Object using nodeID
        const targetPlayer = game.players.filter(
          (player) => player.get("nodeId") === otherPlayer_nodeID
        ); // this is an array
        // value of the player is stored in targetPlayer[0]
        //console.log(targetPlayer[0])
        const value = targetPlayer[0].round.get("value") ?? "NA";
        const reason = targetPlayer[0].round.get("reason") ?? "NA";
        const nodeID = targetPlayer[0].get("nodeId") ?? "NA";
        elements.push(
          <div id="boxContainer" className="">
            <div id="profileContainer" className="mb-[5px]">
              <h3 className="font-bold text-2xl">Player {nodeID}</h3>
              {/* <p> The nodeID of the player is: {nodeID} </p> */}
            </div>

            <div
              id="scaleAndReasonContainer"
              className="flex flex-col border-2 border-[#959595] rounded-[10px] w-[340px] h-[250px]"
              key={nodeID}
            >
              <div className="my-[8px] ml-[-200px]">
                <LikertScale value={value}></LikertScale>
              </div>
              {/* color circle with level of agreement */}

              <p class="font-bold text-lg mx-[20px]">{reason}</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="grid grid-cols-2 gap-[5px] ml-[28px]">{elements}</div>
    );
  }

  getNodeID(otherPlayer) {
    // Get the value or return NA if no value was entered
    const nodeId = otherPlayer.get("nodeId");
    return nodeId;
  }

  compareResults_Loop(otherPlayer) {
    const { player } = this.props;
    // Get the value or return NA if no value was entered
    const otherValue = otherPlayer.round.get("value") ?? "NA";
    const playerValue = player.round.get("value") ?? "NA";
    const difference = Math.abs(otherValue - playerValue);
    return difference;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response-updated">
        <div className="updated-response-submitted">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  componentDidMount() {
    var prevFollowedPlayers;
    var prevBaseConnections;
    //var sorted_neighbor_nodeIDs_string;
    //var sorted_neighbor_nodeIDs;
    //var sorted_difference;
    const { game, round, player } = this.props;
    const otherPlayers = game.players.filter((p) =>
      player.get("neighbors").includes(p.get("nodeId"))
    );
    //getting array of difference from the current player
    // const difference = otherPlayers.map((p) => this.compareResults_Loop(p));
    // //getting node numbers of all other players
    // const neighbor_nodeIDs = otherPlayers.map((p) => this.getNodeID(p));
    // //console.log("difference", difference)
    // //console.log("neighbor_nodeIDs", neighbor_nodeIDs)
    // const mapArrays = (arr1 = [], arr2 = []) => {
    //   const res = arr1.reduce((acc, elem, index) => {
    //     acc[elem] = arr2[index];
    //     return acc;
    //   }, {});
    //   return res;
    // };
    // const difference_nodeIDs_pair = mapArrays(neighbor_nodeIDs, difference);
    // //console.log("difference_nodeIDs_pair before sorting", difference_nodeIDs_pair); //object

    const round_number = game.rounds[0].get("round_number"); // round.index starts from 0.
    console.log(
      "In SocialExposure. In componentDidMount. round_number",
      round_number
    );

    if (round_number > 0) {
      // connections is set at backend starting of the round, from initialConnection assigned
      // from pevious end of round. (Basically the followed players)
      prevFollowedPlayers = player.round.get("connections");
      console.log(
        "In SocialExposure. In componentDidMount. For other rounds, previousfollowedPlayers",
        prevFollowedPlayers
      );
    } else {
      //so if its round = 0, we get base_connections as defined by Seif.
      //  base_connections is assiged at Backend, from end of stage 1 from round 1, stage.index = 0
      // based connecitons is set at the end of stage 1
      prevBaseConnections = player.get("base_connections");
      console.log(
        "In SocialExposure. In componentDidMount. For first round, Base Connections",
        prevBaseConnections
      );
    }
    //else {
    //   //----------------------------- sorting -----------------------------//
    //   const arr = Object.entries(difference_nodeIDs_pair);
    //   arr.sort((a, b) => a[1] - b[1]);
    //   const difference_nodeIDs_sorted = arr.reduce(
    //     (acc, [key, value], index) =>
    //       Object.assign(acc, { [index]: { key, value } }),
    //     {}
    //   );
    //   console.log(difference_nodeIDs_sorted); // making a key-value pair and this is an object

    //   sorted_neighbor_nodeIDs_string = Object.values(
    //     difference_nodeIDs_sorted
    //   ).map(({ key }) => key);
    //   sorted_neighbor_nodeIDs = sorted_neighbor_nodeIDs_string.map((str) => {
    //     return Number(str);
    //   });
    //   sorted_difference = Object.values(difference_nodeIDs_sorted).map(
    //     ({ value }) => value
    //   );

    //   console.log("sorted_difference", sorted_difference);
    //   console.log("sorted_neighbor_nodeIDs", sorted_neighbor_nodeIDs);
    //   //----------------------------- sorting ends here -----------------------------//
    // }

    // {round_number === 0 ? (
    //   <div id="renderTopN"> {this.renderTopN(sorted_difference, sorted_neighbor_nodeIDs, 2)} </div>
    // ) : (
    //   <div id="renderTopN"> {this.renderPrevFollowedPlayers(prevFollowedPlayers)} </div>
    // )}
    if (round_number === 0) {
      const renderContent = this.renderPrevFollowedPlayers(prevBaseConnections);
      this.setState({ content: renderContent });
    } else {
      const renderContent = this.renderPrevFollowedPlayers(prevFollowedPlayers);
      this.setState({ content: renderContent });
    }
  }

  render() {
    const { game, player } = this.props;
    const otherPlayers = game.players.filter((p) =>
      player.get("neighbors").includes(p.get("nodeId"))
    );
    if (otherPlayers.length === 0) {
      return null;
    }
    return <>{this.state.content}</>;
  }
}

function withinBucketConnections(bucket, followers, following, l) {
  ///loops over each person in the bucket
  for (var i = 0; i < bucket.length; i++) {
    ///create a pointer j that loops start from next person in the bucket
    var j = i + 1;
    var added = 0;
    // while added is less than limit of followers (3)
    // and added is less than total player within that bucket
    var k = 1000;
    while (added < l && added < bucket.length - 1) {
      k--;
      if (k <= 0) {
        return false;
      }
      ///if we are at the end of the bucket, then we go back to index 0 (to complete a circle)
      if (j >= bucket.length) {
        j = 0;
      }
      if (j == i) {
        console.log("unexpected error 1");
        break;
      }
      ///once we find an availbe person y to be followed by x
      /// we add y to the following list of x and we add x to the followers list of y
      followers[bucket[j]].push(bucket[i]);
      following[bucket[i]].push(bucket[j]);
      j++;
      added++;
    }
  }
  return true;
}
/////this function takes a person id (i) and a bucket number (l)
//// if one of the people n bucket l has less than 5 followers we make i follow them
//// and return true if no one is found with less than 5 we return false
function assign_i_to_one_in_l(buckets, followers, following, i, f, l) {
  for (var j = 0; j < buckets[l].length; j++) {
    if (
      followers[buckets[l][j]].length < f + 3 &&
      !following[i].includes(buckets[l][j])
    ) {
      followers[buckets[l][j]].push(i);
      following[i].push(buckets[l][j]);
      return true;
    }
  }
  return false;
}
///This function takes a person id i and their bucket number
/// it's supposed to make person i follow what they have left to follow from outside their buckets
/// which means that if person with id i followed 3 people from their
///bucket this function is going to make sure that we assign the other two from outside their bucket
function assign_to_i_random_dir(
  buckets,
  i,
  followers,
  following,
  bucket_no,
  f
) {
  ///first we create two pointers right for right direction and l for left dircetion
  /// r and l start on the buckets neighboring bucket that includes i

  var r = bucket_no + 1;
  var l = bucket_no - 1;

  ///we have the two variables noleft and noright, to indicate whether we can go further left and right or not
  ///we can't we go left or right? in these conditions:
  ///1- if we are out of range already: meaning left is at index -1 or right is at index 7
  /// if our person is in agreeing bucket (4,5,6) and left bucket is in disagreeing index: 2,1,0
  ///in this case we can't go any more left
  /// if our person is in disagreeing bucket (0,1,2) and right bucket is in agreeing index: 4,5,6
  ///in this case we can't go any more right
  var noleft = false;
  var noright = false;
  var k = 5000;
  while (true) {
    k--;
    if (k <= 0) {
      return false;
    }
    if (l < 0 || (l < 3 && bucket_no > 3)) {
      noleft = true;
    }
    if (r > 6 || (r > 3 && bucket_no < 3)) {
      noright = true;
    }
    var left = f - following[i].length;
    if (left == 0) {
      ///if person i already follows 5 people then we are done
      break;
    }
    if (noleft && noright) {
      //if we can't follow any more people with either less or more value to our answer, we just break
      ///leading to redo the algorithm
      break;
    } else if (noleft) {
      /// if we can't assign anyone from left direction we assign from right
      var found = assign_i_to_one_in_l(buckets, followers, following, i, f, r);
      if (!found) {
        ///if no one is found to be followed in bucket r we just go one more bucket to the right
        r++;
      }
    } else if (noright) {
      /// if we can't assign anyone from right direction we assign from left
      var found = assign_i_to_one_in_l(buckets, followers, following, i, f, l);
      if (!found) {
        ///if no one is found to be followed in bucket l we just go one more bucket to the left
        l--;
      }
    } else {
      ///if both left and right options are there we decide on random direction
      var ran = Math.random() > 0.5 ? true : false;
      if (ran) {
        var found = assign_i_to_one_in_l(
          buckets,
          followers,
          following,
          i,
          f,
          l
        );
        if (!found) {
          l--;
        }
      } else {
        var found = assign_i_to_one_in_l(
          buckets,
          followers,
          following,
          i,
          f,
          r
        );
        if (!found) {
          r++;
        }
      }
    }
  }
  return true;
}
///this funciton takes a whole bucket, loops over its members call a funciton to assign followers to each of them
function assign2(buckets, followers, following, bucket_no, f) {
  for (var i = 0; i < buckets[bucket_no].length; i++) {
    if (
      !assign_to_i_random_dir(
        buckets,
        buckets[bucket_no][i],
        followers,
        following,
        bucket_no,
        f
      )
    ) {
      return false;
    }
  }
  return true;
}
function assign(dir, buckets, followers, following, bucket_no, f) {
  for (var i = 0; i < buckets[bucket_no].length; i++) {
    var left = f - following[buckets[bucket_no][i]].length;
    var j = 0;
    var current_bucket = bucket_no + dir;
    var k = 10000;
    while (left > 0) {
      k--;
      if (k <= 0) {
        return false;
      }
      while (j >= buckets[current_bucket].length) {
        j = 0;
        current_bucket += dir;
        if (current_bucket > 6 || current_bucket < 0) {
          //console.log(current_bucket);
          //console.log("enecpexted error 2");
          break;
        }
      }
      if (current_bucket > 6 || current_bucket < 0) {
        //console.log("enecpexted error 3");
        left = 0;
        break;
      }
      if (followers[buckets[current_bucket][j]].length < f + 3) {
        left--;
        followers[buckets[current_bucket][j]].push(buckets[bucket_no][i]);
        following[buckets[bucket_no][i]].push(buckets[current_bucket][j]);
      }
      j++;
    }
  }
  return true;
}
////this the main function to start the algorithm
/// it takes the array of answers to form buckets and then start the algorithm
function alg2(answers, validNodeList, followers, following, n, f, l) {
  // console.log("answers", answers)
  // console.log("valids", validNodeList)
  const buckets = [];
  for (var i = 0; i < 7; i++) {
    buckets.push([]);
  }
  for (var i = 0; i < validNodeList.length; i++) {
    // console.log(answers[i], i)
    buckets[answers[i]].push(validNodeList[i]);
  }
  ////first step is to assign within bucket connections
  for (var i = 0; i < 7; i++) {
    // console.log("Loops: " + i + " times calling withinBucketConnections");
    // console.log("This is buckets[" + i + "] " + buckets[i]);
    var isValid = withinBucketConnections(buckets[i], followers, following, l);
    // if withinBucket returns false, we will return false right away.
    if (!isValid) {
      return false;
    }
    // console.log("this is followers: " + followers);
    // console.log("this is following: " + following);
  }
  ///Now we got to the extreme asnwers 0 and 6 and for each of them we assign people from neighboring buckets
  if (!assign(1, buckets, followers, following, 0, f)) {
    return false;
  }
  if (!assign(-1, buckets, followers, following, 6, f)) {
    return false;
  }
  ///then we go to bucket 3 as it's the nuetral option and have lesss constraints
  const visited = [true, false, false, false, false, false];
  var visited_no = 0;
  while (visited_no < 5) {
    var rand = Math.floor(Math.random() * 5) + 1;
    if (!visited[rand]) {
      visited[rand] = true;
      visited_no++;
      if (!assign2(buckets, followers, following, rand, f)) {
        return false;
      }
    }
  }
  // assign2(buckets, followers, following, 3, f);
  // ///then we visit the remaining buckets using assign2 method
  // assign2(buckets, followers, following, 1, f);
  // assign2(buckets, followers, following, 5, f);
  // assign2(buckets, followers, following, 4, f);
  // assign2(buckets, followers, following, 2, f);
  return true;
}
////function just to print the results
function printAll(following, answers, n) {
  for (var i = 0; i < n; i++) {
    console.log(
      i.toString() +
        ": ans: " +
        answers[i].toString() +
        " following:" +
        following[i].map(
          (k) => "(id:" + k.toString() + "_ans:" + answers[k].toString() + ")"
        )
    );
  }
}
///a function to calculate the cost: the cost of a current setup is the total number of missing followers
function cost(following, followers, n, f) {
  var cost = 0;
  for (var i = 0; i < n; i++) {
    cost += f - following[i].length;
  }
  return cost;
}

// n number of players
// f number of followers
// limit_within bucket
// answers = all players' likert scale responses
function Random_base_c(NodeLists, f) {
  const followers = [];
  const following = [];
  f = min(f, NodeLists.length - 1);
  for (var i = 0; i < NodeLists.length; i++) {
    followers.push([]);
    following.push([]);
  }
  for (var i = 0; i < NodeLists.length; i++) {
    var j = i + 1;
    for (var k = 0; k < f; k++) {
      if (j >= NodeLists.length) {
        j = 0;
      }
      following[i].push[j];
      followers[j].push[i];
      j++;
    }
  }
  const results = [following, followers];
  return results;
}

function add_more_assignments(
  following_temp,
  followers_temp,
  f,
  answers,
  validNodeList
) {
  const buckets = [];
  var added = false;
  for (var i = 0; i < 7; i++) {
    buckets.push([]);
  }
  for (var i = 0; i < validNodeList.length; i++) {
    // console.log(answers[i], i)
    buckets[answers[i]].push(validNodeList[i]);
  }
  const agrees = [];
  const neut = [];
  const disag = [];
  const not_complete = [];

  for (var i = 4; i < 7; i++) {
    for (var j = 0; j < buckets[i].length; j++) {
      disag.push(buckets[i][j]);
      if (following_temp[buckets[i][j]].length < f) {
        not_complete.push(buckets[i][j]);
      }
    }
  }
  for (var i = 2; i >= 0; i--) {
    for (var j = 0; j < buckets[i].length; j++) {
      agrees.push(buckets[i][j]);
      if (following_temp[buckets[i][j]].length < f) {
        not_complete.push(buckets[i][j]);
      }
    }
  }
  for (var j = 0; j < buckets[3].length; j++) {
    neut.push(buckets[3][j]);
    if (following_temp[buckets[3][j]].length < f) {
      not_complete.push(buckets[3][j]);
    }
  }
  // console.log("not_complete",not_complete)
  for (var i = 0; i < not_complete.length; i++) {
    if (agrees.includes(not_complete[i])) {
      if (agrees.length - 1 > following_temp[not_complete[i]].length) {
        var counter = 0;
        while (
          following_temp[not_complete[i]].length < f &&
          counter < agrees.length
        ) {
          if (
            !following_temp[not_complete[i]].includes(agrees[counter]) &&
            agrees[counter] != not_complete[i]
          ) {
            following_temp[not_complete[i]].push(agrees[counter]);
            followers_temp[agrees[counter]].push(not_complete[i]);
            added = true;
          }
          counter++;
        }
      }
      var k = 0;
      while (k < neut.length && following_temp[not_complete[i]].length < f) {
        if (
          !following_temp[not_complete[i]].includes(neut[k]) &&
          not_complete[i] != neut[k]
        ) {
          following_temp[not_complete[i]].push(neut[k]);
          followers_temp[neut[k]].push(not_complete[i]);
          added = true;
        }
        k++;
      }
      k = 0;
      while (
        k < disag.length &&
        following_temp[not_complete[i]].length < f - 2
      ) {
        following_temp[not_complete[i]].push(disag[k]);
        followers_temp[disag[k]].push(not_complete[i]);
        added = true;
        k++;
      }
    } else {
      if (disag.length - 1 > following_temp[not_complete[i]].length) {
        var counter = 0;
        while (
          following_temp[not_complete[i]].length < f &&
          counter < disag.length
        ) {
          if (
            !following_temp[not_complete[i]].includes(disag[counter]) &&
            disag[counter] != not_complete[i]
          ) {
            following_temp[not_complete[i]].push(disag[counter]);
            followers_temp[disag[counter]].push(not_complete[i]);
            added = true;
          }
          counter++;
        }
      }
      var k = 0;
      while (k < neut.length && following_temp[not_complete[i]].length < f) {
        if (
          !following_temp[not_complete[i]].includes(neut[k]) &&
          not_complete[i] != neut[k]
        ) {
          following_temp[not_complete[i]].push(neut[k]);
          followers_temp[neut[k]].push(not_complete[i]);
          added = true;
        }
        k++;
      }
      k = 0;
      while (
        k < agrees.length &&
        following_temp[not_complete[i]].length < f - 2
      ) {
        following_temp[not_complete[i]].push(agrees[k]);
        followers_temp[agrees[k]].push(not_complete[i]);
        added = true;
        k++;
      }
    }
  }
  return added;
}
function main_work(n, f, l, answers, validNodeList) {
  var t = 10000;

  // console.log("this is main work");
  console.log("this is answers: " + answers);
  console.log("thisis nodeIDvalid: " + validNodeList);
  var foundOne = false;
  // var foundOne = false;
  // supposed to be false
  while (t--) {
    ///we keep doing the algorithm until the cost of the result is zero (perfect assignment)
    var following_temp = [];
    var followers_temp = [];
    var minCost = 100000000;
    followers = [];
    following = [];
    for (var i = 0; i < n + 1; i++) {
      followers.push([]);
      following.push([]);
    }

    var isValid = alg2(answers, validNodeList, followers, following, n, f, l);
    if (isValid) {
      // if alg2 returned true, we will set foundOne to true and add more assignment
      foundOne = true;
    }
    // alg2 never returned true, so foundOne stays false. Meaning, we will do random assignment

    var cost1 = cost(following, followers, n, f);
    if (minCost > cost1) {
      minCost = cost1;
      followers_temp = followers;
      following_temp = following;
    }
    if (cost1 === 0) {
      break;
    }
  }

  // 0 1 2 3 4 5 6
  var results = [];
  if (t < 1) {
    // not perfect, but we can do more
    if (foundOne) {
      // not perfect, but valid. we try to see if we can add any more person on the same group
      var added = add_more_assignments(
        following_temp,
        followers_temp,
        f,
        answers,
        validNodeList
      );
      results.push(following_temp);
      results.push(followers_temp);
      if (added) {
        // we did add into not perfect
        results.push("added_more_assignments");
      } else {
        // we did not add into not perfect
        results.push("not perfect assignments and nothing added");
      }
      // console.log(results);
      console.log("Couldn't find perfect connections");
    } else {
      // not perfect, but not valid. So we just randomly assign
      console.log("random b c");
      var local_results = Random_base_c(validNodeList, f);
      results = local_results;
      results.push("random base connections");
    }
    //printAll(followers_temp, answers, n);
  } else {
    console.log("perfect");
    //printAll(following, answers, n);
    results.push(following);
    results.push(followers);
    results.push("perfect connections");
  }
  return results;
}

function connections_to_invalid_nodes(answers, invalidIds, validNodeList) {
  for (var i = 0; i < 7; i++) {
    buckets.push([]);
  }
  for (var i = 0; i < n; i++) {
    buckets[answers[i]].push(validNodeList[i]);
  }
  const connections = [];
  for (var i = 0; i < invalidIds.length; i++) {
    var rand = Math.random();
    var side = rand > 0.5 ? 0 : 6;
    var dir = rand > 0.5 ? 1 : -1;
    connections.push([]);
    var counter = 0;
    while (connections[i].length < 3) {
      if (side <= -1 || side >= 7) {
        break;
      }
      if (counter >= connections[i].length) {
        side += dir;
        counter = 0;
        continue;
      }
      connections[i].push(buckets[side][counter]);
    }
  }
  return connections;
}

function randomAssignment(array, number_of_connections, nodeID_of_player) {
  const result = [];
  if (!Array.isArray(array)) {
    // console.log("Input is not an array");
    return [];
  }
  if (array === null) {
    // console.log("Array is null");
    return [];
  }
  if (typeof Array === "undefined") {
    // console.log("Array is undefined");
    return [];
  }
  // if (array.length < 3) {
  //   throw new Error("Array length should be at least 3");
  // }
  else {
    // console.log("In pickNRandomElements: all checks are completed and it passed!");
    const copy = array.slice();
    while (result.length < number_of_connections) {
      const randomIndex = Math.floor(Math.random() * copy.length);
      // if (copy[randomIndex] !== nodeID_of_player) {
      //   const element = copy[randomIndex];
      //   copy.splice(randomIndex, 1);
      //   result.push(element); // so we're getting nodeIDs
      // }
      // if (copy[randomIndex] !== nodeID_of_player) {
      const element = copy[randomIndex];
      copy.splice(randomIndex, 1);
      result.push(element); // so we're getting nodeIDs
      // }
    }
    return result;
  }
}

export { main_work, randomAssignment };

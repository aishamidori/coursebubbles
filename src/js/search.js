var courses;
var searchFields = ["title", "description", "name"];

$(document).ready(function() {
  $.getJSON("../data/banner.json", function(data) {
    console.log(data);
    courses = TAFFY(data);
  });
});

function query(term, semester) {
  console.log("querying");
  if ((term == undefined) || (term.length == 0)) {
    return [];
  }
  var results = [];
  var terms = term.split(" ");
  var numTerms = terms.length;
  var numFields = searchFields.length;
  for (var i = 0; i < numFields; i++) {
    for (var j = 0; j < numTerms; j++) {
      var search = {};
      search[searchFields[i]] = {likenocase: terms[j]};
      var result = courses(search).get();
      results = results.concat(result);
    }
  }
  return rankResults(results);
}

function rankResults(results) {
  console.log("ranking results");
  var countedResults = {};
  var len = results.length;
  for (var i = 0; i < len; i++) {
    var result = results[i];
    if (countedResults[result] > 0) {
      countedResults[result] += 1;
    } else {
      countedResults[result] = 1;
    }
  }
  console.log("about to sort");
  return _.sortBy(results, function (result) {
    return countedResults[result];
  });
}


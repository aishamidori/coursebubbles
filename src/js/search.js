var courses;
var searchFields = ["title", "description", "name"];

$(document).ready(function() {
  $.getJSON("banner.json", function(data) {
    console.log(data);
    courses = TAFFY(data);
  });
});

function query(term, semester) {
  var results = [];
  var terms = term.split(" ");
  for (var i = 0; i < searchFields.length; i++) {
    for (var j = 0; j < terms.length; j++) {
      var search = {};
      search[searchFields[i]] = {likenocase: terms[j]};
      var result = courses(search).get();
      results = results.concat(result);
    }
  }
  return ranked = rankResults(results);
}

function rankResults(results) {
  var countedResults = {};
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (countedResults[result] > 0) {
      countedResults[result] += 1;
    } else {
      countedResults[result] = 1;
    }
  }
  return _.sortBy(results, function (result) {
    return countedResults[result];
  });
}


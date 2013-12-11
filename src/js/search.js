var courses;
var searchFields = ["title", "name", "description"];

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
  var results = {};
  var terms = [term].concat(term.split(" "));
  courseNum1 = /[A-Z]{4}\d{4}/g.exec(term);
  courseNum2 = /[a-z]{4}\d{4}/g.exec(term);
  console.log(courseNum1);
  console.log(courseNum2);
  if ((courseNum1 != null) && (courseNum1[0].length > 0)) {
    item = term.substring(0, 4) + " " + term.substring(4);
    terms.push(item);
    terms.unshift(item);
  } else if ((courseNum2 != null) && (courseNum2[0].length > 0)) {
    item = term.substring(0, 4).toUpperCase() + " " + term.substring(4);
    terms.push(item);
    terms.unshift(item);
  }
  var numTerms = terms.length;
  var numFields = searchFields.length;
  for (var i = 0; i < numFields; i++) {
    for (var j = 0; j < numTerms; j++) {
      var search = {};
      search[searchFields[i]] = {likenocase: terms[j]};
      var result = courses(search).get();
      results[(searchFields[i] + ":" + terms[j])] = result;
    }
  }
  return rankResults(results, semester);
}

function rankResults(results, semester) {
  var countedResults = {};
  var searches = Object.keys(results);
  var len = searches.length;
  var courseSet = [];
  for (var i = 0; i < len; i++) {
    //console.log("key = " + searches[i]);
    var search = results[searches[i]];
    //console.log(search);
    for (var j = 0; j < search.length; j++) {
      var result = search[j];
      //console.log("RESULT = " + result.name);
      if (result.name == "CSCI 2240") {
        //printCond(result, semester);
      }
      if (((result.semesters).length == 0)
          || ((result.semesters[0]).name.split(" ")[0] == semester.split(" ")[0]) 
          || (((result.semesters).length > 1)
            && ((result.semesters[1]).name.split(" ")[0] == semester.split(" ")[0]))) {
        //console.log("countedResults[" + result.name + "] = " countedResults[result.name]);
        if (countedResults[result.name] === undefined) {
          countedResults[result.name] = [];
          courseSet.push(result);
        }
        countedResults[result.name].push(searches[i]);
        //console.log("pushed " + searches[i]);
      }
    }
  }
  var toReturn = _.sortBy(courseSet, function (result) {
    return 100 - (countedResults[result.name]).length;
  });
  return toReturn;
}

var printCond = function(result, semester) {
  console.log("((result.semesters).length == 0) " + ((result.semesters).length == 0));
  console.log("((result.semesters[0]).name == semester) " + ((result.semesters[0]).name == semester));
  console.log("((result.semesters).length > 1) " + ((result.semesters).length > 1));
  console.log("((result.semesters[1]).name == semester) " + ((result.semesters[1]).name == semester));
  console.log(" 0 || 1 || (2 && 3) = " + (((result.semesters).length == 0)
          || ((result.semesters[0]).name == semester) 
          || (((result.semesters).length > 1)
            && ((result.semesters[1]).name == semester))));
} 


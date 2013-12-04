var numDisplayed = 3;
var courseBubbles;


function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "Law"},
                   {name: "Systems"},
                   {name: "Language"},
                   {name: "Computer"}
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "Economics"},
                   {name: "Gender"},
                   {name: "English"},
                   ])
      }
  ]);
  self.results = ko.observableArray([]);
  self.searchTerm = ko.observable("");
}

function addListeners() {
  $('.course').mousedown(function(e) {
    var rect = e.target.getBoundingClientRect();
    $("#course-add-er").removeClass("hidden-add-er");
    $("#course-add-er").css("top", rect.top - 150);
    $("#course-add-er").css("left", rect.right);
  });

  /*$('.course').mouseup(function(e) {
    console.log(e.target);
    //$(e.target).css("position", "relative");
  });*/
}

$(document).ready(function() {
  courseBubbles = new CourseBubbles();
  ko.applyBindings(courseBubbles); 
  addListeners();
  courseBubbles.searchTerm.subscribe(function(value) {
    console.log("searchTerm updated to " + value);
    var results = query(value, "Spring");
    console.log(results.length);
    courseBubbles.results(results.slice(0, 3));
    console.log(courseBubbles.results());
    console.log("done querying");
  });
});

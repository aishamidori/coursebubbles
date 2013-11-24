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
  self.searchResults = ko.observableArray([]);

  function updateResults(results) {
    searchResults(results);
  }

}

function addListeners() {
  $('.course').mousedown(function(e) {
    var rect = e.target.getBoundingClientRect();
    query($(e.target).text(), "Spring");
    $("#schedule").append(buildQueryBox());
    $(".course-add-er").css("top", rect.top - 150);
    $(".course-add-er").css("left", rect.right);
    $('.add-er-input').bind('input', function() { 
      alert("got query " + $(this).val()); // get the current value of the input field.
    });
  });

  /*$('.course').mouseup(function(e) {
    console.log(e.target);
    //$(e.target).css("position", "relative");
  });*/
}

function buildQueryBox() {
  return "<div class=\"course-add-er\">" 
      + "<h4 class=\"add-er-title\">Search for a course</h4>"
      + "<input class=\"add-er-input\" data-bind=\"value: searchTerm\"></input>"
      + "<div class=\"add-er-results\" data-bind=\"foreach: results\">"
        + "<p data-bind=\"name\"></p>"
      + "</div>"
    + "</div>";
}

$(document).ready(function() {
  courseBubbles = new CourseBubbles();
  ko.applyBindings(courseBubbles); 
  addListeners();
});

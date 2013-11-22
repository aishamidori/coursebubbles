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
}

function addListeners() {
  $('.course').mousedown(function(e) {
    console.log(e.target);
    // Query based on course name
    query($(e.target).text(), "Spring");
  });

  /*$('.course').mouseup(function(e) {
    console.log(e.target);
  });*/
}

$(document).ready(function() {
  ko.applyBindings(new CourseBubbles()); 
  addListeners();
});

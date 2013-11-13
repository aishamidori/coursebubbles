function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "CS1"},
                   {name: "CS2"},
                   {name: "CS3"},
                   {name: "CS4"}
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "CS5"},
                   {name: "CS6"},
                   {name: "CS7"},
                   ])
      },
      {name:"Fall '14", 
        courses: ko.observableArray([
                   {name: "CS8"},
                   {name: "CS9"},
                   {name: "CS10"},
                   {name: "CS11"}
                   ])}
  ]);
}

function addListeners() {
  $('.course').mousedown(function(e) {
    console.log(e.target);
    $(e.target).css("position", "absolute");
  });

  $('.course').mouseup(function(e) {
    console.log(e.target);
    $(e.target).css("position", "relative");
  });
}

$(document).ready(function() {
  ko.applyBindings(new CourseBubbles()); 
  addListeners();
});



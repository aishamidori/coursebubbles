var numDisplayed = 3;
var courseBubbles;


function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "Search"},
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "Search"},
                   ])
      }
  ]);
  self.results = ko.observableArray([]);
  self.searchTerm = ko.observable("");
  self.cart = ko.observableArray([
      {name: "Search"},
  ]);


  self.searchSemester = "";
  self.addCourse = function(result){
    if (self.searchSemester == "Cart") {
      search = self.cart.pop(); 
      self.cart.push(result);
      self.cart.push(search);
    }
    else {
      semester = _.find(courseBubbles.semesters(), function(sem) {
        console.log(sem);
        return (sem.name == self.searchSemester);
      });
      search = semester.courses.pop(); 
      semester.courses.push(result);
      semester.courses.push(search);
    }
    addListeners();
  };
}

function addListeners() {
  $('.course').mousedown(function(e) {
    console.log(e);
    if ($(e.currentTarget).hasClass("search")) {
      semester = $(e.currentTarget).parents('.semester');
      if ($(semester[0]).hasClass('semester')) {
        courseBubbles.searchSemester = $($(semester[0]).children('h2')[0]).text();
      } else {
        courseBubbles.searchSemester = "Cart";
      }
      var rect = e.target.getBoundingClientRect();
      $("#course-add-er").removeClass("hidden-add-er");
      $("#course-add-er").css("top", rect.top - 100);
      $("#course-add-er").css("left", rect.right);
    }
  });
  $("div.toggle").mousedown(function() {
    toggleCart();
  });
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
    //addCourse(courseBubbles.searchSemester, results[0]);
  });
});

function toggleCart(){
  $(".cart").css("display", ($(".cart").css("display") == "block" ? "none": "block"));
  $("#schedule").toggleClass("smallerSchedule");
  $(".cart").toggleClass("cartExpanded");
}

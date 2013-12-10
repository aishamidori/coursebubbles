var numDisplayed = 3;
var courseBubbles;

var previousCourses = [
    ["CLAS1120G", "CLPS0020", "FREN0600", "JUDS0050A"],
    ["CLPS0040", "CLPS0200", "CLPS0500", "ENGL0180", "TAPS0030"],
    ["CLPS0030", "CLPS0900", "CSCI0150", "ENGL1180B", "POLS1120"],
    ["CLPS1590", "CSCI0160", "CSCI0220", "POLS2025"],
    ["AFRI0570", "CSCI0081", "CSCI0330", "CSCI1950I", "MATH0520"]
  ];

function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
      {name:"Fall '11", 
        courses: ko.observableArray([
                   {name: "Search", 
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '12", 
        courses: ko.observableArray([
                   {name: "Search",
                    prereqs: ko.observable(false)}
                   ])
      },
      {name:"Fall '12", 
        courses: ko.observableArray([
                   {name: "Search", 
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '13", 
        courses: ko.observableArray([
                   {name: "Search",
                    prereqs: ko.observable(false)}
                   ])
      },
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "Search", 
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "Search",
                    prereqs: ko.observable(false)}
                   ])
      }
  ]);
  for (var i = 0; i < previousCourses.length; i++) {
    var semester = self.semesters()[i];
    console.log("semester " + i);
    var search = semester.courses.pop();
    var courses = previousCourses[i];
    var limit = courses.length;
    var resultingCourses = [];
    for (var j = 0; j < limit; j++) {
      resultingCourses.push({
        name: courses[j],
        prereqs: ko.observable(false)
      });
      console.log("adding course " + j);
    }
    semester.courses(resultingCourses);
    semester.courses.push(search);
    resultingCourses = [];
  }

  self.results = ko.observableArray([]);
  self.searchTerm = ko.observable("");
  self.cart = ko.observableArray([
      {name: "Search",
       prereqs: ko.observable(false)}
  ]);

  self.searchSemester = "";
  self.addCourse = function(result){
    //TODO: Do we want this to take you to more information first - like in the
    //mock ups?
    result.prereqs = ko.observable(false);
    if (alreadyInSchedule(result, self.searchSemester)) {
      alert("You've already added this course!");
      return;
    }
    if (self.searchSemester == "Cart") {
      var search = self.cart.pop(); 
      self.cart.push(result);
      self.cart.push(search);
    }
    else {
      var semester = _.find(courseBubbles.semesters(), function(sem) {
        return (sem.name == self.searchSemester);
      });
      if (!figurePrerequisites(result)) {
        console.log("doesn't have the prereqs!");
        result.prereqs(true);
      }
      var search = semester.courses.pop(); 
      semester.courses.push(result);
      semester.courses.push(search);

    }
    update(self.searchSemester);
    addListeners();
    $("#course-add-er").addClass("hidden-add-er");
    //TODO: Add checks for - prerequisites, already in cart
    //TODO: How to delete courses?
  };
}

function alreadyInSchedule(course) {
  var courses;
  if (courseBubbles.searchSemester == "Cart") {
    courses = courseBubbles.cart();
  } else {
    courses = _.find(courseBubbles.semesters(), function(sem) {
      return (sem.name == courseBubbles.searchSemester);
    }).courses();
  }
  console.log("courses = " + courses);
  return _.some(courses, function(found) { 
    return found == course; 
  });
}

function addListeners() {
  $('.course').mousedown(function(e) {
    if ($(e.currentTarget).hasClass("search")) {
      var semester = $(e.currentTarget).parents('.semester');
      if ($(semester[0]).hasClass('semester')) {
        courseBubbles.searchSemester = $($(semester[0]).children('h2')[0]).text();
      } else {
        courseBubbles.searchSemester = "Cart";
      }
      var rect = e.target.getBoundingClientRect();
      courseBubbles.searchTerm("");
      console.log(window.innerHeight);
      console.log(rect.top);
      var boxtop = Math.min(rect.top, window.innerHeight - 300);
      $("#course-add-er").css("top", boxtop);
      $("#course-add-er").css("left", rect.left);
      $("#course-add-er").removeClass("hidden-add-er");
    }
    //TODO: else { open window with more information about course
  });
}


$(document).ready(function() {
  courseBubbles = new CourseBubbles();
  ko.applyBindings(courseBubbles); 
  addListeners();
  courseBubbles.searchTerm.subscribe(function(value) {
    var results = query(value, "Spring");
    for (var i = 0; i < Math.min(results.length, 15); i++) {
      results[i].fullTitle = ko.computed(function() {
        return (this.name + ": " + this.title);
      }, results[i]);
    }
    console.log(results);
    courseBubbles.results(results.slice(0, 15));
  });
  $(".exit#course-exit").mousedown(function(e) {
    $("#course-add-er").addClass("hidden-add-er");
  });
  $(".exit#cart-exit").mousedown(function(e) {
    $("#schedule").toggleClass("smallerSchedule");
    $(".cart").toggleClass("cartExpanded");
    $(".toggle").toggleClass("toggleHide");
  });
  $("div.toggle").mousedown(function() {
    toggleCart();
  });

  $( '.sortable' ).sortable({
    connectWith: ".sortable"
  })
  $( '.sortable' ).disableSelection();
  //TODO: Why does dragging to the shopping cart make you scroll all the way
  //down? 
  //TODO: Why do courses bounce when you drag them? weird css issue...?
});

function toggleCart(){
  $("#schedule").toggleClass("smallerSchedule");
  $(".cart").toggleClass("cartExpanded");
  $(".toggle").toggleClass("toggleHide");
  //TODO:Make Shopping Cart button pretty!!
}

var prereqs = {
    "CSCI0330": [["CSCI0150", "CSCI0170", "CSCI0190"]],
    "CSCI0320": [["CSCI0150", "CSCI0170", "CSCI0190"]],
    "CSCI1230": [["CSCI0330", "CSCI0310"], ["CSCI0530", "MATH0520", "MATH0540"]],
    "CSCI2240": [["CSCI1230"]]
  };

function figurePrerequisites(course) {
  return true;
}

function update(changedSemester) {
  console.log("update called");
  var sem_history = courseBubbles.semesters();
  var courses_history = []
  var after = false;
  for (var i = 0; i < sem_history.length; i++) {
    sem = sem_history[i]; 
    console.log(sem.name);
    console.log(changedSemester);
    if (sem.name == changedSemester) {
      console.log("found added semester");
      after = true;
    } else if (after == true) {
      console.log("already passed added semester");
      var courses = sem.courses();
      for (var j = 0; j < courses.length; j++) {
        if (!figurePrerequisites(courses[j])) {
          courses[j].prereqs(true);
        } else {
          courses[j].prereqs(false);
        }
      }
    }
  }
}

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
                    sem: "Fall '11",
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '12", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '12",
                    prereqs: ko.observable(false)}
                   ])
      },
      {name:"Fall '12", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '12",
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '13", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '13",
                    prereqs: ko.observable(false)}
                   ])
      },
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '13",
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '14",
                    prereqs: ko.observable(false)}
                   ])
      },
      {name:"Fall '14", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '14",
                    prereqs: ko.observable(false)},
                   ])
      },
      {name:"Spring '15", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '15",
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
       sem: "Cart",
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
    $("#course-add-er").addClass("hidden-add-er");
    //TODO: Add checks for - prerequisites, already in cart
    //TODO: How to delete courses?
  };

  self.remove = function(course) {
    var semester = _.find(courseBubbles.semesters(), function(sem) {
      return (sem.name == courseBubbles.searchSemester);
    });
    //TODO: Add 'data-bind="click: remove"' to your removal button
    //TODO: remove course from semester
    
  }
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

var courseClick = function(course, e) {
  console.log(course);
  console.log(foo);
  if (course.name == "Search") {
    courseBubbles.searchSemester = course.sem;
    var rect = e.target.getBoundingClientRect();
    courseBubbles.searchTerm("");
    console.log(window.innerHeight);
    console.log(rect.top);
    var boxtop = Math.min(rect.top - 120, window.innerHeight - 300);
    $("#course-add-er").css("top", boxtop);
    $("#course-add-er").css("left", rect.left - 11);
    $("#course-add-er").removeClass("hidden-add-er");*/
  } else {
    // TODO: Pop up the course info box
  }
}

$(document).ready(function() {
  courseBubbles = new CourseBubbles();
  ko.applyBindings(courseBubbles); 
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
  //TODO: Why do courses bounce when you drag them? weird css issue...?
});

function toggleCart(){
  $("#schedule").toggleClass("smallerSchedule");
  $(".cart").toggleClass("cartExpanded");
  $(".toggle").toggleClass("toggleHide");
}

var prereqs = {
    "CSCI0330": [["CSCI0150", "CSCI0170", "CSCI0190"]],
    "CSCI0320": [["CSCI0150", "CSCI0170", "CSCI0190"]],
    "CSCI1230": [["CSCI0330", "CSCI0310"], ["CSCI0530", "MATH0520", "MATH0540"]],
    "CSCI2240": [["CSCI1230"]]
  };

function figurePrerequisites(course) {
  if (prereqs[course] == undefined) {
    return true;
  }
  var sem_history = courseBubbles.semesters();
  var courses_history = []
  for (var i = 0; i < sem_history.length; i++) {
    sem = sem_history[i]; 
    if (sem.name == courseBubbles.currentSemester) {
      break;
    }
    var courses = sem.courses();
    for (var j = 0; j < courses.length; j++) {
      courses_history.push(courses[j].name);
    }
  }
  return _.reduce(prereqs[course], function(result, or) {
    if (hasOr(or, courses_history)) {
      return result;
    } else {
      return false;
    };
  }, true);
}

function hasOr(or, history) {
  console.log("finding or " + or + " in history " + history);
  return (_.intersection(or, history).length > 0);
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

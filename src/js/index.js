var numDisplayed = 3;
var courseBubbles;

var previousCourses = [
    ["CLAS 1120G", "CLPS 0020", "FREN 0600", "JUDS 0050A"],
    ["CLPS 0040", "CLPS 0200", "CLPS 0500", "ENGL 0180", "TAPS 0030"],
    ["CLPS 0030", "CLPS 0900", "CSCI 0150", "ENGL 1180B", "POLS 1120"],
    ["CLPS 1590", "CSCI 0160", "CSCI 0220", "POLS 2025"],
    ["AFRI 0570", "CSCI 0081", "CSCI 0330", "CSCI 1950I", "MATH 0520"]
  ];

function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
      {name:"Fall '11", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '11",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Spring '12", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '12",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Fall '12", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '12",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Spring '13", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '13",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Fall '13", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '13",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Spring '14", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '14",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Fall '14", 
        courses: ko.observableArray([
                   {name: "Search", 
                    sem: "Fall '14",
                    prereqs: ko.observable(false),
                    missing: ""}
                   ])
      },
      {name:"Spring '15", 
        courses: ko.observableArray([
                   {name: "Search",
                    sem: "Spring '15",
                    prereqs: ko.observable(false),
                    missing: ""}
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
        prereqs: ko.observable(false),
        missing: ""
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
       prereqs: ko.observable(false),
       missing: ""}
  ]);

  self.searchSemester = "";
  self.addCourse = function(result){
    //TODO: Do we want this to take you to more information first - like in the
    //mock ups?
    result.prereqs = ko.observable(false);
    result.missing = "";
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
      var missing = figurePrerequisites(result);
      if (missing != true) {
        var msg = "Missing ";
        for (var i = 0; i < missing.length; i++) {
          msg += missing[i] + " or ";
        }
        result.missing = msg.substring(0, msg.length - 4);
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

var courseRemove = function(course, e) {
  var semester = _.find(courseBubbles.semesters(), function(sem) {
    return _.some(sem.courses(), function(currCourse) {
      return (course == currCourse);
    });
  });
  //TODO: remove course from semester
  semester.courses.remove(course);
  update(semester);
}
  

var courseClick = function(course, e) {
  console.log(course);
  if (course.name == "Search") {
    courseBubbles.searchSemester = course.sem;
    var rect = e.target.getBoundingClientRect();
    courseBubbles.searchTerm("");
    console.log(window.innerHeight);
    console.log(rect.top);
    var boxtop = Math.max(Math.min(rect.top - 120, window.innerHeight - 300), 30);
    $("#course-add-er").css("top", boxtop);
    $("#course-add-er").css("left", rect.left - 11);
    $("#course-add-er").removeClass("hidden-add-er");
  } else {
    var rect = e.target.getBoundingClientRect();
    var boxtop = Math.max(Math.min(rect.top - 120, window.innerHeight - 300), 30);
    $("#course-info-box").css("top", boxtop);
    $("#course-info-box").css("left", rect.left - 11);
    $("#course-info-box").removeClass("hidden-info");

    if (course.title === undefined) {
      course = _.find(query(course.name, "Spring").concat(query(course.name, "Fall")), function(howaboutthis) {
        return howaboutthis.name == course.name;
      });
      $(".course-info-title").text(course.name + ": " + course.title);
      $(".course-info-desc").text(course.description);
    } else {
      $(".course-info-title").text(course.name + ": " + course.title);
      $(".course-info-desc").text(course.description);
    }
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
  $(".exit#add-er-exit").mousedown(function(e) {
  courseBubbles.semesters.subscribe(function(value) {
    var lastSem = value[value.length];
    update(lastSem.courses()[lastSem.courses().length]);
  });
  $("#course-add-er").addClass("hidden-add-er");
  });
  $(".exit#cart-exit").mousedown(function(e) {
    $("#schedule").toggleClass("smallerSchedule");
    $(".cart").toggleClass("cartExpanded");
    $(".toggle").toggleClass("toggleHide");
  });
  $(".exit#course-info-exit").mousedown(function(e) {
    $("#course-info-box").addClass("hidden-info");
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
    "CSCI 0330": [["CSCI 0150", "CSCI 0170", "CSCI 0190"]],
    "CSCI 0320": [["CSCI 0150", "CSCI 0170", "CSCI 0190"]],
    "CSCI 1230": [["CSCI 0330", "CSCI 0310"], ["CSCI 0530", "MATH 0520", "MATH 0540"]],
    "CSCI 2240": [["CSCI 1230"]]
  };

function figurePrerequisites(course) {
  console.log("figuring out prereqs");
  console.log(course.name);
  if (prereqs[course.name] == undefined) {
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
  return _.reduce(prereqs[course.name], function(result, or) {
    if (hasOr(or, courses_history)) {
      return result;
    } else {
      console.log("didn't have or");
      console.log(or);
      return or;
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
        console.log(courses[j]);
        var missing = figurePrerequisites(courses[j]);
        if (missing != true) {
          console.log("didn't have prereqs");
          var msg = "Missing ";
          for (var k = 0; k < missing.length; k++) {
            msg += missing[k] + " or ";
          }
          result.missing = msg.substring(0, msg.length - 4);
          courses[j].prereqs(true);
        } else {
          console.log("had prereqs");
          courses[j].prereqs(false);
        }
      }
    }
  }
}

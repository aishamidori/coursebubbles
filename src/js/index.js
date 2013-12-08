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
    //TODO: Do we want this to take you to more information first - like in the
    //mock ups?
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
      if (figurePrerequisites(result)) {
        result.prereqs = true;
      } else {
        result.prereqs = false;
      }
      var search = semester.courses.pop(); 
      semester.courses.push(result);
      semester.courses.push(search);

    }
    addListeners();
    //TODO: Add checks for - prerequisites, already in cart
    //TODO: How to delete courses?
  };
}

function alreadyInSchedule(course) {
  var courses;
  if (courseBubbles.searchSemester == "Cart") {
    courses = self.cart();
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
      $("#course-add-er").css("top", rect.top - 100);
      $("#course-add-er").css("left", rect.right);
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

function figurePrerequisites(course) {
  var desc = course.description;
  var prereqIndex = desc.indexOf("Prerequisite");
  if (prereqIndex == -1) {
    return true;
  }

  var prerequisites = [];
  prereqIndex = desc.indexOf(" ", prereqIndex);
  var dept = desc.substring(prereqIndex + 1, prereqIndex + 5);

  var pattern = /\d{4}|or|and/gi;
  var toparse = desc.substring(prereqIndex + 6).match(pattern);
  var courses = [];
  for (var i = 0; i < toparse.length; i++) {
    switch (toparse[i]) {
      case "and":
        break;
      case "or":
        if (courses.length == 0) {
          toparse[i] = true;
        }
        courses.push(dept + toparse[i + 1]);
        var has = hasOr(courses);
        for (var j = i + 1 - courses.length; j < i + 2; j++) {  
          toparse[j] = has;
        }
        i++;
        courses = [];
        break;
      default:
        courses.push(dept + toparse[i]);
    }
  }
  return true;
}

function hasAnd(and, history) {
  return false;
}

function hasOr(or, history) {
  return true;
}

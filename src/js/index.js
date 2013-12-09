var numDisplayed = 3;
var courseBubbles;


function CourseBubbles() {
  var self = this;
  self.semesters = ko.observableArray([
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

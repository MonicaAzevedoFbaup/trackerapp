/*RAIN*/
var makeItRain = function() {
  //clear out everything
  $('.rain').empty();

  var increment = 0;
  var drops = "";
  var backDrops = "";

  while (increment < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
    //random number between 5 and 2
    var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
    //increment
    increment += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
  }

  $('.rain.front-row').append(drops);
  $('.rain.back-row').append(backDrops);
}

$('.splat-toggle.toggle').on('click', function() {
  $('body').toggleClass('splat-toggle');
  $('.splat-toggle.toggle').toggleClass('active');
  makeItRain();
});

$('.back-row-toggle.toggle').on('click', function() {
  $('body').toggleClass('back-row-toggle');
  $('.back-row-toggle.toggle').toggleClass('active');
  makeItRain();
});

$('.single-toggle.toggle').on('click', function() {
  $('body').toggleClass('single-toggle');
  $('.single-toggle.toggle').toggleClass('active');
  makeItRain();
});

makeItRain();

/*CALENDER*/

"use strict";

var xhr = new XMLHttpRequest();
var $item = $('#item');
var $bestBefore = $('#bestBefore');
var dataSet;

$(document).ready(function () {

 initialize();

 $(".date-picker").on("change", function () {
		 //jump to a specific month
 });

 $('#calendar').fullCalendar({
		 defaultDate: new Date(),
		 loading: function (bool) {
				 if (bool) $('#loading').show();
				 else $('#loading').hide();
		 },
		 eventRender: function (event, element) {
				 element.css('cursor', 'pointer'); //on hovering over events in calendar, hand pointer should appear not cursor
		 },
		 eventClick: function (calEvent, jsEvent, view) {
				 $('#itemId').val(calEvent.id);
				 $('#eitem').val(calEvent.title);
				 $('#ebestBefore').val(calEvent.start.format());
				 $(this).css('border-color', 'green');
				 showElem('#editForm');
				 $('#myTab li:eq(2) a').tab('show');
		 },
		 dayClick: function (date, jsEvent, view) {
				 $('#bestBefore').val(date.format());
				 $(this).css('background-color', 'pink');
				 $('#myTab li:eq(1) a').tab('show');
				 $('#item').focus();
		 },
		 events: function (start, end, timezone, callback) {
				 $.ajax({
						 url: "http://example.azure-mobile.net/tables/food?$filter=bestbefore gt '" + start.toISOString() + "' and bestbefore lt '" + end.toISOString() + "'&$orderby=bestbefore",
						 dataType: 'json',
						 beforeSend: setHeader,
						 success: function (data) {
								 var events = [];
								 $.each(data, function (i) {
										 var bbdate = data[i].bestbefore.split("T");
										 events.push({
												 "id": data[i].id,
												 "title": data[i].item,
												 "start": bbdate[0]
										 });

								 });
								 callback(events);
								 $('#tracker').empty();
								 $('#myTab #viewTab').tab('show');
								 listResults(events, "#tracker");
						 },
						 error: function () { toastr.error('') ; }
				 });
		 }
 });
});
//SEARCH
function searchItem(keyword) {
 $.getJSON("http://example.azure-mobile.net/tables/food?$filter=substringof('" + keyword + "',item)&$orderby=bestbefore", function (data) {
		 var events = [];
		 $.each(data, function (i) {
				 var bbdate = data[i].bestbefore.split("T");
				 events.push({
						 "id": data[i].id,
						 "title": data[i].item,
						 "start": bbdate[0]
				 });
		 });
		 listResults(events, "#results")
 });
}

function restPost(food) {
 $.ajax({
		 url: 'https://example.azure-mobile.net/tables/food',
		 type: 'POST',
		 datatype: 'json',
		 beforeSend: setHeader,
		 data: food,
		 success: function (data) {
				 toastr.success('Added ' + data.item);
		 },
		 error: function () { toastr.error(''); }
 });
}

function listResults(events, container) {
 var results = "";
 for (var i = 0; i < events.length; i++) {
		 var stuff = '[{  "id":"' + events[i].id + '", "title":"' + events[i].title + '" , "start":"' + events[i].start + '" }]';
		 results += "<li><a data-stuff='" + stuff + "' class='items clickable btn' data-editid='" + events[i].id + "' >Edit</a>&nbsp;|&nbsp;<a class='del clickable btn' data-deleteitem='" + events[i].title + "' data-deleteid='" + events[i].id + "' >Delete</a> | " + events[i].title + " X " + events[i].start + "</li>"
 }

 if (results == "") {
		 $(container).html("Nothing to show :-(");
 }
 else {
		 $(container).html(results);

		 $(".items").bind('click', function () {
				 var foodItem = $(this).data('stuff');
				 getItem.apply(this, foodItem);
				 showElem('#editForm');
				 $('#myTab li:eq(2) a').tab('show');

		 });

		 $(".del").bind('click', function () {
				 var delId = $(this).data("deleteid");
				 var delItem = $(this).data("deleteitem");
				 if (confirm('Are you sure you want to delete the record?')) {
						 deleteItem(delId, delItem);
				 }
		 });
 }
}
//UPDATE
function restPatch(food) {
 $.ajax({
		 url: 'https://example.azure-mobile.net/tables/food/' + food.id,
		 type: 'PATCH',
		 datatype: 'json',
		 beforeSend: setHeader,
		 data: food,
		 success: function (data) {
				 toastr.success('Edited ' + data.item);
		 },
		 error: function () { toastr.error('Operation failed! Please retry'); }
 });
}

//DELETE
function deleteItem(delId, delItem) {
 $.ajax({
		 url: 'https://example.azure-mobile.net/tables/food/' + delId,
		 type: 'DELETE',
		 success: function (result) {
				 toastr.success('Deleted ' + delItem);
				 $('#calendar').fullCalendar('refetchEvents');
		 },
		 error: function () { toastr.error(''); }
 });
}

$('#search').on('click', function (e) {
 searchItem($('#keyword').val());
});

$('#submit').on('click', function (e) {
 e.preventDefault();
 var food = {
		 item: $item.val(),
		 bestBefore: $bestBefore.val()
 };

 restPost(food);
 $('#calendar').fullCalendar('refetchEvents');
 $('#myTab li:eq(0) a').tab('show');
 resetForm('#editForm');
});

$('#update').on('click', function (e) {
 e.preventDefault();
 var food = {
		 id: $('#itemId').val(),
		 item: $('#eitem').val(),
		 bestBefore: $('#ebestBefore').val()
 };
 restPatch(food);
 $('#calendar').fullCalendar('refetchEvents');
 hideElem('#editForm');
 $('#myTab li:eq(0) a').tab('show');
 resetForm('#editForm');
});

$.ajaxSetup({
 headers: {
		 'X-ZUMO-APPLICATION': '--paste your APPLICATION KEY here--'
 }
});

function getItem(foodItem) {
 $('#itemId').val(foodItem.id);
 $('#eitem').val(foodItem.title);
 $('#ebestBefore').val(foodItem.start);
}

function setHeader(xhr) {
 xhr.setRequestHeader('X-ZUMO-APPLICATION', '--paste your APPLICATION KEY here--');
}

function initialize() {
 hideElem('#editForm');
 $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });
 $(".date-picker").datepicker();

 toastr.options.timeOut = 1500; // 1.5s
 toastr.options.closeButton = true;
 toastr.options.positionClass = "toast-top-right";
}

function showElem(elem) {
 $(elem).show();
}

function hideElem(elem) {
 $(elem).hide();
}

function resetForm(form) {
 $(form).find("input[type=text]").val("");
}

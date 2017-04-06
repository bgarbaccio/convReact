var date= new Date();

  day=date.getDate();
  var d;
  switch (date.getDay())
  {
    case 1: d = "Monday";
    break;

    case 2: d = "Tuesday";
    break;

    case 3: d = "Wednesday";
    break;

    case 4: d = "Thursday";
    break;

    case 5: d = "Friday";
    break;

    case 6: d = "Saturday";
    break;

    case 0: d = "Sunday";
    break;

    default: d = "erreur : " + d.getDay();
  }
  var m;
  switch (date.getMonth())
  {
    case 0: m = "january";
    break;

    case 1: m = "february";
    break;

    case 2: m = "march";
    break;

    case 3: m = "april";
    break;

    case 4: m = "may";
    break;

    case 5: m = "june";
    break;

    case 6: m = "july";
    break;

    case 7: m = "august";
    break;

    case 8: m = "september";
    break;

    case 9: m = "october";
    break;

    case 10: m = "november";
    break;

    case 11: m = "december";
    break;

    default: m = "erreur : " + d.getMonth();
  }
  var year= date.getFullYear();

  document.getElementById("date").innerHTML = d + " " + day + " " + m + " " + year;
  //document.getElementById("date").innerHTML= "hello";
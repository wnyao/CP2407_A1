"use strict";
var data = {};
var dataNums = [];
var dataLabels = [];
var sortedDatalabels = [];
var smallLetters = getAlphabets('a', 'z');

window.onload = function(){
  document.getElementById('fileinput').addEventListener('change', readFile);
  document.getElementById('canvas').innerHTML = drawBar(dataNums, smallLetters); //Display empty chart while webpage onload
};

function drawBar (data, labels)
/* This function will get two arrays as parameters and draw a bar graph using RGraph. */
{
    var bar = new RGraph.Bar({
        id: 'canvas',
        data: data,
        options: {
            textAccessible: true,
            labels: labels,
            tooltips: labels
        }
    }).draw()
}

function drawButton() {
  /* This function reset canvas and call function of drawBar() */
  RGraph.Reset(document.getElementById('canvas')); //Reset canvas to avoid overlapping
  drawBar(dataNums, dataLabels);
}

function sortButton() {
  /* This function will store sorted data numbers (number more than zero) within an array and get the
   * correct letter of each number into an array before passing it into 'drawBar' function
   */
  RGraph.Reset(document.getElementById('canvas')); //Reset canvas to avoid overlapping
  var sortedDataNumbers = sort(data);
  var sortedDataNumbers1 = [];

  for (var i = 0; i < sortedDataNumbers.length; i++) {
    if (sortedDataNumbers[i] == 0){ //Continue if occurrence is zero
      continue;
    } else {
      sortedDataNumbers1.push(sortedDataNumbers[i]); //Store data with value more than zero
      var dataKey = data.getkey(sortedDataNumbers[i]);
      sortedDatalabels.push(dataKey);
    }
  }
  drawBar(sortedDataNumbers1, sortedDatalabels);
  document.getElementById('content').innerHTML = "sortedDataNumbers: " + sortedDataNumbers; //testing
  document.getElementById('content1').innerHTML = "sortedDatalabels: " + sortedDatalabels; //testing
  sortedDatalabels = []; //Reset array to prevent overlapping labels used to draw graph
}
/*
Object.prototype.getkey = function(value) {
  /* This prototype property receives a value as parameter and return key that have the similar value
   * from the object.
   *
  var j = 0;

  for (var i = 0; i < smallLetters.length; i++) {
    if (this[smallLetters[i]] == value) {   //Loop throught object to find the correct key with the same value
      for (j; j <= sortedDatalabels.length; j++) {
        if (smallLetters[i] == sortedDatalabels[j]) { //Condition designed to avoid reappearance of keys with similar occurence
          j++;
          break;
        } else {
          return smallLetters[i]; //Return key that has not been recorded in 'sortedDatalabels'
        }
      }
    }
  }
};
*/

Object.prototype.getkey = function(value) {
  /* This prototype property receives a value as parameter and return key that have the similar value
   * from the object.
   */
  var j = 0;

  for (var i = 0; i < smallLetters.length; i++) {
    if (this[smallLetters[i]] == value) {   //Loop throught object to find the correct key with the same value
      return smallLetters[i]; //Return key that has not been recorded in 'sortedDatalabels'
    }
  }
};


function readFile(file){
  /* This function will first read file and alert user whether is file input loaded successfully. While
   * reader onload after file input successfully, it will count the occurrence of each letter within
   * the file content and store it within a dictionary and arrays, which are used to display graph
   */
  var f = file.target.files[0]; //The first of the FileList Object
  var reader = new FileReader();

  if (f){
    reader.onload = function(e){
      RGraph.Reset(document.getElementById('canvas')); //Reset canvas to avoid overlapping
      var content = e.target.result; //Text file content
      dataNums = [];  //Reset array
      dataLabels = []; //Reset array

      for (var i = 0; i < smallLetters.length; i++) {
        var occurrence = content.toLowerCase().count(smallLetters[i]); //Count number of occurrence of each letter within content
        data[smallLetters[i]] = occurrence; //Store occurrence of letter according to alphabetical order within dictionary of 'data'
        if(occurrence == 0){
          continue;
        } else {
          dataNums.push(occurrence);
          dataLabels.push(smallLetters[i]);
        }
      }
      alert("File loaded successfully");
      drawBar(dataNums, dataLabels);
    }
    reader.readAsText(f, "UTF-8");
  } else {
    alert("Failed to load file");
  }
}

String.prototype.count = function(letter) {
  /* This prototype property receives a letter as parameter and counts the occurence of the letter
   * within a string and return the count.
   */
  var count = 0;
  for(var i = 0; i < this.length; i++) {
    if(this[i] == letter){
      count++;
    }
  }
  return count;
};

function sort(dict) {
  /* This function will get a dictionary as parameter and stores the values of dictionary into an array
   * before sorted out the array from largest to smallest and return it.
   */
  var sortedValues1 = [];
	var sortedValues2 = [];
  for (var i = 0; i < smallLetters.length ; i++){
      sortedValues1.push(dict[smallLetters[i]]); //Storing dictionary values into an array
  }
  sortedValues1.sort(function(a, b){return b-a}); //Sort number in descending order
  /*
  for (var j = sortedValues1.length - 1; j >= 0; j--){
    	sortedValues2.push(sortedValues1[j]); //Reverse storing of data from sortedValues1
 	}*/
  return sortedValues1;
}

function getAlphabets(charA, charZ) {
  /* This function will get two letters as parameters and return sequence of Unicode values from
   * the first parameter to the second parameter based on the UTF-8 reference.
   */
    var alphabets = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0); //i: 97 j:122
    for (; i <= j; ++i) {
        alphabets.push(String.fromCharCode(i));
    }
    return alphabets;
}

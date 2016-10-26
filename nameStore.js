'use strict';

let names;
let namesMap;

/**
* Given a name and a list of matches, pick a match at random.
*/
const generateMatch = function generateMatch(name, toBeChosenArray) {
  let randomIndex = Math.floor(Math.random() * toBeChosenArray.length);
  let randomName = toBeChosenArray[randomIndex];
  return randomName;
};

const removeNameFromArray = function removeNameFromArray(name, array) {
  let copiedArray = array.map(a => a);
  let index = copiedArray.indexOf(name);
  if(index > -1) {
    copiedArray.splice(index,1);
  }
  return copiedArray;
}

/**
*
*/
const generateMatches = function generateMatches() {
  let toChooseArray = names.map(n => n);
  let toBeChosenArray = names.map(n => n);
  let map = {};

  for (let i = 0 ; i < toChooseArray.length; i++) {

      let arrayWithoutIthName = removeNameFromArray(toChooseArray[i],toBeChosenArray);
      if(arrayWithoutIthName.length === 0) {
        // Left with dud match :( start again
        console.log('left with dud match. restarting...');
        i = -1;
        toBeChosenArray = names.map(n => n);

      } else {
        let match = generateMatch( toChooseArray[i], arrayWithoutIthName);
        map[toChooseArray[i]] = match;
        toBeChosenArray.splice(toBeChosenArray.indexOf(match), 1);
      }

  }

  namesMap = map;
};

// Expect a string of comma delimited names.
module.exports.addNames = function addNames(namesString) {
  names = namesString.split(',')
    .map(name => name.trim());

  console.log('added names. Generating matches...');
  try {
    generateMatches();
  } catch (e) {
    console.log(e);
  }
  console.log('matches are:', namesMap);
}

// Return names array.
module.exports.getNames = function getNames() {
  return names;
}

module.exports.getMatch = function getMatch(name) {
  if(namesMap.hasOwnProperty(name)){
    return namesMap[name];
  }

  throw new Error('No name match found');

}

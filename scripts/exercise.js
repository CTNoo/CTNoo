const smallPause = 1;
const bigPause = 2;
const prepTime = 3;
const timeDelta = 10; // ms

// State
let setIndex = 0;
let excerciseIndex = 0;
let repetitionIndex = 0;
let timer = 0;
let breakTimer = 0;
let prepTimer = prepTime;
let interval = 0;
let totalTimer = 0;
let nextExercise = sets[0].exercises[1].name;
let nextDuration = sets[0].exercises[1].duration;
let done = 0;
const totalExerciseDuration = sets
  .map((set) => set.exercises.map(e => e.duration).reduce((a,b)=> a+b, 0))
  .reduce((a,b) => a + b, 0);
const totalBreakDuration = (sets.length-1)*bigPause + sets.length*(sets[0].exercises.length-1)*smallPause;
const totalDuration = totalExerciseDuration + totalBreakDuration + prepTime;

// Get references to html elements
const $container = $('.containerExercise');
const $exerciseTimer = $('.exercise-timer');
const $exerciseName = $('.exercise-name');
const $exerciseCounter = $('.exercise-counter');
const $exerciseProgressBarNib = $('.exercise-progress-bar .nib');
const $totalProgressBarNib = $('.total-progress-bar .nib');
const $nextcontainer = $('.containerNextExercise');
const $nextText = $('.next-exercise')
const $setCounter = $('.set-counter');
const $pauseBtn = $('button.pause');
const $playBtn = $('button.play');
const $donePicture = $('.donePicture');
$donePicture.hide();
$playBtn.hide();
$pauseBtn.show();
$pauseBtn.on('click', pause);
$playBtn.on('click', play);

function pause() {
  clearInterval(interval);
  
  $pauseBtn.hide();
  $playBtn.show();
}

function play() {
  interval = setInterval(update, timeDelta);
  
  $playBtn.hide();
  $pauseBtn.show();
}

function update() {

  // Do all timer things
  if (prepTimer>=0){
    doPrep();  
  } else if (breakTimer<=0) {
    doWork();
  } else {
    doBreak();
  }

  if (done == 0) {
    const set = sets[setIndex];
    const exercise = set.exercises[excerciseIndex];
    
    // Do all HTML update things
    if (prepTimer > 0) { // Prep
      $exerciseName.text('Prepare')
      $exerciseTimer.text((prepTimer).toFixed(1));
      $container
        .removeClass('break')
        .removeClass('working')
        .addClass('done');
      $exerciseProgressBarNib.css("width", "0%")
    } else if (breakTimer > 0) { // Break
      $exerciseName.text('Break')
      $exerciseTimer.text((breakTimer).toFixed(1));
      $container
        .removeClass('done')
        .removeClass('working')
        .addClass('break');
      $exerciseProgressBarNib.css("width", "0%")
    } else { // Exercise
      $exerciseName.text(exercise.name)
      $exerciseTimer.text((exercise.duration - timer).toFixed(1));
      
      $container
        .removeClass('done')
        .removeClass('break')
        .addClass('working');
      $exerciseProgressBarNib.css("width", (100*timer/exercise.duration) + '%')
    }
    $totalProgressBarNib.css("width", (100*totalTimer/totalDuration) + '%')
    $exerciseCounter.text("Exercise: " + (excerciseIndex+1).toFixed(0) + "/" + set.exercises.length);
    $nextText.text(nextExercise + " (" + nextDuration + "s)")

    $setCounter.text("Set: " + (setIndex+1).toFixed(0) + "/" + sets.length); // + " " + set.name);
  }
}


function doPrep() {
  prepTimer -= timeDelta*1e-3;
  totalTimer += timeDelta*1e-3;
  nextExercise = sets[0].exercises[0].name
  nextDuration = sets[0].exercises[0].duration
}


function doWork() {
  timer += timeDelta*1e-3;
  totalTimer += timeDelta*1e-3;

  $nextcontainer
  .removeClass('done')
  .removeClass('working')
  .addClass('break');

  if (excerciseIndex == sets[setIndex].exercises.length-1) {
    nextExercise = 'Break'
    nextDuration = bigPause
  } else{
    nextExercise = 'Break'
    nextDuration = smallPause
  }
  
  // End of exercise
  if (timer >= sets[setIndex].exercises[excerciseIndex].duration) {
    timer = 0;
    excerciseIndex += 1;
    breakTimer = smallPause;
    
    // End of set
    if (excerciseIndex >= sets[setIndex].exercises.length ) {
      excerciseIndex = 0;
      setIndex += 1;
      breakTimer = bigPause;
      
      // End of workout
      if (setIndex >= sets.length) {
        done=1;
        $exerciseName.text('');      
        
        $exerciseTimer.text('Done!');
        $exerciseTimer.text('Done!');$exerciseProgressBarNib.css("width", '0%')
        $nextText.text('');
        clearInterval(interval)
        $playBtn.hide();
        $pauseBtn.hide();
        $nextcontainer.hide()
        $donePicture.show()
        
        $container
        .removeClass('done')
        .removeClass('working')
        .addClass('break');
        confetti.start()
        return;
      } 
    } 
  } 
}


function doBreak(){
  breakTimer -= timeDelta*1e-3;
  totalTimer += timeDelta*1e-3;
  
  $nextcontainer
  .removeClass('done')
  .removeClass('break')
  .addClass('working');
  nextExercise = sets[setIndex].exercises[excerciseIndex].name
  nextDuration = sets[setIndex].exercises[excerciseIndex].duration

}
/*
// Get data from server CSV
fetch('exercises.csv')
  .then(response => response.text())
  .then(body => {
    const rows = body.split('\n').map(row => row.split(','));
    console.log(rows);
    
    // TODO: mangle data
    
    update();
    // pause();
    play();
  }); */
  
// Github pages allows this to be hosted on Github and be served as a webpage from there!!
// https://pages.github.com/
update();
// pause();
play();
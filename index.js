document.addEventListener('DOMContentLoaded', () => {
    const circleContainer = document.getElementById('circle-container');
    const startBtn = document.getElementById('start-btn');
    const backwardsBtn = document.getElementById('backwards-btn');
    const randomBtn = document.getElementById('random-btn');
    const rotationBtn = document.getElementById('rotation-btn');
    const flashBtn = document.getElementById('flash-btn');
    const nonConsecutiveBtn = document.getElementById('non-consecutive-btn');
    const progressionBtn = document.getElementById('progression-btn');
    const showAnswersBtn = document.getElementById('show-answers-btn');
    const levelDisplay = document.getElementById('level-display');
    const timerDisplay = document.getElementById('timer-display');
    const averageLevelDisplay = document.getElementById('average-level-display');
    const delayMessage = document.getElementById('delay-message');
    const levelInput = document.getElementById('level-input');
    const timerInput = document.getElementById('timer-input');
    const selectTimeInput = document.getElementById('select-time-input');
    const blueDistractorsInput = document.getElementById('blue-distractors-input');
    const randomDistractorsInput = document.getElementById('random-distractors-input');
    const speedInput = document.getElementById('speed-input');
    const delayInput = document.getElementById('delay-input');
    const rotationGroupsInput = document.getElementById('rotation-groups-input'); // Input for number of rotation groups

    let circles = [];
    let sequence = [];
    let displayedNumbers = []; // To track numbers displayed on circles
    let userSequence = [];
    let level = parseInt(levelInput.value, 10);  // Default level
    let interval;
    let animationInterval;
    let flashInterval;
    let selectionTimeout;
    let delayTimeout;
    let timer;
    let timeLeft = parseInt(timerInput.value, 10);  // Default timer value
    let selectTime = parseFloat(selectTimeInput.value) * 1000;  // Convert to milliseconds
    let blueDistractors = parseInt(blueDistractorsInput.value, 10);
    let randomDistractors = parseInt(randomDistractorsInput.value, 10);
    let speed = parseFloat(speedInput.value);
    let delayTime = parseFloat(delayInput.value) * 1000;  // Convert to milliseconds
    let backwardsMode = false;  // Backwards mode flag
    let randomMode = false;  // Random mode flag
    let rotationMode = 0;  // Rotation mode states: 0 - Normal, 1 - Rotation, 2 - Combination
    let flashMode = false;  // Flash mode flag
    let nonConsecutiveMode = false; // Non-consecutive mode flag
    let autoProgression = true; // Automatic level progression flag
    let showAnswers = true; // Show answers flag
    let distractorColors = ['orange', 'pink', 'purple', 'brown', 'cyan', 'gray'];
    let levelHistory = [];  // Track the levels the player has been on

    startBtn.addEventListener('click', startGame);
    backwardsBtn.addEventListener('click', () => { fullResetGame(); toggleBackwardsMode(); });
    randomBtn.addEventListener('click', () => { fullResetGame(); toggleRandomMode(); });
    rotationBtn.addEventListener('click', () => { fullResetGame(); toggleRotationMode(); });
    flashBtn.addEventListener('click', () => { fullResetGame(); toggleFlashMode(); });
    nonConsecutiveBtn.addEventListener('click', () => { fullResetGame(); toggleNonConsecutiveMode(); });
    progressionBtn.addEventListener('click', () => { fullResetGame(); toggleAutoProgression(); });
    showAnswersBtn.addEventListener('click', () => { fullResetGame(); toggleShowAnswers(); });
    levelInput.addEventListener('change', () => { fullResetGame(); updateLevel(); });
    timerInput.addEventListener('change', () => { fullResetGame(); updateTimer(); });
    selectTimeInput.addEventListener('change', () => { fullResetGame(); updateSelectTime(); });
    blueDistractorsInput.addEventListener('change', () => { fullResetGame(); updateBlueDistractors(); });
    randomDistractorsInput.addEventListener('change', () => { fullResetGame(); updateRandomDistractors(); });
    speedInput.addEventListener('change', () => { fullResetGame(); updateSpeed(); });
    delayInput.addEventListener('change', () => { fullResetGame(); updateDelayTime(); });
    rotationGroupsInput.addEventListener('change', () => { fullResetGame(); updateRotationGroups(); });

    function startGame() {
        console.log("Game started");
        level = parseInt(levelInput.value, 10);
        timeLeft = parseInt(timerInput.value, 10);
        selectTime = parseFloat(selectTimeInput.value) * 1000;
        blueDistractors = parseInt(blueDistractorsInput.value, 10);
        randomDistractors = parseInt(randomDistractorsInput.value, 10);
        speed = parseFloat(speedInput.value);
        delayTime = parseFloat(delayInput.value) * 1000;
        fullResetGame();
        createCircles();
        if (rotationMode === 1) {
            animateCirclesInRotation();
        } else if (rotationMode === 2) {
            animateCirclesInCombination();
        } else {
            animateCircles();
        }
        if (flashMode) {
            startFlashMode();
        }
        selectionTimeout = setTimeout(selectCircles, 1000);  // Delay before starting the selection process
    }

    function fullResetGame() {
        console.log("Full game reset");
        clearTimeout(selectionTimeout);
        clearTimeout(delayTimeout);
        clearInterval(interval);
        clearInterval(animationInterval);
        clearInterval(flashInterval);
        clearInterval(timer);
        resetGame();
        delayMessage.style.display = 'none';  // Hide delay message
        circles.forEach(circle => {
            const newCircle = circle.cloneNode(true);
            circle.replaceWith(newCircle);
        });
    }

    function resetGame() {
        console.log("Game reset");
        circles.forEach(circle => circle.remove());
        circles = [];
        sequence = [];
        displayedNumbers = [];
        userSequence = [];
        timerDisplay.textContent = `Timer: ${timeLeft}s`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    function createCircles() {
        console.log("Creating circles");
        const totalBlueBalls = level + blueDistractors; // Level balls + blue distractors
        const totalCircles = totalBlueBalls + randomDistractors;

        // Create circles
        for (let i = 0; i < totalCircles; i++) {
            const circle = document.createElement('div');
            circle.classList.add('circle');

            if (i < level) {
                // Game balls
            } else if (i < totalBlueBalls) {
                // Blue distractors
                circle.classList.add('distractor');
                circle.style.backgroundColor = 'blue';
            } else {
                // Random colored distractors
                circle.classList.add('distractor');
                circle.style.setProperty('--color', distractorColors[i % distractorColors.length]);
            }

            circles.push(circle);
        }

        // Shuffle circles to mix blue and distractors
        shuffleArray(circles);

        // Add circles to the container
        circles.forEach(circle => {
            circle.style.left = `${Math.random() * 300}px`;
            circle.style.top = `${Math.random() * 300}px`;
            circleContainer.appendChild(circle);
        });

        if (rotationMode === 1) {
            const radius = 150;
            const centerX = 300;
            const centerY = 300;
            const angleStep = (2 * Math.PI) / circles.length;
            circles.forEach((circle, index) => {
                const angle = index * angleStep;
                circle.style.left = `${centerX + radius * Math.cos(angle) - 15}px`;
                circle.style.top = `${centerY + radius * Math.sin(angle) - 15}px`;
            });
        }
    }

    function animateCircles() {
        console.log("Animating circles");
        const velocities = circles.map(() => ({
            x: (Math.random() * 2 - 1) * speed,
            y: (Math.random() * 2 - 1) * speed
        }));
        animationInterval = setInterval(() => {
            circles.forEach((circle, i) => {
                let left = parseFloat(circle.style.left);
                let top = parseFloat(circle.style.top);
                left += velocities[i].x;
                top += velocities[i].y;

                // Bounce off walls
                if (left <= 0 || left >= 300) velocities[i].x *= -1;
                if (top <= 0 || top >= 300) velocities[i].y *= -1;

                // Bounce off other circles
                for (let j = 0; j < circles.length; j++) {
                    if (i !== j) {
                        const dx = left - parseFloat(circles[j].style.left);
                        const dy = top - parseFloat(circles[j].style.top);
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 30) {
                            const angle = Math.atan2(dy, dx);
                            const speed1 = Math.sqrt(velocities[i].x * velocities[i].x + velocities[i].y * velocities[i].y);
                            const speed2 = Math.sqrt(velocities[j].x * velocities[j].x + velocities[j].y * velocities[j].y);
                            velocities[i].x = speed2 * Math.cos(angle);
                            velocities[i].y = speed2 * Math.sin(angle);
                            velocities[j].x = speed1 * Math.cos(angle + Math.PI);
                            velocities[j].y = speed1 * Math.sin(angle + Math.PI);
                        }
                    }
                }

                circle.style.left = `${left}px`;
                circle.style.top = `${top}px`;
            });
        }, 20);
    }

    function animateCirclesInRotation() {
        console.log("Animating circles in rotation");
        const radius = 70;
        const centerX = 170;
        const centerY = 160;
        const groups = parseInt(rotationGroupsInput.value, 10);
        const groupRadiusIncrement = 25;  // Increment radius for each group
        let angleOffsets = Array(groups).fill(0);
        const speeds = Array.from({ length: groups }, () => speed * (Math.random() * 1 + 0.5));  // Random speed between 50-150% of the speed
        const directions = Array.from({ length: groups }, () => Math.random() < 0.5 ? 1 : -1);  // Random directions for each group

        animationInterval = setInterval(() => {
            circles.forEach((circle, index) => {
                const group = index % groups;
                const groupRadius = radius + group * groupRadiusIncrement;
                const angleStep = (2 * Math.PI) / Math.ceil(circles.length / groups);
                const angle = angleOffsets[group] * directions[group] + (index / groups) * angleStep;
                circle.style.left = `${centerX + groupRadius * Math.cos(angle) - 15}px`;
                circle.style.top = `${centerY + groupRadius * Math.sin(angle) - 15}px`;
            });
            angleOffsets = angleOffsets.map((offset, group) => offset + speeds[group] * 0.01);
        }, 20);
    }

    function animateCirclesInCombination() {
        console.log("Animating circles in combination");
        const radius = 60;
        const centerX = 170;
        const centerY = 160;
        const groups = parseInt(rotationGroupsInput.value, 10);
        const groupRadiusIncrement = 25;  // Increment radius for each group
        let angleOffsets = Array(groups).fill(0);
        const speeds = Array.from({ length: groups }, () => speed * (Math.random() * 1 + 0.5));  // Random speed between 50-150% of the speed
        const directions = Array.from({ length: groups }, () => Math.random() < 0.5 ? 1 : -1);  // Random directions for each group
        const halfCircles = Math.floor(circles.length / 2);
        const velocities = circles.map(() => ({
            x: (Math.random() * 2 - 1) * speed,
            y: (Math.random() * 2 - 1) * speed
        }));

        animationInterval = setInterval(() => {
            circles.forEach((circle, index) => {
                if (index < halfCircles) {
                    const group = index % groups;
                    const groupRadius = radius + group * groupRadiusIncrement;
                    const angleStep = (2 * Math.PI) / Math.ceil(halfCircles / groups);
                    const angle = angleOffsets[group] * directions[group] + (index / groups) * angleStep;
                    circle.style.left = `${centerX + groupRadius * Math.cos(angle) - 15}px`;
                    circle.style.top = `${centerY + groupRadius * Math.sin(angle) - 15}px`;
                } else {
                    let left = parseFloat(circle.style.left);
                    let top = parseFloat(circle.style.top);
                    left += velocities[index].x;
                    top += velocities[index].y;

                    // Bounce off walls
                    if (left <= 0 || left >= 300) velocities[index].x *= -1;
                    if (top <= 0 || top >= 300) velocities[index].y *= -1;

                    // Bounce off other circles
                    for (let j = 0; j < circles.length; j++) {
                        if (index !== j) {
                            const dx = left - parseFloat(circles[j].style.left);
                            const dy = top - parseFloat(circles[j].style.top);
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < 30) {
                                const angle = Math.atan2(dy, dx);
                                const speed1 = Math.sqrt(velocities[index].x * velocities[index].x + velocities[index].y * velocities[index].y);
                                const speed2 = Math.sqrt(velocities[j].x * velocities[j].x + velocities[j].y * velocities[j].y);
                                velocities[index].x = speed2 * Math.cos(angle);
                                velocities[index].y = speed2 * Math.sin(angle);
                                velocities[j].x = speed1 * Math.cos(angle + Math.PI);
                                velocities[j].y = speed1 * Math.sin(angle + Math.PI);
                            }
                        }
                    }

                    circle.style.left = `${left}px`;
                    circle.style.top = `${top}px`;
                }
            });
            angleOffsets = angleOffsets.map((offset, group) => offset + speeds[group] * 0.01);
        }, 20);
    }

    function selectCircles() {
        console.log("Selecting circles");
        let selected = 0;
        const numbers = nonConsecutiveMode ? generateNonConsecutiveNumbers(level) : Array.from({ length: level }, (_, i) => i + 1); // Generate non-consecutive or consecutive numbers
        if (randomMode) {
            shuffleArray(numbers);
        }
        const selectNext = () => {
            if (selected > 0) {
                circles[sequence[selected - 1]].textContent = '';
                circles[sequence[selected - 1]].style.backgroundColor = 'blue';
            }
            if (selected < level) {
                let index;
                let distractorIndex;
                do {
                    index = Math.floor(Math.random() * circles.length);  // Select from all circles
                } while (sequence.includes(index) || circles[index].classList.contains('distractor'));
                circles[index].style.backgroundColor = 'red';
                circles[index].textContent = numbers[selected];
                displayedNumbers.push(numbers[selected]); // Store the displayed number
                sequence.push(index);

                if (blueDistractors > 0 || randomDistractors > 0) {
                    do {
                        distractorIndex = Math.floor(Math.random() * circles.length);  // Select from all circles
                    } while (distractorIndex === index || !circles[distractorIndex].classList.contains('distractor') || sequence.includes(distractorIndex));
                    circles[distractorIndex].style.backgroundColor = 'red'; // Fake red selection for distractor
                    setTimeout(() => {
                        circles[distractorIndex].style.backgroundColor = 'blue'; // Revert back to blue
                    }, selectTime);
                }

                selected++;
                setTimeout(selectNext, selectTime);
            } else {
                delayMessage.style.display = 'block';  // Show delay message

                delayTimeout = setTimeout(() => {
                    clearInterval(animationInterval); // Stop circles from moving
                    if (flashMode) {
                        clearInterval(flashInterval);
                        circles.forEach(circle => {
                            circle.style.visibility = 'visible';
                        });
                    }
                    circles.forEach(circle => circle.style.transition = 'none'); // Stop circles from moving

                    delayMessage.style.display = 'none';  // Hide delay message
                    startTimer();
                    circles.forEach((circle, idx) => {
                        circle.addEventListener('click', () => selectCircle(idx));
                    });
                }, delayTime);
            }
        };
        selectNext();
    }

    function generateNonConsecutiveNumbers(count) {
        const numbers = [];
        let currentNumber = Math.floor(Math.random() * 5) + 1; // Start with a random number between 1 and 5
        for (let i = 0; i < count; i++) {
            numbers.push(currentNumber);
            currentNumber += Math.floor(Math.random() * 10) + 2; // Add a random number between 2 and 11
        }
        return numbers;
    }

    function selectCircle(index) {
        console.log("Circle selected:", index);
        if (userSequence.includes(index)) return;
        circles[index].style.backgroundColor = 'yellow';
        userSequence.push(index);
        if (userSequence.length === sequence.length) {
            checkSequence();
        }
    }

    function checkSequence() {
        console.log("Checking sequence");
        let correct = true;
        let correctSequence;
        if (randomMode) {
            // Create the correct sequence based on numbers displayed on circles
            correctSequence = sequence.slice().sort((a, b) => displayedNumbers[sequence.indexOf(a)] - displayedNumbers[sequence.indexOf(b)]);
            if (backwardsMode) {
                correctSequence.reverse();
            }
        } else {
            correctSequence = backwardsMode ? sequence.slice().reverse() : sequence;
        }
        for (let i = 0; i < correctSequence.length; i++) {
            if (userSequence[i] !== correctSequence[i]) {
                correct = false;
                break;
            }
        }

        if (correct) {
            alert('Correct! Proceeding to the next level.');
            levelHistory.push(level);  // Track the current level
            updateAverageLevel();
            if (autoProgression) {
                level++;
            }
            levelInput.value = level;
            startGame();
        } else {
            if (showAnswers) {
                alert('Incorrect. Showing correct sequence.');
                showCorrectSequence(() => {
                    levelHistory.push(level);  // Track the current level
                    updateAverageLevel();
                    if (autoProgression) {
                        level = Math.max(1, level - 1);
                    }
                    levelInput.value = level;
                    startGame();
                });
            } else {
                alert('Incorrect. Proceeding to the next level.');
                levelHistory.push(level);  // Track the current level
                updateAverageLevel();
                if (autoProgression) {
                    level = Math.max(1, level - 1);
                }
                levelInput.value = level;
                startGame();
            }
        }
    }

    function showCorrectSequence(callback) {
        console.log("Showing correct sequence");
        sequence.forEach((index, i) => {
            circles[index].textContent = displayedNumbers[i];
            circles[index].style.backgroundColor = 'green';
        });
        setTimeout(() => {
            sequence.forEach(index => {
                circles[index].textContent = '';
                circles[index].style.backgroundColor = 'blue';
            });
            callback();
        }, 3000); // Show the correct sequence for 3 seconds
    }

    function startTimer() {
        console.log("Starting timer");
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Timer: ${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timer);
                alert('Time is up! Game Over.');
                levelHistory.push(level);  // Track the current level
                updateAverageLevel();
                if (autoProgression) {
                    level = Math.max(1, level - 1);
                }
                levelInput.value = level;
                startGame();
            }
        }, 1000);
    }

    function toggleBackwardsMode() {
        backwardsMode = !backwardsMode;
        backwardsBtn.textContent = backwardsMode ? 'Normal Mode' : 'Backwards Mode';
        console.log(`Backwards mode: ${backwardsMode}`);
    }

    function toggleRandomMode() {
        randomMode = !randomMode;
        randomBtn.textContent = randomMode ? 'Normal Mode' : 'Random Mode';
        console.log(`Random mode: ${randomMode}`);
    }

    function toggleRotationMode() {
        rotationMode = (rotationMode + 1) % 3;
        if (rotationMode === 0) {
            rotationBtn.textContent = 'Normal Mode';
            rotationGroupsInput.style.display = 'none'; // Hide rotation groups input
            rotationGroupsInput.previousElementSibling.style.display = 'none'; // Hide the label for rotation groups input
        } else if (rotationMode === 1) {
            rotationBtn.textContent = 'Rotation Mode';
            rotationGroupsInput.style.display = 'block'; // Show rotation groups input
            rotationGroupsInput.previousElementSibling.style.display = 'block'; // Show the label for rotation groups input
        } else {
            rotationBtn.textContent = 'Combination Mode';
            rotationGroupsInput.style.display = 'block'; // Show rotation groups input
            rotationGroupsInput.previousElementSibling.style.display = 'block'; // Show the label for rotation groups input
        }
        console.log(`Rotation mode: ${rotationMode}`);
    }

    function toggleFlashMode() {
        flashMode = !flashMode;
        flashBtn.textContent = flashMode ? 'Normal Mode' : 'Flash Mode';
        console.log(`Flash mode: ${flashMode}`);
    }

    function toggleNonConsecutiveMode() {
        nonConsecutiveMode = !nonConsecutiveMode;
        nonConsecutiveBtn.textContent = nonConsecutiveMode ? 'Consecutive Mode' : 'Non-Consecutive Mode';
        console.log(`Non-consecutive mode: ${nonConsecutiveMode}`);
    }

    function toggleAutoProgression() {
        autoProgression = !autoProgression;
        progressionBtn.textContent = autoProgression ? 'Auto Progression: On' : 'Auto Progression: Off';
        console.log(`Auto progression: ${autoProgression}`);
    }

    function toggleShowAnswers() {
        showAnswers = !showAnswers;
        showAnswersBtn.textContent = showAnswers ? 'Show Answers: On' : 'Show Answers: Off';
        console.log(`Show answers: ${showAnswers}`);
    }

    function updateLevel() {
        level = parseInt(levelInput.value, 10);
        levelDisplay.textContent = `Level: ${level}`;
    }

    function updateTimer() {
        timeLeft = parseInt(timerInput.value, 10);
        timerDisplay.textContent = `Timer: ${timeLeft}s`;
    }

    function updateSelectTime() {
        selectTime = parseFloat(selectTimeInput.value) * 1000;
    }

    function updateBlueDistractors() {
        blueDistractors = parseInt(blueDistractorsInput.value, 10);
    }

    function updateRandomDistractors() {
        randomDistractors = parseInt(randomDistractorsInput.value, 10);
    }

    function updateSpeed() {
        speed = parseFloat(speedInput.value);
    }

    function updateDelayTime() {
        delayTime = parseFloat(delayInput.value) * 1000;
    }

    function updateRotationGroups() {
        const groups = parseInt(rotationGroupsInput.value, 10);
        rotationGroupsInput.value = Math.max(1, Math.min(groups, 4)); // Ensure value is between 1 and 4
    }

    function updateAverageLevel() {
        const totalLevels = levelHistory.reduce((sum, lvl) => sum + lvl, 0);
        const averageLevel = (totalLevels / levelHistory.length).toFixed(1);
        averageLevelDisplay.textContent = `Average Level: ${averageLevel}`;
    }

    function startFlashMode() {
        console.log("Starting flash mode");
        flashInterval = setInterval(() => {
            const numCirclesToFlash = Math.floor(Math.random() * (circles.length / 2)) + 1;  // Random number of circles to flash
            const circlesToFlash = [];

            for (let i = 0; i < numCirclesToFlash; i++) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * circles.length);
                } while (circlesToFlash.includes(randomIndex));
                circlesToFlash.push(randomIndex);
            }

            circlesToFlash.forEach(index => {
                const circle = circles[index];
                const originalColor = circle.style.backgroundColor;
                const originalLeft = circle.style.left;
                const originalTop = circle.style.top;

                circle.style.visibility = 'hidden';

                if (!rotationMode) {
                    // Freeze the circle in place
                    circle.style.left = originalLeft;
                    circle.style.top = originalTop;
                }

                setTimeout(() => {
                    circle.style.visibility = 'visible';
                }, 500);  // Make the circle visible again after 500ms
            });
        }, 2000);  // Repeat the process every 2 seconds
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
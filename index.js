document.addEventListener('DOMContentLoaded', () => {

    function loadModal() {
        fetch('../Settings/settings-modal.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('modal-container').innerHTML = data;

                // Inject CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '../Settings/settings-modal.css';
                document.head.appendChild(link);

                // Initialize modal functionality after content is loaded
                initializeModal();
            });
    }

    function initializeModal() {
        console.log("Initializing modal");

        // Get the modal
        let modal = document.getElementById("settingsModal");

        // Get the button that opens the modal
        let openModalBtn = document.getElementById("settingsBtn");

        // Get the <span> element that closes the modal
        let closeModalBtn = document.getElementById("closeBtn");

        // When the user clicks on the button, open the modal
        openModalBtn.onclick = () => {
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
        };

        // When the user clicks on <span> (x), close the modal
        closeModalBtn.onclick = () => {
            modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        // Initialize settings and event listeners
        initializeSettings();
    }

    function initializeSettings() {
        console.log("Initializing settings");

        const settings = {
            spanTypes: {
                forwards: false,
                backwards: false,
                sequencing: false
            },
            movementTypes: {
                normal: false,
                rotation: false
            },
            flashMode: false,
            consecutiveMode: true,
            autoProgression: true,
            showAnswers: true,
            level: 3,
            timer: 30,
            selectTime: 1,
            randomDistractors: 5,
            speed: 1,
            delayTime: 2,
            rotationGroups: 1
        };

        function loadSettings() {
            console.log("Loading settings from local storage");
            const savedSettings = JSON.parse(localStorage.getItem('settings'));
            if (savedSettings) {
                console.log("Saved settings found:", savedSettings);
                Object.assign(settings, savedSettings);
            } else {
                console.log("No saved settings found, using default settings");
            }
            applySettings();
        }

        function applySettings() {
            console.log("Applying settings:", settings);
            document.getElementById('forwards-btn').checked = settings.spanTypes.forwards;
            document.getElementById('backwards-btn').checked = settings.spanTypes.backwards;
            document.getElementById('sequencing-btn').checked = settings.spanTypes.sequencing;

            document.getElementById('normal-btn').checked = settings.movementTypes.normal;
            document.getElementById('rotation-btn').checked = settings.movementTypes.rotation;

            document.getElementById('flash-btn').textContent = `Flash Mode: ${settings.flashMode ? 'On' : 'Off'}`;
            document.getElementById('consecutive-btn').textContent = `Consecutive Mode: ${settings.consecutiveMode ? 'On' : 'Off'}`;
            document.getElementById('progression-btn').textContent = `Auto Progression: ${settings.autoProgression ? 'On' : 'Off'}`;
            document.getElementById('show-answers-btn').textContent = `Show Answers: ${settings.showAnswers ? 'On' : 'Off'}`;

            document.getElementById('level-input').value = settings.level;
            document.getElementById('timer-input').value = settings.timer;
            document.getElementById('select-time-input').value = settings.selectTime;
            document.getElementById('random-distractors-input').value = settings.randomDistractors;
            document.getElementById('speed-input').value = settings.speed;
            document.getElementById('delay-input').value = settings.delayTime;
            document.getElementById('rotation-groups-input').value = settings.rotationGroups;
        }

        function saveSettings() {
            console.log("Saving settings");
            settings.spanTypes.forwards = document.getElementById('forwards-btn').checked;
            settings.spanTypes.backwards = document.getElementById('backwards-btn').checked;
            settings.spanTypes.sequencing = document.getElementById('sequencing-btn').checked;

            settings.movementTypes.normal = document.getElementById('normal-btn').checked;
            settings.movementTypes.rotation = document.getElementById('rotation-btn').checked;

            settings.flashMode = document.getElementById('flash-btn').textContent.includes('On');
            settings.consecutiveMode = document.getElementById('consecutive-btn').textContent.includes('On');
            settings.autoProgression = document.getElementById('progression-btn').textContent.includes('On');
            settings.showAnswers = document.getElementById('show-answers-btn').textContent.includes('On');

            settings.level = parseInt(document.getElementById('level-input').value, 10);
            settings.timer = parseInt(document.getElementById('timer-input').value, 10);
            settings.selectTime = parseFloat(document.getElementById('select-time-input').value);
            settings.randomDistractors = parseInt(document.getElementById('random-distractors-input').value, 10);
            settings.speed = parseFloat(document.getElementById('speed-input').value);
            settings.delayTime = parseFloat(document.getElementById('delay-input').value);
            settings.rotationGroups = parseInt(document.getElementById('rotation-groups-input').value, 10);

            localStorage.setItem('settings', JSON.stringify(settings));
            console.log("Settings saved:", settings);
        }

        // Function to handle span type checkbox changes
        function handleSpanTypeChange() {
            const forwardsBox = document.getElementById('forwards-btn');
            const backwardsBox = document.getElementById('backwards-btn');
            const sequencingBox = document.getElementById('sequencing-btn');

            // Only allow specific combinations
            if (forwardsBox.checked && backwardsBox.checked) {
                backwardsBox.checked = false;
            }

            if (forwardsBox.checked || backwardsBox.checked) {
                sequencingBox.disabled = false;
            } else {
                sequencingBox.checked = false;
                sequencingBox.disabled = true;
            }
        }

        // Event listeners for span type checkboxes
        document.getElementById('forwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('backwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('sequencing-btn').addEventListener('change', handleSpanTypeChange);

        // Event listeners for other settings
        document.getElementById('flash-btn').addEventListener('click', () => {
            settings.flashMode = !settings.flashMode;
            document.getElementById('flash-btn').textContent = `Flash Mode: ${settings.flashMode ? 'On' : 'Off'}`;
        });

        document.getElementById('consecutive-btn').addEventListener('click', () => {
            settings.consecutiveMode = !settings.consecutiveMode;
            document.getElementById('consecutive-btn').textContent = `Consecutive Mode: ${settings.consecutiveMode ? 'Off' : 'On'}`;
        });

        document.getElementById('progression-btn').addEventListener('click', () => {
            settings.autoProgression = !settings.autoProgression;
            document.getElementById('progression-btn').textContent = `Auto Progression: ${settings.autoProgression ? 'On' : 'Off'}`;
        });

        document.getElementById('show-answers-btn').addEventListener('click', () => {
            settings.showAnswers = !settings.showAnswers;
            document.getElementById('show-answers-btn').textContent = `Show Answers: ${settings.showAnswers ? 'On' : 'Off'}`;
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            saveSettings();
            document.getElementById('settingsModal').style.display = 'none';
            initializeGame();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'none';
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'none';
        });

        loadSettings();
    }

    function initializeGame() {
        const circleContainer = document.getElementById('circle-container');
        const startBtn = document.getElementById('start-btn');
        const levelDisplay = document.getElementById('level-display');
        const timerDisplay = document.getElementById('timer-display');
        const averageLevelDisplay = document.getElementById('average-level-display');
        const levelInput = document.getElementById('level-input');
        const timerInput = document.getElementById('timer-input');
        const selectTimeInput = document.getElementById('select-time-input');
        const randomDistractorsInput = document.getElementById('random-distractors-input');
        const speedInput = document.getElementById('speed-input');
        const delayInput = document.getElementById('delay-input');
        const rotationGroupsInput = document.getElementById('rotation-groups-input'); // Input for number of rotation groups

        console.log("Initializing game");

        let circles = [];
        let sequence = [];
        let displayedNumbers = []; // To track numbers displayed on circles
        let userSequence = [];
        let level = parseInt(levelInput.value, 10);  // Default level
        let interval;
        let animationInterval;
        let flashInterval;
        let selectionTimeout;
        let timer;
        let timeLeft = parseInt(timerInput.value, 10);  // Default timer value
        let selectTime = parseFloat(selectTimeInput.value) * 1000;  // Convert to milliseconds
        let randomDistractors = parseInt(randomDistractorsInput.value, 10);
        let speed = parseFloat(speedInput.value);
        let delayTime = parseFloat(delayInput.value) * 1000;  // Convert to milliseconds
        let spanMode = 'forwards'; // 'forwards', 'backwards', 'sequencing'
        let randomMode = false;  // Random mode flag
        let rotationMode = 0;  // Rotation mode states: 0 - Normal, 1 - Rotation, 2 - Combination
        let flashMode = false;  // Flash mode flag
        let consecutiveMode = true; // Consecutive mode flag
        let autoProgression = true; // Automatic level progression flag
        let showAnswers = true; // Show answers flag
        let distractorColors = ['orange', 'pink', 'purple', 'brown', 'cyan', 'gray'];
        let levelHistory = [];  // Track the levels the player has been on
        let velocities = []; // Velocity array for circles

        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        } else {
            console.error('Start button not found');
        }

        function startGame() {
            console.log("Game started");
            level = parseInt(levelInput.value, 10);
            timeLeft = parseInt(timerInput.value, 10);
            selectTime = parseFloat(selectTimeInput.value) * 1000;
            randomDistractors = parseInt(randomDistractorsInput.value, 10);
            speed = parseFloat(speedInput.value);
            delayTime = parseFloat(delayInput.value) * 1000;
            spanMode = document.getElementById('forwards-btn').checked ? 'forwards' :
                document.getElementById('backwards-btn').checked ? 'backwards' : 'sequencing';
            randomMode = document.getElementById('normal-btn').checked;
            rotationMode = document.getElementById('rotation-btn').checked ? 1 : 0;
            flashMode = document.getElementById('flash-btn').textContent.includes('On');
            consecutiveMode = document.getElementById('consecutive-btn').textContent.includes('On');
            autoProgression = document.getElementById('progression-btn').textContent.includes('On');
            showAnswers = document.getElementById('show-answers-btn').textContent.includes('On');
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
            clearInterval(interval);
            clearInterval(animationInterval);
            clearInterval(flashInterval);
            clearInterval(timer);
            resetGame();
            circles.forEach(circle => {
                const newCircle = circle.cloneNode(true);
                circle.replaceWith(newCircle);
            });
            velocities = [];
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
            const totalCircles = level + randomDistractors;

            // Create circles
            for (let i = 0; i < totalCircles; i++) {
                const circle = document.createElement('div');
                circle.classList.add('circle');

                if (i < level) {
                    // Game balls
                } else {
                    // Random colored distractors
                    circle.classList.add('distractor');
                    circle.style.setProperty('--color', distractorColors[i % distractorColors.length]);
                }

                circles.push(circle);
            }

            // Shuffle circles to mix distractors
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
            velocities = circles.map(() => ({
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
            velocities = circles.map(() => ({
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
                                    velocities.index.y = speed2 * Math.sin(angle);
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
            const numbers = consecutiveMode ? Array.from({ length: level }, (_, i) => i + 1) : generateNonConsecutiveNumbers(level); // Generate consecutive or non-consecutive numbers
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
                    do {
                        index = Math.floor(Math.random() * circles.length);  // Select from all circles
                    } while (sequence.includes(index) || circles[index].classList.contains('distractor'));
                    circles[index].style.backgroundColor = 'red';
                    circles[index].textContent = numbers[selected];
                    displayedNumbers.push(numbers[selected]); // Store the displayed number
                    sequence.push(index);

                    selected++;
                    setTimeout(selectNext, selectTime);
                } else {
                    clearInterval(animationInterval); // Stop circles from moving
                    if (flashMode) {
                        clearInterval(flashInterval);
                        circles.forEach(circle => {
                            circle.style.visibility = 'visible';
                        });
                    }
                    circles.forEach(circle => circle.style.transition = 'none'); // Stop circles from moving

                    startTimer();
                    circles.forEach((circle, idx) => {
                        circle.addEventListener('click', () => selectCircle(idx));
                    });
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
                if (spanMode === 'backwards') {
                    correctSequence.reverse();
                }
            } else {
                correctSequence = sequence;
                if (spanMode === 'backwards') {
                    correctSequence = sequence.slice().reverse();
                }
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
            spanMode = 'backwards';
            document.getElementById('backwards-btn').textContent = 'Normal Mode';
            console.log(`Backwards mode: ${spanMode}`);
        }

        function toggleRandomMode() {
            randomMode = !randomMode;
            document.getElementById('random-btn').textContent = randomMode ? 'Normal Mode' : 'Random Mode';
            console.log(`Random mode: ${randomMode}`);
        }

        function toggleRotationMode() {
            rotationMode = (rotationMode + 1) % 3;
            if (rotationMode === 0) {
                document.getElementById('rotation-btn').textContent = 'Normal Mode';
                rotationGroupsInput.style.display = 'none'; // Hide rotation groups input
                rotationGroupsInput.previousElementSibling.style.display = 'none'; // Hide the label for rotation groups input
            } else if (rotationMode === 1) {
                document.getElementById('rotation-btn').textContent = 'Rotation Mode';
                rotationGroupsInput.style.display = 'block'; // Show rotation groups input
                rotationGroupsInput.previousElementSibling.style.display = 'block'; // Show the label for rotation groups input
            } else {
                document.getElementById('rotation-btn').textContent = 'Combination Mode';
                rotationGroupsInput.style.display = 'block'; // Show rotation groups input
                rotationGroupsInput.previousElementSibling.style.display = 'block'; // Show the label for rotation groups input
            }
            console.log(`Rotation mode: ${rotationMode}`);
        }

        function toggleFlashMode() {
            flashMode = !flashMode;
            document.getElementById('flash-btn').textContent = flashMode ? 'Normal Mode' : 'Flash Mode';
            console.log(`Flash mode: ${flashMode}`);
        }

        function toggleNonConsecutiveMode() {
            consecutiveMode = !consecutiveMode;
            document.getElementById('non-consecutive-btn').textContent = consecutiveMode ? 'Consecutive Mode' : 'Non-Consecutive Mode';
            console.log(`Consecutive mode: ${consecutiveMode}`);
        }

        function toggleAutoProgression() {
            autoProgression = !autoProgression;
            document.getElementById('progression-btn').textContent = autoProgression ? 'Auto Progression: On' : 'Auto Progression: Off';
            console.log(`Auto progression: ${autoProgression}`);
        }

        function toggleShowAnswers() {
            showAnswers = !showAnswers;
            document.getElementById('show-answers-btn').textContent = showAnswers ? 'Show Answers: On' : 'Show Answers: Off';
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

        initializeSettings();
    }

    // Load the modal when the page loads
    loadModal();
});

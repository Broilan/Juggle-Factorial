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

        let modal = document.getElementById("settingsModal");
        let openModalBtn = document.getElementById("settingsBtn");
        let closeModalBtn = document.getElementById("closeBtn");

        openModalBtn.onclick = () => {
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
        };

        closeModalBtn.onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        initializeSettings();
    }

    function initializeSettings() {
        console.log("Initializing settings");

        const settings = {
            spanTypes: {
                forwards: true,
                backwards: false,
                sequencing: false
            },
            movementTypes: {
                normal: true,
                rotation: false
            },
            flashMode: false,
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
            document.getElementById('progression-btn').textContent = `Auto Progression: ${settings.autoProgression ? 'On' : 'Off'}`;
            document.getElementById('show-answers-btn').textContent = `Show Answers: ${settings.showAnswers ? 'On' : 'Off'}`;

            document.getElementById('level-input').value = settings.level;
            document.getElementById('timer-input').value = settings.timer;
            document.getElementById('select-time-input').value = settings.selectTime;
            document.getElementById('random-distractors-input').value = settings.randomDistractors;
            document.getElementById('speed-input').value = settings.speed;
            document.getElementById('delay-input').value = settings.delayTime;
            document.getElementById('rotation-groups-input').value = settings.rotationGroups;

            if (!window.gameInitialized) {
                window.gameInitialized = true;
                initializeGame();
            }
        }

        function saveSettings() {
            console.log("Saving settings");
            settings.spanTypes.forwards = document.getElementById('forwards-btn').checked;
            settings.spanTypes.backwards = document.getElementById('backwards-btn').checked;
            settings.spanTypes.sequencing = document.getElementById('sequencing-btn').checked;

            settings.movementTypes.normal = document.getElementById('normal-btn').checked;
            settings.movementTypes.rotation = document.getElementById('rotation-btn').checked;

            settings.flashMode = document.getElementById('flash-btn').textContent.includes('On');
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

        function handleSpanTypeChange() {
            const forwardsBox = document.getElementById('forwards-btn');
            const backwardsBox = document.getElementById('backwards-btn');
            const sequencingBox = document.getElementById('sequencing-btn');

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

        function handleMovementTypeChange() {
            const normalBox = document.getElementById('normal-btn');
            const rotationBox = document.getElementById('rotation-btn');

            if (!normalBox.checked && !rotationBox.checked) {
                alert("Please select at least one movement type.");
                normalBox.checked = true;
            }
        }

        document.getElementById('forwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('backwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('sequencing-btn').addEventListener('change', handleSpanTypeChange);

        document.getElementById('normal-btn').addEventListener('change', handleMovementTypeChange);
        document.getElementById('rotation-btn').addEventListener('change', handleMovementTypeChange);

        document.getElementById('flash-btn').addEventListener('click', () => {
            settings.flashMode = !settings.flashMode;
            document.getElementById('flash-btn').textContent = `Flash Mode: ${settings.flashMode ? 'On' : 'Off'}`;
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
        console.log("Initializing game");

        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startBtn = document.getElementById('start-btn');
        const levelDisplay = document.getElementById('level-display');
        const timerDisplay = document.getElementById('timer-display');
        const averageLevelDisplay = document.getElementById('average-level-display');

        const elements = [
            { name: 'canvas', element: canvas },
            { name: 'ctx', element: ctx },
            { name: 'startBtn', element: startBtn },
            { name: 'levelDisplay', element: levelDisplay },
            { name: 'timerDisplay', element: timerDisplay },
            { name: 'averageLevelDisplay', element: averageLevelDisplay },
        ];

        for (let { name, element } of elements) {
            if (!element) {
                console.error(`Element ${name} is missing in the DOM`);
                return;
            }
        }

        let circles = [];
        let sequence = [];
        let displayedNumbers = []; 
        let userSequence = [];
        let interval;
        let animationInterval;
        let flashInterval;
        let selectionTimeout;
        let timer;

        const settings = JSON.parse(localStorage.getItem('settings'));
        if (!settings) {
            console.error('Settings not found. Make sure the settings modal is initialized and saved.');
            return;
        }

        let level = settings.level;
        let timeLeft = settings.timer;
        let selectTime = settings.selectTime * 1000; 
        let randomDistractors = settings.randomDistractors;
        let speed = settings.speed;
        let delayTime = settings.delayTime * 1000;  
        let spanModes = settings.spanTypes;
        let randomMode = settings.movementTypes.normal;
        let rotationMode = settings.movementTypes.rotation ? 1 : 0;
        let flashMode = settings.flashMode;
        let autoProgression = settings.autoProgression;
        let showAnswers = settings.showAnswers;
        let distractorColors = ['orange', 'pink', 'purple', 'brown', 'cyan', 'gray'];
        let levelHistory = [];  
        let velocities = []; 

        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        } else {
            console.error('Start button not found');
        }

        function startGame() {
            console.log("Game started");
            if (!spanModes.forwards && !spanModes.backwards) {
                alert("Please select a span type to start the game.");
                return;
            }
            if (!randomMode && rotationMode === 0) {
                alert("Please select at least one movement type.");
                return;
            }

            startBtn.textContent = 'Stop';
            startBtn.style.backgroundColor = 'red';
            startBtn.onclick = () => location.reload();

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
            selectionTimeout = setTimeout(selectCircles, 1000); 
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
            circles = [];
            sequence = [];
            displayedNumbers = [];
            userSequence = [];
            timerDisplay.textContent = `Timer: ${timeLeft}s`;
            levelDisplay.textContent = `Level: ${level}`;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function createCircles() {
            console.log("Creating circles");
            const totalCircles = level + randomDistractors;

            for (let i = 0; i < totalCircles; i++) {
                const circle = {
                    x: Math.random() * (canvas.width - 30),
                    y: Math.random() * (canvas.height - 30 - 80) + 40,
                    radius: 15,
                    color: 'blue',
                    isDistractor: i >= level,
                    number: null,
                    velocity: {
                        x: (Math.random() * 2 - 1) * speed,
                        y: (Math.random() * 2 - 1) * speed
                    }
                };

                if (circle.isDistractor) {
                    circle.color = distractorColors[i % distractorColors.length];
                }

                circles.push(circle);
            }

            if (rotationMode === 1) {
                const radius = canvas.width / 2.5;
                const centerX = canvas.width / 2;
                const centerY = (canvas.height - 80) / 2 + 40;
                const angleStep = (2 * Math.PI) / circles.length;
                circles.forEach((circle, index) => {
                    const angle = index * angleStep;
                    circle.x = centerX + radius * Math.cos(angle);
                    circle.y = centerY + radius * Math.sin(angle);
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circles.forEach((circle, index) => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                ctx.fillStyle = circle.color;
                ctx.fill();
                if (circle.number !== null) {
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(circle.number, circle.x, circle.y);
                }
                ctx.closePath();

                console.log(`Drawing circle ${index} with color ${circle.color}`);

                circle.x += circle.velocity.x;
                circle.y += circle.velocity.y;

                if (circle.x - circle.radius <= 0 || circle.x + circle.radius >= canvas.width) {
                    circle.velocity.x *= -1;
                }
                if (circle.y - circle.radius <= 40 || circle.y + circle.radius >= canvas.height - 80) { 
                    circle.velocity.y *= -1;
                }

                circles.forEach(otherCircle => {
                    if (circle !== otherCircle) {
                        const dx = circle.x - otherCircle.x;
                        const dy = circle.y - otherCircle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < circle.radius + otherCircle.radius) {
                            const angle = Math.atan2(dy, dx);
                            const speed1 = Math.sqrt(circle.velocity.x * circle.velocity.x + circle.velocity.y * circle.velocity.y);
                            const speed2 = Math.sqrt(otherCircle.velocity.x * otherCircle.velocity.x + otherCircle.velocity.y * otherCircle.velocity.y);
                            circle.velocity.x = speed2 * Math.cos(angle);
                            circle.velocity.y = speed2 * Math.sin(angle);
                            otherCircle.velocity.x = speed1 * Math.cos(angle + Math.PI);
                            otherCircle.velocity.y = speed1 * Math.sin(angle + Math.PI);
                        }
                    }
                });
            });
        }

        function animateCircles() {
            console.log("Animating circles");
            function loop() {
                draw();
                animationInterval = requestAnimationFrame(loop);
            }
            loop(); 
        }

        function animateCirclesInRotation() {
            console.log("Animating circles in rotation");
            const radius = canvas.width / 2.5;
            const centerX = canvas.width / 2;
            const centerY = (canvas.height - 80) / 2 + 40;
            const groups = parseInt(settings.rotationGroups, 10);
            const groupRadiusIncrement = canvas.width / 20;
            let angleOffsets = Array(groups).fill(0);
            const speeds = Array.from({ length: groups }, () => speed * (Math.random() * 1 + 0.5));
            const directions = Array.from({ length: groups }, () => Math.random() < 0.5 ? 1 : -1);

            function loop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                circles.forEach((circle, index) => {
                    const group = index % groups;
                    const groupRadius = radius + group * groupRadiusIncrement;
                    const angleStep = (2 * Math.PI) / Math.ceil(circles.length / groups);
                    const angle = angleOffsets[group] * directions[group] + (index / groups) * angleStep;
                    circle.x = centerX + groupRadius * Math.cos(angle);
                    circle.y = centerY + groupRadius * Math.sin(angle);

                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = circle.color;
                    ctx.fill();
                    if (circle.number !== null) {
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(circle.number, circle.x, circle.y);
                    }
                    ctx.closePath();
                });
                angleOffsets = angleOffsets.map((offset, group) => offset + speeds[group] * 0.01);
                animationInterval = requestAnimationFrame(loop);
            }
            loop();
        }

        function animateCirclesInCombination() {
            console.log("Animating circles in combination");
            const radius = canvas.width / 2.5;
            const centerX = canvas.width / 2;
            const centerY = (canvas.height - 80) / 2 + 40;
            const groups = parseInt(settings.rotationGroups, 10);
            const groupRadiusIncrement = canvas.width / 20;
            let angleOffsets = Array(groups).fill(0);
            const speeds = Array.from({ length: groups }, () => speed * (Math.random() * 1 + 0.5));
            const directions = Array.from({ length: groups }, () => Math.random() < 0.5 ? 1 : -1);
            const halfCircles = Math.floor(circles.length / 2);

            function loop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                circles.forEach((circle, index) => {
                    if (index < halfCircles) {
                        const group = index % groups;
                        const groupRadius = radius + group * groupRadiusIncrement;
                        const angleStep = (2 * Math.PI) / Math.ceil(halfCircles / groups);
                        const angle = angleOffsets[group] * directions[group] + (index / groups) * angleStep;
                        circle.x = centerX + groupRadius * Math.cos(angle);
                        circle.y = centerY + groupRadius * Math.sin(angle);
                    } else {
                        circle.x += circle.velocity.x;
                        circle.y += circle.velocity.y;

                        if (circle.x - circle.radius <= 0 || circle.x + circle.radius >= canvas.width) {
                            circle.velocity.x *= -1;
                        }
                        if (circle.y - circle.radius <= 40 || circle.y + circle.radius >= canvas.height - 80) {
                            circle.velocity.y *= -1;
                        }

                        circles.forEach(otherCircle => {
                            if (circle !== otherCircle) {
                                const dx = circle.x - otherCircle.x;
                                const dy = circle.y - otherCircle.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                if (distance < circle.radius + otherCircle.radius) {
                                    const angle = Math.atan2(dy, dx);
                                    const speed1 = Math.sqrt(circle.velocity.x * circle.velocity.x + circle.velocity.y * circle.velocity.y);
                                    const speed2 = Math.sqrt(otherCircle.velocity.x * otherCircle.velocity.x + otherCircle.velocity.y * otherCircle.velocity.y);
                                    circle.velocity.x = speed2 * Math.cos(angle);
                                    circle.velocity.y = speed2 * Math.sin(angle);
                                    otherCircle.velocity.x = speed1 * Math.cos(angle + Math.PI);
                                    otherCircle.velocity.y = speed1 * Math.sin(angle + Math.PI);
                                }
                            }
                        });
                    }

                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = circle.color;
                    ctx.fill();
                    if (circle.number !== null) {
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(circle.number, circle.x, circle.y);
                    }
                    ctx.closePath();
                });
                angleOffsets = angleOffsets.map((offset, group) => offset + speeds[group] * 0.01);
                animationInterval = requestAnimationFrame(loop);
            }
            loop();
        }

        function selectCircles() {
            console.log("Selecting circles");
            let selected = 0;
            let numbers = Array.from({ length: level }, (_, i) => i + 1);
            if (spanModes.sequencing) {
                shuffleArray(numbers);
            }
            const selectNext = () => {
                if (selected > 0) {
                    const previousCircle = circles[sequence[selected - 1]];
                    previousCircle.number = null;
                    previousCircle.color = 'blue';
                    console.log(`Circle ${sequence[selected - 1]} set to blue`);
                }
                if (selected < level) {
                    let index;
                    do {
                        index = Math.floor(Math.random() * circles.length);
                    } while (sequence.includes(index) || circles[index].isDistractor);
                    circles[index].color = 'red';
                    circles[index].number = numbers[selected];
                    displayedNumbers.push(numbers[selected]);
                    sequence.push(index);

                    console.log(`Circle ${index} set to red with number ${numbers[selected]}`);

                    selected++;
                    setTimeout(selectNext, selectTime);
                } else {
                    cancelAnimationFrame(animationInterval);
                    if (flashMode) {
                        clearInterval(flashInterval);
                        circles.forEach(circle => {
                            circle.visible = true;
                        });
                    }
                    circles.forEach(circle => circle.velocity = { x: 0, y: 0 });

                    if (selected > 0) {
                        const lastCircle = circles[sequence[selected - 1]];
                        lastCircle.number = null;
                        lastCircle.color = 'blue';
                        console.log(`Last Circle ${sequence[selected - 1]} set to blue`);
                    }

                    startTimer();
                    canvas.addEventListener('click', handleCanvasClick);
                }
            };
            selectNext();
        }

        function handleCanvasClick(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            circles.forEach((circle, index) => {
                const dx = x - circle.x;
                const dy = y - circle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < circle.radius && !userSequence.includes(index)) {
                    selectCircle(index);
                }
            });
        }

        function selectCircle(index) {
            console.log("Circle selected:", index);
            if (userSequence.includes(index)) return;
            circles[index].color = 'yellow';
            console.log(`Circle ${index} set to yellow`);
            console.log(circles[index]);
            userSequence.push(index);

            draw();

            if (userSequence.length === sequence.length) {
                checkSequence();
            }
        }

        function checkSequence() {
            console.log("Checking sequence");
            let correct = true;
            let correctSequence;
            if (spanModes.sequencing) {
                let sortedSequence = displayedNumbers.slice().sort((a, b) => a - b);
                if (spanModes.backwards) {
                    sortedSequence.reverse();
                }
                if (userSequence.map(index => displayedNumbers[sequence.indexOf(index)]).toString() !== sortedSequence.toString()) {
                    correct = false;
                }
            } else {
                correctSequence = sequence;
                if (spanModes.backwards) {
                    correctSequence = sequence.slice().reverse();
                }
                for (let i = 0; i < correctSequence.length; i++) {
                    if (userSequence[i] !== correctSequence[i]) {
                        correct = false;
                        break;
                    }
                }
            }

            if (correct) {
                alert('Correct! Proceeding to the next level.');
                levelHistory.push(level);
                updateAverageLevel();
                if (autoProgression) {
                    level++;
                }
                settings.level = level;  // Update the settings with the new level
                startGame();
            } else {
                if (showAnswers) {
                    alert('Incorrect. Showing correct sequence.');
                    showCorrectSequence(() => {
                        levelHistory.push(level);
                        updateAverageLevel();
                        if (autoProgression) {
                            level = Math.max(1, level - 1);
                        }
                        settings.level = level;  // Update the settings with the new level
                        startGame();
                    });
                } else {
                    alert('Incorrect. Proceeding to the next level.');
                    levelHistory.push(level);
                    updateAverageLevel();
                    if (autoProgression) {
                        level = Math.max(1, level - 1);
                    }
                    settings.level = level;  // Update the settings with the new level
                    startGame();
                }
            }
        }

        function showCorrectSequence(callback) {
            console.log("Showing correct sequence");
            sequence.forEach((index, i) => {
                circles[index].number = displayedNumbers[i];
                circles[index].color = 'green';
            });
            setTimeout(() => {
                sequence.forEach(index => {
                    circles[index].number = null;
                    circles[index].color = 'blue';
                });
                callback();
            }, 3000);
        }

        function startTimer() {
            console.log("Starting timer");
            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Timer: ${timeLeft}s`;
                if (timeLeft === 0) {
                    clearInterval(timer);
                    alert('Time is up! Game Over.');
                    levelHistory.push(level);
                    updateAverageLevel();
                    if (autoProgression) {
                        level = Math.max(1, level - 1);
                    }
                    settings.level = level;  // Update the settings with the new level
                    startGame();
                }
            }, 1000);
        }

        function updateAverageLevel() {
            const totalLevels = levelHistory.reduce((sum, lvl) => sum + lvl, 0);
            const averageLevel = (totalLevels / levelHistory.length).toFixed(1);
            averageLevelDisplay.textContent = `Average Level: ${averageLevel}`;
        }

        function startFlashMode() {
            console.log("Starting flash mode");
            flashInterval = setInterval(() => {
                const numCirclesToFlash = Math.floor(Math.random() * (circles.length / 2)) + 1;
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
                    const originalColor = circle.color;

                    circle.color = 'transparent';

                    setTimeout(() => {
                        circle.color = originalColor;
                    }, 500);
                });
            }, 2000);
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        loadModal();
    }

    initializeGame();
});

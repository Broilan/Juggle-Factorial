document.addEventListener('DOMContentLoaded', () => {
    function getMaxBalls() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            return 100; // Desktop
        } else if (screenWidth >= 375) {
            return 50; // iPhone 12
        } else if (screenWidth >= 320) {
            return 40; // iPhone SE
        } else {
            return 30; // Smaller screens
        }
    }

    function loadModal() {
        fetch('../Settings/settings-modal.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('modal-container').innerHTML = data;
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '../Settings/settings-modal.css';
                document.head.appendChild(link);
                initializeModal();
            });
    }

    function initializeModal() {
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
        const settings = {
            spanTypes: {
                forwards: true,
                backwards: false,
                sequencing: false
            },
            movementTypes: {
                normal: true,
                rotation: false,
                combination: false
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
            const savedSettings = JSON.parse(localStorage.getItem('settings'));
            if (savedSettings) {
                Object.assign(settings, savedSettings);
            }
            applySettings();
        }

        function applySettings() {
            document.getElementById('forwards-btn').checked = settings.spanTypes.forwards;
            document.getElementById('backwards-btn').checked = settings.spanTypes.backwards;
            document.getElementById('sequencing-btn').checked = settings.spanTypes.sequencing;

            document.getElementById('normal-btn').checked = settings.movementTypes.normal;
            document.getElementById('rotation-btn').checked = settings.movementTypes.rotation;
            document.getElementById('combination-btn').checked = settings.movementTypes.combination;

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

            if (settings.movementTypes.normal) {
                document.getElementById('rotation-groups-input').parentElement.style.display = 'none';
            } else {
                document.getElementById('rotation-groups-input').parentElement.style.display = 'block';
            };

            toggleRotationGroupsInput(settings.movementTypes.rotation || settings.movementTypes.combination);

            // Add event listener for window resize
            window.addEventListener('resize', checkScreenSize);

            function checkScreenSize() {
                const rotationBtn = document.getElementById('rotation-btn');
                const combinationBtn = document.getElementById('combination-btn');

                if (window.innerWidth < 750 || window.innerHeight < 750) {
                    rotationBtn.disabled = true;
                    combinationBtn.disabled = true;

                    document.getElementById("rotation-btn-tooltip").textContent = "Unavailable on this device.";
                    document.getElementById("combination-btn-tooltip").textContent = "Unavailable on this device.";

                } else if (window.innerWidth < 1000 || window.innerHeight < 1000) {
                    document.getElementById('rotation-groups-input').max = 3;

                } else {
                    rotationBtn.disabled = false;
                    combinationBtn.disabled = false;
                }

            }
            checkScreenSize();
        };

        function saveSettings() {
            const level = Math.min(Math.max(parseInt(document.getElementById('level-input').value, 10), 2), 30);
            const randomDistractors = Math.min(Math.max(parseInt(document.getElementById('random-distractors-input').value, 10), 0), 20);
            const rotationGroups = Math.min(Math.max(parseInt(document.getElementById('rotation-groups-input').value, 10), 1), 4);

            settings.randomDistractors = randomDistractors;
            settings.rotationGroups = rotationGroups;
            settings.level = level;

            settings.spanTypes.forwards = document.getElementById('forwards-btn').checked;
            settings.spanTypes.backwards = document.getElementById('backwards-btn').checked;
            settings.spanTypes.sequencing = document.getElementById('sequencing-btn').checked;

            settings.movementTypes.normal = document.getElementById('normal-btn').checked;
            settings.movementTypes.rotation = document.getElementById('rotation-btn').checked;
            settings.movementTypes.combination = document.getElementById('combination-btn').checked;

            settings.flashMode = document.getElementById('flash-btn').textContent.includes('On');
            settings.autoProgression = document.getElementById('progression-btn').textContent.includes('On');
            settings.showAnswers = document.getElementById('show-answers-btn').textContent.includes('On');

            settings.timer = Math.min(Math.max(parseInt(document.getElementById('timer-input').value, 10), 5), 180);
            settings.selectTime = Math.min(Math.max(parseFloat(document.getElementById('select-time-input').value), 1), 10);
            settings.speed = Math.min(Math.max(parseFloat(document.getElementById('speed-input').value), 1), 10);
            settings.delayTime = Math.min(Math.max(parseFloat(document.getElementById('delay-input').value), 1), 60);

            localStorage.setItem('settings', JSON.stringify(settings));
            location.reload();
        };

        function handleSpanTypeChange() {
            const forwardsBox = document.getElementById('forwards-btn');
            const backwardsBox = document.getElementById('backwards-btn');
            const sequencingBox = document.getElementById('sequencing-btn');

            forwardsBox.onclick = () => {
                backwardsBox.checked = false;
                forwardsBox.checked = true;
            };

            backwardsBox.onclick = () => {
                forwardsBox.checked = false;
                backwardsBox.checked = true;
            };

            sequencingBox.onclick = () => {
                if(sequencingBox.checked) {
                    sequencingBox.checked = false;
                } else {
                    sequencingBox.checked = true;
                }
            };

            if (!forwardsBox.checked && !backwardsBox.checked && !sequencingBox.checked) {
                forwardsBox.checked = true;
            } else if (forwardsBox.checked && backwardsBox.checked) {
                forwardsBox.checked = true;
                backwardsBox.checked = false;
            };
        };

        function handleMovementTypeChange() {
            const normalBox = document.getElementById('normal-btn');
            const rotationBox = document.getElementById('rotation-btn');
            const combinationBox = document.getElementById('combination-btn');

            normalBox.onclick = () => {
                rotationBox.checked = false;
                combinationBox.checked = false;
                settings.rotationGroups = 0;
                document.getElementById('rotation-groups-input').parentElement.style.display = 'none';
            };

            rotationBox.onclick = () => {
                normalBox.checked = false;
                combinationBox.checked = false;
                settings.rotationGroups = 1;
                document.getElementById('rotation-groups-input').parentElement.style.display = 'block';
            };

            combinationBox.onclick = () => {
                normalBox.checked = false;
                rotationBox.checked = false;
                settings.rotationGroups = 1;
                document.getElementById('rotation-groups-input').parentElement.style.display = 'block';
            };

            if (!normalBox.checked && !rotationBox.checked && !combinationBox.checked) {
                normalBox.checked = true;
            } else if (normalBox.checked && rotationBox.checked) {
                normalBox.checked = true;
                rotationBox.checked = false;
                combinationBox.checked = false;
            } else if (normalBox.checked && combinationBox.checked) {
                normalBox.checked = true;
                rotationBox.checked = false;
                combinationBox.checked = false;
            } else if (rotationBox.checked && combinationBox.checked) {
                normalBox.checked = false;
                rotationBox.checked = true;
                combinationBox.checked = false;
            }

        }

        document.getElementById('forwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('backwards-btn').addEventListener('change', handleSpanTypeChange);
        document.getElementById('sequencing-btn').addEventListener('change', handleSpanTypeChange);

        document.getElementById('normal-btn').addEventListener('change', handleMovementTypeChange);
        document.getElementById('rotation-btn').addEventListener('change', handleMovementTypeChange);
        document.getElementById('combination-btn').addEventListener('change', handleMovementTypeChange);

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
            applySettings();
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
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const levelDisplay = document.getElementById('level-display');
        const timerDisplay = document.getElementById('timer-display');
        const averageLevelDisplay = document.getElementById('average-level-display');

        let circles = [];
        let sequence = [];
        let displayedNumbers = [];
        let userSequence = [];
        let interval;
        let animationInterval;
        let flashInterval;
        let selectionTimeout;
        let timer;

        function getSettings() {
            const settings = JSON.parse(localStorage.getItem('settings'));
            if (!settings) {
                const settings = {
                    spanTypes: {
                        forwards: true,
                        backwards: false,
                        sequencing: false
                    },
                    movementTypes: {
                        normal: true,
                        rotation: false,
                        combination: false
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
                return settings;
            }
            return settings;
        }

        let settings = getSettings();
        let initialLevel = settings.level;
        let currentLevel = settings.level;
        let timeLeft = settings.timer;
        let selectTime = settings.selectTime * 1000;
        let randomDistractors = settings.randomDistractors;
        let speed = settings.speed;
        let delayTime = settings.delayTime * 1000;
        let spanModes = settings.spanTypes;
        let randomMode = settings.movementTypes.normal;
        let rotationMode = settings.movementTypes.rotation ? 1 : 0;
        let combinationMode = settings.movementTypes.combination;
        let flashMode = settings.flashMode;
        let autoProgression = settings.autoProgression;
        let showAnswers = settings.showAnswers;
        let distractorColors = ['orange', 'pink', 'purple', 'gray', 'blue'];
        let levelHistory = [];
        let velocities = [];
        let angleOffsets = [];
        let speeds = [];
        let directions = [];

        canvas.addEventListener('click', startGame, { once: true });

        function startGame() {
            document.getElementById('title').style.display = 'none';
            document.getElementById("stopBtn").style.display = "block";
            document.getElementById("settingsBtn").style.display = "none";
            document.getElementById("infoBtn").style.display = "none";

            document.getElementById("stopBtn").onclick = () => {
                endGame();
            };

            settings = getSettings();
            if (!settings) return;

            currentLevel = settings.level;
            timeLeft = settings.timer;
            selectTime = settings.selectTime * 1000;
            randomDistractors = settings.randomDistractors;
            speed = settings.speed;
            delayTime = settings.delayTime * 1000;
            spanModes = settings.spanTypes;
            randomMode = settings.movementTypes.normal;
            rotationMode = settings.movementTypes.rotation ? 1 : 0;
            combinationMode = settings.movementTypes.combination;
            flashMode = settings.flashMode;
            autoProgression = settings.autoProgression;
            showAnswers = settings.showAnswers;

            fullResetGame();
            createCircles();
            animateCircles();
            if (flashMode) {
                startFlashMode();
            }
            selectionTimeout = setTimeout(selectCircles, 1000);
        }

        function fullResetGame() {
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
            angleOffsets = [];
            speeds = [];
            directions = [];
        }

        function resetGame() {
            circles = [];
            sequence = [];
            displayedNumbers = [];
            userSequence = [];
            timerDisplay.textContent = `${timeLeft}s`;
            levelDisplay.textContent = `Lvl: ${currentLevel}`;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function createCircles() {
            const maxBalls = getMaxBalls();
            const totalCircles = Math.min(currentLevel + randomDistractors, maxBalls);
            let attempts = 0;
        
            // Clear previous circles
            circles = [];
        
            // Ensure blue circles are spread out
            const blueCircles = [];
            const distractorCircles = [];
        
            // Create blue circles with numbers first
            for (let i = 0; i < Math.min(currentLevel, maxBalls); i++) {
                let circle;
                do {
                    if (attempts > 1000) {
                        return;
                    }
                    circle = {
                        x: Math.random() * (canvas.width - 2 * 20) + 20,
                        y: Math.random() * (canvas.height - 2 * 20 - 80) + 20,
                        radius: 20,
                        color: 'blue',
                        isDistractor: false,
                        number: i + 1,  // Assign numbers here directly
                        velocity: {
                            x: (Math.random() * 2 - 1) * speed,
                            y: (Math.random() * 2 - 1) * speed
                        },
                        isRotational: false,
                        angleOffset: Math.random() * 2 * Math.PI,
                        speed: speed,
                        direction: 1
                    };
                    attempts++;
                } while (checkOverlap(circle, circles));
        
                blueCircles.push(circle);
            }
        
            // Create distractor circles
            for (let i = 0; i < Math.min(randomDistractors, maxBalls - blueCircles.length); i++) {
                let circle;
                do {
                    if (attempts > 1000) {
                        return;
                    }
                    circle = {
                        x: Math.random() * (canvas.width - 2 * 20) + 20,
                        y: Math.random() * (canvas.height - 2 * 20 - 80) + 20,
                        radius: 20,
                        color: distractorColors[i % distractorColors.length],
                        isDistractor: true,
                        number: null,
                        velocity: {
                            x: (Math.random() * 2 - 1) * speed,
                            y: (Math.random() * 2 - 1) * speed
                        },
                        isRotational: false,
                        angleOffset: Math.random() * 2 * Math.PI,
                        speed: speed,
                        direction: 1
                    };
                    attempts++;
                } while (checkOverlap(circle, blueCircles.concat(distractorCircles)));
        
                distractorCircles.push(circle);
            }
        
            circles = distractorCircles.concat(blueCircles);
            shuffleArray(circles);

        
            if (rotationMode === 1 || combinationMode) {
                const groups = settings.rotationGroups;
                const centerX = canvas.width / 2;
                const centerY = (canvas.height - 80) / 2 + 40;
                const baseRadiusSpacing = circles[0].radius * 4;
        
                let circleIndex = 0;
                const circlesPerGroup = Math.ceil(totalCircles / groups);
        
                for (let g = 1; g <= groups; g++) {
                    const currentRingRadius = baseRadiusSpacing * g;
                    const circumference = 2 * Math.PI * currentRingRadius;
                    const circlesInRing = Math.min(Math.floor(circumference / (2 * circles[0].radius)), circlesPerGroup);
                    const angleStep = (2 * Math.PI) / circlesInRing;
        
                    for (let i = 0; i < circlesInRing; i++) {
                        if (circleIndex >= circles.length) break;
        
                        const circle = circles[circleIndex];
                        circle.isRotational = rotationMode === 1 || (combinationMode && Math.random() < 0.5);
        
                        if (circle.isRotational) {
                            const angle = i * angleStep;
                            circle.x = centerX + currentRingRadius * Math.cos(angle);
                            circle.y = centerY + currentRingRadius * Math.sin(angle);
                            circle.angleOffset = angle;
                            circle.centerX = centerX;
                            circle.centerY = centerY;
                            circle.ringRadius = currentRingRadius;
                            circle.direction = 1;
                            circle.speed = speed;
                        }
        
                        circleIndex++;
                    }
                }
            }
        }

        function checkOverlap(circle, circles) {
            return circles.some(existingCircle => {
                const dx = circle.x - existingCircle.x;
                const dy = circle.y - existingCircle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < circle.radius + existingCircle.radius;
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circles.forEach((circle, index) => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                ctx.fillStyle = circle.color;
                ctx.fill();
                if (circle.number !== null && circle.color !== 'blue') { // Ensure numbers are not displayed immediately
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 20px Arial';  // Larger and bolder text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(circle.number, circle.x, circle.y);
                }
                ctx.closePath();

                if (circle.isRotational) {
                    // Rotational movement
                    circle.angleOffset += circle.speed * 0.01 * circle.direction;
                    circle.x = circle.centerX + circle.ringRadius * Math.cos(circle.angleOffset);
                    circle.y = circle.centerY + circle.ringRadius * Math.sin(circle.angleOffset);
                } else {
                    // Normal movement
                    circle.x += circle.velocity.x;
                    circle.y += circle.velocity.y;

                    if (circle.x - circle.radius < 0) {
                        circle.x = circle.radius;  // Ensure circle stays within bounds
                        circle.velocity.x *= -1;
                    }
                    if (circle.x + circle.radius > canvas.width) {
                        circle.x = canvas.width - circle.radius;  // Ensure circle stays within bounds
                        circle.velocity.x *= -1;
                    }
                    if (circle.y - circle.radius < 40) {
                        circle.y = 40 + circle.radius;  // Ensure circle stays within bounds
                        circle.velocity.y *= -1;
                    }
                    if (circle.y + circle.radius > canvas.height - 80) {
                        circle.y = canvas.height - 80 - circle.radius;  // Ensure circle stays within bounds
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
            });
        }

        function animateCircles() {
            function loop() {
                draw();
                animationInterval = requestAnimationFrame(loop);
            }
            loop();
        }

        function selectCircles() {
            let selected = 0;
            let numbers = Array.from({ length: currentLevel }, (_, i) => i + 1);
            if (spanModes.sequencing) {
                shuffleArray(numbers);
            }
            const selectNext = () => {
                if (selected > 0) {
                    const previousCircle = circles[sequence[selected - 1]];
                    previousCircle.number = null;
                    previousCircle.color = previousCircle.originalColor || 'blue';
                }
                if (selected < currentLevel) {
                    let index;
                    do {
                        index = Math.floor(Math.random() * circles.length);
                    } while (sequence.includes(index) || circles[index].isDistractor);
                    circles[index].originalColor = circles[index].color; // Store the original color
                    circles[index].color = 'red';
                    circles[index].number = numbers[selected];
                    displayedNumbers.push(numbers[selected]);
                    sequence.push(index);


                    selected++;
                    setTimeout(selectNext, selectTime);
                } else {
                    cancelAnimationFrame(animationInterval);
                    if (flashMode) {
                        clearInterval(flashInterval);
                        circles.forEach(circle => {
                            if(circle.color === 'transparent') {
                                circle.color = circle.originalColor === "transparent" ? "blue" : circle.originalColor;
                            }
                        });
                    }
                    circles.forEach(circle => circle.velocity = { x: 0, y: 0 });

                    if (selected > 0) {
                        const lastCircle = circles[sequence[selected - 1]];
                        lastCircle.number = null;
                        lastCircle.color = lastCircle.originalColor === "transparent" ? 'blue' : lastCircle.originalColor;
                    };

                    // Redraw the canvas after updating the circle states
                    draw();

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
            if (userSequence.includes(index)) return;
            circles[index].color = 'yellow';
            userSequence.push(index);

            draw();

            if (userSequence.length === sequence.length) {
                checkSequence();
            };
        };

        function checkSequence() {
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
                showCustomAlert('success', 'Success! Incrementing level.', () => {
                    levelHistory.push(currentLevel);
                    updateAverageLevel();
                    if (currentLevel === 30) {
                        alert("Congratulations! You've completed all levels!");
                        location.reload();
                    } else if (autoProgression) {
                        currentLevel++;
                    }
                    settings.level = currentLevel;
                    localStorage.setItem('settings', JSON.stringify(settings));
                    startGame();
                });
            } else {
                if (showAnswers) {
                    showCustomAlert('failure', 'Incorrect. Decrementing level.', () => {
                        showCorrectSequence(() => {
                            levelHistory.push(currentLevel);
                            updateAverageLevel();
                            if (autoProgression) {
                                currentLevel = Math.max(1, currentLevel - 1);
                            }
                            settings.level = currentLevel;
                            localStorage.setItem('settings', JSON.stringify(settings));
                            startGame();
                        });
                    });
                } else {
                    showCustomAlert('failure', 'Incorrect. Decrementing level.', () => {
                        levelHistory.push(currentLevel);
                        updateAverageLevel();
                        if (autoProgression) {
                            currentLevel = Math.max(1, currentLevel - 1);
                        }
                        settings.level = currentLevel;
                        localStorage.setItem('settings', JSON.stringify(settings));
                        startGame();
                    });
                }
            }
        }

        function showCustomAlert(type, message, callback) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'custom-alert';

            if (type === 'success') {
                alertDiv.innerHTML = `
                    <div class="custom-alert-success">
                        <p>${message}</p>
                    </div>`;
            } else if (type === 'failure') {
                alertDiv.innerHTML = `
                    <div class="custom-alert-failure">
                        <p>${message}</p>
                    </div>`;
            }

            document.body.appendChild(alertDiv);
            alertDiv.style.opacity = 1;
            alertDiv.style.pointerEvents = 'auto';

            // Fade-out after 2-3 seconds
            setTimeout(() => {
                alertDiv.style.opacity = 0;
                alertDiv.style.pointerEvents = 'none';
                setTimeout(() => {
                    document.body.removeChild(alertDiv);
                    if (callback) callback();
                }, 2000); // Remove from DOM after transition
            }, 2000); // Keep the alert visible for 2 seconds before fading out
        }

        function showCorrectSequence(callback) {
            sequence.forEach((index, i) => {
                circles[index].number = displayedNumbers[i];
                circles[index].color = 'green';
            });
            draw();
            setTimeout(() => {
                sequence.forEach(index => {
                    circles[index].number = null;
                    circles[index].color = 'blue';
                });
                draw();
                callback();
            }, 3000);
        }

        function startTimer() {
            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `${timeLeft}s`;
                if (timeLeft === 0) {
                    clearInterval(timer);
                    showCustomAlert('failure', 'Time\'s up! Decrementing level.', () => {
                        levelHistory.push(currentLevel);
                        updateAverageLevel();
                        if (autoProgression) {
                            currentLevel = Math.max(1, currentLevel - 1);
                        }
                        settings.level = currentLevel;
                        localStorage.setItem('settings', JSON.stringify(settings));
                        startGame();
                    });
                }
            }, 1000);
        }

        function updateAverageLevel() {
            const totalLevels = levelHistory.reduce((sum, lvl) => sum + lvl, 0);
            const averageLevel = (totalLevels / levelHistory.length).toFixed(1);
            averageLevelDisplay.textContent = `Avg: ${averageLevel}`;
        }

        function endGame() {
            settings.level = initialLevel; // Reset currentLevel to initialLevel
            localStorage.setItem('settings', JSON.stringify(settings));
            location.reload();
        }

        function startFlashMode() {
            flashInterval = setInterval(() => {
                const numCirclesToFlash = Math.floor(circles.length / 3);
                const circlesToFlash = [];

                for (let i = 0; i < numCirclesToFlash; i++) {
                    circlesToFlash.push(numCirclesToFlash * i + Math.floor(Math.random() * numCirclesToFlash));
                }

                circlesToFlash.forEach((c, i) => {
                    const circle = circles[i];
                    circle.originalColor = circle.color; // Store the original color
                    circle.color = 'transparent';
                        setTimeout(() => {
                            circle.color = circle.originalColor === "transparent" ? "blue" : circle.originalColor;
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

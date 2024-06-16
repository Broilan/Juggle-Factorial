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
            blueDistractors: 5,
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
            document.getElementById('blue-distractors-input').value = settings.blueDistractors;
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
            settings.consecutiveMode = !document.getElementById('consecutive-btn').textContent.includes('Off');
            settings.autoProgression = document.getElementById('progression-btn').textContent.includes('On');
            settings.showAnswers = document.getElementById('show-answers-btn').textContent.includes('On');

            settings.level = parseInt(document.getElementById('level-input').value, 10);
            settings.timer = parseInt(document.getElementById('timer-input').value, 10);
            settings.selectTime = parseFloat(document.getElementById('select-time-input').value);
            settings.blueDistractors = parseInt(document.getElementById('blue-distractors-input').value, 10);
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
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'none';
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'none';
        });

        loadSettings();
    }

    // Load the modal when the page loads
    loadModal();
});

class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        this.nitrous = false;
        this.rocketBoost = false;

        switch (type) {
            case "KEYS":
                this.addTouchListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key.toLowerCase()) {
                case 'arrowleft':
                    this.left = true;
                    break;
                case 'arrowright':
                    this.right = true;
                    break;
                case 'arrowup':
                    this.forward = true;
                    break;
                case 'arrowdown':
                case ' ':
                    this.reverse = true;
                    break;
                case 'n':
                    this.nitrous = true;
                    break;
                case 'r':
                    this.rocketBoost = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key.toLowerCase()) {
                case 'arrowleft':
                    this.left = false;
                    break;
                case 'arrowright':
                    this.right = false;
                    break;
                case 'arrowup':
                    this.forward = false;
                    break;
                case 'arrowdown':
                case ' ':
                    this.reverse = false;
                    break;
                case 'n':
                    this.nitrous = false;
                    break;
                case 'r':
                    this.rocketBoost = false;
                    break;
            }
        };
    }

    addTouchListeners() {  
        alert("EXPERIMENTAL FEATURES");
        const touchZone = document.getElementById('touch-controls');
        if (!touchZone) return;

        const handleTouch = (event, isStarting) => {
            for (let touch of event.changedTouches) {
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (!target || !target.dataset.control) continue;

                const control = target.dataset.control;
                const state = isStarting;

                // Optional: vibrate on press
                if (state && 'vibrate' in navigator) {
                    if (control === 'nitrous') {
                        navigator.vibrate(100); // strong effect
                    };
                };

                switch (control) {
                    case 'forward':
                        this.forward = false;
                        this.left = false;
                        this.right = false;
                        this.reverse = false;
                        this.nitrous = false;
                        this.rocketBoost = false;
                        this.forward = state;
                        break;
                    case 'left':
                        this.forward = false;
                        this.left = false;
                        this.right = false;
                        this.reverse = false;
                        this.nitrous = false;
                        this.rocketBoost = false;
                        this.left = state;
                        break;
                    case 'right':
                        this.forward = false;
                        this.left = false;
                        this.right = false;
                        this.reverse = false;
                        this.nitrous = false;
                        this.rocketBoost = false;
                        this.right = state;
                        break;
                    case 'reverse':
                        this.forward = false;
                        this.left = false;
                        this.right = false;
                        this.reverse = false;
                        this.nitrous = false;
                        this.rocketBoost = false;
                        this.reverse = state;
                        break;
                    case 'nitrous':
                        this.forward = false;
                        this.left = false;
                        this.right = false;
                        this.reverse = false;
                        this.nitrous = false;
                        this.rocketBoost = false;
                        this.nitrous = state;
                        break;
                    case 'rocketBoost':
                        this.forward = false;        
                        this.left = false;       
                        this.right = false;     
                        this.reverse = false;   
                        this.nitrous = false;        
                        this.rocketBoost = false;
                        this.rocketBoost = state;
                        break;
                }
            }
        };

        touchZone.addEventListener('touchstart', (event) => {
            handleTouch(event, true);
        }, { passive: false });

        touchZone.addEventListener('touchend', (event) => {
            handleTouch(event, false);
        }, { passive: false });

        touchZone.addEventListener('touchcancel', (event) => {
            handleTouch(event, false);
        }, { passive: false });
    }
}
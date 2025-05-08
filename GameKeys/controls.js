class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        this.nitrous = false; // Add nitrous control

        switch(type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        };
    };

    #addKeyboardListeners() {
        // Optional: Prevent multiple key presses from causing repeat toggles
        const pressedKeys = new Set();
    
        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
    
            if (pressedKeys.has(key)) return;
            pressedKeys.add(key);
    
            switch(key) {
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
                    this.nitrous = !this.nitrous; // 🔁 Toggle on press
                    break;
                case 'r':
                    this.rocketBoost = true;
                    break;
            }
        });
    
        document.addEventListener("keyup", (event) => {
            const key = event.key.toLowerCase();
            pressedKeys.delete(key);
    
            switch(key) {
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
                case 'r':
                    this.rocketBoost = false;
                    break;
            }
        });
    };
};

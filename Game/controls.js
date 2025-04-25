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
        document.onkeydown = (event) => {
            switch(event.key.toLowerCase()) { // Convert key to lowercase for consistency
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
                    this.reverse = true;
                    break;
                case ' ': // Spacebar is used as an alternative key for reverse
                    this.reverse = true;
                    break;
                case 'n': // Handle both 'N' and 'n'
                    this.nitrous = true;
                    break;
                case 'r':
                    this.rocketBoost = true;
                    break;
            };
        };

        document.onkeyup = (event) => {
            switch(event.key.toLowerCase()) { // Convert key to lowercase for consistency
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
                    this.reverse = false;
                    break;
                case ' ': // Spacebar is used as an alternative key for reverse
                    this.reverse = false;
                    break;
                case 'n': // Handle both 'N' and 'n'
                    this.nitrous = false;
                    break;
                case 'r':
                    this.rocketBoost = true;
                    break;
            };
        };
    };
};
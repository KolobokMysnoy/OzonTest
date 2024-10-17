const defaultFillColor = '#005CFF';
const defaultEmptyColor = '#EAF0F6';

const deftaultWidth = 10;

const simpleAnimation = 'progressbar_animated__simple';
const pathAnimation = 'progressbar_animated__path';

const AnimatedState = 'Animated';
const AnimatedPathState = 'Animated-path'


class ProgressBar extends HTMLElement {
    static observedAttributes = [
        "pen-width",
        "value",
        "max",
        'fill-color',
        'animation',
        'ishidden'
    ];

    #settedFillColor = defaultFillColor;
    #settedEmptyColor = defaultEmptyColor;

    #width = deftaultWidth;

    #progressWrapper = null;
    #shadow = null;

    #max = 1;
    #sizeRect;
    #ratio = 1;

    #observer = undefined;

    constructor() {
        super();

        this.#progressWrapper = document.createElement('div');
        this.#progressWrapper.setAttribute('role', 'progressbar');

        this.#shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        if (this.getAttribute('ishidden') == 'true') {
            this.#progressWrapper.display = 'none';
        }

        if (this.getAttribute('pen-width')) {
            this.#width = this.getAttribute('pen-width');
        }

        switch (this.getAttribute('animation')) {
            case AnimatedState:
                this.#progressWrapper.classList.add(simpleAnimation);
                break;
            case AnimatedPathState:
                const svg = document.createElement('svg');
                this.#progressWrapper.append(svg);
                svg.outerHTML = this.getAnimatedSVG();

                this.#progressWrapper.classList.add(pathAnimation);
                break;
        }

        if (this.getAttribute('value')) {
            let settedValue = Number(this.getAttribute('value'));
            if (settedValue == NaN) settedValue = 0;

            if (settedValue > this.#max) {
                settedValue = this.#max;
            };

            this.#progressWrapper.style.setProperty('--progress', `${settedValue / this.#max * 100}%`);
        }

        if (this.getAttribute('max')) {
            this.#max = this.getAttribute('max');
        }

        this.setVariablesToCSS();

        this.#shadow.append(this.#progressWrapper);
        this.#shadow.innerHTML += `<style> @import './progressbar.css' </style>`
        this.#progressWrapper = this.#shadow.firstChild;

        if (this.#observer) {
            this.#observer.disconnect();
        }

        // If change size of our progress bar
        this.#observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.#sizeRect = entry.contentRect;
                this.#ratio = entry.contentRect.width / 100;
                this.#progressWrapper.style.setProperty('--ratio', this.#ratio);
            })
        })

        this.#observer.observe(this.#progressWrapper);
    }

    getAnimatedSVG() {
        const settedWidth = this.#width / this.#ratio / 2;

        return `<svg class="path__progress" viewBox="-50 -50 100 100">
                    <circle class='progress__circle_grey' pathLength="360" r="${50 - settedWidth}" fill="transparent" />
                    <circle class='progress__circle' pathLength="360" r="${50 - settedWidth}" fill="transparent" />
                </svg>`;
    }

    setVariablesToCSS() {
        this.#progressWrapper.style.setProperty('--empty-color', this.#settedEmptyColor);
        this.#progressWrapper.style.setProperty('--bar-width', this.#width + 'px');
        this.#progressWrapper.style.setProperty('--fill-color', this.#settedFillColor);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.#progressWrapper == null || this.#progressWrapper.classList == null) return;

        if (name === 'animation' && oldValue) {
            if (oldValue === AnimatedState) {
                this.#progressWrapper.classList.remove(simpleAnimation);
            } else {
                this.#progressWrapper.classList.remove(pathAnimation);
                if (this.#progressWrapper.firstChild) {
                    this.#progressWrapper.removeChild(this.#progressWrapper.firstChild);
                }
            }
        }

        if (name === 'ishidden') {
            if (newValue === 'true') {
                this.#progressWrapper.style.display = 'none';
            } else {
                this.#progressWrapper.style.display = '';
            }
        }

        if (name === 'animation' && newValue) {
            if (newValue === AnimatedState) {
                this.#progressWrapper.classList.add(simpleAnimation);
            } else {
                const svg = document.createElement('svg');
                this.#progressWrapper.append(svg);
                svg.outerHTML = this.getAnimatedSVG();

                this.#progressWrapper.classList.add(pathAnimation);
            }
        }

        if (name === 'pen-width') {
            let settedWidth = newValue;
            if (settedWidth > this.maxPenWidth) settedWidth = this.maxPenWidth;

            this.#width = newValue;
            this.#progressWrapper.style.setProperty('--bar-width', this.#width + 'px');

            if (this.animation === 'Animated-path') {
                this.animation = 'Animated-path';
            }
        }

        if (name === 'fill-color') {
            this.#settedFillColor = newValue;
            this.#progressWrapper.style.setProperty('--fill-color', this.#settedFillColor);
        }

        if (name === 'max') {
            this.#max = newValue;
        }

        if (name === 'value') {
            let settedValue = Number(newValue);
            if (settedValue == NaN) settedValue = 0;
            if (settedValue > this.#max) {
                settedValue = this.#max;
            };

            this.#progressWrapper.style.setProperty('--progress', `${settedValue / this.#max * 100}%`);
        }
    }

    set value(newValue) {
        this.setAttribute('value', newValue);
    }
    get value() {
        this.getAttribute('value');
    }

    set penWidth(newValue) {
        this.setAttribute('pen-width', newValue);
    }
    get penWidth() {
        return this.getAttribute('pen-width');
    }
    get maxPenWidth() {
        return this.#ratio * 50;
    }

    set max(newValue) {
        this.setAttribute('max', newValue);
    }
    get max() {
        return this.getAttribute('max');
    }

    set fillColor(newValue) {
        this.setAttribute('fill-color', newValue);
    }
    get fillColor() {
        return this.getAttribute('fill-color');
    }

    set hidden(newValue) {
        this.setAttribute('ishidden', newValue);
    }
    get hidden() {
        return this.getAttribute('ishidden');
    }

    set animation(newValue) {
        this.setAttribute('animation', newValue);
    }
    get animation() {
        return this.getAttribute('animation');
    }
}

customElements.define("my-progress-bar", ProgressBar);

const defaultFillColor = '#005CFF';
const defaultEmptyColor = 'white';

const deftaultWidth = 10;

const simpleAnimation = 'progressbar_animated__simple';
const pathAnimation = 'progressbar_animated__path';

export const NormalState = 'Normal';
export const AnimatedState = 'Animated';
export const AnimatedPathState = 'Animated-path'
export const HiddenState = 'Hidden';

const getSimpleAnimated = () => {
    const wrapper = document.createElement('div');

    wrapper.role = 'progressbar';
    wrapper.classList.add(simpleAnimation);

    return wrapper;
}

const getPathAnimated = (width = 0) => {
    const wrapper = document.createElement('div');
    const svg = document.createElement('svg');
    wrapper.append(svg);

    svg.outerHTML = `<svg height="130" width="130">
        <circle class='progress__circle' cx='65' cy='65' pathLength="360" r="${65 - width / 2}" fill="transparent" />
    </svg>`;

    wrapper.role = 'progressbar';
    wrapper.classList.add(pathAnimation);

    return wrapper;
}

const getNone = () => {
    const wrapper = document.createElement('div');

    wrapper.role = 'progressbar';
    wrapper.style.display = 'none';

    return wrapper;
}

const getNormal = () => {
    const wrapper = document.createElement('div');

    wrapper.setAttribute('role', 'progressbar');
    wrapper.setAttribute('cur-value', 0);
    wrapper.style.setProperty('--progress', '0%');

    return wrapper;
}

export class ProgressBar {
    #settedFillColor = defaultFillColor;
    #settedEmptyColor = defaultEmptyColor;
    #width = deftaultWidth;
    #progressWrapper = null;

    #animationStyle = 'simple';
    #placedElement = null;
    #whereToPlace = null;
    #max = 1;
    #state = NormalState;

    constructor(state = null, maxVal = null) {
        this.#max = maxVal ?? 1;

        switch (state) {
            case AnimatedState:
                this.#progressWrapper = getSimpleAnimated();
                break;
            case AnimatedPathState:
                this.#progressWrapper = getPathAnimated(this.#width);
                break;
            case HiddenState:
                this.#progressWrapper = getNone();
                break;
            default:
                this.#state = NormalState;
                this.#progressWrapper = getNormal();
        }
    }

    #setVariablesToCSS() {
        this.#progressWrapper.style.setProperty('--empty-color', this.#settedEmptyColor);
        this.#progressWrapper.style.setProperty('--bar-width', this.#width + 'px');
        this.#progressWrapper.style.setProperty('--fill-color', this.#settedFillColor);
    }

    render(placement) {
        if (!placement) {
            console.error(`Not correct placement for ProgressBar: ${placement}`);
            return;
        }
        this.#whereToPlace = placement;

        if (this.#placedElement) {
            placement.removeChild(this.#placedElement);
        }

        this.#setVariablesToCSS();
        this.#placedElement = this.#progressWrapper;

        placement.append(this.#progressWrapper);
        return this;
    }

    getElement() {
        this.#setVariablesToCSS();

        return this.#progressWrapper;
    }

    changeState(newState) {
        switch (newState) {
            case AnimatedState:
                this.#progressWrapper = getSimpleAnimated();
                break;
            case AnimatedPathState:
                this.#progressWrapper = getPathAnimated(this.#width);
                break;
            case HiddenState:
                this.#progressWrapper = getNone();
                break;
            default:
                newState = NormalState;
                this.#progressWrapper = getNormal();
        }
        this.#state = newState;
        if (this.#whereToPlace) return this.render(this.#whereToPlace);

        return this;
    }

    animate(newAnimationStyle = null) {
        if (this.#state.startsWith(AnimatedState)) {
            this.#state = AnimatedState;
        }
        if (newAnimationStyle !== this.#animationStyle) {
            this.#animationStyle = newAnimationStyle
        }

        switch (this.#animationStyle) {
            case AnimatedState:
                this.#progressWrapper = getPathAnimated(this.#width);
                break;
            default:
                this.#progressWrapper = getSimpleAnimated();
        }

        if (this.#whereToPlace) return this.render(this.#whereToPlace);

        return this;
    }

    changeValue(newValue) {
        if (this.#state !== NormalState) {
            this.#state = NormalState;
        }

        if (newValue == null || newValue === NaN) return this;

        if (newValue > this.#max) {
            newValue = this.#max;
        }

        this.#progressWrapper.style.setProperty('--progress', `${Math.floor(newValue / this.#max * 100)}%`);

        return this;
    }

    changeColors(fillColor = null, emptyColor = null) {
        if (fillColor && fillColor !== this.#settedFillColor) {
            this.#settedFillColor = fillColor;
            this.#progressWrapper.style.setProperty('--fill-color', fillColor)
        }

        if (emptyColor && emptyColor !== this.#settedEmptyColor) {
            this.#settedEmptyColor = emptyColor;
            this.#progressWrapper.style.setProperty('--empty-color', emptyColor)
        }

        return this;
    }

    changeBarWidth(newWidth) {
        if (newWidth !== this.#width) {
            this.#progressWrapper.style.setProperty('--bar-width', newWidth + 'px');
            this.#width = newWidth;
        }
    }

}

const defaultFillColor = '#005CFF';
const defaultEmptyColor = 'white';

const deftaultWidth = 10;

const simpleAnimation = 'progressbar_animated__simple';
const pathAnimation = 'progressbar_animated__path';

const getSimpleAnimated = () => {
    const OutherLook = document.createElement('div');

    OutherLook.role = 'progressbar';
    OutherLook.classList.add(simpleAnimation);

    return OutherLook;
}

const getPathAnimated = (width = 0) => {
    const OutherLook = document.createElement('div');
    const svg = document.createElement('svg');

    OutherLook.append(svg);

    svg.outerHTML = `<svg height="130" width="130">
        <circle class='progress__circle' cx='65' cy='65' pathLength="360" r="${65 - width / 2}" fill="transparent" />
    </svg>`;

    OutherLook.role = 'progressbar';
    OutherLook.classList.add(pathAnimation);


    return OutherLook;
}

const getNone = () => {
    const OutherLook = document.createElement('div');

    OutherLook.role = 'progressbar';
    OutherLook.style.display = 'none';

    return OutherLook;
}


const getNormal = () => {
    const OutherLook = document.createElement('div');

    OutherLook.setAttribute('role', 'progressbar');
    OutherLook.setAttribute('cur-value', 0);

    OutherLook.style.setProperty('--progress', '0%');

    return OutherLook;
}

export const ProgressBar = (state = null, maxVal = null) => {
    let max = maxVal ?? 1;
    let OutherLook;

    switch (state) {
        case 'Animated':
            OutherLook = getSimpleAnimated();
            break;
        case 'Hidden':
            OutherLook = getNone();
            break;
        default:
            state = 'Normal'
            OutherLook = getNormal();
    }

    let settedFillColor = defaultFillColor;
    let settedEmptyColor = defaultEmptyColor;
    let width = deftaultWidth;

    let animationStyle = 'simple';
    let placedElement = null;
    let whereToPlace = null;

    return {
        render(placement) {
            if (!placement) {
                console.error(`Not correct placement for ProgressBar: ${placement}`);
                return;
            }
            whereToPlace = placement;

            if (placedElement) {
                placement.removeChild(placedElement);
            }

            OutherLook.style.setProperty('--empty-color', settedEmptyColor);
            OutherLook.style.setProperty('--bar-width', width + 'px');

            placedElement = OutherLook;
            OutherLook.style.setProperty('--fill-color', settedFillColor);

            placement.append(OutherLook);
            return this;
        },
        changeState(newState) {
            switch (newState) {
                case 'Animated':
                    OutherLook = getSimpleAnimated();
                    break;
                case 'Hidden':
                    OutherLook = getNone();
                    break;
                default:
                    newState = 'Normal'
                    OutherLook = getNormal();
            }
            state = newState;
            if (whereToPlace) return this.render(whereToPlace);

            return this;
        },
        animate(newAnimationStyle = null) {
            if (state.startsWith('Animated')) {
                state = 'Animated';
            }
            if (newAnimationStyle !== animationStyle) {
                animationStyle = newAnimationStyle
            }

            switch (animationStyle) {
                case 'Animated-path':
                    OutherLook = getPathAnimated(width);
                    break;
                default:
                    OutherLook = getSimpleAnimated();
            }

            if (whereToPlace) return this.render(whereToPlace);

            return this;
        },
        changeValue(newValue) {
            if (state !== 'Normal') {
                state = 'Normal';
            }

            if (newValue == null || newValue === NaN) return this;

            if (newValue > max) {
                newValue = max;
            }

            OutherLook.style.setProperty('--progress', `${Math.floor(newValue / max * 100)}%`);

            return this;
        },
        changeColors(fillColor = null, emptyColor = null) {
            if (fillColor && fillColor !== settedFillColor) {
                settedFillColor = fillColor;
                OutherLook.style.setProperty('--fill-color', fillColor)
            }

            if (emptyColor && emptyColor !== settedEmptyColor) {
                settedEmptyColor = emptyColor;
                OutherLook.style.setProperty('--empty-color', emptyColor)
            }

            return this;
        },
        changeBarWidth(newWidth) {
            if (newWidth !== width) {
                OutherLook.style.setProperty('--bar-width', newWidth + 'px');
                width = newWidth;
            }
        }
    }
}

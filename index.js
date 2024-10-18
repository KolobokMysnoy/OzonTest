const progress = document.querySelector('my-progress-bar');


const valueInput = document.getElementById('value-input');
const checkValue = (event) => {
    if (progress.animation !== '') {
        progress.animation = '';
    }
    let valueToSet = Number(event.currentTarget.value);
    if (valueToSet < 0) {
        valueToSet = 0;
    }
    if (valueToSet > progress.max) {
        valueToSet = progress.max;
    }
    valueInput.value = valueToSet;

    progress.value = valueToSet;
};

valueInput.addEventListener('input', checkValue);

valueInput.addEventListener('change', checkValue);


const animationButton = document.getElementById('animation-button');
animationButton.addEventListener('click', () => {
    if (progress.animation && progress.animation.startsWith('Animated')) {
        progress.animation = '';
    } else {
        progress.animation = 'Animated';
    }
});


const hideButton = document.getElementById('hide-button');
hideButton.addEventListener('click', () => {
    progress.hidden = !(progress.hidden === 'true');
})


const barInput = document.getElementById('bar-input');
const checkBar = (event) => {
    let valueToSet = Number(event.currentTarget.value);
    if (Number(valueToSet) === NaN) {
        valueToSet = 0;
    };

    if (valueToSet < 0) {
        valueToSet = 1;
    };
    if (valueToSet > progress.maxPenWidth) {
        valueToSet = progress.maxPenWidth;
    }
    barInput.value = valueToSet;

    progress.penWidth = valueToSet;
}
barInput.addEventListener('input', checkBar);
barInput.addEventListener('change', checkBar);


const animateSelect = document.getElementById('animation-select');
animateSelect.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        progress.animation = 'Animated-path';
    } else {
        progress.animation = 'Animated';
    }
})


const colorPicker = document.getElementById('color-input');
const colorPlacement = document.getElementsByClassName('color__placement')[0];

colorPicker.addEventListener('change', (event) => {
    progress.fillColor = event.currentTarget.value;
    colorPlacement.style.setProperty('--picked-color', event.currentTarget.value);
})


const setCustomization = (displayValue) => {
    barInput.parentElement.style.display = displayValue;
    animateSelect.parentElement.style.display = displayValue;
    colorPicker.parentElement.style.display = displayValue;
}

const customization = document.getElementById('customization-button');
customization.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        setCustomization('')
    } else {
        setCustomization('none')
    }
})

setCustomization('none')


const observer = new MutationObserver((records) => {
    records.forEach((record) => {
        const attributeName = record.attributeName;

        if (attributeName === 'animation' && record.target[attributeName] !== '') {
            if (record.target[attributeName].startsWith('Animated')) {
                animationButton.checked = true;
            }
            if (record.target[attributeName] === 'Animated-path') {
                animateSelect.checked = true;
            }
        }

        if (attributeName === 'animation' && record.target[attributeName] === '') {
            animateSelect.checked = false;
            animationButton.checked = false;
        }

        if (attributeName === 'ishidden') {
            hideButton.checked = record.target.getAttribute(attributeName) === 'true';
        }

        if (attributeName === 'value') {
            progress.animation = '';
        }
    })
})

observer.observe(progress, {
    attributes: true,
    attributeFilter: ['animation', 'fill-color', 'ishidden', 'value']
})
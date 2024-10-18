const progress = document.querySelector('my-progress-bar');


const valueInput = document.getElementById('value-input');
valueInput.addEventListener('input', (event) => {
    if (progress.animation !== '') {
        progress.animation = '';
    }
    let valueToSet = Number(event.currentTarget.value);
    if (valueToSet < 0) {
        valueInput.value = 0;
        valueToSet = 0;
    }
    if (valueToSet > progress.max) {
        valueInput.value = progress.max;
        valueToSet = progress.max;
    }
    progress.value = Number(event.currentTarget.value) ?? 0
});

valueInput.addEventListener('change', (event) => {
    let valueToSet = event.currentTarget.value;
    if (Number(valueToSet) === NaN || valueToSet === '') { valueInput.value = 0; valueToSet = 0; };

    if (valueToSet < 0) {
        valueInput.value = 0;
        valueToSet = 0;
    }
    if (valueToSet > progress.max) {
        valueInput.value = progress.max;
        valueToSet = progress.max;
    }

    progress.value = Number(event.currentTarget.value) ?? 0
});


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
barInput.addEventListener('input', (event) => {
    let valueToSet = event.currentTarget.value;
    if (Number(valueToSet) === NaN) return;

    if (valueToSet < 0) {
        barInput.value = 1;
        valueToSet = 1;
    };
    if (valueToSet > progress.maxPenWidth) {
        barInput.value = progress.maxPenWidth;
        valueToSet = progress.maxPenWidth;
    }
    progress.penWidth = Number(valueToSet) ?? 1;
});

barInput.addEventListener('change', (event) => {
    let valueToSet = event.currentTarget.value;
    if (Number(valueToSet) === NaN) return;

    if (valueToSet > progress.maxPenWidth) {
        barInput.value = progress.maxPenWidth;
        valueToSet = progress.maxPenWidth;
    };

    if (valueToSet < 1) {
        barInput.value = 1;
        valueToSet = 1;
    };
    progress.penWidth = valueToSet;
});


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
            console.log(record.target.getAttribute(attributeName))
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
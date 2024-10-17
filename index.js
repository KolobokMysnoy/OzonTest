let state = {
    renderStyle: 'Normal',
    isHidden: false,
};
const callbacksRenderStyle = [];
const callbackIsHidden = [];

state = new Proxy(state, {
    set: function (target, key, newValue) {
        if (key === 'renderStyle' && target[key] !== newValue) {
            callbacksRenderStyle.forEach((val) => val(newValue));
        }
        if (key === 'isHidden' && target[key] !== newValue) {
            callbackIsHidden.forEach((val) => val(newValue));
        }

        target[key] = newValue;
        return true;
    },
})

const createAnimatedButton = (renderAnimated, renderNormal) => {
    const animationButton = document.getElementById('animation-button');
    animationButton.addEventListener('click', () => {
        if (state.renderStyle.startsWith('Animated')) {
            state.renderStyle = 'Normal';
            renderNormal();
        } else {
            state.renderStyle = 'Animated';
            renderAnimated();
        }
        state.isHidden = false;
    });

    callbacksRenderStyle.push((changedRenderStyle) => {
        if (!changedRenderStyle.startsWith('Animated')) {
            animationButton.checked = false;
        } else {
            animationButton.checked = true;
        }
    });
}

const createHideButton = (hide, open) => {
    const hideButton = document.getElementById('hide-button');
    hideButton.addEventListener('click', () => {
        if (state.isHidden) {
            open();
        } else {
            hide();
        }

        state.isHidden = !state.isHidden;
    })

    callbackIsHidden.push((newHideValue) => {
        if (newHideValue !== hideButton.checked) {
            hideButton.checked = newHideValue;
        }
    })
}

const createValueField = (changeValue, changeToNormal) => {
    const valueInput = document.getElementById('value-input');
    valueInput.addEventListener('input', (event) => {
        if (state.renderStyle !== 'Normal') {
            changeToNormal();
            state.renderStyle = 'Normal';
            state.isHidden = false;
        }

        changeValue(Number(event.currentTarget.value) ?? 0);
    });

    valueInput.addEventListener('change', (event) => {
        let valueToSet = event.currentTarget.value;
        if (Number(valueToSet) === NaN || valueToSet === '') { valueInput.value = 0; valueToSet = 0; };

        if (valueToSet > 100) { valueInput.value = 100; valueToSet = 100; };
        if (valueToSet < 0) { valueInput.value = 0; valueToSet = 0; };

        changeValue(valueToSet);
    });

    callbacksRenderStyle.push((newRenderStyle) => {
        if (newRenderStyle === 'Normal') {
            Promise.resolve().then(() => {
                changeValue(valueInput.value)
            });
        }
    })

    callbackIsHidden.push((newHideState) => {
        if (!newHideState && state.renderStyle === 'Normal') {
            Promise.resolve().then(() => {
                changeValue(valueInput.value)
            });
        }
    })
}

createHideButton(
    () => {
        progress.hidden = 'true';
    },
    () => {
        progress.hidden = 'false';
    }
);

const progress = document.querySelector('my-progress-bar');

createAnimatedButton(
    () => progress.animation = state.renderStyle,
    () => progress.animation = ''
);

const barInput = document.getElementById('bar-input');
barInput.addEventListener('input', (event) => {
    let valueToSet = event.currentTarget.value;
    if (Number(valueToSet) === NaN) return;

    if (valueToSet < 0) { barInput.value = 1; valueToSet = 1; };
    if (valueToSet > progress.maxPenWidth) {
        valueToSet = progress.maxPenWidth;
    }
    progress.penWidth = Number(event.currentTarget.value) ?? 1;
});

barInput.addEventListener('change', (event) => {
    let valueToSet = event.currentTarget.value;
    if (Number(valueToSet) === NaN) return;

    if (valueToSet > progress.maxPenWidth) {
        barInput.value = progress.maxPenWidth;
        valueToSet = progress.maxPenWidth;
    };

    if (valueToSet < 1) { barInput.value = 1; valueToSet = 1; };
    progress.penWidth = valueToSet;
});


const animateSelect = document.getElementById('animation-select');
animateSelect.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        state.renderStyle = 'Animated-path';
        progress.animation = 'Animated-path';
    } else {
        state.renderStyle = 'Animated';
        progress.animation = 'Animated';
    }
    state.isHidden = false;
})

callbacksRenderStyle.push((newRenderStyle) => {
    if (newRenderStyle !== 'Animated-path') {
        animateSelect.checked = false;
    }
})

createValueField(
    (newValue) => { progress.value = Number(newValue) },
    () => progress.animation = ''
);

const colorPicker = document.getElementById('color-input');
const colorPlacement = document.getElementsByClassName('color__placement')[0];

colorPicker.addEventListener('change', (event) => {
    progress.fillColor = event.currentTarget.value;
    colorPlacement.style.setProperty('--picked-color', event.currentTarget.value);
})

const customization = document.getElementById('customization-button');
customization.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        barInput.parentElement.style.display = '';
        animateSelect.parentElement.style.display = '';
        colorPicker.parentElement.style.display = '';
    } else {
        barInput.parentElement.style.display = 'none';
        animateSelect.parentElement.style.display = 'none';
        colorPicker.parentElement.style.display = 'none';
    }
})

animateSelect.parentElement.style.display = 'none';
barInput.parentElement.style.display = 'none';
colorPicker.parentElement.style.display = 'none';

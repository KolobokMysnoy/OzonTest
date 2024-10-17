# Описание

Для использования элемента необходимо добавить js файл `<script src="progressbar.js" defer></script>`. 
Внутри HTML нужно использовать компонент `my-progress-bar`.

# Параметры

У данного компонента есть следующие аттрибуты:
- `pen-width` - для регулировки толщины линии `my-progress-bar`;
- `ishidden` - для скрытия компонента;
- `value` - для регулирования процента заполнения `my-progress-bar`;
- `max` - для указания максимального чилса, от которого будет высчитываться процент заполнения;
- `color` - для изменения цвета полоски заполнения;
- `animation` - переключение `my-progress-bar` в режим бесконечной прокрутки. В данном режиме есть два типа прокрутки:
    - `Animated` - для простой прокрутки выполненной при помощи `rotate`;
    - `Animated-path` - для прокрутки выполненной при помощи `svg`.

## Example

```HTML
<my-progress-bar value="10" max="100"></my-progress-bar>
```

И взаимодействие внутри JS.

```js
const progress = document.querySelector('my-progress-bar');

progress.animation = 'Animated'; // Установка анимации
progress.value = 10; // Установка другого значения
progress.animation = ''; // Перключение из анимации в режим показывания процента
```


--- <br/><br/>-

# Литература: <br>

[KevinPowell YouTube](https://www.youtube.com/watch?v=MXWP56LUI3g&t=1252s&ab_channel=KevinPowell)

[Simple CSS Loader W3](https://www.w3schools.com/howto/howto_css_loader.asp#:~:text=The%20border%2Dradius%20property%20transforms,%22%20(see%20example%20below).)

[SVG paths video](https://www.youtube.com/watch?v=ULomsOSk4JA&ab_channel=HunorM%C3%A1rtonBorb%C3%A9ly)

[CSS Toggle button](https://www.youtube.com/watch?v=N8BZvfRD_eU&ab_channel=WebDevSimplified) 

[Custom Element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#registering_a_custom_element)
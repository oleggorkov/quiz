import $ from "jquery";

const count = $(('#count'));
$({ Counter: 0 }).animate({ Counter: count.text() }, {
    duration: 5000,
    easing: 'linear',
    step: function () {
        count.text(Math.ceil(this.Counter)+ "%");
    }
});

window.addEventListener('load',function () {
    let inp = document.querySelector('#phone');

    inp.addEventListener('focus', _ => {
        if(!/^\+\d*$/.test(inp.value))
            inp.value = '+7';
    });

    inp.addEventListener('keypress', e => {
        if(!/\d/.test(e.key))
            e.preventDefault();
    });
});

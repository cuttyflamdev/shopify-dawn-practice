document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq__item');
        const answer = item.querySelector('.faq__answer');
        const isOpen = item.classList.contains('faq__item--open');

        document.querySelectorAll('.faq__item').forEach(el => {
            el.classList.remove('faq__item--open');
            el.querySelector('.faq__answer').style.maxHeight = null;
            el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('faq__item--open');
            button.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});
if (!customElements.get('free-shipping-bar')) {
    class FreeShippingBar extends HTMLElement {
        connectedCallback() {
            this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
                this.onCartUpdate();
            });
        }

        async onCartUpdate() {
            const response = await fetch(`${window.location.pathname}?section_id=${this.dataset.sectionId}`);
            if (!response.ok) return;
            const html = await response.text();
            if (!this.isConnected) return;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newBar = doc.querySelector('free-shipping-bar');
            if (!newBar) return;
            const newBarFill = newBar.querySelector('.free-shipping-bar__fill');
            const oldBarFill = this.querySelector('.free-shipping-bar__fill');
            oldBarFill.style.width = newBarFill.style.width;
            const newBarMessage = newBar.querySelector('.free-shipping-bar__message');
            const oldBarMessage = this.querySelector('.free-shipping-bar__message');
            oldBarMessage.textContent = newBarMessage.textContent;
            const newBarTrack = newBar.querySelector('.free-shipping-bar__track');
            const oldBarTrack = this.querySelector('.free-shipping-bar__track');
            oldBarTrack.setAttribute('aria-valuenow', newBarTrack.getAttribute('aria-valuenow'));
        }

        disconnectedCallback() {
            this.cartUpdateUnsubscriber();
        }
    }
    customElements.define('free-shipping-bar', FreeShippingBar);    
}

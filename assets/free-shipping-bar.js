class FreeShippingBar extends HTMLElement {
    connectedCallback() {
        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
            console.log('cart changed', event)
        });
    }
}

customElements.define('free-shipping-bar', FreeShippingBar);
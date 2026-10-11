if (!customElements.get('delivery-estimator')) {
    class DeliveryEstimator extends HTMLElement {
        connectedCallback() {
            this.render();
            this.timer = setInterval(() => this.render(), 1000);
        }

        disconnectedCallback() {
            clearInterval(this.timer);
        }

        render() {
            const leadTime = Number(this.getAttribute('data-lead-time'));
            const cutOffHour = Number(this.getAttribute('data-cutoff-hour'));
            const storeTimeZone = this.getAttribute('data-timezone');
            const { hour, minute, second } = this.getStoreTime(storeTimeZone);
            const storeTimeInSeconds = hour * 3600 + minute * 60 + second;
            const cutOffHourInSeconds = cutOffHour * 3600;
            const remainingTimeInSeconds = cutOffHourInSeconds - storeTimeInSeconds;
            var deliveryDay = this.getDeliveryDay(leadTime, storeTimeZone);
            if (remainingTimeInSeconds > 0) {
                const remainingTimeInHour = Math.floor(remainingTimeInSeconds / 3600);
                const remainingTimeInMinute = Math.floor((remainingTimeInSeconds % 3600) / 60);
                const result = remainingTimeInHour + 'h ' + remainingTimeInMinute + 'm';
                this.textContent = `Order within ${result} to get it by ${deliveryDay}`;
            } else {
                deliveryDay = this.getDeliveryDay(leadTime + 1, storeTimeZone);
                this.textContent = `Order now to get it by ${deliveryDay}`;
            }
        }

        getStoreTime(storeTimeZone) { 
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: storeTimeZone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            const storeTime = formatter.formatToParts(new Date());
            const hour = Number(storeTime.find(part => part.type === 'hour').value);
            const minute = Number(storeTime.find(part => part.type === 'minute').value);
            const second = Number(storeTime.find(part => part.type === 'second').value);
            return { hour, minute, second }; 
        }

        getDeliveryDay(leadTime, storeTimeZone) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: storeTimeZone,
                weekday: 'long'
            });
            const date = new Date();
            date.setDate(date.getDate() + leadTime);
            const deliveryDay = formatter.format(date);
            return deliveryDay;
        }
    }
    customElements.define('delivery-estimator', DeliveryEstimator); 
}
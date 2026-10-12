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
            // Convert midnight to 0 hour because some browsers report midnight as 24 with a 24-hour clock
            const hour = Number(storeTime.find(part => part.type === 'hour').value) % 24;
            const minute = Number(storeTime.find(part => part.type === 'minute').value);
            const second = Number(storeTime.find(part => part.type === 'second').value);
            return { hour, minute, second }; 
        }

        getDeliveryDay(leadTime, storeTimeZone) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: storeTimeZone,
                weekday: 'long'
            });

            // Get the current moment in milliseconds
            let timestamp = Date.now();
            let count = 0;
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000; 
            while (count < leadTime) {
                // Step forward one day at a time until enough business days are counted
                timestamp += oneDayInMilliseconds;
                // Check for weekday
                const weekday = formatter.format(timestamp);
                if (weekday !== 'Saturday' && weekday !== 'Sunday') {
                    // Increment count
                    count += 1;
                }
            }
            const deliveryDay = formatter.format(timestamp);
            return deliveryDay;
        }
    }
    customElements.define('delivery-estimator', DeliveryEstimator); 
}
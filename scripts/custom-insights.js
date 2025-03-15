// scripts/custom-insights.js

// Override the default va function
window.va = function () {
    // Block page view tracking
    if (arguments[0] === 'pageview') {
        console.log('Page view tracking blocked');
        return;
    }

    // Forward all other events to the original va function
    (window.vaq = window.vaq || []).push(arguments);
};

// Track a custom "visitor" event
window.va('event', 'visitor', {
    url: window.location.href,
    userAgent: navigator.userAgent,
});
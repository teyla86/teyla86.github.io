document.addEventListener('DOMContentLoaded', function () {

    function updateTime(tz, el) {
        el.innerHTML(new Date().toLocaleTimeString("en-GB", {timeZone: tz, timeStyle: 'short'}));
    };

    function startClock(tzs, els) {
        tzs.forEach(function (value, i) {
            updateTime(value, els[i]);
        });
    };

    const accordionTitles = document.querySelectorAll(".accordionTitle");

    accordionTitles.forEach((accordionTitle) => {
	accordionTitle.addEventListener("click", () => {
		if (accordionTitle.classList.contains("is-open")) {
			accordionTitle.classList.remove("is-open");
		} else {
			const accordionTitlesWithIsOpen = document.querySelectorAll(".is-open");
			accordionTitlesWithIsOpen.forEach((accordionTitleWithIsOpen) => {
				accordionTitleWithIsOpen.classList.remove("is-open");
			});
			accordionTitle.classList.add("is-open");
		}
	});
});

});


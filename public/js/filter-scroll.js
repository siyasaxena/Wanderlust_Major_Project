// This part handles the click
function scrollFilters(direction) {
    const filters = document.getElementById("filters");
    const scrollAmount = (direction === 'left') ? -300 : 300;
    filters.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// This part handles the arrow visibility
document.addEventListener("DOMContentLoaded", () => {
    const filters = document.getElementById("filters");
    const prevBtn = document.getElementById("prev-btn");

    if (filters && prevBtn) {
        prevBtn.style.display = "none";

        filters.addEventListener("scroll", () => {
            if (filters.scrollLeft > 10) {
                prevBtn.style.display = "flex";
            } else {
                prevBtn.style.display = "none";
            }
        });
    }
});
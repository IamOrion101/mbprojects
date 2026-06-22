document.addEventListener('DOMContentLoaded', () => {
    
    // Interactive Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to the clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Minor delay to trigger smooth CSS transitions if handled
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });

    // Basic Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Grab values if you want to route them to an API later
        alert('Thank you for reaching out! We will get back to you shortly.');
        contactForm.reset();
    });
});
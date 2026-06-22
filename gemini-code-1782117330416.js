document.addEventListener('DOMContentLoaded', () => {
    
    // Interactive Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- WHATSAPP FORM SUBMISSION WITH CALLMEBOT ---
    const contactForm = document.getElementById('contactForm');
    
    // ⚠️ REPLACE THESE WITH YOUR ACTUAL DETAILS FROM CALLMEBOT
    const PHONE_NUMBER = "27747017967"; // e.g., "27712345678"
    const API_KEY = "4898902";           // The numeric key sent by the bot

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Capture Form Inputs
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const msg = contactForm.querySelector('textarea').value;

        // 2. Format the Text Message cleanly
        const textMessage = `📩 *New Website Lead!*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${msg}`;
        
        // 3. Build CallMeBot API Endpoint
        const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE_NUMBER}&text=${encodeURIComponent(textMessage)}&apikey=${API_KEY}`;

        // 4. Send the request silently in the background
        fetch(url, { mode: 'no-cors' }) 
            .then(() => {
                alert('Thank you! Your message has been sent directly to our team via WhatsApp.');
                contactForm.reset();
            })
            .catch(err => {
                console.error('Error routing to WhatsApp:', err);
                alert('Something went wrong. Please try again.');
            });
    });
});

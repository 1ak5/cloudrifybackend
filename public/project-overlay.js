
    // Project Case Study View Toggle
    document.querySelectorAll('.view-case-study').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-card');
            
            // Close any other active project cards
            document.querySelectorAll('.project-card.active').forEach(card => {
                if (card !== projectCard) {
                    card.classList.remove('active');
                }
            });
            
            // Toggle the current card
            projectCard.classList.add('active');
        });
    });

    // Close project info when clicking close button
    document.querySelectorAll('.close-project-info').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectCard = closeBtn.closest('.project-card');
            projectCard.classList.remove('active');
        });
    });

    // Close project info when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card') && !e.target.closest('.view-case-study')) {
            document.querySelectorAll('.project-card.active').forEach(card => {
                card.classList.remove('active');
            });
        }
    });


document.addEventListener('DOMContentLoaded', function () {
    // Toggle dropdown menu on click for .dropdown-toggle
    document.querySelectorAll('.dropdown-toggle').forEach(function (dropdownToggle) {
        dropdownToggle.addEventListener('click', function (e) {
            e.preventDefault();
            var dropdownMenu = this.nextElementSibling;
            toggleDropdown(dropdownMenu);
        });
    });

    // Toggle mobile menu on hamburger icon click
    document.querySelector('.hamburger-menu').addEventListener('click', function () {
        document.querySelector('nav ul').classList.toggle('open');
    });

    // Close dropdown menu and mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (!target.closest('.dropdown-toggle') && !target.closest('#art_enthu')) {
            document.querySelectorAll('.dropdown-menu, .art_dropDown').forEach(function (menu) {
                menu.style.display = 'none';
            });
        }

        if (!target.closest('nav ul') && !target.closest('.hamburger-menu') && !target.classList.contains('search-input')) {
            document.querySelector('nav ul').classList.remove('open');
        }
    });

    // Prevent closing dropdown menu when clicking inside
    document.querySelectorAll('.dropdown-menu, .art_dropDown').forEach(function (dropdownMenu) {
        dropdownMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Prevent closing mobile menu when clicking inside
    document.querySelector('nav ul').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Function to toggle dropdown visibility
    function toggleDropdown(dropdownMenu) {
        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu, .art_dropDown').forEach(function (menu) {
            if (menu !== dropdownMenu) {
                menu.style.display = 'none';
            }
        });

        // Toggle the clicked dropdown
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
        }
    }

    // Special handling for the "Art On Demand" link
    document.getElementById('art_enthu').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default action
        var dropdownMenu = this.nextElementSibling; // Get the dropdown menu
        toggleDropdown(dropdownMenu); // Toggle the dropdown
    });
});

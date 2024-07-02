document.addEventListener('DOMContentLoaded', function () {
    // Toggle dropdown menu on click
    document.querySelectorAll('.dropdown-toggle').forEach(function (dropdownToggle) {
        dropdownToggle.addEventListener('click', function (e) {
            e.preventDefault();
            var dropdownMenu = this.nextElementSibling;

            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(function (menu) {
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
        });
    });

    // Toggle mobile menu on hamburger icon click
    document.querySelector('.hamburger-menu').addEventListener('click', function () {
        document.querySelector('nav ul').classList.toggle('open');
    });

    // Close dropdown menu and mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        var target = e.target;

        if (!target.closest('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-menu').forEach(function (menu) {
                menu.style.display = 'none';
            });
        }

        if (!target.closest('nav ul') && !target.closest('.hamburger-menu') && !target.classList.contains('search-input')) {
            document.querySelector('nav ul').classList.remove('open');
        }
    });

    // Prevent closing dropdown menu when clicking inside
    document.querySelectorAll('.dropdown-menu').forEach(function (dropdownMenu) {
        dropdownMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Prevent closing mobile menu when clicking inside
    document.querySelector('nav ul').addEventListener('click', function (e) {
        e.stopPropagation();
    });
});





// Artist Drop Down
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropdown-menu').forEach(function(dropdownToggle) {
        dropdownToggle.addEventListener('click', function(event) {
            event.preventDefault();
            let dropdownMenu = this.nextElementSibling;
            let isDropdownOpen = dropdownMenu.style.display === 'block';
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                menu.style.display = 'none';
            });
            
            // Toggle the current dropdown
            if (!isDropdownOpen) {
                dropdownMenu.style.display = 'block';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                menu.style.display = 'none';
            });
        }
    });
});
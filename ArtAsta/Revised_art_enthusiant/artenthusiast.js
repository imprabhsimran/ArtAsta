class HeaderContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
    <nav>
        <div class="logo">
            <img src="./white-logo-project.jpeg" class="mylogo" alt="logo-image">
            <!-- Add your main logo image here -->
        </div>
        <ul>
            <li>
                <a href="#">Home</a>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle">
                    Auction <span class="caret"></span>
                </a>
            </li>
            <li>
                <a href="#" id="art_enthu">Art On Demand</a>
                <ul class="art_dropDown">
                    <li><a href="./auctionDashboard.html">Art on Demand List</a></li>
                    <li><a href="#">Create New Art on Demand</a></li>
                </ul>
            </li>
            <li>
                <a href="#">Find Artists</a>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle">
                    My Profile <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <div class="first-section">
                        <img src="./white-logo-project.jpeg" alt="Icon" class="dropdown-icon mylogo">
                        <h4>David Turner</h4>
                        <li><a href="#">Profile Details</a></li>
                    </div>
                    <div>
                        <h4>Auction</h4>
                        <li><a href="#">My Auctions</a></li>
                    </div>
                    <div>
                        <h4>Art on Demand</h4>
                        <li><a href="#">My Projects</a></li>
                    </div>
                    <li><a href="#">Sign Out</a></li>
                </ul>
            </li>
        </ul>
        <!-- Search container -->
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search...">
            <i class="fas fa-filter search-icon"></i> <!-- Font Awesome filter icon -->
        </div>
        <div class="hamburger-menu">
            <i class="fas fa-bars"></i>
        </div>
    </nav>
</header>
        `
    }
}

class FooterContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
         <footer>
        <div class="footer-content">
            <div class="footer-section">
                <div class="logo-and-text">
                    <img src="./white-logo-project.jpeg" class="footer-logo flogo" alt="logo-image">
                    <h2>Art Asta</h2>
                </div>
            </div>
            <div class="footer-section first">
                <h4>Follow Us</h4>
                <ul>
                    <li>
                        <a href="#">
                            <i class="fab fa-facebook" aria-hidden="true"></i><span
                                class="visually-hidden">Facebook</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-linkedin" aria-hidden="true"></i><span
                                class="visually-hidden">LinkedIn</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-twitter" aria-hidden="true"></i><span
                                class="visually-hidden">Twitter</span>
                        </a>
                    </li>

                </ul>
            </div>
            <div class="footer-section second">
                <h4>Product</h4>
                <ul>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Download</a></li>
                </ul>
            </div>
            <div class="footer-section third">
                <h4>Group</h4>
                <ul>
                    <li><a href="#">Meet the Team</a></li>
                </ul>
            </div>
            <div class="copyright">
                <p>Copyright&copy; 2024 Mavericks Group. All rights reserved.</p>
            </div>
        </div>
    </footer>
        `
    }
}

customElements.define('header-content',HeaderContent)
customElements.define('footer-content',FooterContent)


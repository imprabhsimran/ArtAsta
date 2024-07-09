class ArtistHeaderContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="mobile-header">
        <div class="logo-name">
            <img src="./white-logo-project.jpg" alt="My logo image">
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>
        <div class="mobile-navigation">
            <input type="text" placeholder="Search Items" id="search-field">
            <i class="fas fa-search"></i>
            <i class="fa-regular fa-bars"></i>
        </div>
    </header>
    <a href=""></a>
    <header class="desktop-header">
        <img src="./white-logo-project.jpeg" alt="mylogo">
        <nav class="header-main-nav">
            <ul class="header-nav-elements">
                <li>
                    <a href="/Homepage-dashboard/homepage.html">Home</a>
                </li>
                <li>
                    <a href="#" id="artist-dropdown">Auction<i class="fa-solid fa-angle-down"></i></a>
                    <ul class="artist-dropdown">
                        <li>
                            <a href="/AuctionList/listing.html">Auction List</a>
                        </li>
                        <li>
                            <a href="/Auction/create-auction.html">Create New Auction</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="/art-on-demand/aod-post-dashboard.html">Art on Demand</a>
                </li>
                <li>
                    <a href="/artasta-map/map.html">Find Artists</a>
                </li>
                <li>
                    <a href="#" id="artist-profile-dropdown">Profile<i class="fa-solid fa-angle-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="/Profile/profile.html">My Profile</a></li>
                        <li><a href="#">Sign Out</a></li>
                    </ul>
                </li>
                <div class="desktop-navigation">
                    <input type="text" placeholder="Search Items" id="search-field">
                    <i class="fas fa-search"></i>
                </div>
            </ul>
        </nav>
    </header>
        `
    }
}

class FooterContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
         <footer class="mobile-footer">
        <div class="logo-name">
            <img src="./white-logo-project.jpeg" alt="My logo image">
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>

        <div class="footer-nav">
            <div class="social-media-icons">
                <h2>Follow Us</h2>
                <a href="https://www.facebook.com" target="_blank" class="facebook"><i
                        class="fab fa-facebook-f"></i></a>
                <a href="https://www.twitter.com" target="_blank" class="twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com" target="_blank" class="linkedin"><i
                        class="fab fa-linkedin-in"></i></a>
            </div>
            <div class="product">
                <h2>Product</h2>
                <p>About</p>
                <p>Download</p>
            </div>
            <div class="group">
                <h2>Group</h2>
                <p>Meet the team</p>
            </div>
        </div>
        <p class="footer-caption">Copyright &copy; 2024 Mavericks Group. All rights reserved.</p>
    </footer>

    <footer class="tablet-footer">
        <div class="logo-name">
            <img src="./white-logo-project.jpeg" alt="My logo image">
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>

        <div class="footer-nav">
            <div class="social-media-icons">
                <h2>Follow Us</h2>
                <a href="https://www.facebook.com" target="_blank" class="facebook"><i
                        class="fab fa-facebook-f"></i></a>
                <a href="https://www.twitter.com" target="_blank" class="twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com" target="_blank" class="linkedin"><i
                        class="fab fa-linkedin-in"></i></a>
            </div>
            <div class="product">
                <h2>Product</h2>
                <p>About</p>
                <p>Download</p>
            </div>
            <div class="group">
                <h2>Group</h2>
                <p>Meet the team</p>
            </div>
        </div>
        <p class="footer-caption">Copyright &copy; 2024 Mavericks Group. All rights reserved.</p>
    </footer>
        `
    }
}

customElements.define('artist-header-content',ArtistHeaderContent)
customElements.define('footer-content',FooterContent)


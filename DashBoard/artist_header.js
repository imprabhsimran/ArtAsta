class ArtistHeaderContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="mobile-header">
        <div class="logo-name">
            <a href="../Homepage-dashboard/homepage.html"><img src="/DashBoard/white-logo-project.jpeg" alt="My logo image"></a>
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>
        
        <div class="mobile-navigation">
            <div class="search-container">
                <input type="text" placeholder="Search by Title" id="search-field">
                <i class="fas fa-search"></i>
            </div>
            <i class="fa-regular fa-bars" id="nav-drpdn"></i>
        </div>
         <nav class="header-mobile-main-nav">
            <ul class="header-mobile-nav-elements">
                <li>
                    <a href="/Homepage-dashboard/homepage.html">Home</a>
                </li>
                <li>                
                            <a href="/AuctionList/listing.html">Auction List</a>
                        </li>
                        <li>
                            <a href="/Auction/create-auction.html">Create New Auction</a>
                        </li>
                </li>
                <li>
                    <a href="/art-on-demand/aod-post-dashboard.html">Art on Demand</a>
                </li>
                <li>
                    <a href="/artasta-map/map.html">Find Artists</a>
                </li>
                <li>
                        <li><a href="/Profile/profile.html">My Profile</a></li>
                        <li><a href="/Sign_out/signout.html" id="sign_out_id">Sign Out</a></li>
                </li>
            </ul>
        </nav>
    </header>
    <header class="desktop-header">
        <a href="../Homepage-dashboard/homepage.html"><img src="/DashBoard/white-logo-project.jpeg" alt="mylogo"></a>
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
                        <li><a href="/Sign_out/signout.html" id="sign_out_id">Sign Out</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
        `
    }
}


class WithoutSearchField extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="mobile-header">
        <div class="logo-name">
            <img src="/DashBoard/white-logo-project.jpeg" alt="My logo image">
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>
        
        <div class="mobile-navigation">
            <i class="fa-regular fa-bars"></i>
        </div>
         <nav class="header-mobile-main-nav">
            <ul class="header-mobile-nav-elements">
                <li>
                    <a href="/Homepage-dashboard/homepage.html">Home</a>
                </li>
                <li>                
                            <a href="/AuctionList/listing.html">Auction List</a>
                        </li>
                        <li>
                            <a href="/Auction/create-auction.html">Create New Auction</a>
                        </li>
                </li>
                <li>
                    <a href="/art-on-demand/aod-post-dashboard.html">Art on Demand</a>
                </li>
                <li>
                    <a href="/artasta-map/map.html">Find Artists</a>
                </li>
                <li>
                        <li><a href="/Profile/profile.html">My Profile</a></li>
                        <li><a href="/Sign_out/signout.html" id="sign_out_id">Sign Out</a></li>
                </li>
            </ul>
        </nav>
    </header>
    <header class="desktop-header">
        <img src="/DashBoard/white-logo-project.jpeg" alt="mylogo">
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
                        <li><a href="/Sign_out/signout.html" id="sign_out_id">Sign Out</a></li>
                    </ul>
                </li>
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
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>

        <p class="footer-caption">Copyright &copy; 2024 Mavericks Group. All rights reserved.</p>
    </footer>

    <footer class="tablet-footer">
        <div class="logo-name">
            <h1><span class="black">Art</span><span class="orange">Asta</span></h1>
        </div>
        <p class="footer-caption">Copyright &copy; 2024 Mavericks Group. All rights reserved.</p>
    </footer>
        `
    }
}
customElements.define('artist-header-content',ArtistHeaderContent)
customElements.define('without-search-field',WithoutSearchField)
customElements.define('footer-content',FooterContent)


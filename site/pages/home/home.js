(function ($) {
  "use strict";

    // banner slides
    var banners = $('.banners');
    if (banners.length) {
      banners.owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        nav: true,
        navText: ["<i class='ti-angle-left'></i> ", "<i class='ti-angle-right'></i> "],
        smartSpeed: 1000,
        responsive: {
          0: {
            margin: 15,
            nav: false,
            items: 1
          },
          600: {
            margin: 15,
            items: 1,
            nav: false
          },
          768: {
            margin: 30,
            nav: true,
            items: 1
          }
        }
      });
    }


  function displayTrendingItems() {
    const container = document.getElementById("trending-items-container");

    // Clear any existing items
    container.innerHTML = "";

    fetch("data/products.json")
      .then((response) => response.json())
      .then((products) => {
        // Loop through products and display only those that are trending
        products.forEach((product) => {
          if (product.isTrending) {
            const productHTML = `
                      <div class="col-lg-4 col-sm-6">
                          <div class="single_product_item">
                              <div class="single_product_item_thumb">
                                  <img src="/img/${
                                    product["Product Header"]
                                  }" alt="#" class="img-fluid">
                              </div>
                              <h3 class="text-center"><a href="${
                                product["Product URL"]
                              }">${capitalizeWords(product["Product Name"])}</a></h3>
                          </div>
                      </div>
                  `;
            container.innerHTML += productHTML;
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching the JSON data:", error);
      });
  }

  // Function to split by hyphen and capitalize the first letter of each word
  function capitalizeWords(str) {
    return str
      .split("-") // Split the string by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" "); // Join them back with a space (or use another separator if needed)
  }

  // Call the function to display the trending items
  displayTrendingItems();
})(jQuery);

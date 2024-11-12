(function ($) {
    "use strict";
    const carouselContainer = $('.product_img_slide');

    function getProductDetailsFromURL() {
        const currentPath = window.location.pathname; // Get the current URL path

        // Fetch data from products.json
        $.getJSON('/data/products.json', function(data) {
            // Find the product that matches the current URL
            const product = data.find(p => p["Product URL"] === currentPath);

            if (product) {
                // Update the product title
                $('#product-name').text(capitalizeWords(product["Product Name"]));

                // Update the catalog link URL and text
                $('#product-catalouge').attr('href', `/pdf/${product["Product Catalog URL"]}`);

                // Clear existing images in the carousel container
                carouselContainer.empty();

                // Loop through each image and construct the image path
                product['Product Images'].forEach(imageName => {
                    const imgPath = `/img/product/${product["Category"]}/${product["Product Name"]}/${imageName}`;
                    const imageHTML = `
                        <div class="single_product_img">
                            <img src="${imgPath}" alt="${product["Product Name"]}" class="img-fluid">
                        </div>`;
                    // Append the image to the carousel container
                    carouselContainer.append(imageHTML);
                });

                // Reinitialize the carousel to load the new images
                carouselContainer.owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    items: 1
                });

                const productSlide = $('.product_img_slide');
                if (productSlide.length) {
                    productSlide.owlCarousel({
                        items: 1,
                        loop: true,
                        dots: false,
                        autoplay: true,
                        autoplayHoverPause: true,
                        autoplayTimeout: 5000,
                        dots: false,
                        nav: true,
                        navText: [" <i class='ti-angle-left'></i> ", "<i class='ti-angle-right'></i> "],
                        responsive: {
                            0: { nav: false },
                            768: { nav: false },
                            991: { nav: true }
                        }
                    });
                }

                // Append specifications to the table
                const specificationsTableBody = $('.specification-table tbody');
                specificationsTableBody.empty();

                $.each(product['Specifications'], function(key, value) {
                    const rowHTML = `
                        <tr>
                            <td>${key}</td>
                            <td>${value}</td>
                        </tr>`;
                    specificationsTableBody.append(rowHTML); // Append each row to the tbody
                });


            } else {
                console.error('Product not found');
            }
        }).fail(function() {
            console.error('Failed to load products.json');
        });
    }

    // Function to split by hyphen and capitalize the first letter of each word
    function capitalizeWords(str) {
        return str
        .split("-") // Split the string by hyphen
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(" "); // Join them back with a space (or use another separator if needed)
    }

    getProductDetailsFromURL(); // Load details on page load

}(jQuery));
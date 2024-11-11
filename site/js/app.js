$(document).ready(function() {
    const contentDiv = $('#content');
    const links = $('[data-link]');

    // Function to fetch and load the HTML content for the matched route
    function loadPage(pagePath) {
        // Find the matching page based on the dynamic path
        const page = pages.find((p) => {
            // Convert the path with dynamic segments (e.g., :id) into a regular expression
            const routePattern = p.path.replace(/:\w+/g, '([\\w-]+)');  // :id becomes a capture group
            const route = new RegExp('^' + routePattern + '$'); // Full match for the path
            return route.test(pagePath);
        });

        console.log("🚀 ~ loadPage ~ page:", page)
        if (page) {
            // Match dynamic segment (e.g., /category/:id, /product/:id)
            const dynamicSegmentMatch = pagePath.match(new RegExp(page.path.replace(/:\w+/g, '([\\w-]+)')));
            
            // Extract dynamic segments (if any) and process them (e.g., ID, category, etc.)
            let dynamicParams = {};
            if (dynamicSegmentMatch) {
                const paramNames = (page.path.match(/:\w+/g) || []).map(param => param.slice(1)); // Get param names (like 'id')
                paramNames.forEach((param, index) => {
                    dynamicParams[param] = dynamicSegmentMatch[index + 1]; // Map param to value
                });
            }

            const htmlPath = page.htmlPath;


            // Fetch the HTML content for the matched path using jQuery's $.get()
            $.get(htmlPath, function(html) {
                // Process the HTML content (e.g., inject dynamic data)
                let processedHtml = processHtmlContent(html, dynamicParams);

                // Inject the HTML content into the content div
                contentDiv.html(processedHtml);

                // Optionally update the page title based on dynamic params
                document.title = `Page - ${dynamicParams.id || 'Home'}`; // You can set the title dynamically
            })
            .fail(function() {
                console.error('Error loading the page:', htmlPath);
                contentDiv.html('<h1>404 Not Found</h1>');
            });
        } else {
            contentDiv.html('<h1>404 Not Found</h1>');
        }
    }

    // Generic function to process HTML content, could be extended for more advanced use cases
    function processHtmlContent(html, params) {
        // For example, replace dynamic placeholders in the HTML with the actual dynamic values
        Object.keys(params).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g'); // Replace {{id}} or other placeholders in HTML
            html = html.replace(regex, params[key]);
        });
        return html;
    }

    // Add event listeners for link clicks (prevent default navigation) using jQuery
    links.on('click', function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        window.history.pushState({}, '', href); // Update the URL in the browser
        loadPage(href); // Load the content for the new page
    });

    // Listen for popstate event to handle back/forward navigation using jQuery
    $(window).on('popstate', function() {
        loadPage(window.location.pathname); // Load content for the current URL
    });

    // Initial load based on the current URL
    loadPage(window.location.pathname);
});

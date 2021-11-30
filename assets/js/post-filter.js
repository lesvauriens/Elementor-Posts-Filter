document.addEventListener("DOMContentLoaded", function(event) {
    var $jq = jQuery.noConflict();

    // Prepare if no results
    var none = false;

    function displayNoneMessage(posts) {
        if (!none) {
            var noResultsText = $jq('.elementor-portfolio__filters').first().attr('data-no-results');
            $jq("#" + posts).append('<span class="no-result">' + noResultsText + '</span>');
            none = true;
        }
    }

    function hideNoneMessage() {
        if (none) {
            $jq(".no-result").remove();
            none = false;
        }
    }

    // identify each occurence
    var i = 1;
    $jq(".elementor-portfolio__filters").each(function() {
        $jq(this).attr("data-id", i);
        i++;
    });

    $jq(".super-cat-post-filter").each(function() {
        let container = $jq("#" + $jq(this).attr("data-container"));
        let posts = $jq(this).attr("data-posts");
        let term = $jq(this).attr("data-term");
        if (term != "" && container.attr("data-hide-empty") == "yes") {
            if ($jq("#" + posts).find('article.' + term).length < 1) {
                $jq(this).hide();
            }
        }
    });

    $jq(".super-cat-post-filter").click(function(event) {
        let item = $jq(event.target);
        let term = item.attr("data-term");
        let posts = item.attr("data-posts");
        let filterBar = $jq(this).parents('.elementor-portfolio__filters');

        // hide all
        $jq("#" + posts).find('article').hide();
        // set all to inactive
        filterBar.find(".super-cat-post-filter").removeClass("elementor-active");

        // sync option in Dropdown Filters
        filterBar.find('.super-cat-dropdown-list').each(function() {
            let toSelect = $jq(this).find('option[data-term="' + term + '"]');
            if (toSelect.size() > 0) {
                toSelect.attr('selected', 'selected');
            } else {
                $jq(this).find('option[data-term=""]').attr('selected', 'selected');
            }
        });

        // Show / Hide all
        if (term == '') {
            // show all
            filterBar.find('.super-cat-post-filter[data-term=""]').addClass("elementor-active");
            if ('URLSearchParams' in window) {
                var searchParams = new URLSearchParams(window.location.search);
                searchParams.delete(filterBar.attr("data-id"));
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);

                var postsClasses = "";
                searchParams.forEach(function(term) {
                    postsClasses += '.' + term;
                });
                $jq("#" + posts).find('article' + postsClasses).fadeIn(400);
                if ($jq("#" + posts).find('article' + postsClasses).length == 0) {
                    displayNoneMessage(posts);
                } else {
                    hideNoneMessage();
                }
            }
        } else {
            // show some
            filterBar.find('.super-cat-post-filter[data-term="' + term + '"]').addClass("elementor-active");
            if ('URLSearchParams' in window) {
                var searchParams = new URLSearchParams(window.location.search);
                searchParams.set(filterBar.attr("data-id"), term);
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);

                var postsClasses = "";
                searchParams.forEach(function(term) {
                    postsClasses += '.' + term;
                });
                $jq("#" + posts).find('article' + postsClasses).fadeIn(400);
                if ($jq("#" + posts).find('article' + postsClasses).length == 0) {
                    displayNoneMessage(posts);
                } else {
                    hideNoneMessage();
                }
            }
        }
    });

    if (window.location.search) {
        let posts = $jq(this).attr("data-posts");
        var searchParams = new URLSearchParams(window.location.search);
        var postsClasses = "";
        searchParams.forEach(function(term) {
            postsClasses += '.' + term;
            $jq('li.elementor-portfolio__filter[data-term=' + term + ']').trigger("click");
        });
        if ($jq("#" + posts).find('article' + postsClasses).length == 0) {
            displayNoneMessage(posts);
        } else {
            hideNoneMessage();
        }
    }

});
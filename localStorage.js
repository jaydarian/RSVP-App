'use strict';
    function supportsLocalStorage() {
      try{
        return 'localStorage' in window && window['localStorage'] !== null;  
      } catch(e) {
        return false;
      }
      
    }

    function getRecentSearches() {
      var searches = localStorage.getItem('recentSearches');
      if(searches) {
        return JSON.parse(searches);
      } else {
        return [];
      }
    }

    function saveSearchString(str) {
      var searches = getRecentSearches();
      if(!str || searches.indexOf(str) > -1) {
        return false;
      }
      searches.push(str);
      localStorage.setItem('recentSearches', JSON.stringify(searches));
      return true;
    }

    function removeSearches() {
      localStorage.removeItem('recentSearches');
    }

    // Create an li, given string contents, append to the supplied ul
    function appendListItem(listElement, string) {
      var listItemElement = document.createElement('LI');
      listItemElement.innerHTML = string;
      listElement.appendChild(listItemElement);
    }

    // Empty the contents of an element (ul)
    function clearList(listElement) {
      listElement.innerHTML = '';
    }

    window.onload = function() {
      if (supportsLocalStorage()) {
        var searchForm = document.getElementById('searchForm');
        var searchBar = document.getElementById('searchBar');
        var recentSearchList = document.getElementById('recentSearchList');
        var clearButton = document.getElementById('clearStorage');

        // Initialize display list
        var recentSearches = getRecentSearches();
        recentSearches.forEach(function(searchString) {
          appendListItem(recentSearchList,searchString);
        });

        // Set event handlers
        searchForm.addEventListener('submit', (e) => {
          var searchString = searchBar.value;
          if (saveSearchString(searchString)) {
            appendListItem(recentSearchList, searchString);
          }
        });

        clearButton.addEventListener('click', (e) => {
          removeSearches();
          clearList(recentSearchList);
        });
      }
    };
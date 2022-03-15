chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    var activeTab = tabs[0];
    var URL = activeTab.url;
    // Show the URL in the extension
    document.getElementById('p_url').innerHTML = "Current URL = " + URL;
});

btn1.addEventListener("click",async () => {
    //Get URL for storing credentials
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
        var activeTab = tabs[0];
        var URL = activeTab.url;

        // Get the value from the form field
        passVal = document.getElementById("pass").value;

        // Split into two with Shamir's secret sharing
        shamirShares = shamir.create(passVal,2,2);
        console.log('- shamir shares:\n', shamirShares)

        // Store the key, value pair
        dbVal1 = {};
        dbVal2 = {};
        dbVal1[URL] = shamirShares[0];
        dbVal2[URL] = shamirShares[1];
        saveObjectInLocalStorage(dbVal1);
        saveObjectInSyncStorage(dbVal2);

        console.log(getObjectFromLocalStorage(URL));
        console.log(getObjectFromSyncStorage(URL));
        //Output the secret shares on the popup
        document.getElementById('secShares').innerHTML = 'Shamir shares = [ ' + shamirShares[0] + '<br>' + shamirShares[1] + ' ]';
        
    })

})

btn2.addEventListener("click",async () => {
    //Get URL for storing credentials
    chrome.tabs.query({active:true, currentWindow:true}, async(tabs) => {
        var activeTab = tabs[0];
        var URL = activeTab.url;
        //Get values from databases and combine them
        dbVal1 = await getObjectFromLocalStorage(URL);
        dbVal2 = await getObjectFromSyncStorage(URL);
        dbVals = [dbVal1, dbVal2];
        //Output password on popup
        document.getElementById("password").innerHTML = shamir.decode(dbVals);
    });
});

const getObjectFromLocalStorage = async function(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(key, function(value) {
          resolve(value[key]);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  const saveObjectInLocalStorage = async function(obj) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(obj, function() {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  const getObjectFromSyncStorage = async function(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, function(value) {
          resolve(value[key]);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  const saveObjectInSyncStorage = async function(obj) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set(obj, function() {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  const shamir = {
	create: (plainText, totalShares, threshold) => {
		// Convert the text into a hex string
		var pwHex = secrets.str2hex(plainText); // => hex string

		// Split into shares
		var shares = secrets.share(pwHex, totalShares, threshold);

		return shares
	},
	decode: (arrayOfShares) => {
		const sharesCombined = secrets.combine(arrayOfShares);

		// Convert back to UTF
		return secrets.hex2str(sharesCombined)
	}
}
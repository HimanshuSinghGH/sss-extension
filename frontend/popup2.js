chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    var activeTab = tabs[0];
    var URL = activeTab.url;
    // Show the URL in the extension
    document.getElementById('p_url').innerHTML = URL;
});

// btn1.addEventListener("click",async () => {
//     //Get URL for storing credentials
//     chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
//         var activeTab = tabs[0];
//         var URL = activeTab.url;
//
//         // Get the value from the form field
//         passVal = document.getElementById("pass").value;
//
//         // Split into two with Shamir's secret sharing
//         shamirShares = shamir.create(passVal,3,2);
//         console.log('- shamir shares:\n', shamirShares)
//
//         // Store the key, value pair
//         dbVal1 = {};
//         dbVal2 = {};
//         dbVal1[URL] = shamirShares[0];
//         dbVal2[URL] = shamirShares[1];
//         // saveObjectInLocalStorage(dbVal1);
//         // saveObjectInSyncStorage(dbVal2);
//
//         // console.log(getObjectFromLocalStorage(URL));
//         // console.log(getObjectFromSyncStorage(URL));
//         //Output the secret shares on the popup
//         document.getElementById('pass_op').value = passVal;
//         document.getElementById('share_1').value = shamirShares[0] ;
//         document.getElementById('share_2').value = shamirShares[1] ;
//         document.getElementById('share_3').value = shamirShares[2] ;
//
//     })
//
// })

btn2.addEventListener("click",async () => {
    //Get URL for storing credentials
    chrome.tabs.query({active:true, currentWindow:true}, async(tabs) => {
        var activeTab = tabs[0];
        var URL = activeTab.url;
        //Get values from databases and combine them
        // dbVal1 = await getObjectFromLocalStorage(URL);
        // dbVal2 = await getObjectFromSyncStorage(URL);
        sssVal1 = document.getElementById('share_1').value ;
        sssVal2 = document.getElementById('share_2').value ;
        sssVal3 = document.getElementById('share_3').value ;
        dbVals = [] ;
        if(sssVal1)
          dbVals.push(sssVal1) ;
        if(sssVal2)
          dbVals.push(sssVal2) ;
        if(sssVal3)
          dbVals.push(sssVal3) ;
        console.log(dbVals) ;
        //Output password on popup
        document.getElementById("pass_gen").value = shamir.decode(dbVals);
    });
});

// btn3.addEventListener("click", async () => {
//   console.log("button 3 pressed") ;
//   pgpencrypt() ;
// }) ;
//
// btn4.addEventListener("click", async() => {
//   const response = await fetch("http://localhost:8000/", {
//     method:'GET'})
//   const ans = await response.json()
//   console.log(response) ;
//   console.log(ans) ;
// }) ;

// btn4.addEventListener("click", async() => {
//   const response = await fetch("http://localhost:8000/", {
//     method:'GET'})
//   const ans = await response.json()
//   console.log(response) ;
//   console.log(ans) ;
// }) ;

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
};


const pgpencrypt =  async function () {
    var password = "abcd1234" ;
    var uint8array = new TextEncoder().encode(password);
    console.log(uint8array) ;
    const message = await openpgp.createMessage({ binary: uint8array });
    console.log(message) ;
    const encrypted = await openpgp.encrypt({
        message, // input as Message object
        passwords: ['passphrase'], // multiple passwords possible
        format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
    console.log("Encrypted password")
    console.log(encrypted); // Uint8Array

    const encryptedMessage = await openpgp.readMessage({
        binaryMessage: encrypted // parse encrypted bytes
    });
    console.log(encryptedMessage) ;
    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: ['passphrase'], // decrypt with password
        format: 'binary' // output as Uint8Array
    });

    var dec_password = new TextDecoder().decode(decrypted);
    console.log("Decrypted Password"); // Uint8Array([0x01, 0x01, 0x01])
    console.log(dec_password) ;

};

// nav1.addEventListener("click",async () => {
//     document.getElementById('nav1').classList.add('active-nav');
//     document.getElementById('nav2').classList.remove('active-nav');
//     })

nav1.addEventListener("click",async () => {
    document.getElementById('nav1').classList.add('active-nav');
    document.getElementById('nav2').classList.remove('active-nav');
    })

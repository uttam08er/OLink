// Get DOM elements
const serverIdInput = document.getElementById('serverId');
const checkboxInput = document.getElementById('checkbox');
const dataInput = document.getElementById('dataInput');
const clearFormButton = document.getElementById('clearForm');
const openSCardButton = document.getElementById('openSCard');
const openSOAButton = document.getElementById('openSOA');
const toast = document.getElementById('toast-text');
const time = document.getElementById('time');

console.log('Connected successfully...');


// Get current time
const currentTime = () => {
    let curTime = new Date().toLocaleTimeString([], { hour12: false });
    time.textContent = curTime;
};
const intervalId = setInterval(() => {
    currentTime();
}, 1000);


// Load saved values from local storage if available
if (localStorage.getItem('serverId')) {
    serverIdInput.value = localStorage.getItem('serverId');
}
if (localStorage.getItem('data')) {
    dataInput.value = localStorage.getItem('data');
}

// Initialize checkbox state
let isChecked = localStorage.getItem('isChecked') === 'true';
updateCheckboxState(isChecked);

// Checkbox click handler
checkboxInput.addEventListener('click', () => {
    isChecked = !isChecked;
    updateCheckboxState(isChecked);
    localStorage.setItem('isChecked', isChecked);
});

// Function to update checkbox visual state and control serverId input
function updateCheckboxState(checked) {
    if (checked) {
        checkboxInput.innerHTML = '✓';
        checkboxInput.style.backgroundColor = '#2fbd2c';
        checkboxInput.setAttribute('aria-checked', 'true');
        serverIdInput.disabled = true;
    } else {
        checkboxInput.innerHTML = '';
        checkboxInput.style.backgroundColor = '#d4d4d4';
        checkboxInput.setAttribute('aria-checked', 'false');
        serverIdInput.disabled = false;
    }
}

// Check box auto checked after button clicked.
const checkBoxChecked = () => {
    isChecked = true;
    if (isChecked) {
        localStorage.setItem('isChecked', isChecked);
        updateCheckboxState(isChecked);
    }
};

// Add input event listeners to save data while typing
serverIdInput.addEventListener('input', () => {
    const serverId = serverIdInput.value.trim();
    if (serverId.length > 0) {
        localStorage.setItem('serverId', serverId);
    } else {
        localStorage.setItem('serverId', '');
    }
});

dataInput.addEventListener('input', () => {
    const data = dataInput.value.trim();
    localStorage.setItem('data', data);
});

// Check if we have data to process or not and show toast.
const showToast = (message, type = 'error') => {
    if (type === 'success') {
        toast.style.color = '#06c303';
    }
    else {
        toast.style.color = '#ff0000';
    }
    time.style.display = 'none';
    toast.style.display = 'block';
    toast.textContent = message;
    setTimeout(() => {
        time.style.display = 'block';
        toast.style.display = 'none';
    }, 3000);
}

const openTabs = (id) => {
    const serverId = serverIdInput.value.trim();
    const dataItems = dataInput.value.split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    if (serverId.length === 0) {
        showToast("Server ID is must required!");
        return;
    }
    else if (dataItems.length === 0) {
        showToast("At least one loan no. is required!");
        return;
    }
    else {
        checkBoxChecked();
        if (id === 'openSCard') {
            try {
                dataItems.forEach(url => window.open(`https://172.36.255.${serverId}/convoque/HFCL_StatCard.jsp?acNo=${url}`, '_blank'));
            } catch (error) {
                showToast("Error opening tabs!");
                console.log(error);
            }
            return;
        }
        else if (id === 'openSOA') {
            try {
                dataItems.forEach(url => window.open(`hhttps://172.36.255.${serverId}/convoque/HFCL_SOA.jsp?rAC=${url}`, '_blank'));
            } catch (error) {
                showToast("Error opening tabs!");
                console.log(error);
            }
            return;
        }
        else {
            showToast("Unknown command!");
        }
    }
}

// Open STAT card button click handler
openSCardButton.addEventListener('click', () => {
    openTabs('openSCard');
});

// Open SOA card button click handler
openSOAButton.addEventListener('click', () => {
    openTabs('openSOA');
});

// Clear form button click handler
clearFormButton.addEventListener('click', () => {
    dataInput.value = '';
    localStorage.removeItem('data');
    showToast("IDs clear successfully!", 'success');
});

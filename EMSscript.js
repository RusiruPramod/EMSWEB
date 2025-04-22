const baseURL = "http://localhost:8080/employee";

document.addEventListener('DOMContentLoaded', () => {
    let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let navLinks = document.querySelectorAll('.navbar a');
let header = document.querySelector('header');
let sections = document.querySelectorAll('section');

// Elements used in ScrollReveal
let aboutImg = document.querySelector('.about-img');
let homeImg = document.querySelector('.home');
let aboutLink = document.querySelector('.aboutLink');

// Extra elements used in reveal animations
let dashboard = document.querySelector('.dashboard');
let EMS = document.querySelector('.EMS');
let contact = document.querySelector('.contact');
let servicesContainer = document.querySelector('.services-container');
let latestItems = document.querySelectorAll('.Latest');
let serviceItems = document.querySelectorAll('.service');
let overlayImage = document.querySelector('.overlay-image');
let qrSection = document.querySelector('.qr-generator-section');


    // Toggle navbar and icon
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    // Scroll behavior
    window.addEventListener('scroll', () => {
        header.classList.toggle('sticky', window.scrollY > 100);
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');

        sections.forEach(sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                let currentLink = document.querySelector(`.navbar a[href*="${id}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    });

   
    // ScrollReveal setup
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal({
            reset: true,
            distance: '80px',
            duration: 2000,
            delay: 200
        });

        ScrollReveal().reveal('.home-content, .dashboard, .EMS, .contact', { origin: 'top' });
        ScrollReveal().reveal('.services-container, .Latest , .service', { origin: 'bottom' });
        ScrollReveal().reveal('.about, .overlay-image', { origin: 'left' });
        ScrollReveal().reveal('.qr-generator-section', { origin: 'right' });
    } else {
        console.warn("ScrollReveal is not loaded.");
    }
});


// Typed.js text animation
const typed = new Typed('.multiple-text', {
    strings: ['Every Day'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1500,
    loop: true
});


// Add new employee and generate QR code with empID
function addEmployee() {
    const employee = getInputValues();
    fetch(`${baseURL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee)
    })
        .then(res => res.json()) // Parse response as JSON to get employeeId
        .then(newEmployee => {
            alert("Employee added successfully!");
            generateQRCode(newEmployee.employeeId); // Call the function to generate QR code
            loadAll();  // Reload the employee table
        })
        .catch(err => {
            alert("Failed to add employee!");
            console.error(err);
        });
}

// Generate QR code with the employee ID
function generateQRCode(empID) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${empID}`;

    // Display the QR code as an image
    document.getElementById("qrCodeImage").src = qrCodeUrl;

    // Alternatively, you could generate it in a canvas
    // For this, you need to add a canvas element in the HTML
    const canvas = document.getElementById("qrCanvas");
    const ctx = canvas.getContext("2d");
    const qr = qrcode(0, "L");
    qr.addData(empID);
    qr.make();

    const cellSize = 6;
    const qrSize = qr.getModuleCount();
    const skipRows = 2;  // Skip 2 top and 2 bottom rows

    canvas.width = canvas.height = (qrSize - skipRows * 2) * cellSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the QR code on canvas
    for (let row = skipRows; row < qrSize - skipRows; row++) {
        for (let col = 0; col < qrSize; col++) {
            if (qr.isDark(row, col)) {
                ctx.fillStyle = "#000";
                ctx.fillRect((col - skipRows) * cellSize, (row - skipRows) * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Get input values from form fields
function getInputValues() {
    return {
        employeeId: document.getElementById("id").value,  // This field can be auto-generated on the backend
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        salary: document.getElementById("salary").value
    };
}

// Load all employees and display in the table
function loadAll() {
    fetch(`${baseURL}/getAll`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#empTable tbody");
            tbody.innerHTML = "";
            data.forEach(emp => {
                const row = `<tr>
          <td>${emp.employeeId}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.salary}</td>
          <td>
            <button class="delete-btn" onclick="deleteEmployee(${emp.employeeId})">Delete</button>
          </td>
        </tr>`;
                tbody.innerHTML += row;
            });
        });
}

// Delete employee by ID
function deleteEmployee(id) {
    fetch(`${baseURL}/delete/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Employee deleted!");
            loadAll();  // Reload the employee table
        });
}

window.onload = function () {
    const canvas = document.getElementById("qrCanvas");
    const context = canvas.getContext("2d");
    const fixedText = "EMPLOYEE-CHECKIN-SECURE-2025"; // Set your fixed QR value

    // Generate QR code using a library like QRious
    const qr = new QRious({
        element: canvas,
        value: fixedText,
        size: 200
    });
};



// Sample data for the chart
const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
        label: 'Attendance Hours',
        data: [8, 7, 8, 9, 6, 5, 4],  // Sample attendance data
        borderColor: 'green',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
    }]
};

// Configuration options for the chart
const config = {
    type: 'line',  // Can be 'line', 'bar', 'pie', etc.
    data: data,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Create the chart
const attendanceChart = new Chart(
    document.getElementById('attendanceChart'),
    config
);




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});






// Wait until the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.querySelector('#getStartedBtn');

    // Check if the button exists
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function (e) {
            e.preventDefault();  // Prevent default anchor behavior

            const target = document.querySelector('#qrSection');  // The QR section

            // If the target exists, scroll it into view
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',  // This ensures the section is centered vertically
                    inline: 'nearest'
                });
            }

            // Optionally, you can trigger the QR code generation here:
            generateRandomQR();
        });
    }
});







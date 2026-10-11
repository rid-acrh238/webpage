
const clockElement = document.getElementById("digital-clock");
const monthElement = document.getElementById("calendar-month");
const daysElement = document.getElementById("calendar-days");
const todayElement = document.getElementById("calendar-today");

const indonesiaTime = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric"
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

function getJakartaDate() {
    const parts = indonesiaTime.formatToParts(new Date());
    const values = {};

    parts.forEach(part => {
        if (part.type !== "literal") {
            values[part.type] = Number(part.value);
        }
    });

    return {
        year: values.year,
        month: values.month,
        day: values.day
    };
}

function updateClock() {
    clockElement.textContent = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(new Date());
}

function renderCalendar() {
    const { year, month, day } = getJakartaDate();

    const monthName = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        month: "long",
        year: "numeric"
    }).format(new Date(Date.UTC(year, month - 1, 15, 12)));

    monthElement.textContent = monthName.toUpperCase();
    daysElement.replaceChildren();

    // JavaScript: Sunday = 0, Saturday = 6.
    // Kalender ditampilkan dengan urutan Minggu sampai Sabtu.
    const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("span");
        emptyCell.className = "empty";
        daysElement.appendChild(emptyCell);
    }

    for (let date = 1; date <= daysInMonth; date++) {
        const cell = document.createElement("span");
        cell.textContent = date;

        if (date === day) {
            cell.classList.add("today");
            cell.setAttribute("aria-current", "date");
        }

        daysElement.appendChild(cell);
    }

    todayElement.textContent =
        "TODAY: " +
        dateFormatter.format(new Date()).toUpperCase();
}

updateClock();
renderCalendar();

setInterval(updateClock, 1000);

// Perbarui kalender saat tanggal berganti.
setInterval(renderCalendar, 60 * 1000);

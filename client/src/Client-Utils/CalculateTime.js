export const calculateTime = (dateString) => {
    //Assuming input date is in UTC
    const inputDate = new Date(dateString);

    // Check if the inputDate is valid 
    if (isNaN(inputDate.getTime())) { return 'Invalid date'; }

    //Get cuurent date
    const currDate = new Date();

    //set up date format
    const timeFormat = { hour: "numeric", minute: "numeric" };
    const dateFormat = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    };

    //check if it's today, tomorrow or more than one day ago
    if(inputDate.getUTCDate() === currDate.getUTCDate() && inputDate.getUTCDate() === currDate.getUTCMonth() && inputDate.getUTCDate() === currDate.getUTCFullYear()) {
        // Today convert to AM/PM Format
        const ampmTime = inputDate.toLocaleTimeString("en-US", timeFormat);
        return ampmTime;
    } else if (inputDate.getUTCDate() - 1 === currDate.getUTCDate() && inputDate.getUTCDate() === currDate.getUTCMonth() && inputDate.getUTCDate() === currDate.getUTCFullYear()) {
        // Tomorrrow: show "Yesterday"
        return "Yesterday"
    } else if (Math.floor((currDate - inputDate) / (1000 * 60 * 60 * 24)) > 1 && Math.floor((currDate - inputDate) / (1000 * 60 * 60 * 24)) <= 7) {
        const timeDifference = Math.floor((currDate - inputDate) / (1000 * 60 * 60 * 24));
        const targetDate = new Date();
        targetDate.setDate(currDate.getDate() - timeDifference);

        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const targetDay = daysOfWeek[targetDate.getDay()];
        return targetDay;
    } else {
        // More than 7 days ago: show date in DD/MM/YYYY format
        const formattedDate = inputDate.toLocaleDateString("en-GB", dateFormat);
        return formattedDate;
    }
}

export const calculateTimes = (dateString) => {
    // Assuming input date is in UTC
    const inputDate = new Date(dateString);

    // Get current date
    const currDate = new Date();

    // Set up date format
    const timeFormat = { hour: "numeric", minute: "numeric" };
    const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };

    // Calculate difference in days
    const timeDifference = Math.floor((currDate - inputDate) / (1000 * 60 * 60 * 24));

    // Check if it's today, yesterday, or within the last 7 days
    if (inputDate.getUTCDate() === currDate.getUTCDate() && inputDate.getUTCMonth() === currDate.getUTCMonth() && inputDate.getUTCFullYear() === currDate.getUTCFullYear()) {
        // Today: convert to AM/PM Format
        const ampmTime = inputDate.toLocaleTimeString("en-US", timeFormat);
        return ampmTime;
    } else if (timeDifference === 1) {
        // Yesterday: show "Yesterday"
        return "Yesterday";
    } else if (timeDifference > 1 && timeDifference <= 7) {
        // Within the last 7 days: show the day of the week
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDay = daysOfWeek[inputDate.getUTCDay()];
        return targetDay;
    } else {
        // More than 7 days ago: show date in DD/MM/YYYY format
        const formattedDate = inputDate.toLocaleDateString("en-GB", dateFormat);
        return formattedDate;
    }
};

export const formatNumber = (num) => { 
    if (num >= 1000) { 
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k'; 
    } 
    return num.toString(); 
};


// The moment i used before {moment(convo.createdAT).format('hh:mm')}
//{moment(convo.createdAT).format('LT')}

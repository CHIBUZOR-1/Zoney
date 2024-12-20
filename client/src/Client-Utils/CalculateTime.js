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

export const storis = [
    {
        img: "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0",
        name: 'weel',
        profile: "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0"
    },
    {
        img: "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0",
        name: 'weel',
        profile: "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0"
    }
];

// The moment i used before {moment(convo.createdAT).format('hh:mm')}
//{moment(convo.createdAT).format('LT')}
